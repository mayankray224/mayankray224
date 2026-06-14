import { MoodCheckin, JournalEntry } from "@/store/useStore";

export interface WellnessMetrics {
  moodScore: number;
  stressScore: number;
  confidenceScore: number;
  burnoutRisk: number;
  readinessScore: number;
  hasSufficientData: boolean;
}

/**
 * Calculations:
 * - Stress Level (1-10) -> Stress Score = avg(stress) * 10
 * - Confidence Level (1-10) -> Confidence Score = avg(confidence) * 10
 * - Energy Level (1-10), Confidence Level (1-10) -> Mood Score = avg(energy + confidence) * 5
 * - Stress Level (1-10), Sleep Quality (1-10) -> Burnout Risk = avg(stress * 6 + (11 - sleep) * 4)
 * - Sleep Quality (1-10), Confidence (1-10), Stress (1-10) -> Mental Readiness Score = avg(sleep * 4 + confidence * 4 + (11 - stress) * 2)
 */
export function calculateWellnessMetrics(
  checkins: MoodCheckin[],
  journals: JournalEntry[]
): WellnessMetrics {
  if (checkins.length === 0) {
    return {
      moodScore: 0,
      stressScore: 0,
      confidenceScore: 0,
      burnoutRisk: 0,
      readinessScore: 0,
      hasSufficientData: false,
    };
  }

  // Filter to last 7 days check-ins
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentCheckins = checkins.filter(
    (c) => new Date(c.createdAt) >= sevenDaysAgo
  );

  const activeLogs = recentCheckins.length > 0 ? recentCheckins : checkins;

  let totalStress = 0;
  let totalEnergy = 0;
  let totalSleep = 0;
  let totalConfidence = 0;

  activeLogs.forEach((c) => {
    totalStress += Number(c.stressScore);
    totalEnergy += Number(c.energyScore);
    totalSleep += Number(c.sleepHours);
    totalConfidence += Number(c.confidenceScore);
  });

  const count = activeLogs.length;
  const avgStressRaw = totalStress / count;
  const avgEnergyRaw = totalEnergy / count;
  const avgSleepRaw = totalSleep / count;
  const avgConfidenceRaw = totalConfidence / count;

  // 1. Stress Score (1-100)
  // Incorporate recent journals stress if they exist
  let stressScore = avgStressRaw * 10;
  if (journals.length > 0) {
    const recentJournals = journals.slice(0, 5);
    const avgJournalStress =
      recentJournals.reduce((sum, j) => sum + j.stressScore, 0) / recentJournals.length;
    stressScore = Math.round(stressScore * 0.7 + avgJournalStress * 0.3);
  } else {
    stressScore = Math.round(stressScore);
  }

  // 2. Confidence Score (1-100)
  const confidenceScore = Math.round(avgConfidenceRaw * 10);

  // 3. Mood Score (1-100)
  const moodScore = Math.round(((avgEnergyRaw + avgConfidenceRaw) / 2) * 10);

  // 4. Burnout Risk (1-100)
  // Derived from high stress and low sleep
  const sleepInverse = 11 - avgSleepRaw; // lower sleep = higher value
  const burnoutRisk = Math.round(avgStressRaw * 6 + sleepInverse * 4);

  // 5. Mental Readiness Score (1-100)
  // Derived from good sleep, high confidence, low stress
  const stressInverse = 11 - avgStressRaw; // lower stress = higher value
  const readinessScore = Math.round(avgSleepRaw * 4 + avgConfidenceRaw * 4 + stressInverse * 2);

  return {
    moodScore: Math.max(10, Math.min(100, moodScore)),
    stressScore: Math.max(10, Math.min(100, stressScore)),
    confidenceScore: Math.max(10, Math.min(100, confidenceScore)),
    burnoutRisk: Math.max(10, Math.min(100, burnoutRisk)),
    readinessScore: Math.max(10, Math.min(100, readinessScore)),
    hasSufficientData: true,
  };
}
