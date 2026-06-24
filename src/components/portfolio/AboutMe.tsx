"use client";

import { useEffect, useState } from "react";
import { Sparkles, Brain, Cpu, Tv, UserCheck, ShieldAlert } from "lucide-react";

const hats = ["BUILDER?", "ANALYST?", "OPERATOR?", "FOUNDER?", "PROBLEM SOLVER?", "PRODUCT THINKER?"];

export default function AboutMe() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [hoverHat, setHoverHat] = useState(false);

  // Sorting Hat sequence animation
  useEffect(() => {
    if (isSorted) return;

    const interval = setInterval(() => {
      setActiveWordIndex((prev) => {
        if (prev === hats.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsSorted(true), 800); // Resolve to Product Builder
          return prev;
        }
        return prev + 1;
      });
    }, 450); // Speed of cycle

    return () => clearInterval(interval);
  }, [isSorted]);

  const handleResetSort = () => {
    setIsSorted(false);
    setActiveWordIndex(0);
  };

  return (
    <section
      className="relative min-h-screen w-full bg-portfolio-bgSec py-24 px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden border-t border-portfolio-card"
      id="sorting-hat"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-portfolio-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 z-10">
        
        {/* Left Side: The Sorting Hat Experience */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-[400px] border border-portfolio-gold/10 bg-portfolio-bg/40 backdrop-blur-md rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl">
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-portfolio-gold/30 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-portfolio-gold/30 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-portfolio-gold/30 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-portfolio-gold/30 rounded-br-lg" />

          {/* Interactive Sorting Hat Vector Icon */}
          <div
            className="relative cursor-pointer mb-8 transition-transform duration-500 hover:scale-105"
            onMouseEnter={() => setHoverHat(true)}
            onMouseLeave={() => setHoverHat(false)}
            onClick={handleResetSort}
            title="Click to resort!"
          >
            <div className={`w-32 h-32 flex items-center justify-center text-portfolio-gold transition-all duration-500 ${
              hoverHat || !isSorted ? "drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" : "drop-shadow-[0_0_4px_rgba(212,175,55,0.2)]"
            }`}>
              <svg viewBox="0 0 100 100" fill="none" className="w-24 h-24 stroke-portfolio-gold" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Custom Sorting Hat SVG */}
                <path d="M50 15 C38 35 44 48 20 65 L80 65 C56 48 62 35 50 15 Z" fill="rgba(6, 7, 10, 0.6)" />
                <path d="M12 75 Q50 68 88 75 C95 82 82 84 50 82 Q18 84 12 75 Z" fill="rgba(20, 19, 15, 0.8)" />
                {/* Eyes of the hat */}
                <path d="M42 48 Q45 44 47 48" strokeWidth="2" />
                <path d="M53 48 Q55 44 58 48" strokeWidth="2" />
                {/* Grumpy Mouth */}
                <path d="M45 56 Q50 59 55 55" strokeWidth="2" />
                {/* Patch */}
                <path d="M32 35 L38 33 L36 39 Z" />
              </svg>
            </div>
            <Sparkles className="absolute -top-2 -right-2 text-portfolio-gold animate-shimmer" size={20} />
          </div>

          <span className="font-mono text-[10px] tracking-[0.3em] text-portfolio-textSec/60 uppercase mb-4">
            The Sorting Hat Ceremony
          </span>

          {/* Sequence Switcher */}
          {!isSorted ? (
            <div className="flex flex-col items-center justify-center min-h-[80px]">
              <span className="font-mono text-xs text-portfolio-textSec/40 uppercase mb-1">Evaluating Soul...</span>
              <div className="flex flex-wrap justify-center gap-3 max-w-sm mt-2">
                {hats.map((word, i) => (
                  <span
                    key={word}
                    className={`font-cinzel text-xs md:text-sm tracking-widest px-3 py-1 border transition-all duration-300 rounded ${
                      activeWordIndex === i
                        ? "border-portfolio-gold text-portfolio-gold bg-portfolio-gold/5 scale-105 shadow-md shadow-portfolio-gold/5"
                        : "border-transparent text-portfolio-textSec/20"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center animate-fade-in duration-1000 min-h-[80px]">
              <span className="font-mono text-xs text-portfolio-purple tracking-widest uppercase mb-1">
                Sorted into House:
              </span>
              <h3 className="font-cinzel text-2xl md:text-4xl text-white font-extrabold tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse">
                PRODUCT BUILDER
              </h3>
              <button
                onClick={handleResetSort}
                className="mt-4 font-mono text-[9px] text-portfolio-gold/60 hover:text-portfolio-gold uppercase tracking-widest underline decoration-dotted transition-colors"
              >
                Sort Again
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Narrative & Key PM Metrics */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide mb-6">
            The Sorting Hat
          </h2>

          <div className="space-y-6 font-inter text-sm md:text-base text-portfolio-textSec leading-relaxed">
            <p>
              Rather than describing product management as a checklist of skills, Mayank Ray views it as a craft of continuous exploration and synthesis.
            </p>
            <p>
              As an <strong className="text-white">Ex-Deloitte Analyst</strong>, he engineered automation workflows and pipelines adopted across massive regional teams. As an <strong className="text-white">Operations Manager</strong>, he managed logistics constraints directly on the floor, translating manual bottlenecks into simple software systems.
            </p>
            <p>
              Today, he acts as an <strong className="text-portfolio-gold">AI Product Builder</strong>, creating wellness companions like <strong className="text-portfolio-purple font-medium">Nazaraana</strong>, combining advanced prompt architectures with strict, localized trust & privacy patterns.
            </p>
          </div>

          {/* Interests Icons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 border border-portfolio-card bg-portfolio-bgSec px-3 py-1.5 rounded-full text-xs font-mono text-white">
              <Brain size={12} className="text-portfolio-purple" />
              User Psychology
            </div>
            <div className="flex items-center gap-2 border border-portfolio-card bg-portfolio-bgSec px-3 py-1.5 rounded-full text-xs font-mono text-white">
              <Cpu size={12} className="text-portfolio-gold" />
              AI Engines
            </div>
            <div className="flex items-center gap-2 border border-portfolio-card bg-portfolio-bgSec px-3 py-1.5 rounded-full text-xs font-mono text-white">
              <Tv size={12} className="text-portfolio-blue" />
              Streaming UX
            </div>
          </div>

          {/* Key Stats Block */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="border border-portfolio-gold/20 bg-portfolio-bg/30 p-4 rounded-xl text-center shadow-lg">
              <div className="font-cinzel text-xl md:text-2xl text-portfolio-gold font-bold">2+ Years</div>
              <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">
                Exp. Domain
              </div>
            </div>

            <div className="border border-portfolio-gold/20 bg-portfolio-bg/30 p-4 rounded-xl text-center shadow-lg">
              <div className="font-cinzel text-xl md:text-2xl text-portfolio-purple font-bold">200+</div>
              <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">
                Users Impacted
              </div>
            </div>

            <div className="border border-portfolio-gold/20 bg-portfolio-bg/30 p-4 rounded-xl text-center shadow-lg">
              <div className="font-cinzel text-xl md:text-2xl text-portfolio-blue font-bold">1 Shipped</div>
              <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">
                GenAI Product
              </div>
            </div>

            <div className="border border-portfolio-gold/20 bg-portfolio-bg/30 p-4 rounded-xl text-center shadow-lg">
              <div className="font-cinzel text-xl md:text-2xl text-white font-bold">Multiple</div>
              <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">
                PM Artifacts
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Core Strengths Block */}
      <div className="w-full max-w-6xl mt-20 pt-16 border-t border-portfolio-card/40 z-10">
        <h3 className="font-cinzel text-xs text-portfolio-gold tracking-[0.2em] uppercase text-center mb-10">
          Core Strengths & Capabilities
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="group border border-portfolio-card bg-portfolio-bg/40 backdrop-blur-sm p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-gold/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            <h4 className="font-cinzel text-xs text-white font-bold tracking-wide group-hover:text-portfolio-gold transition-colors">Product Discovery</h4>
            <p className="font-inter text-[10px] text-portfolio-textSec mt-2 leading-relaxed">
              Conducting customer interviews, user journey maps, and wireframing MVPs.
            </p>
          </div>

          <div className="group border border-portfolio-card bg-portfolio-bg/40 backdrop-blur-sm p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-purple/40 hover:shadow-[0_0_15px_rgba(139,92,246,0.05)]">
            <h4 className="font-cinzel text-xs text-white font-bold tracking-wide group-hover:text-portfolio-purple transition-colors">Stakeholder Management</h4>
            <p className="font-inter text-[10px] text-portfolio-textSec mt-2 leading-relaxed">
              Negotiating requirements between engineering, design, and operations teams.
            </p>
          </div>

          <div className="group border border-portfolio-card bg-portfolio-bg/40 backdrop-blur-sm p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-blue/40 hover:shadow-[0_0_15px_rgba(96,165,250,0.05)]">
            <h4 className="font-cinzel text-xs text-white font-bold tracking-wide group-hover:text-portfolio-blue transition-colors">Problem Solving</h4>
            <p className="font-inter text-[10px] text-portfolio-textSec mt-2 leading-relaxed">
              Deconstructing manual operational log sheets into automated pipelines.
            </p>
          </div>

          <div className="group border border-portfolio-card bg-portfolio-bg/40 backdrop-blur-sm p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-gold/40 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)]">
            <h4 className="font-cinzel text-xs text-white font-bold tracking-wide group-hover:text-portfolio-gold transition-colors">Data-Informed Decisions</h4>
            <p className="font-inter text-[10px] text-portfolio-textSec mt-2 leading-relaxed">
              Writing database metrics queries (SQL/ETL) to bypass bias.
            </p>
          </div>

          <div className="group border border-portfolio-card bg-portfolio-bg/40 backdrop-blur-sm p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-purple/40 hover:shadow-[0_0_15px_rgba(139,92,246,0.05)]">
            <h4 className="font-cinzel text-xs text-white font-bold tracking-wide group-hover:text-portfolio-purple transition-colors">AI Product Development</h4>
            <p className="font-inter text-[10px] text-portfolio-textSec mt-2 leading-relaxed">
              Formulating system prompt constraints and latency guardrails.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
