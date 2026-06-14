"use client";
import React from "react";
import AppShell from "@/components/shared/AppShell";
import { Shield, Lock, Eye, Server, Trash2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-warm-text dark:text-white">Privacy Policy</h1>
            <p className="text-xs text-warm-text/50 dark:text-gray-400">Last updated: June 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-warm-text/80 dark:text-gray-300">
          <section className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-warm-border dark:border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-semibold text-warm-text dark:text-white">Our Core Commitment</h2>
            </div>
            <p className="text-sm leading-relaxed">
              Nazaraana was built on one non-negotiable principle: <strong className="text-orange-600">your emotional data belongs to you alone.</strong> We
              do not collect, transmit, sell, or share any personal information, journal entries, mood check-ins, or chat
              history with any third party — ever. Your story stays on your device.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-warm-border dark:border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-green-500" />
              <h2 className="text-base font-semibold text-warm-text dark:text-white">How is my data stored?</h2>
            </div>
            <p className="text-sm leading-relaxed mb-3">
              All data — your profile, journals, mood check-ins, chat messages, and wellness scores — is stored
              exclusively in your browser's <code className="bg-gray-100 dark:bg-dark-bg px-1 rounded text-xs">localStorage</code>.
              Nothing is sent to an external database. This means:
            </p>
            <ul className="space-y-2 text-sm list-none">
              {[
                "Your data never leaves your device.",
                "No user accounts exist on our servers.",
                "Clearing your browser data clears all Nazaraana data.",
                "There are no analytics trackers or advertising pixels.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-warm-border dark:border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-purple-500" />
              <h2 className="text-base font-semibold text-warm-text dark:text-white">BhalAI Conversations</h2>
            </div>
            <p className="text-sm leading-relaxed">
              When the optional AI features are enabled via an Anthropic API key, conversation messages are sent to
              Anthropic's API to generate responses. These are governed by{" "}
              <a href="https://www.anthropic.com/privacy" target="_blank" rel="noreferrer" className="text-orange-500 underline">
                Anthropic's Privacy Policy
              </a>. Without an API key, BhalAI runs in fully offline mock mode — no data ever leaves your device.
            </p>
          </section>

          <section className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-warm-border dark:border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="w-4 h-4 text-red-500" />
              <h2 className="text-base font-semibold text-warm-text dark:text-white">Your Right to Delete</h2>
            </div>
            <p className="text-sm leading-relaxed">
              You can permanently delete all your data at any time from <strong>Settings → Clear All Data</strong>. This
              wipes your profile, journals, check-ins, and chat history from localStorage. Since data never lives on our
              servers, there is no additional deletion request required.
            </p>
          </section>

          <section className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border border-orange-200 dark:border-orange-800">
            <h2 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">Mental Health Disclaimer</h2>
            <p className="text-sm text-orange-600 dark:text-orange-300 leading-relaxed">
              Nazaraana is an emotional support tool and is not a medical device or diagnostic platform. It should not
              replace professional mental health care. If you are in crisis, please contact iCall at{" "}
              <strong>9152987821</strong> or Vandrevala Foundation at <strong>1860-2662-345</strong>.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
