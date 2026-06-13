"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/actions";
import { Sparkles, ShieldAlert, ArrowRight, CheckCircle, Mail, Lock, User, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { authService } from "@/lib/authService";

export default function LandingClient() {
  const store = useStore();

  useEffect(() => {
    if (store.currentUser) {
      window.location.href = "/dashboard";
    }
  }, [store.currentUser]);

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
      "Suno beta, I know syllabus is heavy today...",
      "Tell me how you are feeling. BhalAI is right here.",
      "Aap akele nahi ho, let's take a deep breath together.",
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
      setError("Please fill in all email and password fields.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await authService.login(email.trim(), password);

      if (res.success) {
        if (res.fallbackToDemo || res.error?.includes("Unable to connect")) {
          setSuccess("Unable to connect to the server. Switching to Demo Mode.");
          setTimeout(() => {
            if (res.user) {
              store.setCurrentUser(res.user);
              store.setUserName(res.user.name);
            }
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          if (res.user) {
            store.setCurrentUser(res.user);
            store.setUserName(res.user.name);
          }
          window.location.href = "/dashboard";
        }
      } else {
        setError(res.error || "Login failed. Check your email and password.");
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
      setError("Please fill in all registration fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await authService.register(fullName, email.trim(), password);

      if (res.success) {
        if (res.fallbackToDemo || res.error?.includes("Unable to connect")) {
          setSuccess("Unable to connect to the server. Switching to Demo Mode.");
          setTimeout(() => {
            if (res.user) {
              store.setCurrentUser(res.user);
              store.setUserName(res.user.name);
            }
            window.location.href = "/onboarding";
          }, 1500);
        } else {
          if (res.user) {
            store.setCurrentUser(res.user);
            store.setUserName(res.user.name);
          }
          window.location.href = "/onboarding";
        }
      } else {
        setError(res.error || "Could not register account.");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Could not register account.");
      setLoading(false);
    }
  };

  const handleDemoExperience = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await authService.login("demo@nazaraana.ai", "demo123");

      if (res.success) {
        if (res.user) {
          store.setCurrentUser(res.user);
          store.setUserName(res.user.name);
        }
        window.location.href = "/dashboard";
      } else {
        setError("Demo login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred during Demo sign-in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-between p-4 md:p-8 font-hind selection:bg-accent/30">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-md">
            न
          </span>
          <span className="text-2xl font-bold tracking-tight text-warm-text font-lato">
            Nazaraana
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-warm-border/50 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-warm-text/80 font-medium font-lato">BhalAI companion active</span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 py-8 my-auto">
        {/* Left column: Copy & Features */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Emotional Support for Indian Aspirants
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-warm-text"
          >
            Syllabus is heavy. <br />
            Let BhalAI carry your <br />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-extrabold">
              heart's burden.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg text-warm-text/85 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Nazaraana is a warm, empathetic wellness companion for JEE, NEET, UPSC, and board students. BhalAI is here to process your stress, mock-test anxiety, and loneliness. No syllabus teaching—just care.
          </motion.p>

          {/* Features checkmarks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 pt-2 text-left"
          >
            {[
              "Empathetic, multi-lingual BhalAI chat",
              "Stress heatmap & mood journal insights",
              "Pre-exam anxiety protocols & coping guides",
              "Anonymous confessions wall with support"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-warm-text/90">
                <CheckCircle className="w-4.5 h-4.5 text-secondary flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column: Self-contained Auth Card */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full bg-[#FFFDFB] border border-warm-border rounded-3xl shadow-xl warm-shadow relative overflow-hidden"
          >
            {/* Header: Contrast heading on gradient background */}
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
              <div className="flex border-b border-warm-border/60">
                <button
                  onClick={() => {
                    setActiveTab("signin");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
                    activeTab === "signin"
                      ? "border-primary text-primary"
                      : "border-transparent text-warm-text/50 hover:text-warm-text"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab("register");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 animate-pulse shadow-sm">
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
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-start gap-2 text-xs">
                  <ShieldAlert className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-start gap-2 text-xs">
                  <CheckCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Animated Form Display */}
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
                      <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-warm-text/40" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-warm-text/40" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text transition-all"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:-translate-y-0.5 disabled:opacity-75 text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Logging you in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4.5 h-4.5" />
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
                      <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" />
                      <input
                        type="password"
                        placeholder="Password (min 8 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text transition-all"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-warm-text/40" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 bg-warm-bg/50 border border-warm-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text transition-all"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-secondary hover:bg-secondary-dark text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-1.5 shadow-md hover:-translate-y-0.5 disabled:opacity-75 text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4.5 h-4.5" />
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

              {/* Try Demo Experience Button: Email demo@nazaraana.ai / password demo123 */}
              <button
                type="button"
                onClick={handleDemoExperience}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-warm-bg text-warm-text border border-warm-border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow active:scale-98 disabled:opacity-50"
              >
                <HeartHandshake className="w-4.5 h-4.5 text-primary" />
                <span>Try Demo Experience</span>
              </button>
            </div>
          </motion.div>

          {/* Study desk illustration */}
          <div className="w-full hidden sm:block opacity-90 max-w-sm">
            <svg viewBox="0 0 400 280" className="w-full h-auto text-warm-text">
              <rect x="20" y="220" width="360" height="12" rx="4" fill="#E8A598" opacity="0.8" />
              <line x1="40" y1="232" x2="40" y2="280" stroke="#E8A598" strokeWidth="12" strokeLinecap="round" />
              <line x1="360" y1="232" x2="360" y2="280" stroke="#E8A598" strokeWidth="12" strokeLinecap="round" />
              <rect x="50" y="150" width="100" height="20" rx="3" fill="#7DB99A" />
              <rect x="45" y="170" width="110" height="22" rx="3" fill="#F4A426" />
              <rect x="40" y="192" width="120" height="28" rx="3" fill="#E8A598" />
              <text x="65" y="210" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">JEE / NEET PREP</text>
              <rect x="180" y="140" width="120" height="75" rx="5" fill="#2C2C2C" />
              <rect x="188" y="148" width="104" height="60" rx="2" fill="#FDF8F2" />
              <path d="M240,172 C240,172 237,166 232,166 C227,166 225,171 228,175 C232,180 240,186 240,186 C240,186 248,180 252,175 C255,171 253,166 248,166 C243,166 240,172 240,172 Z" fill="#E8A598" />
              <text x="212" y="198" fill="#F4A426" fontSize="7" fontWeight="bold">BhalAI: How's prep?</text>
              <polygon points="170,220 310,220 320,227 160,227" fill="#7D7D7D" />
              <path d="M325,190 L345,190 L342,220 L328,220 Z" fill="#E8A598" opacity="0.9" />
              <path d="M345,195 C349,195 352,198 352,202 C352,206 349,209 345,209" stroke="#E8A598" strokeWidth="3" fill="none" />
              <ellipse cx="335" cy="190" rx="10" ry="3" fill="#A57A5A" />
              <path d="M330,182 Q332,175 330,170" stroke="#7DB99A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M336,184 Q338,177 336,172" stroke="#7DB99A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
              <path d="M110,220 L110,80 L200,60" fill="none" stroke="#2C2C2C" strokeWidth="4" strokeLinecap="round" />
              <path d="M190,50 L220,60 L210,80 L180,70 Z" fill="#F4A426" />
              <polygon points="200,75 140,220 280,220 215,75" fill="#F4A426" opacity="0.12" />
            </svg>
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
