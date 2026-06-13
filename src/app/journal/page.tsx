"use client";

import React, { useState, useEffect } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { createJournalEntry, fetchJournalEntries } from "@/app/actions";
import { authService } from "@/lib/authService";
import { BookOpen, Sparkles, Calendar, Tag, ShieldAlert, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Journal {
  id: string;
  content: string;
  emotionSummary: string | null;
  tags: string[];
  stressScore: number;
  createdAt: Date | string;
}

export default function JournalPage() {
  const store = useStore();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [content, setContent] = useState("");
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Results of the latest submission
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load history
  useEffect(() => {
    async function loadJournals() {
      try {
        const isDb = await authService.isDbAvailable();
        if (isDb) {
          const history = await fetchJournalEntries();
          setJournals(history);
        } else {
          setJournals(store.localJournals as any[]);
        }
      } catch (err) {
        console.warn("Failed to load journals from database, using local backup:", err);
        setJournals(store.localJournals as any[]);
      }
    }
    loadJournals();
  }, [store.localJournals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      setError("Beta, please write a few more words before releasing.");
      return;
    }
    setError("");
    setLoading(true);
    setLatestAnalysis(null);

    try {
      const isDb = await authService.isDbAvailable();
      let res;
      
      if (isDb) {
        res = await createJournalEntry(content);
        // Also cache locally
        store.addLocalJournal({
          id: res.entry.id,
          userId: store.currentUser?.id || "demo-user",
          content: res.entry.content,
          emotionSummary: res.entry.emotionSummary,
          tags: res.entry.tags,
          stressScore: res.entry.stressScore,
          createdAt: new Date(res.entry.createdAt).toISOString()
        });
      } else {
        // Database is offline: process locally
        const stressVal = Math.floor(Math.random() * 40) + 40;
        const mockAnalysis = {
          stressScore: stressVal,
          burnoutRisk: Math.min(100, stressVal + 5),
          emotionSummary: "Logged offline. BhalAI is holding space for you.",
          tags: ["local-diary", "offline"]
        };
        const newLocal = {
          id: "journal-" + Math.random().toString(36).substring(2, 9),
          userId: store.currentUser?.id || "demo-user",
          content,
          emotionSummary: mockAnalysis.emotionSummary,
          tags: mockAnalysis.tags,
          stressScore: mockAnalysis.stressScore,
          createdAt: new Date().toISOString()
        };
        store.addLocalJournal(newLocal);
        res = {
          entry: newLocal,
          analysis: mockAnalysis,
          isCrisis: content.toLowerCase().includes("suicide") || content.toLowerCase().includes("kill myself") || content.toLowerCase().includes("end it")
        };
      }
      
      // Update journal list
      setJournals((prev) => [res.entry as any, ...prev]);
      
      // Show BhalAI analysis result cards
      setLatestAnalysis(res.analysis);
      
      // Update store states
      store.setMentalReadinessScore(Math.max(15, 100 - res.analysis.stressScore));
      store.setStreakCount(store.streakCount + 1);

      // Trigger crisis warning if flagged
      if (res.isCrisis) {
        store.setIsCrisisFlagged(true);
      } else {
        // Show streak milestones
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
      
      // Reset editor
      setContent("");
    } catch (err: any) {
      setError("Unable to process entry. Logging to local storage.");
      
      // Fallback local logging
      const newLocal = {
        id: "journal-fallback-" + Math.random().toString(36).substring(2, 9),
        userId: store.currentUser?.id || "demo-user",
        content,
        emotionSummary: "Logged offline.",
        tags: ["local-diary"],
        stressScore: 65,
        createdAt: new Date().toISOString()
      };
      store.addLocalJournal(newLocal);
      setJournals((prev) => [newLocal as any, ...prev]);
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold text-warm-text dark:text-white">{t.journal}</h1>
        <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
          Write freely. Your secrets, fears, and backlogs are safe here. BhalAI will read and hold space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Diary Editor Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-4 relative"
          >
            {/* Hand-crafted diary paper design */}
            <div className="absolute top-4 left-6 flex gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-warm-bg dark:bg-dark-bg border border-warm-border/50"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-warm-bg dark:bg-dark-bg border border-warm-border/50"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-warm-bg dark:bg-dark-bg border border-warm-border/50"></span>
            </div>

            <div className="text-right text-[10px] text-warm-text/40 font-bold uppercase tracking-wider font-lato pt-1">
              Private Diary Log
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative">
              <textarea
                placeholder="Release your stress... How is JEE/NEET study going? Are tests causing fear? Write whatever is on your mind..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError("");
                }}
                disabled={loading}
                className="w-full h-56 p-4 bg-warm-bg/30 dark:bg-dark-bg/20 border border-warm-border dark:border-dark-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text dark:text-white text-sm leading-relaxed resize-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-warm-text/50 font-medium">
                Minimum 5 characters.
              </span>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="py-3 px-6 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 disabled:scale-100 hover:-translate-y-0.5"
              >
                {loading ? "BhalAI is reading..." : "Release Thoughts"}
              </button>
            </div>
          </form>

          {/* Dynamic AI Analysis Feedback Drawer */}
          <AnimatePresence>
            {latestAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-3xl space-y-4"
              >
                <div className="flex items-center gap-2 text-secondary-dark">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-sm uppercase tracking-wider">BhalAI Reflection Analysis</h3>
                </div>

                <p className="text-sm text-warm-text font-medium leading-relaxed italic">
                  "{latestAnalysis.emotionSummary}"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2 border-t border-emerald-100/50">
                  <div>
                    <div className="text-[10px] text-warm-text/50 uppercase font-bold tracking-wider font-lato">Stress index</div>
                    <div className="text-xl font-extrabold text-warm-text font-lato">{latestAnalysis.stressScore}/100</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-warm-text/50 uppercase font-bold tracking-wider font-lato">Burnout risk</div>
                    <div className="text-xl font-extrabold text-warm-text font-lato">{latestAnalysis.burnoutRisk}/100</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-[10px] text-warm-text/50 uppercase font-bold tracking-wider font-lato">Extracted Tags</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {latestAnalysis.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compassionate Streak Preserved Notice */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center gap-3"
              >
                <Award className="w-7 h-7 text-amber-500 flex-shrink-0 animate-bounce" />
                <div>
                  <h4 className="font-bold text-sm">Compassionate Streak Preserved! 🌟</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Streak count: <strong>{store.streakCount} days</strong>. You came here and sat down with your feelings. That is the ultimate progress.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Timeline of past logs (timeline view) */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-warm-text dark:text-white">Past Journal Timeline</h3>
          
          {journals.length === 0 ? (
            <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-2xl text-center text-warm-text/50 text-xs">
              No entries logged yet. Write your first thoughts above to kickstart the timeline.
            </div>
          ) : (
            <div className="space-y-4 max-h-[64vh] overflow-y-auto pr-1">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-warm-text/50 dark:text-gray-400 text-[10px] font-bold uppercase font-lato">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(journal.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <span className="text-[10px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 px-2 py-0.5 rounded-full font-extrabold font-lato">
                      Stress: {journal.stressScore}
                    </span>
                  </div>

                  <p className="text-xs text-warm-text/90 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {journal.content}
                  </p>

                  {journal.emotionSummary && (
                    <p className="text-[11px] text-secondary-dark leading-relaxed font-semibold italic border-t border-warm-border/40 pt-2">
                      "{journal.emotionSummary}"
                    </p>
                  )}

                  {journal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                      <Tag className="w-3 h-3 text-warm-text/40" />
                      {journal.tags.map((tag) => (
                        <span key={tag} className="text-[9px] bg-warm-bg dark:bg-dark-bg text-warm-text/60 dark:text-gray-300 px-2 py-0.5 rounded-md font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
