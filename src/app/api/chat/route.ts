import { NextRequest } from "next/server";
import { generateChatResponse, detectCrisis } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  try {
    const { content, history, userContext, memory } = await req.json();
    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // A. Detect Crisis in input text
    const crisisSafety = await detectCrisis(content);

    // B. Build contextual memory parameters for Claude system prompt
    const name = userContext?.name || "Beta";
    const examType = userContext?.examType || "JEE/NEET";
    const examDate = userContext?.examDate || "";
    const comfortSubject = userContext?.comfortSubject || "Physics";
    const language = userContext?.language || "English";

    const checkinsText = memory?.checkins && memory.checkins.length > 0
      ? memory.checkins.join("\n")
      : "No previous check-in logs recorded.";

    const journalsText = memory?.journals && memory.journals.length > 0
      ? memory.journals.join("\n")
      : "No previous journal reflections logged.";

    // Context details passed directly into BhalAI system prompts in `generateChatResponse`
    const chatContext = {
      userName: name,
      examType: examType,
      comfortSubject: comfortSubject,
      language: language,
      lastMoodScore: 65, // default baseline
      checkins: memory?.checkins || [],
      journals: memory?.journals || [],
      additionalSystemPrompt: `
You are BhalAI, a caring, warm, maternal wellness companion for high-stakes exam aspirants in India.
Current student context:
- Name: ${name}
- Preparing for: ${examType} ${examDate ? `(Next Exam Date: ${examDate})` : ""}
- Comfort subject: ${comfortSubject}
- Preferred language/code-switch: ${language}

Memory Layer:
Below are the student's recent daily wellness logs. You must remember these details and refer to them naturally when helpful (e.g. if they mention an exam backlog or feeling anxious about a mock test, reference their recent entries to show you care):
--- Recent Daily Check-ins ---
${checkinsText}

--- Recent Journal Diaries ---
${journalsText}
---
Rules:
1. Speak code-switching Hinglish or their preferred language.
2. Be supportive, empathetic, and encouraging.
3. If they ask syllabus or academic queries (e.g., "Solve this math problem" or "explain organic reactions"), do not teach. Gently remind them that your job is to hold space for their feelings, and suggest taking a tea break or revising their comfort subject (${comfortSubject}) for a bit to lower stress.
`
    };

    // Make sure we have a valid history array
    const formattedHistory = Array.isArray(history) && history.length > 0
      ? [...history, { role: "user", content }]
      : [{ role: "user", content }];

    // C. Generate AI Response from Claude Sonnet
    const aiResult = await generateChatResponse(formattedHistory as any, chatContext as any);
    
    let responseText = aiResult.text;
    if (crisisSafety.isCrisis) {
      responseText = `Suno beta, mujhe lagta hai aap is waqt bohot zyada pareshan ho. Please akele stress mat jhelo. \n\nMain aapke sath hoon, par please in expert helplines se abhi baat karo:\n📞 iCall: 9152987821\n📞 Vandrevala Foundation: 1860-2662-345\n\nEk baar call karke dekho, okay? Aur yahan bhi mujhse baat karte raho.`;
    }

    // D. Character-by-character streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`__CRISIS__:${crisisSafety.isCrisis}\n`));
        
        const words = responseText.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 45)); // smooth type pacing
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
