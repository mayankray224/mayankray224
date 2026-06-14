"use client";
import React from "react";
import AppShell from "@/components/shared/AppShell";
import { FileText } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using Nazaraana, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree, please do not use this application.",
  },
  {
    title: "2. Nature of the Service",
    content:
      "Nazaraana and its AI companion BhalAI are emotional support tools designed to help students reflect on their mental wellness. They are NOT a substitute for professional mental health care, therapy, counselling, or emergency services. Nazaraana makes no medical claims and provides no diagnoses.",
  },
  {
    title: "3. User Responsibilities",
    content:
      "You agree to use Nazaraana only for lawful, personal wellness purposes. You will not attempt to misuse the service to generate harmful content. You understand that all your data is stored locally on your device and you are responsible for managing it.",
  },
  {
    title: "4. Emergency Situations",
    content:
      "If you or someone you know is in immediate danger or experiencing a mental health crisis, please contact emergency services immediately. BhalAI is not equipped to handle emergencies. Crisis helplines: iCall — 9152987821 · Vandrevala Foundation — 1860-2662-345.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "All application code, design assets, and AI prompt architectures are the intellectual property of the Nazaraana team. You may not reproduce, redistribute, or commercialise any part of the application without explicit written permission.",
  },
  {
    title: "6. Limitation of Liability",
    content:
      "Nazaraana is provided 'as is' without warranties of any kind. The team behind Nazaraana is not liable for any emotional, psychological, or other harm resulting from the use of or reliance on any information provided by BhalAI or the application.",
  },
  {
    title: "7. Privacy",
    content:
      "Your privacy is protected as described in our Privacy Policy. All data remains on your device. We do not collect, sell, or share your personal information.",
  },
  {
    title: "8. Changes to Terms",
    content:
      "We reserve the right to update these Terms of Use at any time. Continued use of the application after changes constitutes acceptance of the new terms.",
  },
];

export default function TermsPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-card flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-warm-text dark:text-white">Terms of Use</h1>
            <p className="text-xs text-warm-text/50 dark:text-gray-400">Last updated: June 2026</p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-warm-border dark:border-dark-border"
            >
              <h2 className="text-sm font-semibold text-warm-text dark:text-white mb-2">{section.title}</h2>
              <p className="text-sm text-warm-text/70 dark:text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-warm-text/40 dark:text-gray-500">
          By using Nazaraana, you agree to these terms. For questions, reach us at{" "}
          <span className="text-orange-500">hello@nazaraana.ai</span>
        </p>
      </div>
    </AppShell>
  );
}
