import { describe, it, expect } from "vitest";
import { calculateWellnessMetrics } from "./assessmentEngine";
import { MoodCheckin, JournalEntry } from "@/store/useStore";

describe("Wellness Metric Calculations & Personalization Tests", () => {
  it("should return hasSufficientData as false when zero logs exist", () => {
    const res = calculateWellnessMetrics([], []);
    expect(res.hasSufficientData).toBe(false);
  });

  it("should return hasSufficientData as false when fewer than 3 logs exist", () => {
    const mockCheckins: MoodCheckin[] = [
      {
        id: "c-1",
        userId: "test-user",
        stressScore: 5,
        energyScore: 6,
        sleepHours: 8,
        confidenceScore: 7,
        moodText: "Feeling okay",
        createdAt: new Date().toISOString(),
      },
    ];
    const res = calculateWellnessMetrics(mockCheckins, []);
    expect(res.hasSufficientData).toBe(false);
  });

  it("should correctly compute metrics for balanced values", () => {
    const mockCheckins: MoodCheckin[] = [
      {
        id: "c-1",
        userId: "test-user",
        stressScore: 5, // 50
        energyScore: 6, // 60
        sleepHours: 8,
        confidenceScore: 7, // 70
        moodText: "Feeling okay",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c-2",
        userId: "test-user",
        stressScore: 5,
        energyScore: 6,
        sleepHours: 8,
        confidenceScore: 7,
        moodText: "Feeling okay",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c-3",
        userId: "test-user",
        stressScore: 5,
        energyScore: 6,
        sleepHours: 8,
        confidenceScore: 7,
        moodText: "Feeling okay",
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = calculateWellnessMetrics(mockCheckins, []);
    expect(metrics.hasSufficientData).toBe(true);
    expect(metrics.confidenceScore).toBe(70);
    expect(metrics.stressScore).toBe(50);
    expect(metrics.moodScore).toBe(65);
    expect(metrics.burnoutRisk).toBe(42);
    expect(metrics.readinessScore).toBe(64);
  });

  it("should decrease readiness score when stress increases and sleep/confidence drop", () => {
    const poorCheckins: MoodCheckin[] = [
      {
        id: "c-1",
        userId: "test-user",
        stressScore: 9,
        energyScore: 2,
        sleepHours: 4,
        confidenceScore: 3,
        moodText: "Anxious",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c-2",
        userId: "test-user",
        stressScore: 9,
        energyScore: 2,
        sleepHours: 4,
        confidenceScore: 3,
        moodText: "Anxious",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c-3",
        userId: "test-user",
        stressScore: 9,
        energyScore: 2,
        sleepHours: 4,
        confidenceScore: 3,
        moodText: "Anxious",
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = calculateWellnessMetrics(poorCheckins, []);
    expect(metrics.stressScore).toBe(90);
    expect(metrics.readinessScore).toBe(34);
    expect(metrics.burnoutRisk).toBe(82);
  });

  it("should increase readiness score when stress is low and sleep/confidence are high", () => {
    const excellentCheckins: MoodCheckin[] = [
      {
        id: "c-1",
        userId: "test-user",
        stressScore: 2,
        energyScore: 9,
        sleepHours: 9,
        confidenceScore: 9,
        moodText: "Excellent",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c-2",
        userId: "test-user",
        stressScore: 2,
        energyScore: 9,
        sleepHours: 9,
        confidenceScore: 9,
        moodText: "Excellent",
        createdAt: new Date().toISOString(),
      },
      {
        id: "c-3",
        userId: "test-user",
        stressScore: 2,
        energyScore: 9,
        sleepHours: 9,
        confidenceScore: 9,
        moodText: "Excellent",
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = calculateWellnessMetrics(excellentCheckins, []);
    expect(metrics.stressScore).toBe(20);
    expect(metrics.readinessScore).toBe(77);
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
      {
        id: "c-2",
        userId: "test-user",
        stressScore: 5,
        energyScore: 5,
        sleepHours: 8,
        confidenceScore: 5,
        moodText: "Normal",
        createdAt: new Date().toISOString(),
      },
    ];

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
    // (50 + 50 + 80) / 3 = 60
    expect(metrics.stressScore).toBe(60);
  });
});
