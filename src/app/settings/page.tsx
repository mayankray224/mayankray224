"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS, Language } from "@/lib/translations";
import { Settings, Shield, Bell, HelpCircle, Check, Info } from "lucide-react";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";

const EXAM_OPTIONS = [
  "NEET",
  "JEE Mains",
  "JEE Advanced",
  "UPSC",
  "CAT",
  "GATE",
  "CUET",
  "CLAT",
  "GMAT",
  "Class 10 Boards",
  "Class 12 Boards",
  "Other"
];

const LANGUAGE_OPTIONS: { name: Language; label: string }[] = [
  { name: "English", label: "English" },
  { name: "Hindi", label: "हिन्दी" },
  { name: "Hinglish", label: "Hinglish" },
  { name: "Gujarati", label: "ગુજરાતી" },
  { name: "Tamil", label: "தமிழ்" },
  { name: "Telugu", label: "తెలుగు" },
  { name: "Bengali", label: "বাংলা" },
  { name: "Marathi", label: "मराठी" },
  { name: "Kannada", label: "ಕನ್ನಡ" },
  { name: "Malayalam", label: "മലയാളം" }
];

export default function SettingsPage() {
  const store = useStore();
  const hydrated = useHydration();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  // Local settings states synced with store
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState<Language>("English");
  const [examType, setExamType] = useState("");
  const [comfortSubject, setComfortSubject] = useState("");
  const [examDate, setExamDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Notification states
  const [allowDailies, setAllowDailies] = useState(true);
  const [allowReminders, setAllowReminders] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);

  // Sync state once hydrated
  useEffect(() => {
    if (hydrated) {
      setUserName(store.name);
      setLanguage(store.language);
      setExamType(store.examType);
      setComfortSubject(store.comfortSubject);
      setExamDate(store.examDate);
    }
  }, [hydrated, store.name, store.language, store.examType, store.comfortSubject, store.examDate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErr("Name cannot be blank.");
      return;
    }
    if (!examType) {
      setErr("Please select your target exam.");
      return;
    }
    if (!examDate) {
      setErr("Please specify your next exam date.");
      return;
    }

    setErr("");
    setMsg("");
    setSaving(true);

    try {
      // Save changes to Zustand
      store.completeOnboarding({
        name: userName.trim(),
        examType,
        examDate,
        comfortSubject: comfortSubject.trim(),
        language,
      });

      setMsg("Settings saved successfully! 🌸");
    } catch (error: any) {
      setErr("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated) {
    return <PageSkeleton />;
  }

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold text-warm-text dark:text-white">{t.settings}</h1>
        <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
          Configure your languages, exams checklist, sleep reminders, and read about BhalAI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Forms */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Card 1: User Profile Settings */}
          <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-4">
            <h3 className="font-bold text-base text-warm-text dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" aria-hidden="true" />
              <span>Personal & Exam details</span>
            </h3>

            {msg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs" role="status">
                {msg}
              </div>
            )}

            {err && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs" role="alert">
                {err}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-warm-text/50 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg/50 border border-warm-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text"
                  aria-label="Name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-warm-text/50 uppercase tracking-wide">{t.comfortSubject}</label>
                <input
                  type="text"
                  value={comfortSubject}
                  onChange={(e) => setComfortSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg/50 border border-warm-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text"
                  aria-label="Comfort Subject"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-warm-text/50 uppercase tracking-wide">{t.examDate}</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 bg-warm-bg/50 border border-warm-border rounded-xl text-sm font-bold font-lato focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text"
                  aria-label="Exam Date"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-warm-text/50 uppercase tracking-wide">{t.selectLanguage}</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 bg-warm-bg/50 border border-warm-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text"
                  aria-label="Select Preferred Language"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.name} value={lang.name}>
                      {lang.label} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exam selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-warm-text/50 uppercase tracking-wide block">Active Target Exam</label>
              <div className="flex flex-wrap gap-2">
                {EXAM_OPTIONS.map((exam) => {
                  const isChecked = examType === exam;
                  return (
                    <button
                      type="button"
                      key={exam}
                      onClick={() => setExamType(exam)}
                      className={`px-3 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        isChecked
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white border-warm-border text-warm-text hover:bg-warm-bg"
                      }`}
                    >
                      <span>{exam}</span>
                      {isChecked && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-xs font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {saving ? "Saving changes..." : t.saveSettings}
            </button>
          </div>

          {/* Card 2: Privacy */}
          <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-4">
            <h3 className="font-bold text-base text-warm-text dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" aria-hidden="true" />
              <span>Privacy & Notifications</span>
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-warm-text dark:text-white">Anonymous Journal logs</h4>
                  <p className="text-[10px] text-warm-text/60">Do not sync journal texts to public analytics</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                  aria-label="Anonymous Journal logs"
                />
              </div>

              <div className="flex items-center justify-between border-t border-warm-border/40 pt-4">
                <div>
                  <h4 className="font-bold text-sm text-warm-text dark:text-white">Daily stress checkin push</h4>
                  <p className="text-[10px] text-warm-text/60">Remind me to log my mood at 9:00 PM every day</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowDailies}
                  onChange={(e) => setAllowDailies(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                  aria-label="Daily stress checkin push"
                />
              </div>

              <div className="flex items-center justify-between border-t border-warm-border/40 pt-4">
                <div>
                  <h4 className="font-bold text-sm text-warm-text dark:text-white">Sleep hygiene reminders</h4>
                  <p className="text-[10px] text-warm-text/60">Warn me to close book stack if stress is elevated</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowReminders}
                  onChange={(e) => setAllowReminders(e.target.checked)}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                  aria-label="Sleep hygiene reminders"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Side: About BhalAI */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-warm-text dark:text-white">{t.aboutBhalAI}</h3>
          
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
              <h4 className="font-bold text-sm uppercase tracking-wider">BhalAI Mandate</h4>
            </div>

            <p className="text-xs text-warm-text/85 dark:text-gray-300 leading-relaxed">
              {t.aboutDescription}
            </p>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex gap-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-[10px] text-amber-700 leading-relaxed font-semibold">
                BhalAI does not give academic answers (syllabus queries). If you ask a maths formula, BhalAI will gently suggest reviewing your comfort subject and taking a chai break.
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
