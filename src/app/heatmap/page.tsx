"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { fetchHeatmapData, getHeatmapInsightAction } from "@/app/actions";
import { authService } from "@/lib/authService";
import { Calendar, AlertCircle, Info, Sparkles, X, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeatmapDay {
  date: string; // YYYY-MM-DD
  stressScore: number;
}

export default function HeatmapPage() {
  const store = useStore();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const isDb = await authService.isDbAvailable();
        let data: HeatmapDay[] = [];
        if (isDb) {
          data = await fetchHeatmapData();
        } else {
          // Format local checkins
          data = store.localMoodCheckins.map((m) => ({
            date: new Date(m.createdAt).toISOString().split("T")[0],
            stressScore: m.stressScore,
          }));
        }
        setHeatmapData(data);
        
        // Generate AI Insight based on history
        const historyContext = data.map((d) => ({ date: d.date, stress: d.stressScore }));
        const insight = await getHeatmapInsightAction(historyContext);
        setAiInsight(insight);
      } catch (err) {
        console.warn("Failed to load database heatmap data, using local storage cache:", err);
        // Sync local storage fallback data
        const fallbackData = store.localMoodCheckins.map((m) => ({
          date: new Date(m.createdAt).toISOString().split("T")[0],
          stressScore: m.stressScore,
        }));
        setHeatmapData(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [store.localMoodCheckins]);

  // Generate 30 days grid array ending today
  const getGridDays = () => {
    const days = [];
    const today = new Date();
    
    // Generate last 30 days
    const rangeLimit = viewMode === "monthly" ? 30 : 7;
    for (let i = rangeLimit - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      // Match with database scores
      const matched = heatmapData.find((h) => h.date === dateStr);
      days.push({
        date: dateStr,
        stressScore: matched ? matched.stressScore : 0, // 0 = no data
      });
    }
    return days;
  };

  const gridDays = getGridDays();

  // Helper to resolve Tailwind colors
  const getStressColor = (score: number) => {
    if (score === 0) return "bg-gray-100 dark:bg-dark-bg/60 border border-warm-border/30 dark:border-dark-border text-transparent";
    if (score < 40) return "bg-emerald-300 dark:bg-emerald-600 hover:scale-105";
    if (score < 60) return "bg-amber-400 dark:bg-amber-600 hover:scale-105";
    if (score < 80) return "bg-orange-400 dark:bg-orange-600 hover:scale-105";
    return "bg-rose-500 dark:bg-rose-700 hover:scale-105";
  };

  const getSeverityText = (score: number) => {
    if (score === 0) return "No entries";
    if (score < 40) return "Green (Low Stress)";
    if (score < 60) return "Yellow (Moderate Anxiety)";
    if (score < 80) return "Orange (High Workload)";
    return "Terracotta (Burnout Risk)";
  };

  const getCopingAdvice = (score: number) => {
    if (score === 0) return "Write in your journal today to assess your emotional index.";
    if (score < 40) return "Your emotional index is healthy. Keep studying using light 45-minute cycles and hydrate.";
    if (score < 60) return "Moderate stress detected. Spend 20 minutes reviewing a comfort subject to regain core confidence.";
    if (score < 80) return "High workload tension. Please step away from social media, take a 10-minute walk, and listen to calming music.";
    return "Extreme burnout. BhalAI suggests suspending mock test reviews, eating a warm meal, sleeping early, and talking to a close friend.";
  };

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
              <Calendar className="w-5 h-5 text-secondary" />
              <span>Stress Index History</span>
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-warm-text/50">Processing calendar logs...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Heatmap Blocks Grid */}
                <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                  {gridDays.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDay(day)}
                      className={`w-10 h-10 rounded-xl transition-all duration-150 relative cursor-pointer shadow-sm ${getStressColor(
                        day.stressScore
                      )}`}
                      title={`${day.date}: Stress Index ${day.stressScore}`}
                    >
                      {day.stressScore > 0 && (
                        <span className="text-[10px] font-bold text-white flex items-center justify-center h-full">
                          {day.stressScore}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Heatmap Legend */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-warm-border/50 text-[10px] text-warm-text/50 uppercase font-bold tracking-wider font-lato">
                  <span>Less Stress</span>
                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-gray-100 dark:bg-dark-bg/60 border border-warm-border/30" title="No logs"></div>
                    <div className="w-4 h-4 rounded-md bg-emerald-300 dark:bg-emerald-600" title="Low Stress"></div>
                    <div className="w-4 h-4 rounded-md bg-amber-400 dark:bg-amber-600" title="Moderate"></div>
                    <div className="w-4 h-4 rounded-md bg-orange-400 dark:bg-orange-600" title="High"></div>
                    <div className="w-4 h-4 rounded-md bg-rose-500 dark:bg-rose-700" title="Extreme"></div>
                  </div>
                  <span>More Stress</span>
                </div>
              </div>
            )}
          </div>

          {/* AI aggregate analysis (Central AI integration) */}
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider">BhalAI Stress Summary</h3>
            </div>
            <p className="text-sm text-warm-text/90 dark:text-gray-200 leading-relaxed font-medium">
              {aiInsight || "Log entries consistently in your diary to generate a comprehensive emotional trend analysis."}
            </p>
          </div>
        </div>

        {/* Side Info Box / Interactive Explainer */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-warm-text dark:text-white">Coping Suggestions</h3>
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warm-text/80 leading-relaxed">
                Click any day block in the stress calendar to open BhalAI's detailed coping suggestions.
              </p>
            </div>

            <div className="border-t border-warm-border/50 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-warm-text/50 uppercase tracking-wide">Stress Metric Indicators</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-emerald-300 dark:bg-emerald-600" />
                  <span>&lt; 40 Score: Light study flow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-amber-400 dark:bg-amber-600" />
                  <span>40 - 60 Score: Micro-Pomodoro revision</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-orange-400 dark:bg-orange-600" />
                  <span>60 - 80 Score: Step away, digital detox</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-md bg-rose-500 dark:bg-rose-700" />
                  <span>&gt; 80 Score: Burnout risk, mandatory sleep</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Drawer / Sliding Modal for Selected Day Details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end justify-center md:items-center p-4"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border max-w-md w-full rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedDay(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-warm-bg dark:hover:bg-dark-bg text-warm-text/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-base text-warm-text dark:text-white">
                  Logs for {new Date(selectedDay.date).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Stress score badge */}
                <div className="flex justify-between items-center p-3 bg-warm-bg/50 dark:bg-dark-bg/40 border border-warm-border dark:border-dark-border/60 rounded-xl">
                  <span className="text-xs font-bold text-warm-text/60">Average Stress Level</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold text-white ${getStressColor(selectedDay.stressScore)}`}>
                    {selectedDay.stressScore === 0 ? "No Logs" : `Score: ${selectedDay.stressScore}`}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] text-warm-text/40 font-bold uppercase tracking-wider font-lato">Classification</h4>
                  <p className="text-sm font-semibold text-warm-text dark:text-white">
                    {getSeverityText(selectedDay.stressScore)}
                  </p>
                </div>

                <div className="space-y-2 border-t border-warm-border/50 pt-3">
                  <h4 className="text-[10px] text-warm-text/40 font-bold uppercase tracking-wider font-lato flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
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
                  className="py-2 px-5 bg-warm-bg dark:bg-dark-bg border border-warm-border dark:border-dark-border text-warm-text/80 dark:text-gray-300 text-xs rounded-xl font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
