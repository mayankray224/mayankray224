"use client";

import React, { useEffect, useState, useRef } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { fetchOrCreateWeeklyReport } from "@/app/actions";
import { authService } from "@/lib/authService";
import { Sparkles, Download, Share2, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const store = useStore();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const isDb = await authService.isDbAvailable();
        if (isDb) {
          const report = await fetchOrCreateWeeklyReport();
          setReportText(report.reportContent);
        } else {
          if (store.localWeeklyReports && store.localWeeklyReports.length > 0) {
            setReportText(store.localWeeklyReports[0].narrative);
          } else {
            const report = await fetchOrCreateWeeklyReport();
            setReportText(report.reportContent);
            store.addLocalWeeklyReport({
              id: report.id || "local-report-" + Math.random().toString(),
              userId: store.currentUser?.id || "demo-user",
              weekRange: "Past 7 Days",
              narrative: report.reportContent,
              stressScore: store.mentalReadinessScore,
              createdAt: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.warn("Failed to load database weekly report, loading fallback:", err);
        if (store.localWeeklyReports && store.localWeeklyReports.length > 0) {
          setReportText(store.localWeeklyReports[0].narrative);
        } else {
          setReportText("Syllabus is heavy, but BhalAI is proud of your progress. Take a deep breath and keep going. Your mental peace is what matters.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [store.localWeeklyReports]);

  // HTML5 Canvas renderer to generate a shareable PNG card
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution dimensions for premium feel
    canvas.width = 800;
    canvas.height = 500;

    // 1. Draw warm cream background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, "#FDF8F2");
    gradient.addColorStop(1, "#FFF7EC");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // 2. Draw border
    ctx.strokeStyle = "#F5E6D3";
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 786, 486);

    // 3. Draw branding header
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

    // 4. Draw Student Profile info
    ctx.fillStyle = "#2C2C2C";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(`Kaise ho, ${store.userName || "Beta"}? 🌸`, 40, 150);

    ctx.fillStyle = "#7D7D7D";
    ctx.font = "normal 16px sans-serif";
    ctx.fillText(`Target Exam: ${store.selectedExams.join(", ") || "JEE/NEET/UPSC Prep"}`, 40, 185);

    // 5. Draw active streak count
    ctx.fillStyle = "#FFE6C2";
    ctx.beginPath();
    ctx.roundRect(40, 210, 170, 36, 18);
    ctx.fill();

    ctx.fillStyle = "#D98616";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`🔥 STREAK: ${store.streakCount} DAYS`, 56, 233);

    // 6. Draw BhalAI Message of Care
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
    
    // Draw text wrap
    const textLines = [
      `"Syllabus backlogs are a part of every student's journey. Do not compare your`,
      `day 1 with someone else's day 100. You are doing your absolute best in a`,
      `very demanding phase of life. Sleep well today, BhalAI is proud of your effort."`
    ];
    textLines.forEach((line, index) => {
      ctx.fillText(line, 65, 345 + index * 28);
    });

    // 7. Trigger download link
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `nazaraana-weekly-report-${store.userName || "student"}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-warm-text dark:text-white">{t.reports}</h1>
          <p className="text-sm text-warm-text/60 dark:text-gray-400 mt-1">
            Narrative wellness reflections generated by BhalAI based on your preparation diary logs.
          </p>
        </div>

        <button
          onClick={handleDownloadPng}
          disabled={loading}
          className="py-2.5 px-5 bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG Card</span>
        </button>
      </div>

      {/* Hidden canvas for background PNG renders */}
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
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-warm-text/90 dark:text-gray-200 leading-relaxed">
                {/* Render report content simply formatted */}
                <div className="whitespace-pre-line">
                  {reportText}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Shareable Graphic Card Preview */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-warm-text dark:text-white">Shareable Reflection</h3>
          
          <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between relative overflow-hidden">
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-warm-text/40 font-bold uppercase font-lato">Reflection Card</span>
              <Share2 className="w-4.5 h-4.5 text-primary" />
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
              disabled={loading}
              className="w-full text-center py-2.5 bg-warm-bg dark:bg-dark-bg border border-warm-border dark:border-dark-border text-warm-text/80 dark:text-gray-300 text-xs rounded-xl font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-primary" />
              Download & Share
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
