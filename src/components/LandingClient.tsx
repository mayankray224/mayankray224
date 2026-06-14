"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldAlert, ArrowRight, CheckCircle, Mail, Lock, User, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import authService from "@/lib/authService";

export default function LandingClient() {
  const store = useStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // BhalAI typing simulation
  const [typingMessage, setTypingMessage] = useState("");

  useEffect(() => {
    const messages = [
      "Suno, I know the syllabus is heavy today...",
      "Tell me how you are feeling. BhalAI is right here.",
      "You are not alone. Let's take a deep breath together.",
    ];
    let msgIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 50;

    const handleTyping = () => {
      const currentMessage = messages[msgIdx];
      
      if (!isDeleting) {
        setTypingMessage(currentMessage.substring(0, charIdx + 1));
        charIdx++;

        if (charIdx === currentMessage.length) {
          isDeleting = true;
          setTimeout(handleTyping, 3000);
          return;
        }
      } else {
        setTypingMessage(currentMessage.substring(0, charIdx - 1));
        charIdx--;

        if (charIdx === 0) {
          isDeleting = false;
          msgIdx = (msgIdx + 1) % messages.length;
        }
      }
      setTimeout(handleTyping, isDeleting ? 30 : typingSpeed);
    };

    const timer = setTimeout(handleTyping, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await authService.login(email.trim(), password);
      if (res.success) {
        setSuccess("Success! Preparing your dashboard...");
        setTimeout(() => {
          if (store.onboardingCompleted) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        }, 800);
      } else {
        setError(res.error || "Login failed. Please check your credentials.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await authService.register(fullName.trim(), email.trim(), password);
      if (res.success) {
        setSuccess("Account created successfully! Let's start onboarding.");
        setTimeout(() => {
          router.push("/onboarding");
        }, 800);
      } else {
        setError(res.error || "Could not register account.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Could not register account.");
      setLoading(false);
    }
  };

  const handleDemoExperience = () => {
    setError("");
    setSuccess("");
    setLoading(true);
    authService.login("demo@nazaraana.ai", "demo123");
    setSuccess("Entering Demo Mode... Please set up your profile.");
    setTimeout(() => {
      router.push("/onboarding");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-between p-4 md:p-8 font-hind selection:bg-accent/30 text-warm-text">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4" role="banner">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md" aria-hidden="true">
            न
          </span>
          <span className="text-2xl font-bold tracking-tight font-lato">
            Nazaraana
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-warm-border/50 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium font-lato">BhalAI companion active</span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 py-8 my-auto">
        {/* Left column: Copy & Features */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Emotional Support for Indian Aspirants</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
          >
            Syllabus is heavy. <br />
            Let BhalAI carry your <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-extrabold">
              heart's burden.
            </span>
          </h1>

          <p
            className="text-lg text-warm-text/85 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Nazaraana is a warm, empathetic wellness companion for JEE, NEET, UPSC, and board students. BhalAI is here to process your stress, mock-test anxiety, and loneliness. No syllabus teaching—just care.
          </p>

          {/* Features checkmarks */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 pt-2 text-left"
          >
            {[
              "Empathetic, multi-lingual BhalAI chat",
              "Stress heatmap & mood journal insights",
              "Pre-exam anxiety protocols & coping guides",
              "Anonymous confessions wall with support"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4.5 h-4.5 text-secondary flex-shrink-0" aria-hidden="true" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Self-contained Auth Card */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
          
          <div
            className="w-full bg-[#FFFDFB] border border-warm-border rounded-3xl shadow-xl warm-shadow relative overflow-hidden"
            role="form"
            aria-label="User Account Form"
          >
            {/* Header */}
            <div className="bg-gradient-to-tr from-primary to-accent py-6 px-6 text-center border-b border-warm-border">
              <h2 className="text-3xl font-bold text-[#FDF8F2] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-[#FDF8F2]/90 mt-1 font-medium font-lato">
                Let's check in with BhalAI.
              </p>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Tab Switchers: Sign In / Create Account */}
              <div className="flex border-b border-warm-border/60" role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === "signin"}
                  onClick={() => {
                    setActiveTab("signin");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all focus:outline-none ${
                    activeTab === "signin"
                      ? "border-primary text-primary"
                      : "border-transparent text-warm-text/50 hover:text-warm-text"
                  }`}
                >
                  Sign In
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "register"}
                  onClick={() => {
                    setActiveTab("register");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all focus:outline-none ${
                    activeTab === "register"
                      ? "border-primary text-primary"
                      : "border-transparent text-warm-text/50 hover:text-warm-text"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* BhalAI Avatar and Typing indicator */}
              <div className="flex items-center gap-3.5 p-3 bg-warm-bg/50 border border-warm-border/50 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 animate-pulse shadow-sm" aria-hidden="true">
                  भ
                </div>
                <div className="flex-1 space-y-0.5 min-w-0">
                  <div className="text-[9px] text-primary uppercase font-bold tracking-wider font-lato flex items-center gap-1.5">
                    <span>BhalAI is online</span>
                    <span className="inline-flex gap-0.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]"></span>
                    </span>
                  </div>
                  <p className="text-[11px] text-warm-text/75 leading-relaxed truncate italic">
                    "{typingMessage || "Suno beta..."}"
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-start gap-2 text-xs" role="alert">
                  <ShieldAlert className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-start gap-2 text-xs" role="status">
                  <CheckCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{success}</span>
                </div>
              )}

              {/* Form Display */}
              <AnimatePresence mode="wait">
                {activeTab === "signin" ? (
                  <motion.form
                    key="signin-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignIn}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-warm-text/40" aria-hidden="true" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text transition-all"
                        required
                        aria-label="Email Address"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-warm-text/40" aria-hidden="true" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text transition-all"
                        required
                        aria-label="Password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:-translate-y-0.5 disabled:opacity-75 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Logging you in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleRegister}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" aria-hidden="true" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text transition-all"
                        required
                        aria-label="Full Name"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" aria-hidden="true" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text transition-all"
                        required
                        aria-label="Email Address"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" aria-hidden="true" />
                      <input
                        type="password"
                        placeholder="Password (min 8 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text transition-all"
                        required
                        aria-label="Password (min 8 characters)"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" aria-hidden="true" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text transition-all"
                        required
                        aria-label="Confirm Password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-secondary hover:bg-secondary-dark text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:-translate-y-0.5 disabled:opacity-75 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Separator */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-warm-border/60"></div>
                <span className="flex-shrink mx-3 text-[10px] text-warm-text/40 uppercase font-bold tracking-wider font-lato">Judge Quick Access</span>
                <div className="flex-grow border-t border-warm-border/60"></div>
              </div>

              {/* Try Demo Experience Button */}
              <button
                type="button"
                onClick={handleDemoExperience}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-warm-bg text-warm-text border border-warm-border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow active:scale-98 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <HeartHandshake className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
                <span>Try Demo Experience</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center py-6 border-t border-warm-border/40 text-xs text-warm-text/50 font-lato">
        © {new Date().getFullYear()} Nazaraana Wellness Platform. Made for Indian Students.
      </footer>
    </div>
  );
}
