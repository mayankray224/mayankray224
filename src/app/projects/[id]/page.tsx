"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProjects } from "@/lib/notion";
import { Project } from "@/lib/portfolioMockData";
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";

export default function DynamicProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the path corresponds to our highly custom static pages, let Next.js routing catch it.
    // However, if they are rendered here, we check:
    if (id === "nazaraana" || id === "crunchyroll-ai" || id === "testbook" || id === "blinkit" || id === "warner-bros-discovery") {
      // These have dedicated layout files, let's redirect to ensure visitors get the rich interactive components.
      return;
    }

    async function loadProject() {
      try {
        const allProjects = await getProjects();
        const found = allProjects.find((p) => p.slug === id || p.id === id);
        if (found) {
          setProject(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id, router]);

  // If redirecting/loading
  if (id === "nazaraana" || id === "crunchyroll-ai" || id === "testbook" || id === "blinkit" || id === "warner-bros-discovery") {
    return (
      <div className="min-h-screen bg-portfolio-bg flex items-center justify-center text-portfolio-gold font-mono text-xs">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="animate-spin" />
          Teleporting to custom interactive case study...
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-portfolio-bg flex items-center justify-center text-portfolio-gold font-mono text-xs">
        Loading project artifact...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-portfolio-bg flex flex-col items-center justify-center text-portfolio-textSec gap-4">
        <p className="font-cormorant italic text-lg">This project artifact does not exist in the Restricted vault...</p>
        <Link href="/" className="text-xs font-mono text-portfolio-gold hover:underline">
          Return to Sanctum
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-portfolio-bg text-portfolio-textSec font-inter pb-24">
      {/* Header */}
      <div className="border-b border-portfolio-card bg-portfolio-bgSec/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-portfolio-gold hover:text-white transition-colors text-xs font-mono tracking-widest uppercase">
          <ArrowLeft size={16} />
          Back to Sanctum
        </Link>
        <span className="font-mono text-[10px] text-portfolio-textSec/60">DYNAMIC PROJECT CARDS</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        
        {/* Hero Section */}
        <section className="space-y-6">
          <span className="font-mono text-xs tracking-widest text-portfolio-gold uppercase block">
            CMS Database Project
          </span>
          <h1 className="font-cinzel text-4xl md:text-5xl text-white font-bold tracking-wide">
            {project.title}
          </h1>
          <p className="font-cormorant italic text-xl md:text-2xl text-white leading-relaxed">
            {project.tagline}
          </p>

          {/* Metrics Scorecard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-portfolio-card/60">
            <div className="border border-portfolio-gold/25 bg-portfolio-gold/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-gold font-bold">CMS</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Source Database</div>
            </div>
            {project.metrics.efficiency !== undefined && (
              <div className="border border-portfolio-purple/20 bg-portfolio-purple/5 p-4 rounded-xl text-center">
                <div className="font-cinzel text-xl text-portfolio-purple font-bold">{project.metrics.efficiency}%</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Efficiency</div>
              </div>
            )}
            {project.metrics.alignment !== undefined && (
              <div className="border border-portfolio-blue/20 bg-portfolio-blue/5 p-4 rounded-xl text-center">
                <div className="font-cinzel text-xl text-portfolio-blue font-bold">{project.metrics.alignment}%</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Alignment</div>
              </div>
            )}
            {project.metrics.security !== undefined && (
              <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl text-center">
                <div className="font-cinzel text-xl text-emerald-400 font-bold">{project.metrics.security}%</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Security</div>
              </div>
            )}
          </div>
        </section>

        {/* 1. Problem */}
        <section className="space-y-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            1. Problem & Context
          </h2>
          <p className="leading-relaxed text-sm md:text-base">
            This project showcases tactical execution driven by Notion CMS sync. It maps features dynamically, resolving parameters against active customer requirements.
          </p>
        </section>

        {/* 2. User Persona & Research */}
        <section className="space-y-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            2. Persona & Discovery Research
          </h2>
          <p className="leading-relaxed text-sm md:text-base">
            Customer interview logs highlight friction in existing workflows, requiring streamlined metrics frameworks and automated checks.
          </p>
        </section>

        {/* 3. Prioritization & Metrics */}
        <section className="space-y-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            3. Prioritization & Metrics
          </h2>
          <p className="leading-relaxed text-sm md:text-base">
            We prioritized elements according to RICE metrics (Reach, Impact, Confidence, Effort) to balance engineering delivery speeds against customer delight factors.
          </p>
          <div className="bg-portfolio-bgSec border border-portfolio-card p-4 rounded-xl flex items-start gap-3">
            <TrendingUp className="text-portfolio-gold shrink-0 mt-0.5" size={16} />
            <p className="text-xs">
              <strong>Impact Summary:</strong> {project.metrics.impact || "No impact metric logged."}
            </p>
          </div>
        </section>

        {/* 4. Learnings & Next Steps */}
        <section className="space-y-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            4. Project Learnings
          </h2>
          <p className="leading-relaxed text-sm md:text-base">
            Phased rollout models confirm that simple, intuitive UI elements coupled with secure backends produce higher conversion and retention rates across various user groups.
          </p>
        </section>

      </div>
    </div>
  );
}
