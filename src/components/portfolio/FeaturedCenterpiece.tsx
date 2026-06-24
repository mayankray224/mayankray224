"use client";

import Link from "next/link";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { Sparkles, ArrowRight, Brain, ShieldCheck, Heart } from "lucide-react";

export default function FeaturedCenterpiece() {
  const addVisitedProject = usePortfolioStore((state) => state.addVisitedProject);

  return (
    <section className="relative w-full bg-portfolio-bg py-16 px-6 md:px-12 flex flex-col items-center overflow-hidden border-t border-portfolio-card/45">
      {/* Ambient background glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-portfolio-gold/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10">
        <div className="border border-portfolio-gold bg-[#07090e]/95 shadow-[0_0_35px_rgba(212,175,55,0.15)] hover:shadow-[0_0_45px_rgba(212,175,55,0.25)] rounded-3xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5">
          
          {/* Label top-left */}
          <div className="absolute top-0 left-0 bg-portfolio-gold text-portfolio-bg font-mono text-[9px] font-extrabold tracking-[0.25em] px-5 py-2 uppercase rounded-br-2xl">
            Featured Build
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 border border-portfolio-gold/20 bg-portfolio-gold/10 backdrop-blur-md rounded-full">
            <Sparkles size={12} className="text-portfolio-gold animate-pulse" />
            <span className="font-mono text-[9px] tracking-wider text-portfolio-gold font-bold uppercase">
              PromptWars Ahmedabad 2026 • 84.81 Overall Score
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
            {/* Left Column: Summary */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-portfolio-gold tracking-widest uppercase">
                    AI Wellness Product
                  </span>
                  <span className="h-2.5 w-[1px] bg-portfolio-card" />
                  <span className="font-mono text-[10px] text-portfolio-textSec/65">
                    8 min read
                  </span>
                </div>
                <h3 className="font-cinzel text-3xl md:text-4xl text-white font-extrabold tracking-wide">
                  Nazaraana (नज़राना)
                </h3>
                <p className="font-cormorant italic text-md md:text-lg text-portfolio-gold leading-relaxed">
                  AI Mental Wellness Companion for Indian Students
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-portfolio-card/45">
                <div>
                  <h4 className="font-cinzel text-[10px] text-white tracking-wider uppercase font-bold">The Problem</h4>
                  <p className="font-inter text-xs text-portfolio-textSec mt-1.5 leading-relaxed">
                    JEE/NEET aspirants face extreme isolation and mental load, with zero private or culturally empathetic stress tracking support.
                  </p>
                </div>
                <div>
                  <h4 className="font-cinzel text-[10px] text-portfolio-gold tracking-wider uppercase font-bold">The Solution</h4>
                  <p className="font-inter text-xs text-portfolio-textSec mt-1.5 leading-relaxed">
                    An offline-first wellness portal pairing BhalAI (empathetic multilingual Hinglish companion) with local journal sentiment checks.
                  </p>
                </div>
              </div>

              {/* Core Frameworks */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Double Diamond Discovery", "Dynamic Context Prompting", "Zustand Local State Persistence"].map((fw) => (
                  <span key={fw} className="text-[9px] font-mono border border-portfolio-card bg-portfolio-bgSec px-2 py-0.5 rounded text-slate-350">
                    {fw}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Key metrics and CTA */}
            <div className="lg:col-span-2 flex flex-col justify-between border-l border-portfolio-card/40 lg:pl-8 gap-6">
              <div>
                <h4 className="font-cinzel text-[10px] text-portfolio-textSec/80 tracking-wider uppercase mb-3">Verification Scorecard</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-2.5 rounded-xl text-center">
                    <div className="font-cinzel text-sm text-portfolio-gold font-bold">100%</div>
                    <div className="text-[8px] uppercase font-mono tracking-wider text-slate-500 mt-0.5">Efficiency</div>
                  </div>
                  <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-2.5 rounded-xl text-center">
                    <div className="font-cinzel text-sm text-portfolio-purple font-bold">94%</div>
                    <div className="text-[8px] uppercase font-mono tracking-wider text-slate-500 mt-0.5">Alignment</div>
                  </div>
                  <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-2.5 rounded-xl text-center">
                    <div className="font-cinzel text-sm text-portfolio-blue font-bold">96%</div>
                    <div className="text-[8px] uppercase font-mono tracking-wider text-slate-500 mt-0.5">Security</div>
                  </div>
                </div>

                <div className="mt-4 p-4 border border-portfolio-purple/20 bg-portfolio-purple/5 rounded-xl">
                  <div className="text-[9px] font-mono uppercase text-portfolio-purple tracking-widest font-semibold mb-1">Impact Output</div>
                  <p className="font-inter text-xs text-white leading-relaxed italic">
                    "Adopted by 200+ mock exam takers, driving 35% weekly retention in distress moderation."
                  </p>
                </div>
              </div>

              <Link
                href="/projects/nazaraana"
                onClick={() => addVisitedProject("nazaraana")}
                className="w-full flex items-center justify-center gap-2 py-3 bg-portfolio-gold hover:bg-transparent border border-portfolio-gold text-portfolio-bg hover:text-portfolio-gold font-inter text-xs tracking-widest uppercase font-semibold transition-all duration-300 rounded-lg shadow-lg"
              >
                View Case Study
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
