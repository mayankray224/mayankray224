import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { generateChatResponse, detectCrisis } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  try {
    const { content, conversationId, userContext } = await req.json();
    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // A. Detect Crisis in content
    const crisisSafety = await detectCrisis(content);

    let user = null;
    let activeConversationId = conversationId || "offline-conversation-id";

    // B. Attempt database profile lookups
    try {
      const session = await getServerSession(authOptions);
      let email = session?.user?.email || "demo@nazaraana.in";

      user = await prisma.user.findUnique({
        where: { email },
        include: {
          exams: true,
          subjects: { where: { isComfortSubject: true } },
          moodCheckins: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });

      if (user) {
        if (crisisSafety.isCrisis) {
          await prisma.crisisFlag.create({
            data: {
              userId: user.id,
              severity: crisisSafety.severity,
              source: "chat",
            },
          });
        }

        let activeConversation;
        if (conversationId) {
          activeConversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
          });
        }

        if (!activeConversation) {
          const latest = await prisma.conversation.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
          });
          activeConversation = latest || await prisma.conversation.create({
            data: { userId: user.id },
          });
        }

        activeConversationId = activeConversation.id;

        // Save User Message
        await prisma.message.create({
          data: {
            conversationId: activeConversationId,
            role: "user",
            content,
            language: user.language,
          },
        });
      }
    } catch (dbError) {
      console.warn("Database is unreachable in Chat API. Switching to offline mock streaming mode.", dbError);
    }

    // C. Retrieve recent history context
    let formattedHistory: { role: "user" | "assistant"; content: string }[] = [];
    let chatContext = {
      userName: userContext?.name || user?.name || "Beta",
      examType: userContext?.examType || user?.exams[0]?.examType || "JEE/NEET",
      comfortSubject: userContext?.comfortSubject || user?.subjects[0]?.name || "Physics",
      lastMoodScore: user?.moodCheckins[0]?.stressScore || 65,
      language: userContext?.language || user?.language || "Hinglish",
    };

    if (user) {
      try {
        const history = await prisma.message.findMany({
          where: { conversationId: activeConversationId },
          orderBy: { createdAt: "asc" },
          take: 8,
        });
        formattedHistory = history.map((h) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        }));
      } catch (e) {
        // Ignore history fetch fail
      }
    }

    if (formattedHistory.length === 0) {
      formattedHistory = [{ role: "user", content }];
    }

    // D. Generate AI response
    const aiResult = await generateChatResponse(formattedHistory, chatContext);
    
    let responseText = aiResult.text;
    if (crisisSafety.isCrisis) {
      responseText = `Suno beta, mujhe lagta hai aap is waqt bohot zyada pareshan ho. Please akele stress mat jhelo. \n\nMain aapke sath hoon, par please in expert helplines se abhi baat karo:\n📞 iCall: 9152987821\n📞 Vandrevala Foundation: 1860-2662-345\n\nEk baar call karke dekho, okay? Aur yahan bhi mujhse baat karte raho.`;
    }

    // E. Save Assistant Message if database available
    if (user) {
      try {
        await prisma.message.create({
          data: {
            conversationId: activeConversationId,
            role: "assistant",
            content: responseText,
            language: user.language,
          },
        });
      } catch (e) {
        // Ignore assistant message save fail
      }
    }

    // F. Stream response character by character
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`__CONVID__:${activeConversationId}\n`));
        controller.enqueue(encoder.encode(`__CRISIS__:${crisisSafety.isCrisis}\n`));
        
        const words = responseText.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 40));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("Chat API Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
