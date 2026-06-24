"use client";

import { useState, useEffect, useRef } from "react";
import { mockCareerJourney, CareerNode } from "@/lib/portfolioMockData";
import { Map, Footprints, GraduationCap, Briefcase, Landmark, Trophy, Lightbulb, TrendingUp, X } from "lucide-react";

export default function CareerJourney() {
  const [activeNode, setActiveNode] = useState<CareerNode | null>(null);
  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Monitor scroll to reveal footprints and timeline nodes sequentially
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nodeId = entry.target.getAttribute("data-id");
            if (nodeId && !visibleNodeIds.includes(nodeId)) {
              setVisibleNodeIds((prev) => [...prev, nodeId]);
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    const nodes = timelineRef.current?.querySelectorAll(".timeline-node");
    nodes?.forEach((node) => observer.observe(node));

    return () => {
      nodes?.forEach((node) => observer.unobserve(node));
    };
  }, [visibleNodeIds]);

  const getNodeIcon = (id: string) => {
    switch (id) {
      case "nirma":
        return <GraduationCap size={18} />;
      case "deloitte":
        return <Landmark size={18} />;
      case "steel":
        return <Briefcase size={18} />;
      case "promptwars-event":
        return <Map size={18} className="text-portfolio-purple animate-pulse" />;
      case "nazaraana-build":
        return <Trophy size={18} className="text-portfolio-gold animate-pulse" />;
      case "future":
        return <TrendingUp size={18} className="text-portfolio-blue animate-bounce" />;
      default:
        return <Briefcase size={18} />;
    }
  };

  return (
    <section
      className="relative min-h-screen w-full bg-portfolio-bg py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden border-t border-portfolio-card"
      id="career-journey"
    >
      {/* Background Marauder Grid Elements */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10" ref={timelineRef}>
        
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-portfolio-gold mb-2">
            <Map size={18} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase">Interactive Map Navigation</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide">
            Marauder's Map
          </h2>
          <p className="font-cormorant italic text-lg text-portfolio-textSec mt-3 max-w-xl">
            \"I solemnly swear that I am up to no good.\" Trace the footprints across Mayank's career checkpoints.
          </p>
        </div>

        {/* Timeline Path Container */}
        <div className="relative border-l border-portfolio-gold/20 ml-4 md:ml-32 py-8 space-y-12">
          
          {mockCareerJourney.map((node, index) => {
            const isVisible = visibleNodeIds.includes(node.id);
            const isExpanded = activeNode?.id === node.id;

            return (
              <div
                key={node.id}
                data-id={node.id}
                className="timeline-node relative pl-8 md:pl-12 transition-all duration-1000"
                style={{
                  opacity: isVisible ? 1 : 0.05,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                }}
              >
                {/* Winding Footprint Animations */}
                {isVisible && index > 0 && (
                  <div className="absolute -top-12 -left-3 text-portfolio-gold/40 flex flex-col gap-2 rotate-12">
                    <Footprints size={12} className="animate-pulse" style={{ animationDelay: "0s" }} />
                    <Footprints size={12} className="animate-pulse ml-2" style={{ animationDelay: "0.4s" }} />
                  </div>
                )}

                {/* Left Timeline Indicator */}
                <div
                  onClick={() => setActiveNode(isExpanded ? null : node)}
                  className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 z-20 ${
                    isExpanded
                      ? "bg-portfolio-gold border-portfolio-gold text-portfolio-bg scale-110 shadow-lg shadow-portfolio-gold/25"
                      : "bg-portfolio-bgSec border-portfolio-gold/30 text-portfolio-gold hover:border-portfolio-gold hover:scale-105"
                  }`}
                  title="Expand checkpoint details"
                >
                  {getNodeIcon(node.id)}
                </div>

                {/* Period Badge on the Left (for md+ screens) */}
                <div className="hidden md:block absolute -left-32 top-2 w-24 text-right font-mono text-[11px] tracking-wider text-portfolio-textSec">
                  {node.period}
                </div>

                {/* Timed Node Content Card */}
                <div
                  className={`border border-portfolio-card rounded-xl bg-portfolio-bgSec/60 backdrop-blur-sm p-6 hover:border-portfolio-gold/40 transition-all duration-300 shadow-md ${
                    isExpanded ? "ring-1 ring-portfolio-gold/30 bg-portfolio-bgSec" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-cinzel text-md md:text-lg text-white font-semibold tracking-wide">
                        {node.company}
                      </h4>
                      <p className="font-inter text-xs text-portfolio-gold uppercase tracking-wider mt-0.5">
                        {node.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="md:hidden font-mono text-[10px] text-portfolio-textSec bg-portfolio-bg px-2.5 py-0.5 rounded border border-portfolio-card">
                        {node.period}
                      </span>
                      <span className="font-mono text-[10px] text-portfolio-textSec/60 italic">
                        {node.location}
                      </span>
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <p className="font-inter text-xs md:text-sm text-portfolio-textSec mt-3 line-clamp-2">
                    {node.achievements[0]}
                  </p>

                  <button
                    onClick={() => setActiveNode(isExpanded ? null : node)}
                    className="mt-3 font-mono text-[10px] text-portfolio-purple hover:text-portfolio-blue tracking-widest uppercase flex items-center gap-1 transition-colors"
                  >
                    {isExpanded ? "Close Map Segment" : "Unfold Map Segment →"}
                  </button>

                  {/* Expanding Map Details Drawer */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-portfolio-card/60 space-y-4 animate-fade-in duration-500">
                      
                      {/* Achievements Block */}
                      <div>
                        <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider mb-2">
                          <Trophy size={12} className="text-portfolio-gold" />
                          Core Responsibilities & Achievements
                        </div>
                        <ul className="list-disc pl-5 space-y-1.5 font-inter text-xs md:text-sm text-portfolio-textSec">
                          {node.achievements.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Learnings Block */}
                      <div>
                        <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider mb-2">
                          <Lightbulb size={12} className="text-portfolio-purple" />
                          Key Product PM Learnings
                        </div>
                        <ul className="list-disc pl-5 space-y-1.5 font-inter text-xs md:text-sm text-portfolio-textSec">
                          {node.learnings.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Impact Block */}
                      <div className="border border-portfolio-purple/20 bg-portfolio-purple/5 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-portfolio-purple font-mono text-xs uppercase tracking-wider mb-1">
                          <TrendingUp size={12} />
                          Product / Business Impact
                        </div>
                        <p className="font-inter text-xs md:text-sm text-white italic">
                          "{node.impact}"
                        </p>
                      </div>

                      {/* Custom visual scorecard for PromptWars event */}
                      {node.id === "promptwars-event" && (
                        <div className="mt-4 p-4 border border-portfolio-gold/25 bg-portfolio-gold/5 rounded-xl space-y-3">
                          <span className="font-mono text-[9px] text-portfolio-gold uppercase tracking-[0.2em] block font-bold">
                            Competition Scorecard & Telemetry
                          </span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                            <div className="bg-portfolio-bg/85 border border-portfolio-card p-2 rounded-lg">
                              <div className="font-cinzel text-md text-portfolio-gold font-bold">84.81</div>
                              <div className="text-[8px] font-mono uppercase text-portfolio-textSec mt-0.5">Overall Score</div>
                            </div>
                            <div className="bg-portfolio-bg/85 border border-portfolio-card p-2 rounded-lg">
                              <div className="font-cinzel text-md text-portfolio-purple font-bold">100</div>
                              <div className="text-[8px] font-mono uppercase text-portfolio-textSec mt-0.5">Efficiency</div>
                            </div>
                            <div className="bg-portfolio-bg/85 border border-portfolio-card p-2 rounded-lg">
                              <div className="font-cinzel text-md text-portfolio-blue font-bold">94</div>
                              <div className="text-[8px] font-mono uppercase text-portfolio-textSec mt-0.5">Alignment</div>
                            </div>
                            <div className="bg-portfolio-bg/85 border border-portfolio-card p-2 rounded-lg">
                              <div className="font-cinzel text-md text-emerald-400 font-bold">96</div>
                              <div className="text-[8px] font-mono uppercase text-portfolio-textSec mt-0.5">Security</div>
                            </div>
                          </div>
                          <p className="font-cormorant italic text-[11px] text-portfolio-textSec/80 leading-relaxed pt-1">
                            PromptWars Ahmedabad 2026 evaluated generative AI products on agent execution efficiency, model guardrails alignment, and prompt injection security. Mayank designed Nazaraana specifically to satisfy these benchmarks, landing an elite overall PM placement.
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* Career Details Modal for absolute focus view if clicked */}
      {activeNode && (
        <div className="fixed inset-0 z-40 bg-portfolio-bg/80 backdrop-blur-md flex items-center justify-center p-4 lg:hidden">
          <div className="relative border border-portfolio-gold/30 bg-portfolio-bgSec w-full max-w-md p-6 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveNode(null)}
              className="absolute top-4 right-4 text-portfolio-textSec hover:text-portfolio-gold"
            >
              <X size={20} />
            </button>
            <span className="font-mono text-[9px] text-portfolio-gold tracking-widest uppercase">
              {activeNode.period}
            </span>
            <h3 className="font-cinzel text-xl text-white font-bold tracking-wide mt-1">
              {activeNode.company}
            </h3>
            <p className="font-inter text-xs text-portfolio-purple uppercase tracking-wider mt-0.5">
              {activeNode.role}
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h5 className="font-mono text-xs uppercase tracking-wider text-white mb-2">Achievements</h5>
                <ul className="list-disc pl-4 space-y-2 text-xs text-portfolio-textSec">
                  {activeNode.achievements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-mono text-xs uppercase tracking-wider text-white mb-2">Learnings</h5>
                <ul className="list-disc pl-4 space-y-2 text-xs text-portfolio-textSec">
                  {activeNode.learnings.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-portfolio-purple/10 border border-portfolio-purple/20 p-4 rounded-xl text-xs text-white italic">
                <strong>Impact:</strong> {activeNode.impact}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
