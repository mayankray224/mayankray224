import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "./useStore";

// Reset the store before each test to ensure isolation
beforeEach(() => {
  useStore.setState({
    userId: "",
    name: "",
    email: "",
    language: "English",
    examType: "",
    examDate: "",
    comfortSubject: "",
    onboardingCompleted: false,
    isAuthenticated: false,
    isDemoUser: false,
    localUsers: [],
    localJournals: [],
    localMoodCheckins: [],
    localChatMessages: [],
    localWeeklyReports: [],
    localConfessions: [],
    isCrisisFlagged: false,
    preExamMode: false,
    streakCount: 0,
    theme: "light",
  });
});

describe("Authentication Flow", () => {
  it("Test 1a: should register a new user and authenticate them", () => {
    const store = useStore.getState();
    const result = store.registerUserLocal("Aarav Sharma", "aarav@test.com", "Password123");

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();

    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.name).toBe("Aarav Sharma");
    expect(state.email).toBe("aarav@test.com");
    expect(state.localUsers).toHaveLength(1);
  });

  it("Test 1b: should not register a user with a duplicate email", () => {
    const store = useStore.getState();
    store.registerUserLocal("Aarav Sharma", "aarav@test.com", "Password123");
    const result = store.registerUserLocal("Another User", "aarav@test.com", "Password456");

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/already exists/i);
  });

  it("Test 1c: should login a registered user and set authenticated state", () => {
    const store = useStore.getState();
    store.registerUserLocal("Priya Singh", "priya@test.com", "SecurePass1");

    // Logout to reset session
    useStore.setState({ isAuthenticated: false, name: "", email: "" });

    const loginResult = store.loginUserLocal("priya@test.com", "SecurePass1");
    expect(loginResult.success).toBe(true);

    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.name).toBe("Priya Singh");
  });

  it("Test 1d: should reject login with wrong password", () => {
    const store = useStore.getState();
    store.registerUserLocal("Rahul Verma", "rahul@test.com", "CorrectPass1");

    useStore.setState({ isAuthenticated: false });
    const loginResult = store.loginUserLocal("rahul@test.com", "WrongPassword");
    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toMatch(/invalid/i);
  });

  it("Test 1e: should persist session state (isAuthenticated remains true)", () => {
    const store = useStore.getState();
    store.registerUserLocal("Meera Joshi", "meera@test.com", "TestPass123");

    // Simulate reading state fresh (like a page reload in-memory)
    const freshState = useStore.getState();
    expect(freshState.isAuthenticated).toBe(true);
    expect(freshState.email).toBe("meera@test.com");
  });

  it("Test 1f: should persist onboarding completion status", () => {
    const store = useStore.getState();
    store.registerUserLocal("Arjun Nair", "arjun@test.com", "TestPass123");

    expect(useStore.getState().onboardingCompleted).toBe(false);

    store.completeOnboarding({
      name: "Arjun Nair",
      examType: "JEE Mains",
      examDate: "2026-04-10",
      comfortSubject: "Physics",
      language: "English",
    });

    const updatedState = useStore.getState();
    expect(updatedState.onboardingCompleted).toBe(true);
    expect(updatedState.examType).toBe("JEE Mains");
    expect(updatedState.comfortSubject).toBe("Physics");
  });

  it("Test 1g: should log out user and clear session", () => {
    const store = useStore.getState();
    store.registerUserLocal("Deepa Kumar", "deepa@test.com", "TestPass123");
    expect(useStore.getState().isAuthenticated).toBe(true);

    store.logoutUser();
    const loggedOut = useStore.getState();
    expect(loggedOut.isAuthenticated).toBe(false);
    expect(loggedOut.name).toBe("");
  });

  it("Test 1h: should allow demo user login", () => {
    const store = useStore.getState();
    store.loginDemoUser();

    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isDemoUser).toBe(true);
    expect(state.email).toBe("demo@nazaraana.ai");
  });
});

describe("Journal Entry Storage", () => {
  it("should add a journal entry and retrieve it from the store", () => {
    const store = useStore.getState();
    store.registerUserLocal("Test Student", "test@test.com", "TestPass123");

    store.addJournal(
      "I feel anxious about my exams",
      "Feeling anxious about upcoming tests.",
      ["anxiety", "exam-stress"],
      72,
      65,
      35,
      "Anxiety",
      ["Exam pressure"],
      []
    );

    const state = useStore.getState();
    expect(state.localJournals).toHaveLength(1);
    expect(state.localJournals[0].content).toBe("I feel anxious about my exams");
    expect(state.localJournals[0].stressScore).toBe(72);
    expect(state.localJournals[0].tags).toContain("anxiety");
    expect(state.localJournals[0].tags).toContain("exam-stress");
  });
});
