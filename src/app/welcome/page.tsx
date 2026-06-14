"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useHydration } from "@/hooks/useHydration";
import { motion } from "framer-motion";
import {
  Heart, Brain, BarChart2, MessageCircle, Shield,
  AlertTriangle, ArrowRight, Lock, Sparkles, Eye
} from "lucide-react";

const canDoItems = [
  { icon: <MessageCircle className="w-5 h-5" />, text: "Listen to your thoughts without judgment" },
  { icon: <Heart className="w-5 h-5" />, text: "Understand and acknowledge your emotions" },
  { icon: <BarChart2 className="w-5 h-5" />, text: "Track your daily stress and mood patterns" },
  { icon: <Brain className="w-5 h-5" />, text: "Provide coping strategies and gentle guidance" },
  { icon: <Sparkles className="w-5 h-5" />, text: "Help you reflect on your challenges and growth" },
];

const cannotDoItems = [
  { icon: <AlertTriangle className="w-5 h-5" />, text: "Replace a licensed therapist or counsellor" },
  { icon: <AlertTriangle className="w-5 h-5" />, text: "Provide medical or psychiatric advice" },
  { icon: <AlertTriangle className="w-5 h-5" />, text: "Guarantee any specific outcome or result" },
  { icon: <AlertTriangle className="w-5 h-5" />, text: "Replace emergency mental health support" },
];

export default function WelcomePage() {
  const router = useRouter();
  const store = useStore();
  const hydrated = useHydration();

  useEffect(() => {
    if (hydrated) {
      if (!store.isAuthenticated) {
        router.push("/");
      } else if (store.onboardingCompleted) {
        router.push("/dashboard");
      }
    }
  }, [hydrated, store.isAuthenticated, store.onboardingCompleted, router]);

  const handleBeginJourney = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg mb-6"
          >
            <Heart className="w-10 h-10 text-white" fill="white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "'Hind', sans-serif" }}
          >
            Welcome to <span className="text-orange-500">Nazaraana</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-rose-600 font-medium italic"
          >
            — A gift for your journey.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-500 text-base max-w-md mx-auto"
          >
            Before we begin, we want you to know exactly what BhalAI is — and what it is not.
            Knowing this will help you get the most from your experience.
          </motion.p>
        </div>

        {/* CAN / CANNOT Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* CAN DO */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-green-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="font-semibold text-gray-800 text-base">What BhalAI <span className="text-green-600">CAN</span> do</h2>
            </div>
            <ul className="space-y-3">
              {canDoItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-600 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CANNOT DO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-amber-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="font-semibold text-gray-800 text-base">What BhalAI <span className="text-amber-600">CANNOT</span> do</h2>
            </div>
            <ul className="space-y-3">
              {cannotDoItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-600 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-amber-100">
              <p className="text-xs text-amber-700 font-medium">
                ⚡ If you are in crisis, please call iCall: <strong>9152987821</strong> or Vandrevala Foundation: <strong>1860-2662-345</strong>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-blue-50"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" /> Your Privacy is Sacred
              </h3>
              <p className="text-sm text-gray-500">
                Your journals, mood check-ins, and conversations <strong>remain completely private</strong>.
                All your data is stored locally on your device only and is never shared, sold, or transmitted
                to any third-party service. You own your story.
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 ml-14">
            <Eye className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-blue-500 italic">
              Nazaraana does not store your data on any external server. No analytics. No ads. No surveillance.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            id="begin-journey-btn"
            onClick={handleBeginJourney}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-rose-600 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-3 text-xs text-gray-400">
            By continuing, you acknowledge that BhalAI is a supportive companion, not a medical professional.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
