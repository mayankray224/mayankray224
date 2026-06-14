"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Language } from "@/lib/translations";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Calendar, Sparkles, BookOpen, MessageSquare, Heart, GraduationCap } from "lucide-react";

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
  const hydrated = useHydration();
  
  // Local wizard step state (1 to 5)
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [examType, setExamType] = useState("");
  const [language, setLanguage] = useState<Language>("English");
  const [comfortSubject, setComfortSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [error, setError] = useState("");

  // Route protection
  useEffect(() => {
    if (hydrated) {
      if (!store.isAuthenticated) {
        router.push("/");
      } else if (store.onboardingCompleted) {
        router.push("/dashboard");
      }
    }
  }, [hydrated, store.isAuthenticated, store.onboardingCompleted, router]);

  if (!hydrated || !store.isAuthenticated) {
    return <PageSkeleton />;
  }

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (step === 2 && !examType) {
      setError("Please select your target exam.");
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

  const handleSubmit = () => {
    if (!examDate) {
      setError("Please select your exam date.");
      return;
    }
    setError("");

    store.completeOnboarding({
      name: name.trim(),
      examType,
      examDate,
      comfortSubject: comfortSubject.trim(),
      language,
    });

    router.push("/dashboard");
  };

  // Slide Animation configs (<300ms duration)
  const slideVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FFF7EC] to-[#FDF1E2] flex flex-col justify-between p-4 md:p-8 font-hind text-[#2C2C2C]">
      {/* Header */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between py-4" role="banner">
        <div className="flex items-center gap-1.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
            न
          </span>
          <span className="text-lg font-bold font-lato">Nazaraana</span>
        </div>
        {/* Step Indicator dots */}
        <div className="flex gap-1.5" aria-label={`Step ${step} of 5`}>
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
      <main className="max-w-md mx-auto w-full my-auto py-6" role="main">
        <div className="bg-[#FFFFFF] border-2 border-[#F5E6D3] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden text-[#2C2C2C]">
          
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs" role="alert">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: NAME INPUT */}
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
                <div className="space-y-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto mb-2 shadow-sm animate-bounce">
                    <Sparkles className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#2C2C2C] tracking-tight">
                    What should we call you, beta?
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
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
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-[#F5E6D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg text-center text-[#2C2C2C] font-semibold"
                  aria-label="Name"
                />
              </motion.div>
            )}

            {/* STEP 2: EXAM SELECTION */}
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
                <div className="space-y-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 border border-blue-200 flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <GraduationCap className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#2C2C2C] tracking-tight">
                    Which exam are you preparing for?
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    Select your primary target exam.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {EXAM_OPTIONS.map((exam) => {
                    const isSelected = examType === exam;
                    return (
                      <button
                        key={exam}
                        onClick={() => {
                          setExamType(exam);
                          setError("");
                        }}
                        className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary ${
                          isSelected
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-white border-gray-200 text-[#2C2C2C] hover:bg-gray-50"
                        }`}
                      >
                        <span>{exam}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: LANGUAGE SELECTION */}
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
                <div className="space-y-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-200 flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <MessageSquare className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#2C2C2C] tracking-tight">
                    Which language do you prefer?
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
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
                        className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-center flex flex-col justify-center items-center focus:outline-none focus:ring-2 focus:ring-primary ${
                          isSelected
                            ? "bg-secondary/15 border-secondary text-secondary-dark"
                            : "bg-white border-gray-200 text-[#2C2C2C] hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-bold text-base">{lang.label}</span>
                        <span className="text-xs text-gray-500 font-medium">{lang.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: COMFORT SUBJECT */}
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
                <div className="space-y-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <BookOpen className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#2C2C2C] tracking-tight">
                    Which subject is your comfort zone?
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
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
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-[#F5E6D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg text-center text-[#2C2C2C] font-semibold"
                  aria-label="Comfort Subject"
                />
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Physics", "Maths", "Chemistry", "Biology", "History", "English"].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setComfortSubject(sub);
                        setError("");
                      }}
                      className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-[#2C2C2C] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: EXAM DATE */}
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
                <div className="space-y-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <Calendar className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#2C2C2C] tracking-tight">
                    When is your next big exam?
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
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
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-[#F5E6D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg text-center font-bold font-lato text-[#2C2C2C]"
                  aria-label="Exam Date"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-warm-border/40">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="py-2.5 px-4 bg-white hover:bg-warm-bg border border-warm-border text-warm-text rounded-xl font-semibold transition-all duration-200 flex items-center gap-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="py-2.5 px-5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-1.5 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Next
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="py-2.5 px-6 bg-secondary hover:bg-secondary-dark text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-1.5 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Start Journey
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
