"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { getHeatmapInsightAction } from "@/app/actions";
import { Calendar, Info, Sparkles, X, HeartHandshake } from "lucide-react";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";

interface HeatmapDay {
  date: string; // YYYY-MM-DD
  stressScore: number;
  journals?: any[];
  checkins?: any[];
}

export default function HeatmapPage() {
  const store = useStore();
  const hydrated = useHydration();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  // Filter logs for current user
  const userCheckins = store.localMoodCheckins.filter((c) => c.userId === store.userId);
  const userJournals = store.localJournals.filter((j) => j.userId === store.userId);

  // Group checkins and journals by date and calculate average stress score
  const getHeatmapData = (): HeatmapDay[] => {
    const dateMap: Record<string, { total: number; count: number; journals: any[]; checkins: any[] }> = {};
    
    userCheckins.forEach((c) => {
      const dateStr = new Date(c.createdAt).toISOString().split("T")[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { total: 0, count: 0, journals: [], checkins: [] };
      }
      dateMap[dateStr].total += Number(c.stressScore) * 10; // scale 1-10 to 1-100
      dateMap[dateStr].count += 1;
      dateMap[dateStr].checkins.push(c);
    });

    userJournals.forEach((j) => {
      const dateStr = new Date(j.createdAt).toISOString().split("T")[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { total: 0, count: 0, journals: [], checkins: [] };
      }
      dateMap[dateStr].total += Number(j.stressScore);
      dateMap[dateStr].count += 1;
      dateMap[dateStr].journals.push(j);
    });

    return Object.keys(dateMap).map((date) => ({
      date,
      stressScore: Math.round(dateMap[date].total / dateMap[date].count),
      journals: dateMap[date].journals,
      checkins: dateMap[date].checkins,
    }));
  };

  const heatmapData = getHeatmapData();

  useEffect(() => {
    if (heatmapData.length === 0) return;

    async function loadAiInsight() {
      setLoading(true);
      try {
        const historyContext = heatmapData.map((d) => ({ date: d.date, stress: d.stressScore }));
        const insight = await getHeatmapInsightAction(historyContext);
        setAiInsight(insight);
      } catch (err) {
        console.error("Claude heatmap insight failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAiInsight();
  }, [userCheckins.length, userJournals.length]);

  // Generate grid array ending today
  const getGridDays = () => {
    const days = [];
    const today = new Date();
    const rangeLimit = viewMode === "monthly" ? 30 : 7;

    for (let i = rangeLimit - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const matched = heatmapData.find((h) => h.date === dateStr);
      days.push({
        date: dateStr,
        stressScore: matched ? matched.stressScore : 0, // 0 = no data
        journals: matched ? matched.journals : [],
        checkins: matched ? matched.checkins : [],
      });
    }
    return days;
  };

  const gridDays = getGridDays();

  const getStressColor = (score: number) => {
    if (score === 0) return "bg-gray-100 dark:bg-dark-bg/60 border border-warm-border/30 dark:border-dark-border text-transparent";
    if (score <= 20) return "bg-[#1b5e20] dark:bg-[#2e7d32] text-white hover:scale-105"; // Deep Green
    if (score <= 40) return "bg-[#81c784] dark:bg-[#4caf50] text-gray-800 dark:text-white hover:scale-105"; // Light Green
    if (score <= 60) return "bg-[#ffb74d] dark:bg-[#ff9800] text-gray-800 dark:text-white hover:scale-105"; // Amber
    if (score <= 80) return "bg-[#ff7043] dark:bg-[#f4511e] text-white hover:scale-105"; // Orange
    return "bg-[#c62828] dark:bg-[#d32f2f] text-white hover:scale-105 animate-pulse"; // Terracotta Red (burnout/crisis)
  };

  const getSeverityText = (score: number) => {
    if (score === 0) return "No entries";
    if (score <= 20) return "Deep Green (Healthy Study Flow)";
    if (score <= 40) return "Light Green (Active Prep)";
    if (score <= 60) return "Yellow (Moderate Anxiety)";
    if (score <= 80) return "Orange (High Workload Fatigue)";
    return "Terracotta Red (Severe Distress / Burnout)";
  };

  const getCopingAdvice = (score: number) => {
    if (score === 0) return "Perform your daily check-in to assess your stress metrics today.";
    if (score < 40) return "Your stress level is healthy. Keep studying using clean 45-minute cycles and hydrate.";
    if (score < 60) return "Moderate stress detected. Spend 20 minutes reviewing a comfort subject to regain core confidence.";
    if (score < 80) return "High workload tension. Please step away from social media, take a 10-minute walk, and listen to calming music.";
    return "Extreme burnout. BhalAI suggests suspending mock test reviews, eating a warm meal, sleeping early, and talking to a close friend.";
  };

  if (!hydrated) {
    return <PageSkeleton />;
  }

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-text dark:text-white">{t.heatmap}</h1>
          <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
            Visual tracking of your preparation stress cycles. Darker terracotta squares suggest resting blocks.
          </p>
        </div>

        {/* Weekly / Monthly toggle */}
        <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-1 rounded-xl flex gap-1 self-start shadow-sm">
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "monthly"
                ? "bg-primary text-white"
                : "text-warm-text/60 dark:text-gray-400 hover:bg-warm-bg dark:hover:bg-dark-bg"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "weekly"
                ? "bg-primary text-white"
                : "text-warm-text/60 dark:text-gray-400 hover:bg-warm-bg dark:hover:bg-dark-bg"
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Heatmap Grid Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-6">
            <h3 className="font-bold text-lg text-warm-text dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" aria-hidden="true" />
              <span>Stress Index History</span>
            </h3>

            <div className="space-y-4">
              {heatmapData.length === 0 ? (
                <div className="text-center py-12 text-xs text-warm-text/50">
                  No stress check-ins or journal entries logged yet. Perform a check-in or write a journal entry to build your wellness calendar.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                  {gridDays.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(day)}
                      className={`w-10 h-10 rounded-xl transition-all duration-150 relative cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${getStressColor(
                        day.stressScore
                      )}`}
                      aria-label={`${day.date}: Stress score is ${day.stressScore || "No Logs"}`}
                    >
                      {day.stressScore > 0 && (
                        <span className="text-[10px] font-bold text-white flex items-center justify-center h-full">
                          {day.stressScore}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Heatmap Legend */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-warm-border/50 text-[10px] text-warm-text/50 uppercase font-bold tracking-wider font-lato">
                <span>Less Stress</span>
                <div className="flex gap-1.5" aria-hidden="true">
                  <div className="w-4 h-4 rounded-md bg-gray-100 dark:bg-dark-bg/60 border border-warm-border/30" title="No logs"></div>
                  <div className="w-4 h-4 rounded-md bg-emerald-300 dark:bg-emerald-600" title="Low Stress"></div>
                  <div className="w-4 h-4 rounded-md bg-amber-400 dark:bg-amber-600" title="Moderate"></div>
                  <div className="w-4 h-4 rounded-md bg-orange-400 dark:bg-orange-600" title="High"></div>
                  <div className="w-4 h-4 rounded-md bg-rose-500 dark:bg-rose-700" title="Extreme"></div>
                </div>
                <span>More Stress</span>
              </div>
            </div>
          </div>

          {/* AI aggregate analysis */}
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-bold text-sm uppercase tracking-wider">BhalAI Stress Summary</h3>
            </div>
            {loading ? (
              <p className="text-xs text-warm-text/50 animate-pulse">BhalAI is reading stress trends...</p>
            ) : (
              <p className="text-sm text-warm-text/90 dark:text-gray-200 leading-relaxed font-medium">
                {aiInsight || "Perform daily check-ins consistently to generate a personalized AI emotional trend summary."}
              </p>
            )}
          </div>
        </div>

        {/* Side Info Box */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-warm-text dark:text-white">Coping Suggestions</h3>
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-warm-text/80 leading-relaxed">
                Click any day block in the stress calendar to open BhalAI's detailed coping suggestions.
              </p>
            </div>

            <div className="border-t border-warm-border/50 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-warm-text/50 uppercase tracking-wide">Stress Metric Indicators</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-[#1b5e20] dark:bg-[#2e7d32]" />
                  <span>0 - 20 Score: Deep Green (Flow State)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-[#81c784] dark:bg-[#4caf50]" />
                  <span>21 - 40 Score: Light Green (Active prep)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-[#ffb74d] dark:bg-[#ff9800]" />
                  <span>41 - 60 Score: Amber (Warm Pomodoro)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-[#ff7043] dark:bg-[#f4511e]" />
                  <span>61 - 80 Score: Orange (Workload fatigue)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-[#c62828] dark:bg-[#d32f2f]" />
                  <span>81 - 100 Score: Terracotta Red (Crisis/Burnout)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Details Drawer */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end justify-center md:items-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Coping strategy drawer for selected day"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border max-w-md w-full rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedDay(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-warm-bg dark:hover:bg-dark-bg text-warm-text/50 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close strategy drawer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-secondary" aria-hidden="true" />
                <h3 className="font-bold text-base text-warm-text dark:text-white">
                  Logs for {new Date(selectedDay.date).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-warm-bg/50 dark:bg-dark-bg/40 border border-warm-border dark:border-dark-border/60 rounded-xl">
                  <span className="text-xs font-bold text-warm-text/60">Average Stress Level</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold text-white ${getStressColor(selectedDay.stressScore)}`}>
                    {selectedDay.stressScore === 0 ? "No Logs" : `Score: ${selectedDay.stressScore}`}
                  </span>
                </div>

                <div className="space-y-2 border-t border-warm-border/50 pt-3">
                  <h4 className="text-[10px] text-warm-text/40 font-bold uppercase tracking-wider font-lato">Journal Excerpt</h4>
                  {selectedDay.journals && selectedDay.journals.length > 0 ? (
                    <p className="text-xs text-warm-text/90 dark:text-gray-200 bg-white dark:bg-dark-bg p-3 border border-warm-border/40 rounded-xl italic">
                      "{selectedDay.journals[0].content.substring(0, 150)}..."
                    </p>
                  ) : (
                    <p className="text-xs text-warm-text/50 italic">No journal logged on this day.</p>
                  )}
                </div>

                <div className="space-y-2 border-t border-warm-border/50 pt-3">
                  <h4 className="text-[10px] text-warm-text/40 font-bold uppercase tracking-wider font-lato">Detected Triggers</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedDay.journals && selectedDay.journals.length > 0 && selectedDay.journals[0].detectedTriggers && selectedDay.journals[0].detectedTriggers.length > 0 ? (
                      selectedDay.journals[0].detectedTriggers.map((trig: string) => (
                        <span key={trig} className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-[10px] font-bold">
                          {trig}
                        </span>
                      ))
                    ) : selectedDay.journals && selectedDay.journals.length > 0 && selectedDay.journals[0].tags.length > 0 ? (
                      selectedDay.journals[0].tags.map((t: string) => (
                        <span key={t} className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-[10px] font-bold">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-warm-text/50 italic">No specific triggers detected.</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 border-t border-warm-border/50 pt-3">
                  <h4 className="text-[10px] text-warm-text/40 font-bold uppercase tracking-wider font-lato flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
                    <span>BhalAI coping recommendation</span>
                  </h4>
                  <p className="text-xs text-warm-text/80 dark:text-gray-300 leading-relaxed italic">
                    "{getCopingAdvice(selectedDay.stressScore)}"
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="py-2 px-5 bg-warm-bg dark:bg-dark-bg border border-warm-border dark:border-dark-border text-warm-text/80 dark:text-gray-300 text-xs rounded-xl font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Close Drawer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
