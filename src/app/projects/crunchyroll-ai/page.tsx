"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Sliders, Play, Zap, ShieldAlert, BarChart3, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FeatureRow {
  id: string;
  name: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
}

export default function CrunchyrollCaseStudy() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showInterviewBreakdown, setShowInterviewBreakdown] = useState(false);
  
  // Monitor scroll for progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [riceFeatures, setRiceFeatures] = useState<FeatureRow[]>([
    { id: "mood", name: "1. Interactive Mood Emoji Classifier", reach: 8, impact: 2, confidence: 90, effort: 3 },
    { id: "context", name: "2. Late-Night Chill Watch Filter", reach: 6, impact: 3, confidence: 75, effort: 5 },
    { id: "social", name: "3. Social Cohort (Friends Watch Now)", reach: 4, impact: 1, confidence: 50, effort: 8 }
  ]);

  const calculateRice = (row: FeatureRow) => {
    // RICE Formula: (Reach * Impact * Confidence) / Effort
    const score = (row.reach * 100000 * row.impact * (row.confidence / 100)) / row.effort;
    return Math.round(score);
  };

  const handleSliderChange = (id: string, field: keyof FeatureRow, val: number) => {
    setRiceFeatures((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: val };
        }
        return row;
      })
    );
  };

  // Watch flow segment step hover
  const [activeFlowStep, setActiveFlowStep] = useState(0);

  const recommendationFlow = [
    { title: "Raw Context Logs", desc: "System scrapes client: Current time (11:30 PM), local weather (rainy), recent watch speed (paused 2x)." },
    { title: "Metadata Vectorization", desc: "Anime database nodes mapped by intensity index (comfort vs Shonen fight loops)." },
    { title: "Context Transformer Model", desc: "Weights applied: Late night + rain = high romance/slice-of-life similarity multiplier." },
    { title: "Recommendation Output", desc: "Serves 'Laid-Back Camp' module as top tier card on Crunchyroll home screen." }
  ];

  return (
    <div className="min-h-screen bg-portfolio-bg text-portfolio-textSec font-inter pb-24">
      {/* Top Banner with scroll progress bar */}
      <div className="border-b border-portfolio-card bg-portfolio-bgSec/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-portfolio-gold hover:text-white transition-colors text-xs font-mono tracking-widest uppercase">
          <ArrowLeft size={16} />
          Back to Sanctum
        </Link>
        <span className="font-mono text-[10px] text-portfolio-textSec/60">CASE STUDY: CRUNCHYROLL AI</span>
        
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-portfolio-gold transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      {/* Sticky Quick Jump (horizontal scrollable on mobile) */}
      <div className="bg-portfolio-bgSec/40 border-b border-portfolio-card py-2.5 px-6 sticky top-[53px] z-20 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-5 text-[10px] font-mono whitespace-nowrap">
        <a href="#prd" className="text-portfolio-textSec hover:text-portfolio-gold">1. PRD Nodes</a>
        <a href="#flow" className="text-portfolio-textSec hover:text-portfolio-gold">2. Engine Flow</a>
        <a href="#rice" className="text-portfolio-textSec hover:text-portfolio-gold font-bold text-portfolio-gold">3. Interactive RICE</a>
        <a href="#interview" className="text-portfolio-textSec hover:text-portfolio-gold">4. PM Breakdown</a>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Project Hero */}
        <section className="space-y-6">
          <span className="font-mono text-xs tracking-widest text-portfolio-purple uppercase block">AI & Streaming Case Study</span>
          <h1 className="font-cinzel text-4xl md:text-5xl text-white font-extrabold tracking-wide">
            Crunchyroll AI Recommendation Engine
          </h1>
          <p className="font-cormorant italic text-xl md:text-2xl text-white">
            Designing a context-aware neural routing system to match active viewer mood vibes and boost session watch times.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-portfolio-card/60">
            <div className="border border-portfolio-purple/30 bg-portfolio-purple/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-purple font-bold">24%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Discovery Boost</div>
            </div>
            <div className="border border-portfolio-gold/30 bg-portfolio-gold/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-gold font-bold">+15%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Session Length</div>
            </div>
            <div className="border border-portfolio-blue/30 bg-portfolio-blue/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-blue font-bold">120K</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Simulated Cohort</div>
            </div>
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-emerald-400 font-bold">-8%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Homepage Bounce</div>
            </div>
          </div>
        </section>

        {/* 1. PRD Frame */}
        <section id="prd" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            1. PRD: Contextual Recommendation Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="border border-portfolio-card bg-portfolio-bgSec p-5 rounded-xl space-y-2">
              <div className="text-portfolio-purple font-mono text-xs uppercase tracking-wider font-bold">The Goal</div>
              <p className="text-xs leading-relaxed text-slate-300">
                Increase monthly subscriber viewing sessions by dynamically matching recommendations to current localized watches.
              </p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec p-5 rounded-xl space-y-2">
              <div className="text-portfolio-gold font-mono text-xs uppercase tracking-wider font-bold">The Persona</div>
              <p className="text-xs leading-relaxed text-slate-300">
                Aman, a 19yo student watching Shonen fighting series on weekends vs. Riya, a 24yo working PM looking for cozy slices late-night.
              </p>
            </div>
            <div className="border border-portfolio-blue/30 bg-portfolio-blue/5 p-5 rounded-xl space-y-2">
              <div className="text-portfolio-blue font-mono text-xs uppercase tracking-wider font-bold">The Risk</div>
              <p className="text-xs leading-relaxed text-slate-300">
                Over-indexing on current weather context might prevent discovery of unrelated classics (e.g. recommending only slow series on rainy days).
              </p>
            </div>
          </div>
        </section>

        {/* 2. Anime-Inspired Vector Flow chart */}
        <section id="flow" className="space-y-6 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            2. Recommendation Engine Flow
          </h2>
          <p className="text-sm">Hover over each module to trace how raw client variables translate into categorized anime suggestions:</p>

          <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {recommendationFlow.map((step, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveFlowStep(idx)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                    activeFlowStep === idx
                      ? "border-portfolio-purple bg-portfolio-purple/5 scale-105 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                      : "border-portfolio-card bg-portfolio-bgSec/35 hover:border-portfolio-card/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] text-portfolio-purple uppercase">Node {idx + 1}</span>
                    <Play size={10} className="text-portfolio-purple/60" />
                  </div>
                  <h4 className="font-cinzel text-xs text-white font-semibold">{step.title}</h4>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-portfolio-card bg-portfolio-bg p-5 rounded-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-portfolio-purple/15 flex items-center justify-center text-portfolio-purple shrink-0 animate-pulse">
                <Sliders size={20} />
              </div>
              <div>
                <h5 className="font-cinzel text-sm text-white font-bold">{recommendationFlow[activeFlowStep].title}</h5>
                <p className="font-inter text-xs text-portfolio-textSec mt-1.5 leading-relaxed">
                  {recommendationFlow[activeFlowStep].desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive RICE Matrix Prioritizer */}
        <section id="rice" className="space-y-6 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
              3. Interactive RICE Prioritization Calculator
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-portfolio-purple/10 border border-portfolio-purple/30 rounded-full text-portfolio-purple font-mono text-[9px] uppercase font-semibold">
              <Sliders size={10} />
              RICE Simulator
            </div>
          </div>
          <p className="text-sm">
            Adjust features dynamically (e.g. increase Reach or scale Effort) to see how RICE indexes update in real-time. Reach values are represented in hundreds of thousands of active viewers:
          </p>

          <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl space-y-6">
            <div className="space-y-6">
              {riceFeatures.map((row) => (
                <div key={row.id} className="border border-portfolio-card bg-portfolio-bg p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h4 className="font-cinzel text-xs text-white font-bold uppercase">{row.name}</h4>
                    <span className="font-mono text-xs text-portfolio-purple font-extrabold bg-portfolio-purple/10 border border-portfolio-purple/20 px-3 py-1 rounded">
                      Score: {calculateRice(row).toLocaleString()}
                    </span>
                  </div>

                  {/* Sliders deck */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-slate-400 mb-1">
                        <span>Reach</span>
                        <span>{row.reach * 100}K</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={row.reach}
                        onChange={(e) => handleSliderChange(row.id, "reach", parseInt(e.target.value))}
                        className="w-full h-1 bg-portfolio-card rounded-lg appearance-none cursor-pointer accent-portfolio-purple"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-slate-400 mb-1">
                        <span>Impact</span>
                        <span>{row.impact}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.5"
                        value={row.impact}
                        onChange={(e) => handleSliderChange(row.id, "impact", parseFloat(e.target.value))}
                        className="w-full h-1 bg-portfolio-card rounded-lg appearance-none cursor-pointer accent-portfolio-purple"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-slate-400 mb-1">
                        <span>Confidence</span>
                        <span>{row.confidence}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        step="5"
                        value={row.confidence}
                        onChange={(e) => handleSliderChange(row.id, "confidence", parseInt(e.target.value))}
                        className="w-full h-1 bg-portfolio-card rounded-lg appearance-none cursor-pointer accent-portfolio-purple"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-slate-400 mb-1">
                        <span>Effort (wks)</span>
                        <span>{row.effort} wks</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={row.effort}
                        onChange={(e) => handleSliderChange(row.id, "effort", parseInt(e.target.value))}
                        className="w-full h-1 bg-portfolio-card rounded-lg appearance-none cursor-pointer accent-portfolio-purple"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <div className="bg-portfolio-purple/5 border border-portfolio-purple/20 p-4 rounded-xl">
              <p className="font-inter text-xs text-portfolio-textSec leading-relaxed">
                <strong>PM Thinking Note:</strong> Dynamic RICE matrices ensure prioritization decisions are quantifiable. By adjusting the Reach or Effort sliders, you simulate the exact discussions PMs coordinate with engineering leads to evaluate bandwidth boundaries.
              </p>
            </div>
          </div>
        </section>

        {/* PM Interview Breakdown Accordion */}
        <section id="interview" className="border border-portfolio-purple/20 bg-portfolio-purple/5 rounded-2xl overflow-hidden pt-2">
          <div
            onClick={() => setShowInterviewBreakdown(!showInterviewBreakdown)}
            className="flex items-center justify-between p-6 cursor-pointer select-none bg-portfolio-purple/10 hover:bg-portfolio-purple/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="text-portfolio-purple" size={20} />
              <div>
                <h3 className="font-cinzel text-md text-white font-bold tracking-wide">PM Interview Breakdown</h3>
                <p className="text-[10px] text-portfolio-purple font-mono uppercase tracking-wider mt-0.5">Core Product Frameworks</p>
              </div>
            </div>
            {showInterviewBreakdown ? <ChevronUp className="text-portfolio-purple" size={18} /> : <ChevronDown className="text-portfolio-purple" size={18} />}
          </div>

          {showInterviewBreakdown && (
            <div className="p-6 border-t border-portfolio-purple/20 space-y-6 text-xs md:text-sm text-portfolio-textSec leading-relaxed animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Problem Statement</strong>
                  <p>Collaborative recommendations ignore transient user emotions, failing to differentiate between late-night cozy watch habits vs afternoon high-energy sessions.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Target User Segment</strong>
                  <p>Shonen fight loop fans watching on study breaks vs cozy rom-com slice-of-life bingers decompressing at midnight.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Key Insights</strong>
                  <p>Recommendation queries must balance context metadata (local time, weather) alongside watched pacing speed histories.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Metrics Strategy</strong>
                  <p>North Star: Average Session Watch Duration (minutes). Guardrail: Home page carousel CTR and exit bounce rate.</p>
                </div>
                <div className="md:col-span-2">
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Trade-offs & Prioritization</strong>
                  <p>Decided to query time and weather contexts locally (cached) to serve recommendations in under 200ms, sacrificing complex real-time server evaluations. RICE matrix prioritized simple emoji mood seed classifiers and cozy evening modules over complex local room sound trackers.</p>
                </div>
                <div className="md:col-span-2 bg-portfolio-purple/10 border border-portfolio-purple/20 p-4 rounded-xl text-white italic">
                  <strong>What I Learned:</strong> Focus on solving variables with high confidence metrics (time/weather) before expanding complex data structures.
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. Learnings */}
        <section className="space-y-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            4. Project Learnings & Next Steps
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              In our offline testing cycle, contextual filtering produced an **average 24% boost** in video recommendation discovery metrics and **reduced homepage exit bounce rates by 8%**.
            </p>
            <p>
              <strong>Future Scope:</strong> The next phase seeks to integrate real-time sound vector classifiers (ambient room noise levels) to map if viewers are watching on a TV system in group environments, tailoring suggestions appropriately.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
