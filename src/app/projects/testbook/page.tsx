"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, XCircle, CheckCircle2, TrendingUp, AlertTriangle, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function TestbookTeardown() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAfterJourney, setShowAfterJourney] = useState(false);
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

  const beforeSteps = [
    { title: "1. Massive Land page", desc: "User is presented with a listing grid of 30+ exams, languages, and plans on a single mobile screen, prompting immediate choice confusion." },
    { title: "2. OTP Validation latency", desc: "SMS OTP is triggered. In tier-3 towns, delivery latency is ~45s. Timeout occurs after 30s, causing user blockages." },
    { title: "3. Multi-page profile forms", desc: "Forcing fields like address, coaching history, and stream interests before allowing students to view the actual sample mocks catalog." }
  ];

  const afterSteps = [
    { title: "1. Stepwise Onboarding", desc: "Single query screen. Ask only 3 clean steps: Language -> Target exam cluster -> Level check. Low visual strain." },
    { title: "2. WhatsApp Fallback OTP", desc: "Automatically triggers WhatsApp verification option alongside SMS, reducing delivery failures by 30%." },
    { title: "3. Deferred Profiling", desc: "Allow instant access to open mock papers. Prompt profile detail completion only when user tries to submit their test." }
  ];

  return (
    <div className="min-h-screen bg-portfolio-bg text-portfolio-textSec font-inter pb-24">
      {/* Top Banner with scroll progress bar */}
      <div className="border-b border-portfolio-card bg-portfolio-bgSec/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-portfolio-gold hover:text-white transition-colors text-xs font-mono tracking-widest uppercase">
          <ArrowLeft size={16} />
          Back to Sanctum
        </Link>
        <span className="font-mono text-[10px] text-portfolio-textSec/60">CASE STUDY: TESTBOOK TEARDOWN</span>
        
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-portfolio-gold transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      {/* Sticky Quick Jump (horizontal scrollable on mobile) */}
      <div className="bg-portfolio-bgSec/40 border-b border-portfolio-card py-2.5 px-6 sticky top-[53px] z-20 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-5 text-[10px] font-mono whitespace-nowrap">
        <a href="#barrier" className="text-portfolio-textSec hover:text-portfolio-gold">1. The Onboarding Barrier</a>
        <a href="#mapping" className="text-portfolio-textSec hover:text-portfolio-gold">2. Funnel Experience Mapping</a>
        <a href="#outcomes" className="text-portfolio-textSec hover:text-portfolio-gold">3. Solutions & Outcomes</a>
        <a href="#interview" className="text-portfolio-textSec hover:text-portfolio-gold font-bold text-portfolio-gold">4. PM Breakdown</a>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Project Hero */}
        <section className="space-y-6">
          <span className="font-mono text-xs tracking-widest text-portfolio-blue uppercase block">Product Growth & UX Teardown</span>
          <h1 className="font-cinzel text-4xl md:text-5xl text-white font-bold tracking-wide">
            Testbook Funnel Optimization Teardown
          </h1>
          <p className="font-cormorant italic text-xl md:text-2xl text-white">
            Reducing registration drop-offs for tier-2/3 Indian aspirants by restructuring multi-step verification gates.
          </p>

          {/* Metrics Scorecard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-portfolio-card/60">
            <div className="border border-portfolio-blue/30 bg-portfolio-blue/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-blue font-bold">18%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Expected Conversion Lift</div>
            </div>
            <div className="border border-portfolio-gold/30 bg-portfolio-gold/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-gold font-bold">-30%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">OTP Failure Rate</div>
            </div>
            <div className="border border-portfolio-purple/30 bg-portfolio-purple/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-purple font-bold">42%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Baseline Drop-off</div>
            </div>
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-emerald-400 font-bold">78%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Onboarding Completes</div>
            </div>
          </div>
        </section>

        {/* 1. Problem Space */}
        <section id="barrier" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            1. The Onboarding Barrier
          </h2>
          <div className="space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              Testbook supports millions of students preparing for government recruitments and tests. However, quantitative funnel checks revealed that **42% of visitors** dropping off during initial onboarding were located in non-metro areas with limited network bandwidth and high latency environments.
            </p>
            <p>
              We identified two massive friction vectors: **Visual Cognitive Overload** (overwhelming exam options presented immediately) and **SMS delivery latency** (resulting in expired OTP sessions).
            </p>
          </div>
        </section>

        {/* 2. Before vs After Interactive Funnel Switcher */}
        <section id="mapping" className="space-y-6 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
              2. Funnel Experience Mapping
            </h2>
            
            {/* Interactive Toggle Switcher */}
            <div className="flex items-center gap-2 border border-portfolio-card bg-portfolio-bgSec p-1 rounded-full">
              <button
                onClick={() => setShowAfterJourney(false)}
                className={`px-4 py-1.5 rounded-full font-mono text-[9px] tracking-wider uppercase transition-all duration-300 ${
                  !showAfterJourney
                    ? "bg-red-500/20 border border-red-500/40 text-red-400 font-bold"
                    : "text-portfolio-textSec hover:text-white"
                }`}
              >
                Before Flow
              </button>
              <button
                onClick={() => setShowAfterJourney(true)}
                className={`px-4 py-1.5 rounded-full font-mono text-[9px] tracking-wider uppercase transition-all duration-300 ${
                  showAfterJourney
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold"
                    : "text-portfolio-textSec hover:text-white"
                }`}
              >
                Optimized Flow
              </button>
            </div>
          </div>
          <p className="text-sm">Compare the steps of the onboarding funnel to evaluate the friction reduction design changes:</p>

          <div className="border border-portfolio-card bg-[#0d1017] rounded-2xl p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(showAfterJourney ? afterSteps : beforeSteps).map((step, idx) => (
                <div key={idx} className="border border-portfolio-card bg-portfolio-bg p-5 rounded-xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    {showAfterJourney ? (
                      <CheckCircle2 size={16} className="text-emerald-400 animate-pulse" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                  </div>
                  <h4 className="font-cinzel text-xs text-white font-bold tracking-wide">{step.title}</h4>
                  <p className="font-inter text-xs text-portfolio-textSec leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border border-portfolio-card bg-portfolio-bg rounded-xl flex items-start gap-3">
              <AlertTriangle size={18} className={showAfterJourney ? "text-emerald-400" : "text-red-400"} />
              <p className="font-inter text-xs text-portfolio-textSec">
                <strong>PM Insight:</strong> {showAfterJourney 
                  ? "By postponing profile forms, we allow immediate value realization (mock catalog). Reciprocal trust drives higher registration completions."
                  : "Visual options should never exceed 7 items per screen (Miller's Law). 30+ items trigger choice paralysis, forcing exit drop-offs."
                }
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
                  <p>Registration conversion rates for tier-2/3 mock exam takers drop off due to choice overload (Miller's Law) and OTP timeout latencies.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Target User Segment</strong>
                  <p>Aspirants in non-metro regions studying on low bandwidth mobile connections with high network latency.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Key Insights</strong>
                  <p>Presenting 30+ exams on a single landing screen causes visual paralysis. WhatsApp is highly reliable for OTP verification delivery.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Metrics Strategy</strong>
                  <p>North Star: Registration Completion Rate. Guardrail: User onboarding flow cycle duration.</p>
                </div>
                <div className="md:col-span-2">
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Trade-offs & Prioritization</strong>
                  <p>WhatsApp APIs incur transactional costs, so we prioritised falling back to WhatsApp only when standard SMS delivery fails or latency exceeds 30s. Scoped down onboarding checks to defer full profile creation forms until mock paper submission.</p>
                </div>
                <div className="md:col-span-2 bg-portfolio-purple/10 border border-portfolio-purple/20 p-4 rounded-xl text-white italic">
                  <strong>What I Learned:</strong> In growth onboarding, prioritize immediate value realization (mock paper access) before requesting data collection. Reciprocal user trust increases cohort signups.
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. Expected Metrics */}
        <section id="outcomes" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            3. Proposed Solutions & Expected Outcomes
          </h2>
          <div className="space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              By swapping the rigid SMS-only registration validation with a **dual SMS/WhatsApp fallback gateway**, we target a **30% reduction in OTP time-outs**. Combined with a structured 3-step onboarding flow, overall cohort signup rates are modeled to climb from 58% to 76%, representing millions of newly converted mock test subscriptions annually.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
