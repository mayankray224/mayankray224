"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { fetchUserProfile, getStudyRecommendation } from "@/app/actions";
import { authService } from "@/lib/authService";
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
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StudyRec {
  recommendationTitle: string;
  durationText: string;
  explanation: string;
  actionSteps: string[];
}

export default function Dashboard() {
  const store = useStore();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;
  
  const [profile, setProfile] = useState<any>(null);
  const [studyRec, setStudyRec] = useState<StudyRec | null>(null);
  const [loading, setLoading] = useState(true);

  // State for breathing exercise
  const [breathPhase, setBreathPhase] = useState("Click to start breathing guide");
  const [breathCount, setBreathCount] = useState(0);
  const [breathActive, setBreathActive] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const isDb = await authService.isDbAvailable();
        if (isDb) {
          const userProf = await fetchUserProfile();
          setProfile(userProf);
          if (userProf) {
            store.setUserName(userProf.name || "");
            store.setStreakCount(userProf.streaks[0]?.currentStreak || 0);
            store.setMentalReadinessScore(userProf.readinessScore);
            store.setPreExamMode(userProf.preExamActive);
          }
          const rec = await getStudyRecommendation();
          setStudyRec(rec);
        } else {
          // Local offline data construction
          const localProf = {
            id: store.currentUser?.id || "demo-user",
            name: store.currentUser?.name || store.userName || "Beta",
            email: store.currentUser?.email || "demo@nazaraana.ai",
            language: store.currentUser?.language || store.language,
            exams: [{ examType: store.selectedExams[0] || "JEE Mains" }],
            subjects: [{ name: store.comfortSubject || "Physics", isComfortSubject: true }],
            moodCheckins: store.localMoodCheckins,
            journalEntries: store.localJournals,
            streaks: [{ currentStreak: store.streakCount }],
            readinessScore: store.mentalReadinessScore,
            preExamActive: store.preExamMode
          };
          setProfile(localProf);
          
          const rec = {
            recommendationTitle: "Empathetic Pause & Calm Breath",
            durationText: "10-15 mins",
            explanation: "Since database sync is offline, take a brief moment to practice our 4-7-8 box breathing exercise to bring your stress levels down.",
            actionSteps: ["Focus on breathing", "Write in journal", "Chat with BhalAI"]
          };
          setStudyRec(rec);
        }
      } catch (err) {
        console.warn("Dashboard load failed, falling back to local store cache:", err);
        const localProf = {
          id: store.currentUser?.id || "demo-user",
          name: store.currentUser?.name || store.userName || "Beta",
          email: store.currentUser?.email || "demo@nazaraana.ai",
          language: store.currentUser?.language || store.language,
          exams: [{ examType: store.selectedExams[0] || "JEE Mains" }],
          subjects: [{ name: store.comfortSubject || "Physics", isComfortSubject: true }],
          moodCheckins: store.localMoodCheckins,
          journalEntries: store.localJournals,
          streaks: [{ currentStreak: store.streakCount }],
          readinessScore: store.mentalReadinessScore,
          preExamActive: store.preExamMode
        };
        setProfile(localProf);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [store.preExamMode, store.currentUser, store.userName]);

  // Simulated 4-7-8 Breathing controller
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

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-warm-text/60">Aapka safar load ho raha hai...</span>
        </div>
      </AppShell>
    );
  }

  // Color mapper for heatmap blocks
  const getStressColor = (score: number) => {
    if (score === 0) return "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600";
    if (score < 40) return "bg-emerald-400 dark:bg-emerald-600"; // Green
    if (score < 60) return "bg-amber-400 dark:bg-amber-600";   // Yellow
    if (score < 80) return "bg-orange-400 dark:bg-orange-600"; // Orange
    return "bg-rose-500 dark:bg-rose-700";                     // Terracotta / Dark Red
  };

  // Human Explanation for Mental Readiness Score
  const getReadinessFeedback = (score: number) => {
    if (score > 80) return { title: "Dimaag Thanda Hai 🌟", desc: "Your confidence is high and stress levels are balanced. Go tackle the tough revision units!" };
    if (score > 60) return { title: "Steady State 🧘", desc: "A stable emotional zone. Keep your Pomodoros brief and take breaks on time." };
    return { title: "Burnout Alert ⚠️", desc: "Your stress index is elevated. BhalAI recommends light revision, no test papers today, and prioritizing rest." };
  };

  const readiness = getReadinessFeedback(store.mentalReadinessScore);

  return (
    <AppShell>
      {/* 1. Greeting header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-text dark:text-white">
            Kaise ho, {profile?.name || store.userName || "Beta"}? 🌸
          </h1>
          <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
            {store.preExamMode 
              ? "All active study routings disabled. Focus only on breathing and self-compassion today."
              : t.tagline
            }
          </p>
        </div>

        {/* Developer Mock Toggle */}
        <button
          onClick={() => store.setPreExamMode(!store.preExamMode)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold font-lato transition-all border ${
            store.preExamMode
              ? "bg-rose-100 border-rose-200 text-rose-600"
              : "bg-white border-warm-border text-warm-text hover:bg-warm-bg/50"
          }`}
        >
          🚨 Dev Toggle: Pre-Exam Mode {store.preExamMode ? "(ON)" : "(OFF)"}
        </button>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score Card Component */}
        <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-warm-text dark:text-white">{t.readinessScore}</h3>
            <Activity className="w-5 h-5 text-primary" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
            {/* Visual Gauge */}
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
                  strokeDasharray={`${store.mentalReadinessScore}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="text-center">
                <span className="text-3xl font-extrabold text-warm-text dark:text-white font-lato">{store.mentalReadinessScore}</span>
                <span className="text-[10px] block text-warm-text/50 uppercase font-bold tracking-wider">Index</span>
              </div>
            </div>

            {/* Human explanation */}
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="font-bold text-base text-primary">{readiness.title}</h4>
              <p className="text-xs text-warm-text/80 dark:text-gray-300 leading-relaxed">
                {readiness.desc}
              </p>
              <p className="text-[10px] text-warm-text/40 dark:text-gray-400 uppercase font-bold font-lato">
                {t.readinessExplain}
              </p>
            </div>
          </div>
        </div>

        {/* Heatmap Preview Component */}
        <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-warm-text dark:text-white">{t.heatmap}</h3>
            <Calendar className="w-5 h-5 text-secondary" />
          </div>

          <div className="space-y-4">
            {/* Display last 7 days blocks */}
            <div className="flex gap-2 justify-center py-2">
              {[35, 45, 78, 62, 52, 85, 30].map((score, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-lg ${getStressColor(score)} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                    title={`Day stress index: ${score}`}
                  >
                    {score}
                  </div>
                  <span className="text-[9px] text-warm-text/40 font-bold uppercase font-lato">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-warm-text/60 dark:text-gray-400">
              Yellow & Orange signify peak workload days. Tap below to see full history.
            </p>
          </div>

          <Link
            href="/heatmap"
            className="w-full text-center py-2 mt-2 bg-warm-bg dark:bg-dark-bg border border-warm-border dark:border-dark-border text-warm-text/80 dark:text-gray-300 text-xs rounded-xl font-bold hover:bg-primary/5 transition-all"
          >
            Open Analytics Calendar
          </Link>
        </div>
      </div>

      {/* Conditional layout override: PRE-EXAM PROTOCOL (Screen 6 / Feature 7) vs STUDY ROUTING (Screen 7 / Feature 4) */}
      <AnimatePresence mode="wait">
        {store.preExamMode ? (
          /* PRE-EXAM ANXIETY PROTOCOL MODULE */
          <motion.div
            key="preexam"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-tr from-accent/20 to-[#FFE9E5] border-2 border-accent/60 p-6 rounded-3xl shadow-sm space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-1 bg-accent/20 rounded-bl-2xl text-[9px] font-extrabold text-accent uppercase tracking-wider font-lato">
              Protocol active: 72h to exam
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-xl text-warm-text">{t.anxietyProtocol}</h3>
                <p className="text-sm text-warm-text/80">{t.calmMessage}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Interactive Breathing Guide */}
              <div className="bg-[#FFFDFB]/80 backdrop-blur border border-accent/20 p-5 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-accent uppercase tracking-wider">{t.breathingText}</h4>
                  <div className="h-16 flex items-center justify-center text-center my-4 font-bold text-lg text-warm-text">
                    {breathActive ? (
                      <span className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-accent animate-pulse">
                        {breathPhase} : {breathCount}s
                      </span>
                    ) : (
                      <span className="text-warm-text/60 text-sm font-medium">{breathPhase}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={runBreathingCycle}
                  disabled={breathActive}
                  className="w-full py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4.5 h-4.5 fill-white" />
                  Start 3 Cycles
                </button>
              </div>

              {/* Visualization and affirmations */}
              <div className="bg-[#FFFDFB]/80 backdrop-blur border border-accent/20 p-5 rounded-2xl space-y-4 shadow-sm">
                <div>
                  <h4 className="font-bold text-sm text-accent uppercase tracking-wider">{t.visualization}</h4>
                  <p className="text-xs text-warm-text/80 leading-relaxed mt-2 italic">
                    "Visualize entering the exam hall calmly. You sit at your desk, look at the paper, and take a deep breath. You are fully capable of solving what you know."
                  </p>
                </div>
                <div className="border-t border-accent/10 pt-3">
                  <h4 className="font-bold text-sm text-accent uppercase tracking-wider">{t.affirmations}</h4>
                  <ul className="text-xs text-warm-text/80 space-y-1.5 mt-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span>My preparation is enough for today.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span>One mark sheet cannot measure my life's success.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* REGULAR STUDY ROUTING RECOMMENDATION (Screen 7 / Feature 4) */
          <motion.div
            key="routing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-lg text-warm-text dark:text-white">{t.studyRouting}</h3>
              </div>
              <span className="text-xs bg-secondary/15 text-secondary-dark px-2.5 py-1 rounded-full font-bold">
                {studyRec?.durationText || "30 mins"}
              </span>
            </div>

            <div className="p-4 bg-warm-bg/50 dark:bg-dark-bg/40 border border-warm-border dark:border-dark-border/40 rounded-2xl">
              <h4 className="font-bold text-base text-warm-text dark:text-white mb-1">
                {studyRec?.recommendationTitle || "Comfort subject Warming up"}
              </h4>
              <p className="text-xs text-warm-text/80 dark:text-gray-300 leading-relaxed">
                {studyRec?.explanation || "Let's work on simple progress. Pushing through exhaustion causes burnout."}
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs text-warm-text/40 dark:text-gray-400 uppercase font-bold tracking-wider">Suggested flow checklist</h4>
              {studyRec?.actionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-warm-text/90 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Panel */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg text-warm-text dark:text-white">{t.quickActions}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/chat"
            className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-warm-text dark:text-white">Talk to BhalAI</span>
          </Link>

          <Link
            href="/journal"
            className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-warm-text dark:text-white">Write in Diary</span>
          </Link>

          <Link
            href="/confessions"
            className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-warm-text dark:text-white">Confessions Wall</span>
          </Link>

          <Link
            href="/reports"
            className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all warm-shadow group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-warm-text dark:text-white">Weekly Report</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
