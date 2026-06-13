import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language } from "@/lib/translations";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  language?: string;
  comfortSubject?: string;
  examDate?: string;
  onboardingStep?: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  emotionSummary?: string;
  tags: string[];
  stressScore: number;
  createdAt: string;
}

export interface MoodCheckin {
  id: string;
  userId: string;
  moodText: string;
  stressScore: number;
  confidenceScore: number;
  burnoutRisk: number;
  moodScore: number;
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
  weekRange: string;
  narrative: string;
  stressScore: number;
  createdAt: string;
}

interface NazaraanaState {
  // Localization & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Active User session for Local/Offline Mode
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Registered local users
  localUsers: User[];
  addLocalUser: (user: User) => void;

  // Offline local database backups
  localJournals: JournalEntry[];
  setLocalJournals: (journals: JournalEntry[]) => void;
  addLocalJournal: (journal: JournalEntry) => void;

  localMoodCheckins: MoodCheckin[];
  setLocalMoodCheckins: (checkins: MoodCheckin[]) => void;
  addLocalMoodCheckin: (checkin: MoodCheckin) => void;

  localChatMessages: ChatMessage[];
  setLocalChatMessages: (messages: ChatMessage[]) => void;
  addLocalChatMessage: (message: ChatMessage) => void;

  localWeeklyReports: WeeklyReport[];
  setLocalWeeklyReports: (reports: WeeklyReport[]) => void;
  addLocalWeeklyReport: (report: WeeklyReport) => void;

  // Student Profile Onboarding Info (legacy sync fields)
  userName: string;
  setUserName: (name: string) => void;
  selectedExams: string[];
  setSelectedExams: (exams: string[]) => void;
  comfortSubject: string;
  setComfortSubject: (subject: string) => void;
  examDate: string; // ISO String or YYYY-MM-DD
  setExamDate: (date: string) => void;
  
  // Onboarding Step Tracker
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  resetOnboarding: () => void;

  // Emotional Readiness & Flags
  mentalReadinessScore: number;
  setMentalReadinessScore: (score: number) => void;
  streakCount: number;
  setStreakCount: (count: number) => void;
  isCrisisFlagged: boolean;
  setIsCrisisFlagged: (flagged: boolean) => void;
  preExamMode: boolean;
  setPreExamMode: (active: boolean) => void;
  
  // Reset all local session states
  clearLocalData: () => void;
}

export const useStore = create<NazaraanaState>()(
  persist(
    (set) => ({
      // Defaults
      language: "English",
      setLanguage: (language) => set({ language }),
      theme: "light",
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

      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
      
      localUsers: [],
      addLocalUser: (user) => set((state) => ({ localUsers: [...state.localUsers, user] })),

      localJournals: [],
      setLocalJournals: (localJournals) => set({ localJournals }),
      addLocalJournal: (journal) => set((state) => ({ localJournals: [journal, ...state.localJournals] })),

      localMoodCheckins: [],
      setLocalMoodCheckins: (localMoodCheckins) => set({ localMoodCheckins }),
      addLocalMoodCheckin: (checkin) => set((state) => ({ localMoodCheckins: [checkin, ...state.localMoodCheckins] })),

      localChatMessages: [],
      setLocalChatMessages: (localChatMessages) => set({ localChatMessages }),
      addLocalChatMessage: (message) => set((state) => ({ localChatMessages: [...state.localChatMessages, message] })),

      localWeeklyReports: [],
      setLocalWeeklyReports: (localWeeklyReports) => set({ localWeeklyReports }),
      addLocalWeeklyReport: (report) => set((state) => ({ localWeeklyReports: [report, ...state.localWeeklyReports] })),

      userName: "",
      setUserName: (userName) => set({ userName }),
      selectedExams: [],
      setSelectedExams: (selectedExams) => set({ selectedExams }),
      comfortSubject: "",
      setComfortSubject: (comfortSubject) => set({ comfortSubject }),
      examDate: "",
      setExamDate: (examDate) => set({ examDate }),

      onboardingStep: 1,
      setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
      resetOnboarding: () =>
        set({
          onboardingStep: 1,
          userName: "",
          selectedExams: [],
          comfortSubject: "",
          examDate: "",
        }),

      mentalReadinessScore: 75, // Initial default
      setMentalReadinessScore: (mentalReadinessScore) => set({ mentalReadinessScore }),
      streakCount: 3, // Default active streak
      setStreakCount: (streakCount) => set({ streakCount }),
      isCrisisFlagged: false,
      setIsCrisisFlagged: (isCrisisFlagged) => set({ isCrisisFlagged }),
      preExamMode: false,
      setPreExamMode: (preExamMode) => set({ preExamMode }),

      clearLocalData: () => set({
        currentUser: null,
        localJournals: [],
        localMoodCheckins: [],
        localChatMessages: [],
        localWeeklyReports: [],
        userName: "",
        selectedExams: [],
        comfortSubject: "",
        examDate: "",
        onboardingStep: 1,
        mentalReadinessScore: 75,
        streakCount: 3,
        isCrisisFlagged: false,
        preExamMode: false,
      }),
    }),
    {
      name: "nazaraana-store", // Persists state in localstorage
    }
  )
);
