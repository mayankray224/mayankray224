"use server";

import {
  analyzeJournal,
  detectCrisis,
  generateWeeklyReport,
  generateStudyRouting,
  generateHeatmapInsight
} from "@/lib/ai/claude";

/**
 * 1. Log Journal Entry + Analyze with Claude AI (Screen 9)
 */
export async function createJournalEntry(data: {
  content: string;
  name: string;
  examType: string;
}) {
  const { content, name, examType } = data;

  if (!content || content.trim().length < 5) {
    throw new Error("Journal entry must be at least 5 characters long.");
  }

  // A. Check for potential emotional crisis
  const safetyCheck = await detectCrisis(content);
  
  // B. Run Claude emotional analysis
  const analysis = await analyzeJournal(content);

  return { analysis, isCrisis: safetyCheck.isCrisis };
}

/**
 * 2. Generate Weekly Wellness Report (Screen 11)
 */
export async function generateWeeklyReportAction(data: {
  name: string;
  examType: string;
  checkins: string[];
  journals: string[];
}) {
  const { name, examType, checkins, journals } = data;

  const checkinsText = checkins.length > 0 ? checkins.join("\n") : "No check-ins logged.";
  const journalsText = journals.length > 0 ? journals.join("\n") : "No journals logged.";

  const historyContext = `
  User Name: ${name}
  Target Exam: ${examType}
  Recent Mood check-ins:\n${checkinsText}
  Recent Journal Inputs:\n${journalsText}
  `;

  const reportContent = await generateWeeklyReport(historyContext, name, checkins, journals);
  return { reportContent };
}

/**
 * 3. Fetch Heatmap Insight from Claude
 */
export async function getHeatmapInsightAction(history: { date: string; stress: number }[]) {
  return generateHeatmapInsight(history);
}

/**
 * 4. Study Recommendation Fetch
 */
export async function getStudyRecommendationAction(data: {
  moodText: string;
  stressScore: number;
  energyScore: number;
  comfortSubject: string;
  examType: string;
}) {
  const { moodText, stressScore, energyScore, comfortSubject, examType } = data;
  return generateStudyRouting(moodText, stressScore, energyScore, comfortSubject, examType);
}
