"use client";
import React, { useState } from "react";
import AppShell from "@/components/shared/AppShell";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "How is my data stored?",
    a: "All your data — journals, mood check-ins, chat history, and your profile — is stored exclusively in your browser's localStorage on your own device. Nothing is transmitted to any server. Clearing your browser data will erase all Nazaraana data. We have no access to your data at any time.",
  },
  {
    q: "Can BhalAI replace therapy?",
    a: "No. BhalAI is a supportive wellness companion, not a therapist or mental health professional. It cannot diagnose mental health conditions, prescribe treatments, or provide clinical therapy. If you are struggling significantly with your mental health, please seek support from a qualified mental health professional. BhalAI can complement, but never replace, professional care.",
  },
  {
    q: "How does crisis detection work?",
    a: "BhalAI continuously monitors your messages and journal entries for distress signals — phrases indicating self-harm intent, hopelessness, suicidal ideation, or severe despair. When such signals are detected, BhalAI immediately shifts to compassionate de-escalation language and surfaces the iCall helpline (9152987821) and Vandrevala Foundation (1860-2662-345). A crisis flag is stored in your history so the heatmap and weekly report can acknowledge that day with appropriate care.",
  },
  {
    q: "How are stress scores generated?",
    a: "Stress scores are derived from two sources: (1) Your daily mood check-ins, where you rate your stress, energy, sleep, and confidence on sliders from 1-10. These are scaled to a 0-100 index. (2) Your journal entries, which are analysed for emotional keywords, detected triggers (e.g. mock test anxiety, family pressure), and sentiment cues. Both sources are combined into a weighted daily stress score that feeds the heatmap, dashboard, and weekly report.",
  },
  {
    q: "Does BhalAI remember past conversations?",
    a: "Yes. BhalAI has a memory layer that reads your recent journal entries and mood check-ins and references them during conversations. For example, if you previously wrote about exam backlog stress, BhalAI may mention it naturally in a later conversation. This memory is built from your local store data — nothing is stored externally.",
  },
  {
    q: "What languages does BhalAI support?",
    a: "BhalAI supports English, Hindi, Hinglish (code-switching), Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, and Gujarati. You can set your preferred language during onboarding. BhalAI also naturally code-switches — mixing Hindi and English the way Indian students actually speak.",
  },
  {
    q: "Is Nazaraana free to use?",
    a: "Yes, Nazaraana is completely free to use in offline/mock mode. Advanced AI features (real Claude-powered responses) require an Anthropic API key, which you can obtain from anthropic.com. The API key is stored only in your environment file and never transmitted to Nazaraana's servers.",
  },
  {
    q: "What should I do if I am in a mental health crisis?",
    a: "Please contact emergency support immediately. Do not rely solely on BhalAI in a crisis. Reach out to: iCall at 9152987821 (Mon–Sat, 8am–10pm) or Vandrevala Foundation at 1860-2662-345 (24/7). If you are in immediate danger, call emergency services (112 in India).",
  },
  {
    q: "How do I delete my data?",
    a: "Go to Settings → scroll to the bottom → click 'Clear All Data'. This permanently removes all your journals, check-ins, chat history, and profile from localStorage. Since your data never lives on our servers, no further action is needed.",
  },
  {
    q: "What is the Confession Wall?",
    a: "The Confession Wall is an anonymous space where students can post short, unfiltered thoughts or feelings. Posts are moderated for safety and community members can react with emoji support buttons. It is designed to reduce the isolation of exam prep by creating a sense of shared experience.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-warm-border dark:border-dark-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-warm-bg/30 dark:hover:bg-dark-bg/30 transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-warm-text dark:text-white pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-warm-text/40 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-warm-border/50 dark:border-dark-border/50 pt-3">
          <p className="text-sm text-warm-text/70 dark:text-gray-300 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-warm-text dark:text-white">Frequently Asked Questions</h1>
            <p className="text-xs text-warm-text/50 dark:text-gray-400">Everything you need to know about Nazaraana & BhalAI</p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border border-orange-200 dark:border-orange-800 text-center">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Still have a question?{" "}
            <span className="font-semibold">Write in your Mann Ki Diary</span> or{" "}
            <span className="font-semibold">chat with BhalAI</span> — we're here 24/7.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
