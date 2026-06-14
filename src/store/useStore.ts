import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language } from "@/lib/translations";
import bcrypt from "bcryptjs";

export interface User {
  userId: string;
  name: string;
  email: string;
  passwordHash?: string;
  examType: string;
  examDate: string;
  comfortSubject: string;
  language: Language;
  onboardingCompleted: boolean;
  isDemoUser: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  emotionSummary?: string;
  tags: string[];
  stressScore: number;
  burnoutRisk?: number;
  confidenceScore?: number;
  primaryEmotion?: string;
  detectedTriggers?: string[];
  positiveIndicators?: string[];
  createdAt: string;
}

export interface MoodCheckin {
  id: string;
  userId: string;
  stressScore: number; // 1-10
  energyScore: number; // 1-10
  sleepHours: number; // 1-12
  confidenceScore: number; // 1-10
  moodText: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  reportContent: string;
  generatedAt: string;
}

interface NazaraanaState {
  // Required Authentication/User Profile Fields
  userId: string;
  name: string;
  email: string;
  language: Language;
  examType: string;
  examDate: string;
  comfortSubject: string;
  onboardingCompleted: boolean;
  isAuthenticated: boolean;
  isDemoUser: boolean;

  // Registered local users database
  localUsers: User[];

  // User Logs Data persistence
  localJournals: JournalEntry[];
  localMoodCheckins: MoodCheckin[];
  localChatMessages: ChatMessage[];
  localWeeklyReports: WeeklyReport[];
  localConfessions: {
    id: string;
    content: string;
    createdAt: string;
    reactions: { emoji: string; count: number }[];
  }[];

  // UI state
  theme: "light" | "dark";
  isCrisisFlagged: boolean;
  preExamMode: boolean;
  streakCount: number;

  // Actions
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setPreExamMode: (active: boolean) => void;
  setIsCrisisFlagged: (flagged: boolean) => void;
  setStreakCount: (count: number) => void;

  // Auth Operations
  registerUserLocal: (name: string, email: string, passwordPlain: string) => { success: boolean; error?: string };
  loginUserLocal: (email: string, passwordPlain: string) => { success: boolean; error?: string };
  loginDemoUser: () => void;
  logoutUser: () => void;
  completeOnboarding: (data: { name: string; examType: string; examDate: string; comfortSubject: string; language: Language }) => void;

  // Data Operations
  addJournal: (
    content: string,
    emotionSummary: string,
    tags: string[],
    stressScore: number,
    burnoutRisk?: number,
    confidenceScore?: number,
    primaryEmotion?: string,
    detectedTriggers?: string[],
    positiveIndicators?: string[]
  ) => void;
  addCheckin: (stress: number, energy: number, sleep: number, confidence: number, text: string) => void;
  addChatMessage: (role: "user" | "assistant", content: string) => void;
  clearChat: () => void;
  addWeeklyReport: (content: string) => void;
  addConfession: (content: string) => { success: boolean; moderated?: boolean };
  reactToConfession: (id: string, emoji: string) => void;
}

export const useStore = create<NazaraanaState>()(
  persist(
    (set, get) => ({
      // Defaults
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

      theme: "light",
      isCrisisFlagged: false,
      preExamMode: false,
      streakCount: 0,

      setLanguage: (language) => set({ language }),
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            if (newTheme === "dark") {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }
          return { theme: newTheme };
        }),
      setTheme: (theme) =>
        set(() => {
          if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            if (theme === "dark") {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }
          return { theme };
        }),
      setPreExamMode: (preExamMode) => set({ preExamMode }),
      setIsCrisisFlagged: (isCrisisFlagged) => set({ isCrisisFlagged }),
      setStreakCount: (streakCount) => set({ streakCount }),

      // Local Registration
      registerUserLocal: (name, email, passwordPlain) => {
        const users = get().localUsers;
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { success: false, error: "An account with this email already exists." };
        }

        const passwordHash = bcrypt.hashSync(passwordPlain, 10);
        const newUser: User = {
          userId: "user-" + Math.random().toString(36).substring(2, 9),
          name,
          email,
          passwordHash,
          examType: "",
          examDate: "",
          comfortSubject: "",
          language: "English",
          onboardingCompleted: false,
          isDemoUser: false,
        };

        set({
          localUsers: [...users, newUser],
          userId: newUser.userId,
          name: newUser.name,
          email: newUser.email,
          language: newUser.language,
          examType: "",
          examDate: "",
          comfortSubject: "",
          onboardingCompleted: false,
          isAuthenticated: true,
          isDemoUser: false,
          streakCount: 0,
        });

        return { success: true };
      },

      // Local Login
      loginUserLocal: (email, passwordPlain) => {
        const users = get().localUsers;
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user || !user.passwordHash) {
          return { success: false, error: "No account found with this email." };
        }

        const isValid = bcrypt.compareSync(passwordPlain, user.passwordHash);
        if (!isValid) {
          return { success: false, error: "Invalid password." };
        }

        set({
          userId: user.userId,
          name: user.name,
          email: user.email,
          language: user.language,
          examType: user.examType,
          examDate: user.examDate,
          comfortSubject: user.comfortSubject,
          onboardingCompleted: user.onboardingCompleted,
          isAuthenticated: true,
          isDemoUser: false,
        });

        return { success: true };
      },

      // Demo User Activation
      loginDemoUser: () => {
        const users = get().localUsers;
        const existingDemo = users.find((u) => u.email.toLowerCase() === "demo@nazaraana.ai");
        if (existingDemo) {
          set({
            userId: existingDemo.userId,
            name: existingDemo.name,
            email: existingDemo.email,
            language: existingDemo.language,
            examType: existingDemo.examType,
            examDate: existingDemo.examDate,
            comfortSubject: existingDemo.comfortSubject,
            onboardingCompleted: existingDemo.onboardingCompleted,
            isAuthenticated: true,
            isDemoUser: true,
            streakCount: 1,
          });
        } else {
          const newDemo: User = {
            userId: "demo-user-id",
            name: "",
            email: "demo@nazaraana.ai",
            examType: "",
            examDate: "",
            comfortSubject: "",
            language: "English",
            onboardingCompleted: false,
            isDemoUser: true,
          };
          set({
            localUsers: [...users, newDemo],
            userId: "demo-user-id",
            name: "",
            email: "demo@nazaraana.ai",
            language: "English",
            examType: "",
            examDate: "",
            comfortSubject: "",
            onboardingCompleted: false,
            isAuthenticated: true,
            isDemoUser: true,
            streakCount: 0,
          });
        }
      },

      // Logout
      logoutUser: () => {
        set({
          userId: "",
          name: "",
          email: "",
          examType: "",
          examDate: "",
          comfortSubject: "",
          onboardingCompleted: false,
          isAuthenticated: false,
          isDemoUser: false,
          isCrisisFlagged: false,
        });
      },

      // Complete Onboarding
      completeOnboarding: (data) => {
        const currentUserId = get().userId;
        set({
          name: data.name,
          examType: data.examType,
          examDate: data.examDate,
          comfortSubject: data.comfortSubject,
          language: data.language,
          onboardingCompleted: true,
          streakCount: 1,
        });

        // Sync back into localUsers list
        const updatedUsers = get().localUsers.map((u) => {
          if (u.userId === currentUserId) {
            return {
              ...u,
              name: data.name,
              examType: data.examType,
              examDate: data.examDate,
              comfortSubject: data.comfortSubject,
              language: data.language,
              onboardingCompleted: true,
            };
          }
          return u;
        });
        set({ localUsers: updatedUsers });
      },

      // Data Operations
      addJournal: (
        content,
        emotionSummary,
        tags,
        stressScore,
        burnoutRisk,
        confidenceScore,
        primaryEmotion,
        detectedTriggers,
        positiveIndicators
      ) => {
        const newEntry: JournalEntry = {
          id: "journal-" + Math.random().toString(36).substring(2, 9),
          userId: get().userId,
          content,
          emotionSummary,
          tags,
          stressScore,
          burnoutRisk: burnoutRisk || stressScore,
          confidenceScore: confidenceScore || 50,
          primaryEmotion: primaryEmotion || "Neutral",
          detectedTriggers: detectedTriggers || [],
          positiveIndicators: positiveIndicators || [],
          createdAt: new Date().toISOString(),
        };

        // Auto-check crisis terms to immediately flag the user's state
        const crisisKeywords = [
          "suicide", "self harm", "end my life", "kill myself", "better off dead", 
          "marna chahta", "want to die", "ending it all", "give up on life", "can't continue",
          "want to end it", "don't want to live"
        ];
        const hasCrisis = crisisKeywords.some(keyword => content.toLowerCase().includes(keyword));
        if (hasCrisis) {
          set({ isCrisisFlagged: true });
        }

        set((state) => ({
          localJournals: [newEntry, ...state.localJournals],
        }));
      },

      addCheckin: (stress, energy, sleep, confidence, text) => {
        const newCheckin: MoodCheckin = {
          id: "checkin-" + Math.random().toString(36).substring(2, 9),
          userId: get().userId,
          stressScore: stress,
          energyScore: energy,
          sleepHours: sleep,
          confidenceScore: confidence,
          moodText: text,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          localMoodCheckins: [newCheckin, ...state.localMoodCheckins],
        }));
      },

      addChatMessage: (role, content) => {
        const newMessage: ChatMessage = {
          id: "msg-" + Math.random().toString(36).substring(2, 9),
          userId: get().userId,
          role,
          content,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          localChatMessages: [...state.localChatMessages, newMessage],
        }));
      },

      clearChat: () => {
        set({ localChatMessages: [] });
      },

      addWeeklyReport: (reportContent) => {
        const newReport: WeeklyReport = {
          id: "report-" + Math.random().toString(36).substring(2, 9),
          userId: get().userId,
          reportContent,
          generatedAt: new Date().toISOString(),
        };
        set((state) => ({
          localWeeklyReports: [newReport, ...state.localWeeklyReports],
        }));
      },

      addConfession: (content) => {
        // Claude moderation simulation
        const crisisKeywords = ["suicide", "kill myself", "end it", "atmahathya", "mar jau"];
        const hasCrisis = crisisKeywords.some((word) => content.toLowerCase().includes(word));
        if (hasCrisis) {
          set({ isCrisisFlagged: true });
          return { success: false, moderated: true };
        }

        const newConfession = {
          id: "confession-" + Math.random().toString(36).substring(2, 9),
          content,
          createdAt: new Date().toISOString(),
          reactions: [
            { emoji: "🫂", count: 0 },
            { emoji: "❤️", count: 0 },
            { emoji: "💪", count: 0 },
            { emoji: "🙌", count: 0 },
          ],
        };

        set((state) => ({
          localConfessions: [newConfession, ...state.localConfessions],
        }));

        return { success: true };
      },

      reactToConfession: (id, emoji) => {
        const updated = get().localConfessions.map((c) => {
          if (c.id === id) {
            return {
              ...c,
              reactions: c.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              ),
            };
          }
          return c;
        });
        set({ localConfessions: updated });
      },
    }),
    {
      name: "nazaraana-store",
    }
  )
);
