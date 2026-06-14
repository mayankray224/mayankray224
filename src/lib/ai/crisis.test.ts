import { describe, it, expect } from "vitest";
import { detectCrisis, analyzeJournal } from "./claude";

describe("Crisis Detection", () => {
  it("Test 3a: should flag 'I feel like ending my life' as a crisis", async () => {
    const result = await detectCrisis("I feel like ending my life");
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe("high");
  });

  it("Test 3b: should flag 'I want to die' as a crisis", async () => {
    const result = await detectCrisis("I want to die, I cannot take this pressure anymore");
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe("high");
  });

  it("Test 3c: should flag 'kill myself' as a crisis", async () => {
    const result = await detectCrisis("I feel like I should kill myself");
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe("high");
  });

  it("Test 3d: should flag 'suicide' keyword as a crisis", async () => {
    const result = await detectCrisis("I have been thinking about suicide lately");
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe("high");
  });

  it("Test 3e: should flag 'better off dead' as a crisis", async () => {
    const result = await detectCrisis("Everyone would be better off dead, including me");
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe("high");
  });

  it("Test 3f: should flag 'harm myself' as a crisis", async () => {
    const result = await detectCrisis("I want to harm myself tonight");
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe("high");
  });

  it("Test 3g: should flag hopelessness phrases as a crisis", async () => {
    const result = await detectCrisis("life is meaningless, there is no point in going on");
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe("high");
  });

  it("Test 3h: should NOT flag normal exam stress as a crisis", async () => {
    const result = await detectCrisis("I am very stressed about my mock tests and have syllabus backlog");
    expect(result.isCrisis).toBe(false);
  });

  it("Test 3i: should NOT flag normal sadness as a crisis", async () => {
    const result = await detectCrisis("I am sad today because I did badly in my test");
    expect(result.isCrisis).toBe(false);
  });

  it("Test 3j: should NOT flag empty text as a crisis", async () => {
    const result = await detectCrisis("Hi, how are you?");
    expect(result.isCrisis).toBe(false);
  });
});

describe("Journal Analysis — Crisis Path", () => {
  it("Test 3k: should return CRITICAL risk level for crisis journal entry", async () => {
    const result = await analyzeJournal("I feel like ending my life, nothing matters anymore");
    expect(result.riskLevel).toBe("CRITICAL");
    expect(result.stressScore).toBeGreaterThanOrEqual(90);
    expect(result.tags).toContain("crisis");
  });

  it("Test 3l: should return appropriate emotionSummary for crisis entry", async () => {
    const result = await analyzeJournal("I want to kill myself");
    expect(result.emotionSummary.toLowerCase()).toMatch(/heavy|carry|alone|serious/);
    expect(result.riskLevel).toBe("CRITICAL");
  });
});

describe("Journal Analysis — Standard Path", () => {
  it("Test 2a: should detect anxiety from 'I feel anxious about my exams'", async () => {
    const result = await analyzeJournal("I feel anxious about my exams. I am scared I will fail.");
    expect(result.stressScore).toBeGreaterThan(50);
    expect(result.primaryEmotion).toBeTruthy();
    // Should have anxiety-related tags
    const allTags = result.tags.join(" ").toLowerCase();
    const hasAnxietyTag = allTags.includes("anxiety") || allTags.includes("stress") || allTags.includes("fear");
    expect(hasAnxietyTag).toBe(true);
  });

  it("Test 2b: should save journal with stress score and tags", async () => {
    const result = await analyzeJournal("I feel anxious about my exams, lots of backlog");
    expect(result.stressScore).toBeGreaterThan(0);
    expect(result.stressScore).toBeLessThanOrEqual(100);
    expect(Array.isArray(result.tags)).toBe(true);
    expect(result.tags.length).toBeGreaterThan(0);
  });

  it("Test 2c: should detect positive sentiment for good journal entries", async () => {
    const result = await analyzeJournal("Today was great! I completed my Physics revision and feel confident.");
    expect(result.stressScore).toBeLessThan(60);
    expect(result.confidenceScore).toBeGreaterThan(40);
  });

  it("Test 2d: should detect relationship triggers", async () => {
    const result = await analyzeJournal("My girlfriend broke up with me and now I cannot focus on JEE prep");
    expect(result.detectedTriggers.some(t => t.toLowerCase().includes("relationship"))).toBe(true);
    expect(result.stressScore).toBeGreaterThan(70);
  });

  it("Test 2e: should detect parental pressure triggers", async () => {
    const result = await analyzeJournal("My parents keep comparing me to my cousin and it is making me very anxious");
    expect(result.detectedTriggers.some(t =>
      t.toLowerCase().includes("family") || t.toLowerCase().includes("parent")
    )).toBe(true);
  });
});
