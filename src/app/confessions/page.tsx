"use client";

import React, { useState } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { Heart, Send, MessageCircleCode, ShieldCheck, HelpCircle } from "lucide-react";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfessionsPage() {
  const store = useStore();
  const hydrated = useHydration();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      setError("Beta, a confession must be at least 10 characters long.");
      return;
    }
    setError("");
    setSuccessMsg("");

    const res = store.addConfession(content.trim());
    if (res.success) {
      setSuccessMsg("Released anonymously! May your heart feel lighter.");
      setContent("");
    } else if (res.moderated) {
      setError("Your post was flagged by safety filters. If you are experiencing extreme distress, please reach out to our helplines.");
      setContent("");
    }
  };

  const handleReact = (id: string, emoji: string) => {
    store.reactToConfession(id, emoji);
  };

  if (!hydrated) {
    return <PageSkeleton />;
  }

  const feed = store.localConfessions;

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold text-warm-text dark:text-white">{t.confessions}</h1>
        <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
          A silent wall to release what's heavy. No comments, no profiles. All logs are stored anonymously.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Submission Panel */}
        <div className="lg:col-span-1 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm warm-shadow space-y-4 relative overflow-hidden"
          >
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 to-accent" />

            <h3 className="font-bold text-lg text-warm-text dark:text-white flex items-center gap-2">
              <MessageCircleCode className="w-5 h-5 text-accent" aria-hidden="true" />
              <span>{t.confessAnonymously}</span>
            </h3>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs" role="alert">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs" role="status">
                {successMsg}
              </div>
            )}

            <textarea
              placeholder={t.confessionPlaceholder}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError("");
                setSuccessMsg("");
              }}
              className="w-full h-44 p-4 bg-warm-bg/30 dark:bg-dark-bg/20 border border-warm-border dark:border-dark-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-xs leading-relaxed resize-none text-warm-text dark:text-white"
              aria-label="Write anonymous confession"
            />

            <div className="flex items-center justify-between text-[10px] text-warm-text/40 font-bold uppercase tracking-wider font-lato">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                <span>Claude Moderated</span>
              </span>
              <button
                type="submit"
                disabled={!content.trim()}
                className="py-2.5 px-5 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Post anonymously</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Confessions Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg text-warm-text dark:text-white">Active Wall Feed</h3>
          
          {feed.length === 0 ? (
            <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-8 rounded-3xl text-center text-warm-text/50 text-xs">
              No active confessions recorded. Write your first anonymous block above to seed the wall.
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <AnimatePresence>
                {feed.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-5 rounded-3xl shadow-sm space-y-3 relative group"
                  >
                    <p className="text-xs text-warm-text/90 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-warm-border/40 dark:border-dark-border/40">
                      <span className="text-[9px] text-warm-text/40 uppercase font-bold tracking-wider font-lato">
                        Logged anonymously
                      </span>

                      {/* Emoji reaction selector */}
                      <div className="flex items-center gap-1.5">
                        {post.reactions.map((r) => (
                          <button
                            key={r.emoji}
                            onClick={() => handleReact(post.id, r.emoji)}
                            className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                              r.count > 0
                                ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 text-amber-800 dark:text-amber-300"
                                : "bg-white dark:bg-dark-bg/40 border-warm-border/60 hover:bg-warm-bg"
                            }`}
                            aria-label={`React with ${r.emoji}, current count is ${r.count}`}
                          >
                            <span>{r.emoji}</span>
                            <span className="text-[10px] font-bold font-lato">{r.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
