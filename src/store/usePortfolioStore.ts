import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PortfolioState {
  recruiterMode: boolean;
  hasSeenOpening: boolean;
  visitedProjects: string[];
  setRecruiterMode: (val: boolean) => void;
  setHasSeenOpening: (val: boolean) => void;
  addVisitedProject: (id: string) => void;
  resetPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      recruiterMode: false,
      hasSeenOpening: false,
      visitedProjects: [],
      setRecruiterMode: (val) => set({ recruiterMode: val }),
      setHasSeenOpening: (val) => set({ hasSeenOpening: val }),
      addVisitedProject: (id) =>
        set((state) => {
          if (state.visitedProjects.includes(id)) return state;
          return { visitedProjects: [...state.visitedProjects, id] };
        }),
      resetPortfolio: () =>
        set({ recruiterMode: false, hasSeenOpening: false, visitedProjects: [] }),
    }),
    {
      name: "mayank-portfolio-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
