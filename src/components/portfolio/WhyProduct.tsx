"use client";

import { Sparkles, HelpCircle, CheckCircle2, ChevronRight } from "lucide-react";

export default function WhyProduct() {
  return (
    <section
      className="relative min-h-[80vh] w-full bg-portfolio-bg py-24 px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden border-t border-portfolio-card"
      id="why-product"
    >
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] bg-portfolio-gold/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10">
        
        {/* Header Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-portfolio-gold mb-2">
            <HelpCircle size={18} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase">Core Motivation</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide">
            Why Product?
          </h2>
          <p className="font-cormorant italic text-lg text-portfolio-textSec mt-3 max-w-xl">
            Tracing the transition from backend operations and analytics pipelines to strategic product thinking.
          </p>
        </div>

        {/* Story details layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          {/* Left Column: Personal Narrative */}
          <div className="lg:col-span-3 space-y-6 font-inter text-sm md:text-base text-portfolio-textSec leading-relaxed">
            <p>
              My journey didn't start with whiteboard wireframes or user stories. It started on the operational floor, surrounded by logistics bottlenecks and complex analytics logs.
            </p>
            <p>
              At <strong className="text-white">S.S. Steel Industries</strong>, I managed supply-chain routing manually, working alongside operators who struggled with non-digital logbooks. At <strong className="text-white">Deloitte India</strong>, I wrote pipelines to aggregate metrics for corporate teams, seeing first-hand how legacy dashboards create data silos.
            </p>
            <p>
              By engineering tools to resolve these manual failures, I discovered a fundamental truth: <strong className="text-portfolio-gold">optimizing a process is good, but designing the right system from scratch is transformative.</strong>
            </p>
            <p>
              I transitioned into product management to take ownership of the primary lifecycle loop: deciding <strong className="text-white">what should be built</strong>, establishing <strong className="text-white">why it matters</strong>, and engineering precise metrics to measure <strong className="text-white">how success is achieved</strong>.
            </p>
          </div>

          {/* Right Column: Key pillars cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-5 rounded-2xl relative overflow-hidden shadow-lg hover:border-portfolio-gold/30 transition-all duration-300">
              <div className="absolute top-3 right-3 text-portfolio-gold/30">
                <Sparkles size={16} />
              </div>
              <h4 className="font-cinzel text-xs text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <ChevronRight size={14} className="text-portfolio-gold" />
                Solve the System
              </h4>
              <p className="font-inter text-xs text-portfolio-textSec mt-2 leading-relaxed">
                Applying structural systems thinking learned in engineering and operations to build cohesive product platforms.
              </p>
            </div>

            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-5 rounded-2xl relative overflow-hidden shadow-lg hover:border-portfolio-purple/30 transition-all duration-300">
              <div className="absolute top-3 right-3 text-portfolio-purple/30">
                <Sparkles size={16} />
              </div>
              <h4 className="font-cinzel text-xs text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <ChevronRight size={14} className="text-portfolio-purple" />
                Collaborate natively
              </h4>
              <p className="font-inter text-xs text-portfolio-textSec mt-2 leading-relaxed">
                Speaking the same language as engineers, operations operators, and business leaders to align roadmaps.
              </p>
            </div>

            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-5 rounded-2xl relative overflow-hidden shadow-lg hover:border-portfolio-blue/30 transition-all duration-300">
              <div className="absolute top-3 right-3 text-portfolio-blue/30">
                <Sparkles size={16} />
              </div>
              <h4 className="font-cinzel text-xs text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <ChevronRight size={14} className="text-portfolio-blue" />
                Data-Informed Direction
              </h4>
              <p className="font-inter text-xs text-portfolio-textSec mt-2 leading-relaxed">
                Utilizing database analytics (SQL/ETL) to set objective targets and bypass vanity metrics.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
