import { describe, it, expect } from "vitest";
import { calculateWellnessMetrics } from "./assessmentEngine";
import { MoodCheckin, JournalEntry } from "@/store/useStore";

describe("Wellness Metric Calculations & Personalization Tests", () => {
  it("should return hasSufficientData as false when zero check-ins exist", () => {
    const res = calculateWellnessMetrics([], []);
    expect(res.hasSufficientData).toBe(false);
  });

  it("should correctly compute metrics for balanced values", () => {
    const mockCheckins: MoodCheckin[] = [
      {
        id: "c-1",
        userId: "test-user",
        stressScore: 5, // 5/10
        energyScore: 6, // 6/10
        sleepHours: 8, // 8 hours
        confidenceScore: 7, // 7/10
        moodText: "Feeling okay",
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = calculateWellnessMetrics(mockCheckins, []);
    expect(metrics.hasSufficientData).toBe(true);
    // Confidence = 7 * 10 = 70
    expect(metrics.confidenceScore).toBe(70);
    // Stress = 5 * 10 = 50
    expect(metrics.stressScore).toBe(50);
    // Mood = avg(energy + confidence) * 5 = avg(6 + 7) * 5 = 65
    expect(metrics.moodScore).toBe(65);
    // Burnout Risk = stress * 6 + (11 - sleep) * 4 = 5 * 6 + 3 * 4 = 42
    expect(metrics.burnoutRisk).toBe(42);
    // Readiness Score = sleep * 4 + confidence * 4 + (11 - stress) * 2 = 8 * 4 + 7 * 4 + 6 * 2 = 32 + 28 + 12 = 72
    expect(metrics.readinessScore).toBe(72);
  });

  it("should decrease readiness score when stress increases and sleep/confidence drop", () => {
    const poorCheckins: MoodCheckin[] = [
      {
        id: "c-2",
        userId: "test-user",
        stressScore: 9, // High stress
        energyScore: 2, // Low energy
        sleepHours: 4, // 4 hours sleep
        confidenceScore: 3, // Low confidence
        moodText: "Very anxious",
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = calculateWellnessMetrics(poorCheckins, []);
    // Stress = 90
    expect(metrics.stressScore).toBe(90);
    // Readiness = sleep * 4 + confidence * 4 + (11 - stress) * 2 = 4 * 4 + 3 * 4 + 2 * 2 = 16 + 12 + 4 = 32
    expect(metrics.readinessScore).toBe(32);
    // Burnout Risk = stress * 6 + (11 - sleep) * 4 = 9 * 6 + 7 * 4 = 54 + 28 = 82
    expect(metrics.burnoutRisk).toBe(82);
  });

  it("should increase readiness score when stress is low and sleep/confidence are high", () => {
    const excellentCheckins: MoodCheckin[] = [
      {
        id: "c-3",
        userId: "test-user",
        stressScore: 2, // Low stress
        energyScore: 9, // High energy
        sleepHours: 9, // 9 hours sleep
        confidenceScore: 9, // High confidence
        moodText: "Feeling great",
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = calculateWellnessMetrics(excellentCheckins, []);
    // Stress = 20
    expect(metrics.stressScore).toBe(20);
    // Readiness = sleep * 4 + confidence * 4 + (11 - stress) * 2 = 9 * 4 + 9 * 4 + 9 * 2 = 36 + 36 + 18 = 90
    expect(metrics.readinessScore).toBe(90);
    // Burnout Risk = stress * 6 + (11 - sleep) * 4 = 2 * 6 + 2 * 4 = 20
    expect(metrics.burnoutRisk).toBe(20);
  });

  it("should incorporate journal entry stress scores in calculation weighting", () => {
    const mockCheckins: MoodCheckin[] = [
      {
        id: "c-1",
        userId: "test-user",
        stressScore: 5,
        energyScore: 5,
        sleepHours: 8,
        confidenceScore: 5,
        moodText: "Normal",
        createdAt: new Date().toISOString(),
      },
    ];

    // Journal entry with extreme stress score (80)
    const mockJournals: JournalEntry[] = [
      {
        id: "j-1",
        userId: "test-user",
        content: "Really high backlog stress today.",
        tags: ["backlog"],
        stressScore: 80,
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = calculateWellnessMetrics(mockCheckins, mockJournals);
    // Checkin stress = 50. Weighted stress = (50 * 0.7) + (80 * 0.3) = 35 + 24 = 59
    expect(metrics.stressScore).toBe(59);
  });
});
