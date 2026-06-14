"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { calculateWellnessMetrics } from "@/lib/assessmentEngine";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";
import {
  Flame,
  CheckCircle,
  Activity,
  Smile,
  MessageSquare,
  BookOpen,
  Heart,
  Calendar,
  AlertTriangle,
  Play,
  Check,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const store = useStore();
  const hydrated = useHydration();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  // Local Check-in Form States
  const [stressInput, setStressInput] = useState(5);
  const [energyInput, setEnergyInput] = useState(5);
  const [sleepInput, setSleepInput] = useState(7);
  const [confidenceInput, setConfidenceInput] = useState(5);
  const [moodText, setMoodText] = useState("");
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  // State for breathing exercise
  const [breathPhase, setBreathPhase] = useState("Click to start breathing guide");
  const [breathCount, setBreathCount] = useState(0);
  const [breathActive, setBreathActive] = useState(false);

  // State for Developer Debug Panel
  const [showDebug, setShowDebug] = useState(false);

  // Filter journals and checkins belonging to current user
  const userCheckins = store.localMoodCheckins.filter((c) => c.userId === store.userId);
  const userJournals = store.localJournals.filter((j) => j.userId === store.userId);

  // Calculate dynamic metrics
  const metrics = calculateWellnessMetrics(userCheckins, userJournals);

  // Update store state with computed readiness score for other pages
  useEffect(() => {
    if (metrics.hasSufficientData) {
      store.setStreakCount(Math.max(1, userCheckins.length));
    }
  }, [userCheckins.length, metrics.hasSufficientData]);

  // Exam Countdown calculation
  const getExamCountdown = () => {
    if (!store.examDate) return null;
    const diff = new Date(store.examDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysLeft = getExamCountdown();

  // Check pre-exam mode activation (72h hours to exam)
  useEffect(() => {
    if (daysLeft !== null && daysLeft <= 3 && daysLeft > 0) {
      store.setPreExamMode(true);
    } else if (daysLeft !== null && daysLeft > 3) {
      store.setPreExamMode(false);
    }
  }, [daysLeft]);

  // Handle Check-in submission
  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addCheckin(stressInput, energyInput, sleepInput, confidenceInput, moodText.trim());
    setMoodText("");
    setCheckinSuccess(true);
    setTimeout(() => setCheckinSuccess(false), 3000);
  };

  // 4-7-8 Breathing Guide
  const runBreathingCycle = () => {
    if (breathActive) return;
    setBreathActive(true);
    let cycleCount = 0;
    
    const cycle = () => {
      setBreathPhase("Inhale through nose... (4s)");
      setBreathCount(4);
      
      let sec = 4;
      const inhaleTimer = setInterval(() => {
        sec -= 1;
        setBreathCount(sec);
        if (sec <= 0) {
          clearInterval(inhaleTimer);
          // Hold
          setBreathPhase("Hold your breath... (7s)");
          setBreathCount(7);
          let holdSec = 7;
          const holdTimer = setInterval(() => {
            holdSec -= 1;
            setBreathCount(holdSec);
            if (holdSec <= 0) {
              clearInterval(holdTimer);
              // Exhale
              setBreathPhase("Exhale slowly making 'whoosh' sound... (8s)");
              setBreathCount(8);
              let exhSec = 8;
              const exhTimer = setInterval(() => {
                exhSec -= 1;
                setBreathCount(exhSec);
                if (exhSec <= 0) {
                  clearInterval(exhTimer);
                  cycleCount += 1;
                  if (cycleCount < 3) {
                    cycle();
                  } else {
                    setBreathPhase("Exercise complete. Feeling lighter?");
                    setBreathActive(false);
                  }
                }
              }, 1000);
            }
          }, 1000);
        }
      }, 1000);
    };

    cycle();
  };

  if (!hydrated) {
    return <PageSkeleton />;
  }

  // Stress indicator color block mapper
  const getStressColor = (score: number) => {
    if (score < 40) return "bg-emerald-400 dark:bg-emerald-600";
    if (score < 60) return "bg-amber-400 dark:bg-amber-600";
    if (score < 80) return "bg-orange-400 dark:bg-orange-600";
    return "bg-rose-500 dark:bg-rose-700";
  };

  // Human Explanation for Mental Readiness Score
  const getReadinessFeedback = (score: number) => {
    if (score > 80) {
      return {
        title: "Dimaag Thanda Hai 🌟",
        desc: "Your confidence is high and stress levels are balanced. Go tackle the tough revision units!"
      };
    }
    if (score > 60) {
      return {
        title: "Steady State 🧘",
        desc: "A stable emotional zone. Keep your Pomodoros brief and take breaks on time."
      };
    }
    return {
      title: "Burnout Alert ⚠️",
      desc: "Your stress index is elevated. BhalAI recommends light revision, no mock tests today, and prioritizing rest."
    };
  };

  const readiness = getReadinessFeedback(metrics.readinessScore);

  // Format Recharts graph data
  const chartData = userCheckins
    .slice()
    .reverse()
    .map((c) => ({
      name: new Date(c.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
      stress: c.stressScore * 10,
      confidence: c.confidenceScore * 10,
    }));

  return (
    <AppShell>
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-text dark:text-white">
            Kaise ho, {store.name || "Beta"}? 🌸
          </h1>
          <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
            {store.preExamMode 
              ? "All active study routings disabled. Focus only on breathing and self-compassion today."
              : t.tagline
            }
          </p>
        </div>

        {/* Countdown tag */}
        {daysLeft !== null && (
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border px-4 py-2 rounded-2xl flex items-center gap-2 self-start shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
            <span className="text-xs font-bold font-lato">
              {daysLeft > 0 ? `${daysLeft} Days to ${store.examType}` : `Today is ${store.examType} Day!`}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side Cards: Daily checkin form & dynamic scores */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DAILY Mood Checkin Form */}
          <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow">
            <h3 className="font-bold text-lg text-warm-text dark:text-white flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span>Daily Check-In</span>
            </h3>

            {checkinSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-semibold">
                Daily check-in logged! Thank you for sharing your state, beta.
              </div>
            )}

            <form onSubmit={handleCheckinSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stress Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-warm-text/60">
                    <span>Stress Level</span>
                    <span>{stressInput}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressInput}
                    onChange={(e) => setStressInput(Number(e.target.value))}
                    className="w-full h-2 bg-warm-bg rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Energy Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-warm-text/60">
                    <span>Energy Level</span>
                    <span>{energyInput}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyInput}
                    onChange={(e) => setEnergyInput(Number(e.target.value))}
                    className="w-full h-2 bg-warm-bg rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Sleep Input */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-warm-text/60">
                    <span>Sleep Quality (Hours)</span>
                    <span>{sleepInput} Hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={sleepInput}
                    onChange={(e) => setSleepInput(Number(e.target.value))}
                    className="w-full h-2 bg-warm-bg rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                </div>

                {/* Confidence Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-warm-text/60">
                    <span>Confidence Level</span>
                    <span>{confidenceInput}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidenceInput}
                    onChange={(e) => setConfidenceInput(Number(e.target.value))}
                    className="w-full h-2 bg-warm-bg rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Open ended checkin reflection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-warm-text/60">How are you feeling today?</label>
                <input
                  type="text"
                  placeholder="e.g. Backlog stress, mock score fear, or standard flow..."
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Log Check-In
              </button>
            </form>
          </div>

          {/* Emotional assessment summary details */}
          {metrics.hasSufficientData ? (
            <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-warm-text dark:text-white">{t.readinessScore}</h3>
                <Activity className="w-5 h-5 text-primary" />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Circular readiness score display */}
                <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                  <svg className="absolute w-full h-full rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-warm-bg dark:text-dark-bg"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary transition-all duration-500"
                      strokeWidth="3.5"
                      strokeDasharray={`${metrics.readinessScore}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="text-center">
                    <span className="text-3xl font-extrabold font-lato">{metrics.readinessScore}</span>
                    <span className="text-[10px] block text-warm-text/50 uppercase font-bold tracking-wider">Index</span>
                  </div>
                </div>

                {/* Score narrative insight */}
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-bold text-base text-primary">{readiness.title}</h4>
                  <p className="text-xs text-warm-text/80 dark:text-gray-300 leading-relaxed">
                    {readiness.desc}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-warm-border/50 text-[11px]">
                    <div>
                      <span className="text-warm-text/50">Mood Index:</span> <strong>{metrics.moodScore}/100</strong>
                    </div>
                    <div>
                      <span className="text-warm-text/50">Stress Index:</span> <strong>{metrics.stressScore}/100</strong>
                    </div>
                    <div>
                      <span className="text-warm-text/50">Confidence Score:</span> <strong>{metrics.confidenceScore}/100</strong>
                    </div>
                    <div>
                      <span className="text-warm-text/50">Burnout Risk:</span> <strong>{metrics.burnoutRisk}/100</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-8 rounded-3xl text-center text-warm-text/60 text-xs shadow-sm font-semibold">
              Let's get to know you better before calculating your readiness.
            </div>
          )}

          {/* Stress Trend Analytics Chart (Only shown if data exists) */}
          {metrics.hasSufficientData && chartData.length > 0 && (
            <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-4">
              <h3 className="font-bold text-base text-warm-text dark:text-white">Stress Trend Calendar</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F4A426" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F4A426" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #F5E6D3", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="stress" stroke="#F4A426" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStress)" name="Stress Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Coping exercises & Quick Actions */}
        <div className="space-y-6">
          
          {/* Pre-Exam Support Protocol Module */}
          <AnimatePresence mode="wait">
            {store.preExamMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-tr from-accent/20 to-[#FFE9E5] border-2 border-accent/60 p-5 rounded-3xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-md">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-base text-warm-text">{t.anxietyProtocol}</h3>
                    <p className="text-xs text-warm-text/80">{t.calmMessage}</p>
                  </div>
                </div>

                {/* Breathing Box */}
                <div className="bg-[#FFFDFB]/80 backdrop-blur border border-accent/20 p-4 rounded-2xl space-y-3 shadow-sm">
                  <h4 className="font-bold text-[10px] text-accent uppercase tracking-wider">{t.breathingText}</h4>
                  <div className="h-10 flex items-center justify-center text-center font-bold text-sm text-warm-text">
                    {breathActive ? (
                      <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-accent animate-pulse">
                        {breathPhase} : {breathCount}s
                      </span>
                    ) : (
                      <span className="text-warm-text/60 text-xs font-medium">{breathPhase}</span>
                    )}
                  </div>
                  <button
                    onClick={runBreathingCycle}
                    disabled={breathActive}
                    className="w-full py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Start Breathing
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions Panel */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-warm-text dark:text-white">{t.quickActions}</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/chat"
                className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform" aria-hidden="true">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-warm-text dark:text-white">Talk to BhalAI</span>
              </Link>

              <Link
                href="/journal"
                className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform" aria-hidden="true">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-warm-text dark:text-white">Write in Diary</span>
              </Link>

              <Link
                href="/confessions"
                className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform" aria-hidden="true">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-warm-text dark:text-white">Confessions Wall</span>
              </Link>

              <Link
                href="/reports"
                className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform" aria-hidden="true">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-warm-text dark:text-white">Weekly Report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Developer Debug Panel */}
      <div className="mt-8 bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border rounded-3xl p-5 shadow-sm warm-shadow space-y-4">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="w-full flex items-center justify-between text-warm-text dark:text-white font-bold text-sm uppercase tracking-wider focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/20 text-orange-600">🔧</span>
            <span>Developer Debug Panel (Verification)</span>
          </span>
          <span className="text-xs text-warm-text/50">{showDebug ? "Collapse ▲" : "Expand ▼"}</span>
        </button>

        {showDebug && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-warm-border/50 text-xs animate-fade-in">
            {/* Left side: Stats Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-warm-text/60 uppercase text-[10px] tracking-wide">Live Store State</h4>
              <div className="border border-warm-border/60 dark:border-dark-border/60 rounded-xl overflow-hidden divide-y divide-warm-border/60 dark:divide-dark-border/60">
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">Current User:</span>
                  <span className="font-semibold text-warm-text dark:text-white">{store.name || "None"} ({store.email || "No email"})</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">User ID:</span>
                  <span className="font-mono text-[10px] text-warm-text/75">{store.userId || "None"}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">Onboarding Status:</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${store.onboardingCompleted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {store.onboardingCompleted ? "COMPLETED" : "PENDING"}
                  </span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">Is Demo User:</span>
                  <span className="font-semibold">{store.isDemoUser ? "Yes" : "No"}</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">Journal Count:</span>
                  <span className="font-bold text-warm-text">{userJournals.length} entries</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">Chat Messages Count:</span>
                  <span className="font-bold text-warm-text">{store.localChatMessages.filter(m => m.userId === store.userId).length} msgs</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">Stress Records (Check-ins):</span>
                  <span className="font-bold text-warm-text">{userCheckins.length} records</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span className="text-warm-text/50">Crisis Flagged State:</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${store.isCrisisFlagged ? "bg-rose-100 text-rose-800 animate-pulse" : "bg-gray-100 text-gray-800"}`}>
                    {store.isCrisisFlagged ? "CRISIS ACTIVE" : "NORMAL"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Developer Tools */}
            <div className="space-y-4">
              <h4 className="font-bold text-warm-text/60 uppercase text-[10px] tracking-wide">Debug Simulation Actions</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    // Seed mock entries over past 7 days to let judges verify reports/heatmap immediately
                    const dates = [];
                    const today = new Date();
                    for (let i = 6; i >= 0; i--) {
                      const d = new Date(today);
                      d.setDate(today.getDate() - i);
                      dates.push(d);
                    }

                    // Add check-ins
                    dates.forEach((date, index) => {
                      const mockCheckin = {
                        id: "mock-checkin-" + Math.random().toString(36).substring(2, 9),
                        userId: store.userId,
                        stressScore: index === 3 ? 9 : 4,
                        energyScore: 5,
                        sleepHours: 8,
                        confidenceScore: 6,
                        moodText: index === 3 ? "Tired, backlog syllabus" : "Solved some physics, doing okay",
                        createdAt: date.toISOString()
                      };
                      useStore.setState((state) => ({
                        localMoodCheckins: [mockCheckin, ...state.localMoodCheckins]
                      }));
                    });

                    // Add journals
                    dates.slice(0, 3).forEach((date, index) => {
                      const mockJournal = {
                        id: "mock-journal-" + Math.random().toString(36).substring(2, 9),
                        userId: store.userId,
                        content: index === 0 
                          ? "I am extremely worried about my mock tests and JEE Advanced prep." 
                          : "Spent the evening revising math and solving practice papers.",
                        emotionSummary: index === 0 ? "Fear of failure" : "steady revision flow",
                        tags: index === 0 ? ["jee-prep", "mock-test"] : ["math", "steady"],
                        stressScore: index === 0 ? 82 : 35,
                        burnoutRisk: index === 0 ? 75 : 30,
                        confidenceScore: index === 0 ? 30 : 65,
                        primaryEmotion: index === 0 ? "Fear" : "Balanced",
                        detectedTriggers: index === 0 ? ["Mock test anxiety"] : [],
                        positiveIndicators: index === 0 ? [] : ["Consistency"],
                        createdAt: date.toISOString()
                      };
                      useStore.setState((state) => ({
                        localJournals: [mockJournal, ...state.localJournals]
                      }));
                    });
                    
                    alert("Simulation Success! Seeded 7 days of mood check-ins and 3 journal entries into the store for this user.");
                  }}
                  className="p-3 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white rounded-xl text-center font-bold shadow-sm"
                >
                  Seed 7-Day History
                </button>

                <button
                  type="button"
                  onClick={() => {
                    store.setIsCrisisFlagged(!store.isCrisisFlagged);
                  }}
                  className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-center font-bold shadow-sm"
                >
                  Toggle Crisis State
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !store.onboardingCompleted;
                    useStore.setState({ onboardingCompleted: nextVal });
                    // Sync back into localUsers list for the current logged-in account
                    const currentUserId = store.userId;
                    const updatedUsers = store.localUsers.map((u) => {
                      if (u.userId === currentUserId) {
                        return {
                          ...u,
                          onboardingCompleted: nextVal,
                        };
                      }
                      return u;
                    });
                    useStore.setState({ localUsers: updatedUsers });
                  }}
                  className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-center font-bold shadow-sm"
                >
                  Toggle Onboarding
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to clear the entire store? This resets everything.")) {
                      localStorage.clear();
                      window.location.href = "/";
                    }
                  }}
                  className="p-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-center font-bold shadow-sm"
                >
                  Hard Reset LocalStorage
                </button>
              </div>
              <p className="text-[10px] text-warm-text/40 leading-relaxed italic">
                Use the Seed button to generate mock history points. This will populate the Heatmap grid and allow BhalAI to analyze weekly reports instantly.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
