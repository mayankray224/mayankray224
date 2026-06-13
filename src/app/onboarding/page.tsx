"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { syncOnboarding } from "@/app/actions";
import { Language } from "@/lib/translations";
import { authService } from "@/lib/authService";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Calendar, Sparkles } from "lucide-react";

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

export default function Onboarding() {
  const router = useRouter();
  const store = useStore();
  
  // Local wizard step state (1 to 5)
  const [step, setStep] = useState(1);
  const [name, setName] = useState(store.userName);
  const [exams, setExams] = useState<string[]>(store.selectedExams);
  const [language, setLanguage] = useState<Language>(store.language);
  const [comfortSubject, setComfortSubject] = useState(store.comfortSubject);
  const [examDate, setExamDate] = useState(store.examDate || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      setError("Please enter your name, beta.");
      return;
    }
    if (step === 2 && exams.length === 0) {
      setError("Please select at least one exam.");
      return;
    }
    if (step === 4 && !comfortSubject.trim()) {
      setError("Please tell us your comfort subject.");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleExamToggle = (exam: string) => {
    setExams((prev) =>
      prev.includes(exam) ? prev.filter((e) => e !== exam) : [...prev, exam]
    );
  };

  const handleSubmit = async () => {
    if (!examDate) {
      setError("Please select your exam date.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Sync client side store
      store.setUserName(name);
      store.setSelectedExams(exams);
      store.setLanguage(language);
      store.setComfortSubject(comfortSubject);
      store.setExamDate(examDate);

      // Persist in local user session
      if (store.currentUser) {
        const updatedUser = {
          ...store.currentUser,
          name,
          language,
          comfortSubject,
          examDate,
          onboardingStep: 5
        };
        store.setCurrentUser(updatedUser);
        localStorage.setItem("nazaraana_session", JSON.stringify(updatedUser));
      }

      // Sync to DB if available
      const isDb = await authService.isDbAvailable();
      if (isDb) {
        await syncOnboarding({
          name,
          exams,
          comfortSubject,
          examDate,
          language,
        });
      }

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.warn("Database sync failed in onboarding, proceeding locally:", err);
      // Navigate to dashboard anyway since local storage has the state
      router.push("/dashboard");
    }
  };

  // Slide Animation configs (<300ms duration)
  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-between p-4 md:p-8 font-hind">
      {/* Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-1.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
            न
          </span>
          <span className="text-lg font-bold text-warm-text">Nazaraana</span>
        </div>
        {/* Step Indicator dots */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                s === step
                  ? "bg-primary w-4"
                  : s < step
                  ? "bg-secondary"
                  : "bg-warm-border"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main card container */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border rounded-3xl p-6 md:p-8 shadow-lg warm-shadow relative overflow-hidden">
          
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: NAME INPUT (SCREEN 2) */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-warm-text">
                    What should we call you, beta?
                  </h2>
                  <p className="text-sm text-warm-text/60">
                    BhalAI will address you by this name.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3.5 bg-warm-bg/50 border border-warm-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text text-lg text-center"
                />
              </motion.div>
            )}

            {/* STEP 2: EXAM SELECTION (SCREEN 3) */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-warm-text">
                    Which exams are you preparing for?
                  </h2>
                  <p className="text-sm text-warm-text/60">
                    Select all that apply.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {EXAM_OPTIONS.map((exam) => {
                    const isSelected = exams.includes(exam);
                    return (
                      <button
                        key={exam}
                        onClick={() => handleExamToggle(exam)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-left flex justify-between items-center ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white border-warm-border text-warm-text hover:bg-warm-bg/50"
                        }`}
                      >
                        <span>{exam}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: LANGUAGE SELECTION (SCREEN 4) */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-warm-text">
                    Which language do you prefer?
                  </h2>
                  <p className="text-sm text-warm-text/60">
                    BhalAI can speak, switch codes, and read in your language.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isSelected = language === lang.name;
                    return (
                      <button
                        key={lang.name}
                        onClick={() => setLanguage(lang.name)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all text-center flex flex-col justify-center items-center ${
                          isSelected
                            ? "bg-secondary/15 border-secondary text-secondary-dark"
                            : "bg-white border-warm-border text-warm-text hover:bg-warm-bg/50"
                        }`}
                      >
                        <span className="font-bold text-base">{lang.label}</span>
                        <span className="text-xs text-warm-text/50">{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: COMFORT SUBJECT (SCREEN 5) */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-warm-text">
                    Which subject is your comfort zone?
                  </h2>
                  <p className="text-sm text-warm-text/60">
                    The subject that gives you confidence on low stress days.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Physics, History, Anatomy"
                  value={comfortSubject}
                  onChange={(e) => {
                    setComfortSubject(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 bg-warm-bg/50 border border-warm-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text text-lg text-center"
                />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Physics", "Maths", "Chemistry", "Biology", "History", "English"].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setComfortSubject(sub);
                        setError("");
                      }}
                      className="px-3 py-1.5 rounded-full border border-warm-border bg-white text-xs text-warm-text hover:bg-warm-bg/50"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: EXAM DATE (SCREEN 6) */}
            {step === 5 && (
              <motion.div
                key="step5"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-warm-text">
                    When is your next big exam?
                  </h2>
                  <p className="text-sm text-warm-text/60">
                    We use this to activate pre-exam support 72 hours before.
                  </p>
                </div>
                <input
                  type="date"
                  value={examDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setExamDate(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 bg-warm-bg/50 border border-warm-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text text-lg text-center font-bold font-lato"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-warm-border/40">
            {step > 1 ? (
              <button
                onClick={handleBack}
                disabled={loading}
                className="py-2.5 px-4 bg-white hover:bg-warm-bg border border-warm-border text-warm-text rounded-xl font-semibold transition-all duration-200 flex items-center gap-1.5 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="py-2.5 px-5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-1.5 text-sm shadow-md"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="py-2.5 px-6 bg-secondary hover:bg-secondary-dark text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-1.5 text-sm shadow-md disabled:opacity-50"
              >
                {loading ? "Saving..." : "Start Journey"}
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-warm-text/40 font-lato">
        Nazaraana is here to support, not test you. Take your time.
      </footer>
    </div>
  );
}
