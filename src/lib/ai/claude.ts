import Anthropic from "@anthropic-ai/sdk";
import {
  BHALAI_SYSTEM_PROMPT,
  JOURNAL_ANALYSIS_PROMPT,
  STUDY_ROUTING_PROMPT,
  COPING_STRATEGIES_PROMPT,
  CRISIS_DETECTION_PROMPT,
  WEEKLY_REPORT_PROMPT,
} from "./prompts";

// Initialize Anthropic client safely
const getAnthropicClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    return null;
  }
  return new Anthropic({ apiKey });
};

// Helper to check if we should run in Mock mode
const isMockMode = () => {
  return getAnthropicClient() === null;
};

/**
 * 1. Generate streaming/non-streaming chat response
 */
export async function generateChatResponse(
  messages: { role: "user" | "assistant"; content: string }[],
  context: {
    userName?: string;
    examType?: string;
    comfortSubject?: string;
    lastMoodScore?: number;
    language?: string;
  } = {}
) {
  const client = getAnthropicClient();
  const systemPrompt = `${BHALAI_SYSTEM_PROMPT}\n\nStudent Profile Context:\n- Student Name: ${
    context.userName || "Friend"
  }\n- Target Exam: ${context.examType || "High stakes boards"}\n- Comfort Subject: ${
    context.comfortSubject || "Not specified"
  }\n- Last Mood Score: ${context.lastMoodScore || "N/A"}\n- Preferred Language: ${
    context.language || "English/Hinglish"
  }\n\nMaintain character at all costs. Respond warmth-first.`;

  if (isMockMode() || !client) {
    // Return a generator or mock response stream simulation
    const mockResponses = [
      `Haan beta, I can completely understand what you are going through. Preparing for ${
        context.examType || "exams"
      } is like running a marathon, and it is natural to feel tired. Kya hua, tell me more? Did mock tests not go as expected, or is syllabus backlog stressing you out?`,
      `Arey, listen to me. Breathe. Ek test score tumhari life decide nahi karta. I know parents have high hopes, but your peace of mind is more important. Let's take a 5-minute break together. Ready for a small breathing exercise?`,
      `Bilkul sahi bola aapne. Loneliness during drop years is very real. When everyone else seems to move on, sitting in one room studying all day is hard. But BhalAI is right here with you. Aap akele nahi ho.`,
      `That is wonderful! Balancing your comfort subject with difficult ones is a very mature way to study. Don't push yourself to exhaustion. Aaj thoda chill karo, aur kal subah fresh mind se start karna.`,
    ];
    // Pick a response based on keywords
    const userText = messages[messages.length - 1]?.content.toLowerCase() || "";
    let selectedText = mockResponses[0];
    if (userText.includes("score") || userText.includes("marks") || userText.includes("fail")) {
      selectedText = mockResponses[1];
    } else if (userText.includes("lonely") || userText.includes("alone") || userText.includes("sad")) {
      selectedText = mockResponses[2];
    } else if (userText.includes("good") || userText.includes("happy") || userText.includes("completed")) {
      selectedText = mockResponses[3];
    }

    return {
      text: selectedText,
      isMock: true,
      // Stream simulator helper
      async *stream() {
        const words = selectedText.split(" ");
        for (const word of words) {
          yield word + " ";
          await new Promise((r) => setTimeout(r, 80));
        }
      },
    };
  }

  // Call real Claude API (claude-3-5-sonnet-20241022)
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const responseText =
    response.content[0].type === "text" ? response.content[0].text : "";

  return {
    text: responseText,
    isMock: false,
    async *stream() {
      // Simulate stream for standard fetch if streaming flag wasn't active,
      // or we can invoke client.messages.stream for actual stream.
      const words = responseText.split(" ");
      for (const word of words) {
        yield word + " ";
        await new Promise((r) => setTimeout(r, 30));
      }
    },
  };
}

/**
 * 2. Analyze Journal Entries
 */
export async function analyzeJournal(content: string) {
  const client = getAnthropicClient();
  if (isMockMode() || !client) {
    // Generate simulated emotional analysis
    const isHighStress =
      content.includes("anxious") ||
      content.includes("scared") ||
      content.includes("fail") ||
      content.includes("give up") ||
      content.includes("pressure");
    const stressScore = isHighStress ? 75 : 35;
    const burnoutRisk = isHighStress ? 65 : 25;

    return {
      emotionSummary: isHighStress
        ? "You are feeling anxious and carrying heavy exam pressure."
        : "You feel relatively stable, focusing on taking small steps.",
      tags: isHighStress ? ["exam-anxiety", "overwhelm"] : ["mindful", "steady"],
      stressScore,
      burnoutRisk,
      positiveIndicators: isHighStress ? [] : ["stable routine"],
    };
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      system: JOURNAL_ANALYSIS_PROMPT,
      messages: [{ role: "user", content }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    // Clean potential markdown wrappers
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Journal analysis error:", error);
    return {
      emotionSummary: "Processed your thoughts with care.",
      tags: ["journaled"],
      stressScore: 50,
      burnoutRisk: 40,
      positiveIndicators: [],
    };
  }
}

/**
 * 3. Detect Crisis Flag
 */
export async function detectCrisis(text: string): Promise<{
  isCrisis: boolean;
  severity: "low" | "medium" | "high";
  reason: string;
}> {
  const lowerText = text.toLowerCase();
  // Quick local heuristics first for immediate response
  const crisisKeywords = [
    "suicide",
    "self harm",
    "end my life",
    "kill myself",
    "better off dead",
    "marna chahta",
    "want to die",
    "ending it all",
    "give up on life",
  ];
  const matched = crisisKeywords.some((keyword) => lowerText.includes(keyword));

  if (matched) {
    return {
      isCrisis: true,
      severity: "high",
      reason: "Self-harm or hopeless keywords detected directly.",
    };
  }

  const client = getAnthropicClient();
  if (isMockMode() || !client) {
    return { isCrisis: false, severity: "low", reason: "No flags detected." };
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 150,
      system: CRISIS_DETECTION_PROMPT,
      messages: [{ role: "user", content: text }],
    });

    const respText = response.content[0].type === "text" ? response.content[0].text : "";
    const cleanJson = respText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch {
    return { isCrisis: false, severity: "low", reason: "Fallback safety check pass." };
  }
}

/**
 * 4. Generate Study Routing Recommendations
 */
export async function generateStudyRouting(
  mood: string,
  stress: number,
  energy: number,
  comfortSubject: string,
  examType: string
) {
  const client = getAnthropicClient();
  if (isMockMode() || !client) {
    // Mock routing logic based on stress
    if (stress > 70) {
      return {
        recommendationTitle: "Comfort Subject Healing Walk",
        durationText: "20-30 mins",
        explanation: `Stress levels are high. Pushing difficult subjects will cause frustration. Let's do light reading of your comfort subject (${comfortSubject}) without pressure.`,
        actionSteps: [
          "Close all test papers and social media tabs.",
          `Open ${comfortSubject} and read a chapter you already enjoy.`,
          "Take a deep breath every 10 minutes. Stop if you feel tired.",
        ],
      };
    } else if (energy < 40) {
      return {
        recommendationTitle: "Micro-Pomodoro Reset",
        durationText: "25 mins",
        explanation: "Your energy is low, which means long study blocks will cause burnout. Let's use a single 25-minute Pomodoro block followed by high quality rest.",
        actionSteps: [
          "Pick one small, defined topic.",
          "Set a timer for 25 minutes. Study with single focus.",
          "Take a 10-minute walk or drink water afterwards.",
        ],
      };
    } else {
      return {
        recommendationTitle: "Flow State Focus Session",
        durationText: "90 mins",
        explanation: "Mood is stable and energy is high. This is the perfect time to tackle challenging exam concepts with a warm, focused mind.",
        actionSteps: [
          "Define 2 core problem sets you want to solve.",
          "Keep water and study materials close by.",
          "Set phone to 'Do Not Disturb' mode.",
        ],
      };
    }
  }

  try {
    const formattedPrompt = STUDY_ROUTING_PROMPT
      .replace("{mood}", mood)
      .replace("{stress}", String(stress))
      .replace("{energy}", String(energy))
      .replace("{comfortSubject}", comfortSubject)
      .replace("{examType}", examType);

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 400,
      messages: [{ role: "user", content: formattedPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch {
    return {
      recommendationTitle: "Gentle Refresh Warmup",
      durationText: "30 mins",
      explanation: `Let's focus on a relaxed study session. Small progress on ${comfortSubject} is better than no progress.`,
      actionSteps: ["Read 5 pages of comfort subject", "Take a short break"],
    };
  }
}

/**
 * 5. Generate Coping Strategies
 */
export async function generateCopingStrategies(stressLevel: number) {
  const client = getAnthropicClient();
  if (isMockMode() || !client) {
    if (stressLevel > 60) {
      return [
        {
          id: "cs-1",
          strategyText: "5-4-3-2-1 Grounding: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. It anchors you in the present.",
        },
        {
          id: "cs-2",
          strategyText: "Chai Break & Sigh: Make a warm cup of herbal tea or warm water. Take a slow sip, and release a long sigh. Let your shoulders drop.",
        },
      ];
    } else {
      return [
        {
          id: "cs-3",
          strategyText: "Digital Detach: Set your phone aside for the next 2 hours. Out of sight, out of mind. Give your brain cells space to breathe.",
        },
        {
          id: "cs-4",
          strategyText: "Progress Journaling: Write down exactly three small things you successfully finished today, no matter how small.",
        },
      ];
    }
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      system: COPING_STRATEGIES_PROMPT,
      messages: [{ role: "user", content: `Stress Level Score is: ${stressLevel}` }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch {
    return [
      { id: "fallback-1", strategyText: "Box Breathing: Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4." },
    ];
  }
}

/**
 * 6. Generate Weekly Wellness Report
 */
export async function generateWeeklyReport(
  historyContext: string,
  userName: string
) {
  const client = getAnthropicClient();
  if (isMockMode() || !client) {
    return `
# Weekly Wellness Reflection for ${userName} 🌸

Aapki mehnat aur aapka safar humne dekha hai. Here is your BhalAI summary for the past week:

### 🌟 Tera Haal-Chaal (Your Vibe)
This week, your mood shows you've been battling persistent exam pressure. You felt anxious about your syllabus coverage mid-week, but showed a lot of maturity by journaling and taking breaks. Your average stress index was around **58/100**.

### 🫂 Jeet aur Aaram (Victories & Rest)
- **Mindful Break**: You successfully logged two journal entries on high-stress days. This means instead of ignoring your panic, you faced it!
- **Consistency**: You maintained a study-routing warmup streak. Celebrate these little victories.

### ❤️ BhalAI's Paigam (A Message of Care)
*Suno, beta.* Syllabus backlogs are a part of every student's life. Do not compare your day 1 with someone else's day 100. You are doing your absolute best in a very demanding phase of your life. Take care of your sleep today, and remember BhalAI is always proud of your effort.
`;
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      system: WEEKLY_REPORT_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate report for ${userName} given this history:\n${historyContext}`,
        },
      ],
    });

    return response.content[0].type === "text" ? response.content[0].text : "";
  } catch {
    return `Weekly report processed. You did an amazing job holding on this week! Keep going.`;
  }
}

/**
 * 7. Generate Heatmap Insights
 */
export async function generateHeatmapInsight(history: { date: string; stress: number }[]) {
  if (history.length === 0) return "No entries recorded. Start journaling to track your mental landscape.";
  const highStressDays = history.filter((h) => h.stress > 65).length;
  const avgStress = Math.round(history.reduce((acc, curr) => acc + curr.stress, 0) / history.length);

  if (highStressDays > 3) {
    return `You've had ${highStressDays} high-stress days this week. This is an indicator that burnout is close. Please pause, defer mock test reviews for 24 hours, and prioritize sleep.`;
  }
  return `Your average stress this week is ${avgStress}/100. Your emotional graph is stable. You are balancing prep pressure well with rest. Keep this rhythm.`;
}

/**
 * 8. Generate Pre-Exam Anxiety Support
 */
export async function generatePreExamSupport(examType: string, hoursRemaining: number) {
  const support = {
    affirmations: [
      "I have prepared to the best of my current capacity.",
      "My value as a person is not bound to a paper score.",
      "I will remain calm and attempt what I know step-by-step.",
    ],
    breathingExercise: "4-7-8 Relaxing Breath: Inhale through nose for 4s, hold breath for 7s, exhale slowly through mouth making a 'whoosh' sound for 8s.",
    visualization: "Visualize entering the hall, sitting down, and focusing solely on the questions you can solve, feeling relaxed and clear-headed.",
    morningEncouragement: `Chalo, the day has arrived. Eat a light breakfast, drink some water, and remember that you are loved beyond your exam ranks. All the best, beta!`,
  };

  return support;
}
