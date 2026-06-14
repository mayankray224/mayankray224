"use client";

import React, { useEffect, useState, useRef } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { generateWeeklyReportAction } from "@/app/actions";
import { Sparkles, Download, Share2, FileText, CheckCircle } from "lucide-react";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";

export default function ReportsPage() {
  const store = useStore();
  const hydrated = useHydration();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter local reports for current user
  const userReports = store.localWeeklyReports.filter((r) => r.userId === store.userId);
  const userCheckins = store.localMoodCheckins.filter((c) => c.userId === store.userId);
  const userJournals = store.localJournals.filter((j) => j.userId === store.userId);

  const reportText = userReports.length > 0 ? userReports[0].reportContent : "";

  // Trigger weekly report generation via Claude
  const handleGenerateReport = async () => {
    if (userCheckins.length === 0 && userJournals.length === 0) {
      setError("Please perform a check-in or journal entry before generating a report.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const checkinStrings = userCheckins.slice(0, 7).map(
        (c) => `Stress: ${c.stressScore}/10, Energy: ${c.energyScore}/10, Sleep: ${c.sleepHours}h, Mood text: "${c.moodText || "None"}"`
      );
      const journalStrings = userJournals.slice(0, 5).map(
        (j) => `Journal content: "${j.content.substring(0, 150)}..." [Stress score: ${j.stressScore}/100]`
      );

      const res = await generateWeeklyReportAction({
        name: store.name,
        examType: store.examType,
        checkins: checkinStrings,
        journals: journalStrings,
      });

      if (res && res.reportContent) {
        store.addWeeklyReport(res.reportContent);
      } else {
        throw new Error("Empty report received.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Canvas PNG downloader
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, "#FDF8F2");
    gradient.addColorStop(1, "#FFF7EC");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Border
    ctx.strokeStyle = "#F5E6D3";
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 786, 486);

    // Header logo
    ctx.fillStyle = "#F4A426";
    ctx.fillRect(40, 40, 45, 45);
    
    ctx.fillStyle = "white";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("न", 53, 72);

    ctx.fillStyle = "#2C2C2C";
    ctx.font = "bold 28px Georgia, serif";
    ctx.fillText("Nazaraana", 100, 72);

    ctx.font = "normal 14px sans-serif";
    ctx.fillStyle = "#7DB99A";
    ctx.fillText("Weekly Wellness Reflection", 600, 70);

    // Profile Details
    ctx.fillStyle = "#2C2C2C";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(`Kaise ho, ${store.name || "Beta"}? 🌸`, 40, 150);

    ctx.fillStyle = "#7D7D7D";
    ctx.font = "normal 16px sans-serif";
    ctx.fillText(`Target Exam: ${store.examType || "JEE/NEET Prep"}`, 40, 185);

    // Streak Count Badge
    ctx.fillStyle = "#FFE6C2";
    ctx.beginPath();
    ctx.roundRect(40, 210, 170, 36, 18);
    ctx.fill();

    ctx.fillStyle = "#D98616";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`🔥 STREAK: ${store.streakCount} DAYS`, 56, 233);

    // Reflection Text card background
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(40, 270, 720, 180, 24);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#F5E6D3";
    ctx.stroke();

    ctx.fillStyle = "#F4A426";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("BHALAI'S MESSAGE OF CARE FOR YOU", 65, 305);

    ctx.fillStyle = "#2C2C2C";
    ctx.font = "italic 16px Georgia, serif";
    
    const textLines = [
      `"Syllabus backlogs are a part of every student's journey. Do not compare your`,
      `day 1 with someone else's day 100. You are doing your absolute best in a`,
      `very demanding phase of life. Sleep well today, BhalAI is proud of your effort."`
    ];
    textLines.forEach((line, index) => {
      ctx.fillText(line, 65, 345 + index * 28);
    });

    // Save as link and download
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `nazaraana-weekly-report-${store.name || "student"}.png`;
    link.href = dataURL;
    link.click();
  };

  if (!hydrated) {
    return <PageSkeleton />;
  }

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-text dark:text-white">{t.reports}</h1>
          <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
            Narrative wellness reflections generated by BhalAI based on your preparation diary logs.
          </p>
        </div>

        {reportText && (
          <button
            onClick={handleDownloadPng}
            className="py-2.5 px-5 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start"
            aria-label="Download Weekly reflection report as PNG card"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download PNG Card</span>
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Markdown Narrative Report */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 md:p-8 rounded-3xl shadow-sm warm-shadow">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-warm-text/50">BhalAI is writing your reflection...</span>
              </div>
            ) : reportText ? (
              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-warm-text/90 dark:text-gray-200 leading-relaxed">
                <div className="whitespace-pre-line">
                  {reportText}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <FileText className="w-12 h-12 text-warm-text/40 mx-auto" aria-hidden="true" />
                <p className="text-xs text-warm-text/50 max-w-xs mx-auto leading-relaxed">
                  No reflection generated yet. Check-in or write a journal entry to generate your weekly report.
                </p>
                {error && (
                  <p className="text-xs text-rose-500 font-bold" role="alert">{error}</p>
                )}
                <button
                  onClick={handleGenerateReport}
                  className="py-2.5 px-6 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-xs font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  Generate Weekly Report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Shareable Graphic Card Preview */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-warm-text dark:text-white">Shareable Reflection</h3>
          
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-warm-text/40 font-bold uppercase font-lato">Reflection Card</span>
              <Share2 className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
            </div>

            <div className="space-y-4 py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mx-auto text-xl font-bold animate-pulse">
                न
              </div>
              <h4 className="font-extrabold text-base text-warm-text dark:text-white">
                Weekly Wellness Reflection
              </h4>
              <p className="text-xs text-warm-text/70 dark:text-gray-300 px-2 leading-relaxed">
                "Do not compare your day 1 with someone else's day 100. Your worth is more than a rank."
              </p>
            </div>

            <button
              onClick={handleDownloadPng}
              disabled={!reportText}
              className="w-full text-center py-2.5 bg-warm-bg dark:bg-dark-bg border border-warm-border dark:border-dark-border text-warm-text/80 dark:text-gray-300 text-xs rounded-xl font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-primary" aria-hidden="true" />
              Download & Share
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
