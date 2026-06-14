"use client";
import React from "react";
import AppShell from "@/components/shared/AppShell";
import { Heart, Brain, MessageCircle, BarChart2, Sparkles, Globe, Shield, AlertTriangle } from "lucide-react";

const capabilities = [
  { icon: <MessageCircle className="w-5 h-5" />, title: "Deep Listening", desc: "BhalAI listens without judgement. There are no right or wrong feelings — only your truth, heard and acknowledged." },
  { icon: <Brain className="w-5 h-5" />, title: "Emotion Understanding", desc: "Trained to recognise nuanced emotional states — exam anxiety, parental pressure, coaching burnout, hostel loneliness — and respond with warmth." },
  { icon: <BarChart2 className="w-5 h-5" />, title: "Stress Pattern Tracking", desc: "Every journal and check-in feeds a live stress score and heatmap, helping you see patterns over time." },
  { icon: <Globe className="w-5 h-5" />, title: "Multilingual & Code-switching", desc: "BhalAI speaks Hinglish, Hindi, English, Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, and Gujarati — naturally mixing languages the way Indian students do." },
  { icon: <Sparkles className="w-5 h-5" />, title: "Memory Layer", desc: "BhalAI remembers your recent journals, mood entries, and chat history to build a continuous, personalised relationship over time." },
  { icon: <Shield className="w-5 h-5" />, title: "Crisis Escalation", desc: "When severe distress signals are detected, BhalAI immediately surfaces helpline numbers (iCall, Vandrevala Foundation) and shifts to compassionate, de-escalation language." },
];

const limitations = [
  "BhalAI cannot replace a licensed therapist, psychiatrist, or counsellor.",
  "BhalAI cannot provide medical diagnoses or prescribe treatment.",
  "BhalAI cannot guarantee any emotional or academic outcome.",
  "BhalAI cannot be used in place of emergency mental health services.",
  "BhalAI may occasionally misclassify emotional intent — always use your own judgement.",
];

export default function AboutPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-6">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg mb-4">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-warm-text dark:text-white mb-2">
            Meet <span className="text-orange-500">BhalAI</span>
          </h1>
          <p className="text-warm-text/60 dark:text-gray-400 text-sm max-w-lg mx-auto">
            BhalAI is Nazaraana's empathetic AI wellness companion — a warm, maternal presence designed to hold
            space for Indian exam aspirants during the most stressful chapters of their lives.
          </p>
        </div>

        {/* Origin Story */}
        <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800 mb-6">
          <h2 className="font-semibold text-warm-text dark:text-white mb-2 text-base">Why BhalAI exists</h2>
          <p className="text-sm text-warm-text/70 dark:text-gray-300 leading-relaxed">
            Millions of Indian students preparing for JEE, NEET, UPSC, and board exams experience extreme emotional
            strain — yet existing tools only track productivity, not wellbeing. BhalAI was created to fill this gap:
            an always-available, non-judgemental companion who understands the cultural, linguistic, and emotional
            context of Indian student life. The name "Bhal" means "forehead" in Hindi — traditionally the place a
            parent kisses to bestow love and blessings.
          </p>
        </div>

        {/* Capabilities */}
        <h2 className="text-base font-semibold text-warm-text dark:text-white mb-4">What BhalAI can do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {capabilities.map((cap, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-sm border border-warm-border dark:border-dark-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-500">{cap.icon}</span>
                <h3 className="text-sm font-semibold text-warm-text dark:text-white">{cap.title}</h3>
              </div>
              <p className="text-xs text-warm-text/60 dark:text-gray-400 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

        {/* Limitations */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-amber-700 dark:text-amber-400">Important limitations</h2>
          </div>
          <ul className="space-y-2">
            {limitations.map((lim, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-300">
                <span className="mt-0.5">•</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-700">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              Crisis support: <strong>iCall 9152987821</strong> · <strong>Vandrevala Foundation 1860-2662-345</strong>
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
