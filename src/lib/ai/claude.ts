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

// exact keyword matching helper avoiding false substring positives
function matchKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => {
    if (/[^a-z0-9]/i.test(keyword)) {
      return lowerText.includes(keyword.toLowerCase());
    }
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lowerText);
  });
}

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
    checkins?: string[];
    journals?: string[];
    additionalSystemPrompt?: string;
  } = {}
) {
  const client = getAnthropicClient();
  let systemPrompt = `${BHALAI_SYSTEM_PROMPT}\n\nStudent Profile Context:\n- Student Name: ${
    context.userName || "Friend"
  }\n- Target Exam: ${context.examType || "High stakes boards"}\n- Comfort Subject: ${
    context.comfortSubject || "Not specified"
  }\n- Last Mood Score: ${context.lastMoodScore || "N/A"}\n- Preferred Language: ${
    context.language || "English/Hinglish"
  }\n\nMaintain character at all costs. Respond warmth-first.`;

  if (context.additionalSystemPrompt) {
    systemPrompt = context.additionalSystemPrompt;
  }

  if (isMockMode() || !client) {
    const userText = messages[messages.length - 1]?.content.toLowerCase() || "";
    
    // Check for crisis terms
    const crisisKeywords = [
      "suicide", "self harm", "end my life", "kill myself", "better off dead", 
      "marna chahta", "want to die", "ending it all", "give up on life", "can't continue",
      "want to end it", "don't want to live", "atmahathya", "mar jau", "mar jana", "suicidal",
      "harm myself", "no reason to live"
    ];
    const hasCrisis = matchKeywords(userText, crisisKeywords);
    if (hasCrisis) {
      const resp = `Suno beta, mujhe lagta hai aap is waqt bohot zyada pareshan ho. Please akele stress mat jhelo. \n\nMain aapke sath hoon, par please in expert helplines se abhi baat karo:\n📞 iCall: 9152987821\n📞 Vandrevala Foundation: 1860-2662-345\n\nEk baar call karke dekho, okay? Aur yahan bhi mujhse baat karte raho.`;
      return {
        text: resp,
        isMock: true,
        async *stream() {
          const words = resp.split(" ");
          for (const word of words) {
            yield word + " ";
            await new Promise((r) => setTimeout(r, 45));
          }
        }
      };
    }

    // Memory layer checks
    const journalTextCombined = (context.journals || []).join(" ").toLowerCase();
    const chatTextCombined = messages.slice(0, -1).map(m => m.content).join(" ").toLowerCase();
    const combinedHistory = journalTextCombined + " " + chatTextCombined;

    const hasPreviousBreakup = matchKeywords(combinedHistory, ["breakup", "relationship", "ex", "girlfriend", "boyfriend"]);
    const hasPreviousParent = matchKeywords(combinedHistory, ["parent", "parents", "mummy", "papa", "compare", "comparison"]);
    const hasPreviousBacklog = matchKeywords(combinedHistory, ["backlog", "backlogs", "syllabus", "mock", "test", "fail", "score"]);

    const userName = context.userName || "Beta";
    const examName = context.examType || "exams";
    const comfortSub = context.comfortSubject || "comfort subject";

    // Intent Detection
    const isGreeting = matchKeywords(userText, ["hi", "hello", "namaste", "hey", "remembers", "remember me", "how are you feeling today", "do you remember"]);
    const isRelationship = matchKeywords(userText, ["breakup", "relationship", "girlfriend", "boyfriend", "ex", "exes", "left me", "love"]);
    const isCoaching = matchKeywords(userText, ["teacher", "insult", "critic", "criticism", "coaching", "class", "shout"]);
    const isParent = matchKeywords(userText, ["parent", "parents", "mummy", "papa", "mother", "father", "expectations", "compare"]);
    const isAcademic = matchKeywords(userText, ["backlog", "syllabus", "test", "mock", "score", "marks", "fail", "failed", "marksheet"]);
    const isLoneliness = matchKeywords(userText, ["lonely", "alone", "hostel", "room", "isolated", "isolation"]);
    const isMotivation = matchKeywords(userText, ["happy", "good", "solved", "completed", "studied", "great", "better", "accomplished"]);

    let selectedText = "";

    // 1. GREETING INTENT (with context-driven memory triggers)
    if (isGreeting) {
      if (hasPreviousBreakup) {
        selectedText = `### Suno, beta... 🌸
I am here to listen. I know that studying while processing relationship grief is incredibly heavy.

**BhalAI observations from your diary:**
- You recently mentioned a breakup making it hard to study.
- Concentration in drop years can feel even harder in isolated rooms.

*Has concentration become any easier today? Did you manage to read some **${comfortSub}**?* No pressure, just take it 10 minutes at a time.`;
      } else if (hasPreviousParent) {
        selectedText = `### Pyare bacche... ❤️
I am doing fine. But I was thinking about the heavy family comparisons and marks pressure you wrote about in your reflections. 

**Remember this, beta:**
- Your worth is not tied to coaching ranks or marksheets.
- Consistently showing up is the ultimate success.

*How is your heart feeling today? Let's take a deep breath together.* 🫂`;
      } else if (hasPreviousBacklog) {
        selectedText = `### Chalo reset karte hain! 🧘
I remember you were feeling anxious about exam backlog accumulation and test stress. Don't worry, every student goes through this phase.

**A quick BhalAI study route plan:**
1. Choose one micro-topic from **${comfortSub}**.
2. Put your phone on DND for exactly 20 minutes.
3. Solve 3 easy questions to break the backlog fear.

*How is your revision session going today? Did you take a warm tea break?* ☕`;
      } else {
        selectedText = `### Namaste beta! 🌸
I am doing well. I am here to hold space for you. Tell me, how was your day and how is your mood today? 

**Quick daily reminder:**
- Drink some water right now 💧
- Relax your shoulders and drop your jaw.
- Take a high quality study break.

*What is on your mind today? Study backlog, or just feeling a bit tired?*`;
      }
    }
    // 2. RELATIONSHIP INTENT
    else if (isRelationship) {
      selectedText = `### Breakup stress is real... 💔
Beta, relationship pain is extremely tough to handle, especially when high-stakes exams like **${examName}** demand all your time. Studying in a single room makes those loops even louder.

**BhalAI Support Guidelines:**
- **Do not force focus:** Suppression will cause emotional burnout.
- **Micro-blocks:** Study only your comfort subject (**${comfortSub}**) for 15-20 minutes, then rest.
- **Physical movement:** Stand up, stretch, or drink some water.

*I am right here with you. Write down your feelings or cry if you need to, it's okay.* 🫂`;
    }
    // 3. COACHING / TEACHER INTENT
    else if (isCoaching) {
      selectedText = `### Suno, rankings don't define you... 🌟
Teacher insults or classroom comparisons in coaching institutes can feel deeply embarrassing and hurtful. Ranks are pathfinders for syllabus gaps, not measures of your potential.

**How to handle coaching friction:**
1. **De-bias:** Remember the teacher sees only a test score, not your full capabilities.
2. **Table Reset:** Clear all test marks sheets from your study table.
3. **Breathing reset:** Do a quick box breathing cycle (4s inhale, 4s hold, 4s exhale, 4s hold).

*Let's leave coaching stress behind for tonight. Shall we revise some easy parts of **${comfortSub}**?*`;
    }
    // 4. PARENT EXPECTATIONS INTENT
    else if (isParent) {
      selectedText = `### Carrying expectations... 👪
Mummy-Papa's constant comparison and expectations can create massive academic anxiety, beta. Indian students carry this burden silently, especially when preparing for highly competitive exams like **${examName}**.

**BhalAI Reminder of Worth:**
- You are their child, not a rank-producing machine.
- Your value is independent of any marksheet.
- Progress is built on consistent small attempts, not instant scores.

*Take a deep breath. You are doing your best, and BhalAI is proud of your efforts.* ❤️`;
    }
    // 5. ACADEMIC / BACKLOG / TEST STRESS INTENT
    else if (isAcademic) {
      selectedText = `### Syllabus Backlog Reset 📚
Arey beta, panic will only accelerate backlog fear! It is normal to feel overwhelmed by mock test marks or massive syllabi.

**Step-by-step backlog recovery plan:**
1. **Define target:** Select one tiny concept in **${comfortSub}**.
2. **Pomodoro focus:** Turn off notifications and study for 25 minutes.
3. **No comparison:** Do not compare your backlog speed with others.

*Let's take a 5-minute chai break first. Reset your table, and start small.* ☕`;
    }
    // 6. LONELINESS INTENT
    else if (isLoneliness) {
      selectedText = `### You are not alone, beta... 🫂
Hostel isolation and drop-year study routines can feel incredibly lonely. While everyone seems to be moving ahead, you are sitting in one room studying all day.

**Self-care steps for drop-year isolation:**
- **Vocalize:** Call a close friend or family member for a 5-minute normal chat (not about exams).
- **Sensory change:** Look outside the window or walk to a local stall for a tea break.
- **Compassion:** BhalAI is right here with you. Your effort is seen.

*Tell me, is hostel life or drop-year isolation feeling heavier tonight?*`;
    }
    // 7. MOTIVATION / POSITIVE INTENT
    else if (isMotivation) {
      selectedText = `### Shabash, beta! 🎉
That is wonderful to hear! Small wins and consistent revisions build ultimate confidence.

**How to maintain this positive flow:**
- **Protect sleep:** Do not stretch study sessions into the night.
- **Acknowledge effort:** Congratulate yourself for completing today's topics.
- **Rhythm:** Continue this steady pacing tomorrow.

*BhalAI is extremely proud of you! Keep this beautiful momentum going.* 🌟`;
    }
    // 8. FALLBACK (Contextual to Exam)
    else {
      let examNote = "";
      if (examName.includes("UPSC")) {
        examNote = "UPSC preparation requires long-term patience, drop years, and isolating study cycles. It is normal to feel overwhelmed.";
      } else if (examName.includes("NEET")) {
        examNote = "NEET aspirants carry immense expectations from family, rank pressure, and vast biology backlog stress.";
      } else if (examName.includes("JEE")) {
        examNote = "JEE Advanced prep requires immense practice, and mock test marking schemes can be extremely exhausting.";
      } else if (examName.includes("SSC")) {
        examNote = "SSC competitive exam uncertainties and schedules can cause high anxiety.";
      } else {
        examNote = `Preparing for ${examName} is a challenging journey, and the prep pressure is very real.`;
      }
      
      selectedText = `### Main sun rahi hoon... 🌸
I can completely understand what you are going through. ${examNote} 

**Things we can do together:**
- Log your stress metrics in the daily check-in.
- Write down your backlog fears in the Mann Ki Diary.
- Do a box breathing exercise on the dashboard.

*Mujhe batao, kya chal raha hai aapke dil mein? Padhai ka load hai, ya kuch aur?*`;
    }

    return {
      text: selectedText,
      isMock: true,
      async *stream() {
        const words = selectedText.split(" ");
        for (const word of words) {
          yield word + " ";
          await new Promise((r) => setTimeout(r, 45));
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
  // A. Check for potential emotional crisis first
  const safetyCheck = await detectCrisis(content);

  const client = getAnthropicClient();
  if (isMockMode() || !client) {
    const text = content.toLowerCase();
    
    // A. Check for potential emotional crisis first
    if (safetyCheck.isCrisis) {
      return {
        primaryEmotion: "Sadness",
        stressScore: 95,
        burnoutRisk: 95,
        confidenceScore: 15,
        detectedTriggers: ["Severe despair"],
        positiveIndicators: [],
        tags: ["crisis", "severe-distress"],
        emotionSummary: "It sounds like you're carrying something extremely heavy right now. You don't have to carry it alone.",
        riskLevel: "CRITICAL"
      };
    }

    // Check specific triggers with exact word matching helper
    const hasRelationship = matchKeywords(text, ["breakup", "relationship", "girlfriend", "boyfriend", "ex", "exes", "left me", "dhoka"]);
    const hasCoaching = matchKeywords(text, ["teacher", "insult", "critic", "criticism", "coaching", "class", "shout", "coaching center", "classroom"]);
    const hasParent = matchKeywords(text, ["parent", "parents", "mummy", "papa", "mother", "father", "compare", "comparison", "expectations", "family", "rishtedar"]);
    const hasMock = matchKeywords(text, ["mock", "test", "tests", "marks", "score", "scores", "fail", "failed", "failure", "rank", "percentile", "backlog", "backlogs", "syllabus"]);
    const hasLoneliness = matchKeywords(text, ["lonely", "alone", "hostel", "room", "isolated", "isolation"]);
    const hasFinancial = matchKeywords(text, ["money", "fee", "fees", "afford", "financial", "loan", "loans", "expense", "expenses"]);
    const hasHealth = matchKeywords(text, ["health", "sick", "ill", "headache", "sleep", "tired", "exhausted", "fatigue", "fever"]);

    // Calculate baseline sentiment indicators
    const lowCues = ["fine", "okay", "good", "happy", "stable", "calm", "cool", "peace", "normal", "steady", "relaxed", "better", "great", "nice", "hope", "solved", "easy"];
    const medCues = ["tired", "exhausted", "fatigue", "backlog", "worry", "worried", "tense", "nervous", "pressure", "heavy", "sleepy", "sad", "lonely", "alone", "bored", "distracted"];
    const highCues = ["anxious", "anxiety", "panic", "scared", "fear", "fail", "failed", "failure", "hopeless", "depressed", "worthless", "useless", "give up", "crying", "cry", "hate", "angry", "frustrated", "ruined"];

    let lowCount = lowCues.filter(c => matchKeywords(text, [c])).length;
    let medCount = medCues.filter(c => matchKeywords(text, [c])).length;
    let highCount = highCues.filter(c => matchKeywords(text, [c])).length;

    let stressScore = 40;
    let burnoutRisk = 35;
    let confidenceScore = 60;
    let primaryEmotion = "Neutral";
    let emotionSummary = "You shared your thoughts. Writing them down is a good step towards emotional clarity.";
    let tags: string[] = ["journaled"];
    let detectedTriggers: string[] = [];
    let positiveIndicators: string[] = ["Self-awareness"];

    if (highCount > 0) {
      stressScore = 70 + Math.min(20, highCount * 5);
      burnoutRisk = 65 + Math.min(25, highCount * 5 + medCount * 2);
      confidenceScore = Math.max(10, 40 - highCount * 8);
      primaryEmotion = "Anxiety";
      emotionSummary = "You are feeling highly anxious and overwhelmed. Remember to pause and breathe.";
      tags.push("anxiety-heavy");
    } else if (medCount > 0) {
      stressScore = 50 + Math.min(15, medCount * 5);
      burnoutRisk = 45 + Math.min(20, medCount * 5);
      confidenceScore = Math.max(30, 55 - medCount * 5);
      primaryEmotion = "Fatigue";
      emotionSummary = "You are feeling tired and carrying backlog pressure. Give yourself permission to take brief breaks.";
      tags.push("fatigued");
    } else if (lowCount > 0) {
      stressScore = 20 + Math.max(0, 15 - lowCount * 5);
      burnoutRisk = 15 + Math.max(0, 15 - lowCount * 5);
      confidenceScore = Math.min(95, 70 + lowCount * 5);
      primaryEmotion = "Balanced";
      emotionSummary = "You are holding steady and feeling balanced. Keep going with this positive pace.";
      tags.push("steady-flow");
    }

    // Apply specific triggers if detected
    if (hasRelationship) {
      detectedTriggers.push("Relationship issues");
      primaryEmotion = "Loneliness";
      stressScore = Math.max(stressScore, 85);
      burnoutRisk = Math.max(burnoutRisk, 70);
      confidenceScore = Math.min(confidenceScore, 35);
      tags.push("relationship-grief");
      emotionSummary = "You are processing heavy relationship grief and feeling isolated in your prep room.";
    }

    if (hasCoaching) {
      detectedTriggers.push("Teacher criticism");
      primaryEmotion = "Anger";
      stressScore = Math.max(stressScore, 75);
      burnoutRisk = Math.max(burnoutRisk, 60);
      confidenceScore = Math.min(confidenceScore, 30);
      tags.push("coaching-stress");
      emotionSummary = "Embarrassment and frustration from classroom criticism is affecting your focus.";
    }

    if (hasParent) {
      detectedTriggers.push("Family pressure");
      primaryEmotion = "Anxiety";
      stressScore = Math.max(stressScore, 80);
      burnoutRisk = Math.max(burnoutRisk, 75);
      confidenceScore = Math.min(confidenceScore, 40);
      tags.push("family-expectations");
      emotionSummary = "Comparing yourself to others and facing expectations from family is causing emotional fatigue.";
    }

    if (hasMock) {
      detectedTriggers.push("Mock test anxiety");
      primaryEmotion = "Fear";
      stressScore = Math.max(stressScore, 82);
      burnoutRisk = Math.max(burnoutRisk, 72);
      confidenceScore = Math.min(confidenceScore, 30);
      tags.push("mock-test-panic");
      emotionSummary = "Low scores in mock tests have triggered fear of failure and syllabus overload anxiety.";
    }

    if (hasLoneliness) {
      detectedTriggers.push("Hostel loneliness");
      primaryEmotion = "Loneliness";
      stressScore = Math.max(stressScore, 70);
      burnoutRisk = Math.max(burnoutRisk, 65);
      confidenceScore = Math.min(confidenceScore, 45);
      tags.push("hostel-isolation");
      emotionSummary = "The drop-year routine is feeling extremely isolating, making concentration difficult.";
    }

    if (hasFinancial) {
      detectedTriggers.push("Financial pressure");
      primaryEmotion = "Anxiety";
      stressScore = Math.max(stressScore, 80);
      burnoutRisk = Math.max(burnoutRisk, 70);
      confidenceScore = Math.min(confidenceScore, 40);
      tags.push("financial-stress");
      emotionSummary = "The financial burden of coaching fees is weighing heavily on your mind.";
    }

    if (hasHealth) {
      detectedTriggers.push("Health issues");
      primaryEmotion = "Burnout";
      stressScore = Math.max(stressScore, 78);
      burnoutRisk = Math.max(burnoutRisk, 85);
      confidenceScore = Math.min(confidenceScore, 40);
      tags.push("physical-exhaustion");
      emotionSummary = "Physical fatigue, poor sleep quality, and headaches are accelerating burnout.";
    }

    // Optimism check
    const hasOptimism = matchKeywords(text, ["hope", "try", "warm", "better", "accomplish", "proud", "achieve"]);
    if (hasOptimism) {
      positiveIndicators.push("Optimism");
    }

    return {
      primaryEmotion,
      stressScore,
      burnoutRisk,
      confidenceScore,
      detectedTriggers,
      positiveIndicators,
      tags,
      emotionSummary,
      riskLevel: stressScore > 80 ? "HIGH" : stressScore > 50 ? "MEDIUM" : "LOW"
    };
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      system: `${JOURNAL_ANALYSIS_PROMPT}\n\nIMPORTANT: If the user indicates self-harm or suicide, ensure stressScore is 95+, burnoutRisk is 95+, riskLevel is 'CRITICAL', and emotionSummary is 'It sounds like you\'re carrying something extremely heavy right now. You don\'t have to carry it alone.'`,
      messages: [{ role: "user", content }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonStr);
    return {
      primaryEmotion: parsed.primaryEmotion || "Anxiety",
      stressScore: Number(parsed.stressScore) || 50,
      burnoutRisk: Number(parsed.burnoutRisk) || 50,
      confidenceScore: Number(parsed.confidenceScore) || 50,
      detectedTriggers: parsed.detectedTriggers || parsed.triggers || [],
      positiveIndicators: parsed.positiveIndicators || [],
      tags: parsed.tags || ["journaled"],
      emotionSummary: parsed.emotionSummary || "Processed with care.",
      riskLevel: parsed.riskLevel || (Number(parsed.stressScore) > 80 ? "HIGH" : "MEDIUM")
    };
  } catch (error) {
    console.error("Journal analysis error:", error);
    return {
      primaryEmotion: "Anxiety",
      stressScore: 50,
      burnoutRisk: 50,
      confidenceScore: 50,
      detectedTriggers: [],
      positiveIndicators: [],
      tags: ["journaled"],
      emotionSummary: "Processed your thoughts with care.",
      riskLevel: "MEDIUM"
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
    "can't continue",
    "want to end it",
    "don't want to live",
    "atmahathya",
    "mar jau",
    "mar jana",
    "suicidal",
    "harm myself",
    "no reason to live"
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
  userName: string,
  checkinsRaw?: string[],
  journalsRaw?: string[]
) {
  const client = getAnthropicClient();
  if (isMockMode() || !client) {
    const checkinList = checkinsRaw || [];
    const journalList = journalsRaw || [];
    
    let totalStress = 0;
    let totalSleep = 0;
    let highStressDaysCount = 0;
    let counts = checkinList.length;
    
    checkinList.forEach(c => {
      const stressMatch = c.match(/Stress:\s*(\d+)/);
      const sleepMatch = c.match(/Sleep:\s*(\d+)/);
      if (stressMatch) {
        const s = parseInt(stressMatch[1]);
        totalStress += s;
        if (s > 6) highStressDaysCount++;
      }
      if (sleepMatch) totalSleep += parseInt(sleepMatch[1]);
    });
    
    const avgStress = counts > 0 ? Math.round((totalStress / counts) * 10) : 55;
    const avgSleep = counts > 0 ? Math.round(totalSleep / counts) : 6.5;
    
    let triggers = new Set<string>();
    let primaryEmotion = "Stable";
    let themes = ["Revision pacing"];
    
    const journalStr = journalList.join(" ").toLowerCase();
    if (matchKeywords(journalStr, ["breakup", "relationship", "ex", "girlfriend", "boyfriend"])) {
      triggers.add("Relationship issues");
      themes.push("Emotional distraction");
      primaryEmotion = "Sadness & Overwhelm";
    }
    if (matchKeywords(journalStr, ["parent", "compare", "expect", "mummy", "papa"])) {
      triggers.add("Family pressure");
      themes.push("Expectation load");
      primaryEmotion = "Anxiety";
    }
    if (matchKeywords(journalStr, ["mock", "test", "score", "marks", "fail"])) {
      triggers.add("Mock test anxiety");
      themes.push("Score pressure");
      primaryEmotion = "Fear of Failure";
    }
    if (matchKeywords(journalStr, ["teacher", "insult"])) {
      triggers.add("Teacher criticism");
      themes.push("Coaching class environment");
      primaryEmotion = "Anger & Embarrassment";
    }
    if (matchKeywords(journalStr, ["lonely", "alone", "hostel"])) {
      triggers.add("Hostel loneliness");
      themes.push("Drop year isolation");
      primaryEmotion = "Loneliness";
    }
    if (matchKeywords(journalStr, ["suicide", "kill myself", "die"])) {
      triggers.add("Severe despair");
      themes.push("Crisis emergency");
      primaryEmotion = "CRITICAL Distress";
    }
    
    const triggerArr = Array.from(triggers);
    const mostCommonTrigger = triggerArr.length > 0 ? triggerArr.join(", ") : "General study stress";
    
    let report = `
# Weekly Wellness Reflection for ${userName} 🌸

Aapka is hafte ka safar humne bohot kareeb se dekha hai. Here is your personalized emotional review:

### 🌟 This Week's Emotional Journey
You spent this week navigating the challenges of your preparation journey. Your emotional graph shows you've been carrying a heavy workload.
- **Average Stress Score:** ${avgStress}/100
- **Sleep Quality:** ${avgSleep} hours on average
- **Primary State:** ${primaryEmotion}

### 🔍 Key Metrics & Insights
- **Most Common Trigger:** ${mostCommonTrigger}
- **Recurring Themes:** ${themes.join(", ")}
- **Most Difficult Day:** Wednesday (due to high mock/study logs)
- **Most Positive Day:** Sunday (calmer study logs)

### ❤️ BhalAI Observations & Guidance
*Suno, beta.* ${
      primaryEmotion.includes("CRITICAL") 
      ? "Mujhe aapki bohot chinta hai. Standard study routing ignores this level of stress. Please talk to a close friend or reach out to our emergency helplines immediately. You are precious, and your life is worth far more than any exam."
      : primaryEmotion.includes("Failure")
      ? "Mock test tests are designed to highlight gaps, not define your intelligence. Mock papers shouldn't make you doubt your capabilities. Take a short tea break and revise your comfort subject."
      : primaryEmotion.includes("Relationship")
      ? "Breakups are incredibly painful, especially in drop years when study focus is crucial. Don't suppress your feelings. Write them down and let them go."
      : "You are doing your absolute best in a very demanding phase of your life. Do not compare your day 1 with someone else's day 100."
    }

Keep going, BhalAI is always proud of your effort! 🫂
`;
    return report;
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
