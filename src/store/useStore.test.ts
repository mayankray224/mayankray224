import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "./useStore";

describe("Zustand Store Auth & Onboarding Tests", () => {
  beforeEach(() => {
    useStore.getState().logoutUser();
    // Clear users database in store for clean test run
    useStore.setState({ localUsers: [] });
  });

  it("should initialize with default states", () => {
    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.userId).toBe("");
    expect(state.onboardingCompleted).toBe(false);
  });

  it("should successfully register a new user locally", () => {
    const registerRes = useStore.getState().registerUserLocal(
      "Test Student",
      "test@student.com",
      "testpassword123"
    );

    expect(registerRes.success).toBe(true);
    
    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.email).toBe("test@student.com");
    expect(state.name).toBe("Test Student");
    expect(state.onboardingCompleted).toBe(false);
    expect(state.isDemoUser).toBe(false);
    expect(state.localUsers.length).toBe(1);
  });

  it("should reject registering a duplicate email", () => {
    useStore.getState().registerUserLocal("Test 1", "dup@student.com", "pass123");
    
    const res = useStore.getState().registerUserLocal("Test 2", "dup@student.com", "pass456");
    expect(res.success).toBe(false);
    expect(res.error).toContain("exists");
  });

  it("should successfully log in registered user with correct credentials", () => {
    useStore.getState().registerUserLocal("Alice", "alice@prep.com", "alicepass123");
    useStore.getState().logoutUser();

    const loginRes = useStore.getState().loginUserLocal("alice@prep.com", "alicepass123");
    expect(loginRes.success).toBe(true);

    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.name).toBe("Alice");
  });

  it("should reject login with invalid credentials", () => {
    useStore.getState().registerUserLocal("Bob", "bob@prep.com", "bobpass123");
    useStore.getState().logoutUser();

    const loginRes = useStore.getState().loginUserLocal("bob@prep.com", "wrongpassword");
    expect(loginRes.success).toBe(false);
    expect(loginRes.error).toContain("password");
  });

  it("should support quick demo mode login", () => {
    useStore.getState().loginDemoUser();
    
    const state = useStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isDemoUser).toBe(true);
    expect(state.email).toBe("demo@nazaraana.ai");
    expect(state.onboardingCompleted).toBe(false);
  });

  it("should save onboarding parameters and mark completion", () => {
    useStore.getState().registerUserLocal("Chandra", "chan@prep.com", "chan123");
    
    useStore.getState().completeOnboarding({
      name: "Chandra Shekhar",
      examType: "JEE Mains",
      examDate: "2026-06-30",
      comfortSubject: "Physics",
      language: "Hinglish"
    });

    const state = useStore.getState();
    expect(state.onboardingCompleted).toBe(true);
    expect(state.name).toBe("Chandra Shekhar");
    expect(state.examType).toBe("JEE Mains");
    expect(state.comfortSubject).toBe("Physics");
    expect(state.language).toBe("Hinglish");
  });
});
