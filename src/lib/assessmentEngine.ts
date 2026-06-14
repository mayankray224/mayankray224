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
 * - Stress Level (0-100) -> derived from both check-ins and journals
 * - Confidence Level (0-100) -> derived from both check-ins and journals
 * - Mood Score (0-100) -> avg(energy + confidence)
 * - Burnout Risk (0-100) -> avg(stress * 0.6 + (11 - sleep) * 4)
 * - Mental Readiness Score (0-100) -> weighted index of sleep, low stress, confidence, mood stability, and journal frequency.
 */
export function calculateWellnessMetrics(
  checkins: MoodCheckin[],
  journals: JournalEntry[]
): WellnessMetrics {
  const totalLogs = checkins.length + journals.length;
  
  // Require at least 3 logs combined to calculate readiness
  if (totalLogs < 3) {
    return {
      moodScore: 0,
      stressScore: 0,
      confidenceScore: 0,
      burnoutRisk: 0,
      readinessScore: 0,
      hasSufficientData: false,
    };
  }

  // 1. Average Stress Level (0-100 scale)
  let sumStress = 0;
  let countStress = 0;
  checkins.forEach(c => {
    sumStress += Number(c.stressScore) * 10;
    countStress++;
  });
  journals.forEach(j => {
    sumStress += Number(j.stressScore);
    countStress++;
  });
  const avgStress = countStress > 0 ? sumStress / countStress : 50;

  // 2. Sleep Quality average (1-12 hrs)
  let sumSleep = 0;
  let countSleep = 0;
  checkins.forEach(c => {
    sumSleep += Number(c.sleepHours);
    countSleep++;
  });
  const avgSleep = countSleep > 0 ? sumSleep / countSleep : 7;

  // 3. Confidence level (0-100 scale)
  let sumConfidence = 0;
  let countConfidence = 0;
  checkins.forEach(c => {
    sumConfidence += Number(c.confidenceScore) * 10;
    countConfidence++;
  });
  journals.forEach(j => {
    if (j.confidenceScore !== undefined) {
      sumConfidence += Number(j.confidenceScore);
      countConfidence++;
    }
  });
  const avgConfidence = countConfidence > 0 ? sumConfidence / countConfidence : 55;

  // 4. Mood Score (0-100 scale)
  let sumEnergy = 0;
  let countEnergy = 0;
  checkins.forEach(c => {
    sumEnergy += Number(c.energyScore) * 10;
    countEnergy++;
  });
  const avgEnergy = countEnergy > 0 ? sumEnergy / countEnergy : 55;
  const moodScore = Math.round((avgEnergy + avgConfidence) / 2);

  // 5. Burnout Risk (0-100 scale)
  const sleepFactor = Math.max(0, 11 - avgSleep);
  const burnoutRisk = Math.round((avgStress * 0.6) + (sleepFactor * 10 * 0.4));

  // 6. Mood Stability (0-100 scale)
  let moodStability = 100;
  if (checkins.length > 1) {
    let diffSum = 0;
    for (let i = 0; i < checkins.length - 1; i++) {
      diffSum += Math.abs(Number(checkins[i].stressScore) - Number(checkins[i + 1].stressScore));
    }
    const avgDiff = diffSum / (checkins.length - 1);
    moodStability = Math.round(Math.max(10, 100 - (avgDiff * 10)));
  }

  // 7. Journal Frequency (0-100 scale)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentJournalsCount = journals.filter(j => new Date(j.createdAt) >= sevenDaysAgo).length;
  const journalFreqScore = Math.min(100, Math.round((recentJournalsCount / 3) * 100));

  // 8. Mental Readiness Score (0-100 scale)
  const stressReadiness = 100 - avgStress;
  const sleepReadiness = (avgSleep / 8) * 100;
  const readinessScore = Math.round(
    (stressReadiness * 0.3) +
    (Math.min(100, sleepReadiness) * 0.2) +
    (avgConfidence * 0.2) +
    (moodStability * 0.15) +
    (journalFreqScore * 0.15)
  );

  return {
    moodScore: Math.max(10, Math.min(100, moodScore)),
    stressScore: Math.max(10, Math.min(100, Math.round(avgStress))),
    confidenceScore: Math.max(10, Math.min(100, Math.round(avgConfidence))),
    burnoutRisk: Math.max(10, Math.min(100, burnoutRisk)),
    readinessScore: Math.max(10, Math.min(100, readinessScore)),
    hasSufficientData: true,
  };
}
