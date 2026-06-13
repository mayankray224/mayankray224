"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import {
  analyzeJournal,
  detectCrisis,
  generateWeeklyReport,
  generateStudyRouting,
  generateCopingStrategies,
  generateHeatmapInsight
} from "@/lib/ai/claude";

// Helper to get active user ID from NextAuth session, with automatic Demo user fallback
async function getUserId() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) return user.id;
    }
  } catch (e) {
    console.warn("Database connection failed in getUserId. Falling back to demo-user id.", e);
  }
  return "demo-user";
}

/**
 * 1. Synchronize Onboarding Data (Screens 2-6)
 */
export async function syncOnboarding(data: {
  name: string;
  exams: string[];
  comfortSubject: string;
  examDate: string;
  language: string;
}) {
  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      // Update database profile
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: data.name,
          language: data.language,
        },
      });

      // Re-create exam details
      await prisma.exam.deleteMany({ where: { userId } });
      for (const examType of data.exams) {
        await prisma.exam.create({
          data: {
            userId,
            examType,
            examDate: new Date(data.examDate),
          },
        });
      }

      // Re-create comfort subject
      await prisma.subject.deleteMany({ where: { userId } });
      await prisma.subject.create({
        data: {
          userId,
          name: data.comfortSubject,
          isComfortSubject: true,
        },
      });

      // Setup/Refresh streak count
      const streak = await prisma.streak.findFirst({ where: { userId } });
      if (!streak) {
        await prisma.streak.create({
          data: {
            userId,
            currentStreak: 1,
            longestStreak: 1,
            lastActive: new Date(),
          },
        });
      }
    }
  } catch (err) {
    console.warn("Database connection failed in syncOnboarding. Proceeding in offline mock mode.", err);
  }

  return { success: true };
}

/**
 * 2. Record Daily Mood Checkin (Screen 7)
 */
export async function createMoodCheckin(data: {
  moodText: string;
  stressScore: number;
  confidenceScore: number;
  burnoutRisk: number;
  moodScore: number;
}) {
  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      return await prisma.moodCheckin.create({
        data: {
          userId,
          moodText: data.moodText,
          stressScore: data.stressScore,
          confidenceScore: data.confidenceScore,
          burnoutRisk: data.burnoutRisk,
          moodScore: data.moodScore,
        },
      });
    }
  } catch (err) {
    console.warn("Database connection failed in createMoodCheckin. Simulating offline save.", err);
  }

  return {
    id: "checkin-" + Math.random().toString(),
    userId: "demo-user",
    createdAt: new Date(),
    ...data,
  };
}

/**
 * 3. Log Journal Entry + Analyze with Claude AI (Screen 9)
 */
export async function createJournalEntry(content: string) {
  const userId = await getUserId();

  if (!content || content.trim().length < 5) {
    throw new Error("Journal entry must be at least 5 characters long.");
  }

  // A. Check for potential emotional crisis
  const safetyCheck = await detectCrisis(content);
  
  // B. Run Claude emotional analysis
  const analysis = await analyzeJournal(content);

  try {
    if (userId !== "demo-user") {
      if (safetyCheck.isCrisis) {
        await prisma.crisisFlag.create({
          data: {
            userId,
            severity: safetyCheck.severity,
            source: "journal",
          },
        });
      }

      // Write Journal Entry to Database
      const entry = await prisma.journalEntry.create({
        data: {
          userId,
          content,
          emotionSummary: analysis.emotionSummary || "Reflected on prep challenges",
          tags: analysis.tags || ["journaled"],
          stressScore: analysis.stressScore ?? 50,
        },
      });

      // Update Streak
      const streak = await prisma.streak.findFirst({ where: { userId } });
      if (streak) {
        const today = new Date();
        const lastActiveDate = new Date(streak.lastActive);
        const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newCurrent = streak.currentStreak;
        if (diffDays <= 1) {
          if (diffDays === 1) newCurrent += 1;
        } else {
          newCurrent = 1;
        }

        await prisma.streak.update({
          where: { id: streak.id },
          data: {
            currentStreak: newCurrent,
            longestStreak: Math.max(newCurrent, streak.longestStreak),
            lastActive: today,
          },
        });
      }

      return { entry, analysis, isCrisis: safetyCheck.isCrisis };
    }
  } catch (err) {
    console.warn("Database connection failed in createJournalEntry. Simulating offline save.", err);
  }

  // Fallback return if database offline
  const fallbackEntry = {
    id: "journal-" + Math.random().toString(),
    userId: "demo-user",
    content,
    emotionSummary: analysis.emotionSummary || "Reflected on study backlog",
    tags: analysis.tags || ["exam-anxiety"],
    stressScore: analysis.stressScore ?? 65,
    createdAt: new Date(),
  };

  return { entry: fallbackEntry, analysis, isCrisis: safetyCheck.isCrisis };
}

/**
 * 4. Fetch User Journal Entry History
 */
export async function fetchJournalEntries() {
  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      return await prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("Database connection failed in fetchJournalEntries. Falling back to mock journal history.", err);
  }

  // Offline mock journals
  return [
    {
      id: "j-1",
      content: "Organic chemistry is piling up. I sat for 4 hours today but could not recall basic mechanism during mock test. I am scared I won't clear the JEE cutoffs. Papa spent so much money in coaching.",
      emotionSummary: "Anxious and carrying parental exam pressure.",
      tags: ["chemistry", "mock-test", "parental-pressure"],
      stressScore: 82,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "j-2",
      content: "Talked to BhalAI and focused only on Physics (my comfort subject) for 30 minutes. It felt good to solve simple equations again. Maybe I am not completely hopeless. Still anxious but calmer.",
      emotionSummary: "Regaining confidence, calm progress.",
      tags: ["physics", "small-wins", "hopeful"],
      stressScore: 55,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }
  ];
}

/**
 * 5. Anonymous Confession Wall (Screen 12)
 */
export async function createConfession(content: string) {
  if (!content || content.trim().length < 10) {
    throw new Error("Confession must be at least 10 characters long.");
  }

  const safety = await detectCrisis(content);
  if (safety.isCrisis && safety.severity === "high") {
    return { success: false, moderated: true };
  }

  try {
    const confession = await prisma.confession.create({
      data: {
        content,
        approved: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return { success: true, confession };
  } catch (err) {
    console.warn("Database connection failed in createConfession. Simulating offline submission.", err);
  }

  // Fallback return if database offline
  const mockConfession = {
    id: "confession-" + Math.random().toString(),
    content,
    approved: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  };

  return { success: true, confession: mockConfession };
}

/**
 * 6. React to Confessions with Emojis / Me Too
 */
export async function reactToConfession(confessionId: string, emoji: string) {
  try {
    const existing = await prisma.reaction.findFirst({
      where: { confessionId, emoji },
    });

    if (existing) {
      return await prisma.reaction.update({
        where: { id: existing.id },
        data: { count: existing.count + 1 },
      });
    } else {
      return await prisma.reaction.create({
        data: { confessionId, emoji, count: 1 },
      });
    }
  } catch (err) {
    console.warn("Database connection failed in reactToConfession. Simulating reaction click.", err);
  }
  return { id: "react-id", confessionId, emoji, count: 5 };
}

/**
 * 7. Fetch active, non-expired confessions
 */
export async function fetchConfessions() {
  try {
    const now = new Date();
    return await prisma.confession.findMany({
      where: {
        approved: true,
        expiresAt: { gt: now },
      },
      include: {
        reactions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Database connection failed in fetchConfessions. Falling back to offline mock wall.", err);
  }

  // Offline mock confessions
  return [
    {
      id: "c-1",
      content: "Scoring 180/300 in JEE Advanced mocks. Coachings are saying I won't get IIT Bombay. I am studying 14 hours a day, sleeping only 4 hours. My head hurts constantly. I just want to sleep for a week without feeling guilty.",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      reactions: [
        { id: "r-1", emoji: "🫂", count: 24 },
        { id: "r-2", emoji: "❤️", count: 18 },
        { id: "r-3", emoji: "💪", count: 9 },
      ]
    },
    {
      content: "This is my third drop year for NEET. All my school friends are in third year of college, posting vacation photos. I am still solving biology MCQs in the same dusty room. Feel extremely lonely today.",
      id: "c-2",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      reactions: [
        { id: "r-4", emoji: "🫂", count: 48 },
        { id: "r-5", emoji: "🙌", count: 12 },
        { id: "r-6", emoji: "❤️", count: 32 },
      ]
    },
    {
      content: "UPSC prelims results are out. Didn't make it. Again. Spent 4 years in Old Rajinder Nagar. I don't know how to look at my father's face. He is retired and still sending me money. My hands are shaking.",
      id: "c-3",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reactions: [
        { id: "r-7", emoji: "🫂", count: 52 },
        { id: "r-8", emoji: "❤️", count: 29 },
        { id: "r-9", emoji: "🙌", count: 14 },
      ]
    }
  ];
}

/**
 * 8. Retrieve User Profile Data & Readiness
 */
export async function fetchUserProfile() {
  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          exams: true,
          subjects: true,
          moodCheckins: { orderBy: { createdAt: "desc" }, take: 10 },
          journalEntries: { orderBy: { createdAt: "desc" }, take: 10 },
          streaks: true,
          crisisFlags: true,
        },
      });

      if (user) {
        let baseScore = 75;
        if (user.moodCheckins.length > 0) {
          const avgMood = user.moodCheckins.reduce((a, b) => a + b.moodScore, 0) / user.moodCheckins.length;
          const avgStress = user.moodCheckins.reduce((a, b) => a + b.stressScore, 0) / user.moodCheckins.length;
          baseScore = Math.round(avgMood * 0.6 + (100 - avgStress) * 0.4);
        }

        const journalBonus = Math.min(user.journalEntries.length * 5, 15);
        const finalScore = Math.max(10, Math.min(100, baseScore + journalBonus));

        let preExamActive = false;
        if (user.exams.length > 0) {
          const nextExam = user.exams[0].examDate;
          const diffHours = (nextExam.getTime() - Date.now()) / (1000 * 60 * 60);
          if (diffHours > 0 && diffHours <= 72) {
            preExamActive = true;
          }
        }

        return {
          ...user,
          readinessScore: finalScore,
          preExamActive,
        };
      }
    }
  } catch (err) {
    console.warn("Database connection failed in fetchUserProfile. Loading mock profile.", err);
  }

  // Offline mock profile fallback
  return {
    id: "demo-user",
    name: "Aarav Sharma",
    email: "demo@nazaraana.in",
    language: "Hinglish",
    theme: "light",
    age: 19,
    exams: [
      { id: "e-1", userId: "demo-user", examType: "JEE Mains", examDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) }
    ],
    subjects: [
      { id: "s-1", userId: "demo-user", name: "Physics", isComfortSubject: true }
    ],
    moodCheckins: [
      { id: "mc-1", userId: "demo-user", moodText: "Mock test went bad, syllabus backlog is piling up", stressScore: 82, confidenceScore: 40, burnoutRisk: 75, moodScore: 45, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: "mc-2", userId: "demo-user", moodText: "Felt very lonely. Talked to BhalAI, did a small breathing exercise.", stressScore: 68, confidenceScore: 50, burnoutRisk: 65, moodScore: 55, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { id: "mc-3", userId: "demo-user", moodText: "Chai break with friends, revision went okay today", stressScore: 52, confidenceScore: 65, burnoutRisk: 50, moodScore: 72, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    journalEntries: [
      { id: "je-1", userId: "demo-user", content: "Organic chemistry is hard.", emotionSummary: "Feeling backlog pressure", tags: ["chemistry"], stressScore: 80, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
    ],
    streaks: [
      { id: "st-1", userId: "demo-user", currentStreak: 3, longestStreak: 5, lastActive: new Date() }
    ],
    crisisFlags: [],
    readinessScore: 72,
    preExamActive: false,
  };
}

/**
 * 9. Fetch Heatmap History (Stress scores per day)
 */
export async function fetchHeatmapData() {
  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      const checkins = await prisma.moodCheckin.findMany({
        where: { userId },
        select: { createdAt: true, stressScore: true },
        orderBy: { createdAt: "asc" },
      });

      const journals = await prisma.journalEntry.findMany({
        where: { userId },
        select: { createdAt: true, stressScore: true },
        orderBy: { createdAt: "asc" },
      });

      const datesMap: Record<string, { count: number; totalStress: number }> = {};
      const processEntry = (date: Date, stress: number) => {
        const isoString = date.toISOString().split("T")[0];
        if (!datesMap[isoString]) {
          datesMap[isoString] = { count: 0, totalStress: 0 };
        }
        datesMap[isoString].count += 1;
        datesMap[isoString].totalStress += stress;
      };

      checkins.forEach((c) => processEntry(c.createdAt, c.stressScore));
      journals.forEach((j) => processEntry(j.createdAt, j.stressScore));

      return Object.keys(datesMap).map((date) => {
        const avgStress = Math.round(datesMap[date].totalStress / datesMap[date].count);
        return { date, stressScore: avgStress };
      });
    }
  } catch (err) {
    console.warn("Database connection failed in fetchHeatmapData. Falling back to offline mock heatmap.", err);
  }

  // Offline mock heatmap
  const today = new Date();
  return [
    { date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], stressScore: 35 },
    { date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], stressScore: 82 },
    { date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], stressScore: 68 },
    { date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], stressScore: 52 },
  ];
}

/**
 * 10. Generate & Store Weekly Wellness Report (Screen 11)
 */
export async function fetchOrCreateWeeklyReport() {
  const userId = await getUserId();

  try {
    if (userId !== "demo-user") {
      const recentReport = await prisma.weeklyReport.findFirst({
        where: {
          userId,
          generatedAt: { gt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { generatedAt: "desc" },
      });

      if (recentReport) {
        return recentReport;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          exams: true,
          journalEntries: { take: 5, orderBy: { createdAt: "desc" } },
          moodCheckins: { take: 5, orderBy: { createdAt: "desc" } },
        },
      });

      if (user) {
        const checkinsText = user.moodCheckins
          .map((c) => `- Mood: "${c.moodText}", Stress Index: ${c.stressScore}/100`)
          .join("\n");
        const journalsText = user.journalEntries
          .map((j) => `- Entry: "${j.content.substring(0, 150)}..." [Stress: ${j.stressScore}/100]`)
          .join("\n");

        const historyContext = `
        User Name: ${user.name || "Student"}
        Exam: ${user.exams[0]?.examType || "JEE/NEET/UPSC"}
        Recent Mood Logs:\n${checkinsText}
        Recent Journal Inputs:\n${journalsText}
        `;

        const content = await generateWeeklyReport(historyContext, user.name || "Beta");
        return await prisma.weeklyReport.create({
          data: {
            userId,
            reportContent: content,
          },
        });
      }
    }
  } catch (err) {
    console.warn("Database connection failed in fetchOrCreateWeeklyReport. Falling back to offline report.", err);
  }

  // Offline mock report
  let sessionName = "Beta";
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.name) {
      sessionName = session.user.name;
    }
  } catch (e) {}

  const content = await generateWeeklyReport("", sessionName);
  return {
    id: "report-1",
    userId: "demo-user",
    reportContent: content,
    generatedAt: new Date(),
  };
}

/**
 * 11. Study Recommendation Fetch
 */
export async function getStudyRecommendation() {
  let moodText = "Backlog stress";
  let stressScore = 65;
  let moodScore = 55;
  let comfortSubjectName = "Physics";
  let examName = "JEE Mains";

  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      const profile = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          exams: true,
          subjects: { where: { isComfortSubject: true } },
          moodCheckins: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });

      if (profile) {
        const moodCheckin = profile.moodCheckins[0] || { moodText, stressScore, moodScore };
        moodText = moodCheckin.moodText;
        stressScore = moodCheckin.stressScore;
        moodScore = moodCheckin.moodScore;
        comfortSubjectName = profile.subjects[0]?.name || comfortSubjectName;
        examName = profile.exams[0]?.examType || examName;
      }
    }
  } catch (err) {
    console.warn("Database connection failed in getStudyRecommendation. Proceeding in offline mock mode.", err);
  }

  const energy = Math.round(moodScore * 0.9);
  return generateStudyRouting(moodText, stressScore, energy, comfortSubjectName, examName);
}

/**
 * 12. Update Coping Strategy Helped feedback
 */
export async function trackCopingStrategy(id: string, helped: boolean) {
  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      return await prisma.copingStrategy.create({
        data: {
          userId,
          strategyText: id,
          helped,
        },
      });
    }
  } catch (err) {
    console.warn("Database connection failed in trackCopingStrategy. Simulating feedback.", err);
  }
  return { id: "strategy-feedback", strategyText: id, helped };
}

/**
 * 13. Fetch Chat Conversation History
 */
export async function fetchChatHistory() {
  try {
    const userId = await getUserId();
    if (userId !== "demo-user") {
      let conversation = await prisma.conversation.findFirst({
        where: { userId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
        orderBy: { createdAt: "desc" },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { userId },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        });
      }

      return conversation.messages;
    }
  } catch (err) {
    console.warn("Database connection failed in fetchChatHistory. Returning mock chat history.", err);
  }

  // Offline mock chat history
  return [];
}

/**
 * 14. Fetch Heatmap Insight from Claude
 */
export async function getHeatmapInsightAction(history: { date: string; stress: number }[]) {
  return generateHeatmapInsight(history);
}

/**
 * 15. Register New User Account
 */
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const { name, email, password, confirmPassword } = data;

  if (!name || !name.trim()) {
    throw new Error("Name is required, beta.");
  }
  if (!email || !email.trim()) {
    throw new Error("Email is required, beta.");
  }
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match. Please verify.");
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error("An account already exists with this email. Please log in!");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        language: "English",
        theme: "light",
      },
    });

    // Seed default streak
    await prisma.streak.create({
      data: {
        userId: user.id,
        currentStreak: 1,
        longestStreak: 1,
        lastActive: new Date(),
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Register Error:", err);
    throw new Error(err.message || "Failed to create account. Is database offline?");
  }
}

/**
 * 16. Check Database Connectivity
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    console.warn("Database health check failed:", e);
    return false;
  }
}
