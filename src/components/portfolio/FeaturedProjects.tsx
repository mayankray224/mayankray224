"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects } from "@/lib/notion";
import { Project } from "@/lib/portfolioMockData";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { Sparkles, BarChart, ShieldCheck, Zap, ArrowRight, FolderKanban } from "lucide-react";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const addVisitedProject = usePortfolioStore((state) => state.addVisitedProject);

  useEffect(() => {
    async function loadProjects() {
      const data = await getProjects();
      setProjects(data);
    }
    loadProjects();
  }, []);

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case "efficiency":
        return <Zap size={14} className="text-portfolio-gold" />;
      case "alignment":
        return <BarChart size={14} className="text-portfolio-purple" />;
      case "security":
        return <ShieldCheck size={14} className="text-portfolio-blue" />;
      default:
        return <Sparkles size={14} />;
    }
  };

  return (
    <section
      className="relative min-h-screen w-full bg-portfolio-bgSec py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden border-t border-portfolio-card"
      id="room-of-requirement"
    >
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-portfolio-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10">
        
        {/* Title Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-portfolio-purple mb-2">
            <FolderKanban size={18} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase">Artifact Cache</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide">
            The Room of Requirement
          </h2>
          <p className="font-cormorant italic text-lg text-portfolio-textSec mt-3 max-w-xl">
            A hidden chamber displaying product artifacts tailored to answer your recruitment needs.
          </p>
        </div>

        {/* Project Grid */}
        <div className="space-y-12">
          
          {/* CENTERPIECE FEATURED BUILD: NAZARAANA */}
          {projects.filter(p => p.id === "nazaraana").map((project) => (
            <div
              key={project.id}
              className="border border-portfolio-gold/50 bg-[#07090e]/95 shadow-[0_0_35px_rgba(212,175,55,0.15)] hover:shadow-[0_0_45px_rgba(212,175,55,0.25)] rounded-3xl p-6 md:p-10 relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Featured Build Header */}
              <div className="absolute top-0 left-0 bg-portfolio-gold text-portfolio-bg font-mono text-[9px] font-extrabold tracking-[0.25em] px-5 py-2 uppercase rounded-br-2xl">
                Featured Build
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 border border-portfolio-gold/20 bg-portfolio-gold/10 backdrop-blur-md rounded-full">
                <Sparkles size={12} className="text-portfolio-gold animate-pulse" />
                <span className="font-mono text-[9px] tracking-wider text-portfolio-gold font-bold uppercase">
                  PromptWars Ahmedabad 2026 • 84.81 Overall
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
                
                {/* Left Side: Summary & Details */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-portfolio-gold tracking-widest uppercase">
                        {project.projectType}
                      </span>
                      <span className="h-2.5 w-[1px] bg-portfolio-card" />
                      <span className="font-mono text-[10px] text-portfolio-textSec/65">
                        {project.readTime}
                      </span>
                    </div>
                    <h3 className="font-cinzel text-2xl md:text-4xl text-white font-extrabold tracking-wide">
                      {project.title}
                    </h3>
                    <p className="font-cormorant italic text-md md:text-lg text-portfolio-textSec leading-relaxed">
                      AI Mental Wellness Companion for Indian Students
                    </p>
                  </div>

                  {/* Problem & Solution Stack */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-portfolio-card/45">
                    <div>
                      <h4 className="font-cinzel text-[10px] text-white tracking-wider uppercase font-bold">The Problem</h4>
                      <p className="font-inter text-xs text-portfolio-textSec mt-1.5 leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-cinzel text-[10px] text-portfolio-gold tracking-wider uppercase font-bold">The Solution</h4>
                      <p className="font-inter text-xs text-portfolio-textSec mt-1.5 leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  {/* Frameworks Tag Deck */}
                  <div className="space-y-2">
                    <h4 className="font-cinzel text-[9px] text-portfolio-textSec/70 tracking-widest uppercase">Frameworks Cast</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.frameworks.map((fw) => (
                        <span key={fw} className="text-[10px] font-mono border border-portfolio-card bg-portfolio-bgSec px-2.5 py-1 rounded text-slate-300">
                          {fw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Scorecard & CTA */}
                <div className="lg:col-span-2 flex flex-col justify-between border-l border-portfolio-card/40 lg:pl-8 gap-6">
                  <div>
                    <h4 className="font-cinzel text-[10px] text-portfolio-textSec/80 tracking-wider uppercase mb-4">Verification Scorecard</h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-3 rounded-xl text-center">
                        <div className="font-cinzel text-md text-portfolio-gold font-bold">100%</div>
                        <div className="text-[8px] uppercase font-mono tracking-wider text-slate-500 mt-1">Efficiency</div>
                      </div>
                      <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-3 rounded-xl text-center">
                        <div className="font-cinzel text-md text-portfolio-purple font-bold">94%</div>
                        <div className="text-[8px] uppercase font-mono tracking-wider text-slate-500 mt-1">Alignment</div>
                      </div>
                      <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-3 rounded-xl text-center">
                        <div className="font-cinzel text-md text-portfolio-blue font-bold">96%</div>
                        <div className="text-[8px] uppercase font-mono tracking-wider text-slate-500 mt-1">Security</div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 border border-portfolio-purple/20 bg-portfolio-purple/5 rounded-xl">
                      <div className="text-[9px] font-mono uppercase text-portfolio-purple tracking-widest font-semibold mb-1">Impact Output</div>
                      <p className="font-inter text-xs text-white leading-relaxed italic">
                        "{project.impactText}"
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    onClick={() => addVisitedProject(project.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-portfolio-gold hover:bg-transparent border border-portfolio-gold text-portfolio-bg hover:text-portfolio-gold font-inter text-xs tracking-widest uppercase font-semibold transition-all duration-300 rounded-lg shadow-lg"
                  >
                    View Case Study
                    <ArrowRight size={12} />
                  </Link>
                </div>

              </div>
            </div>
          ))}

          {/* OTHER PROJECTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects
              .filter(p => p.id !== "nazaraana")
              .sort((a, b) => {
                const order = ["warner-bros-discovery", "crunchyroll-ai", "blinkit", "testbook"];
                return order.indexOf(a.id) - order.indexOf(b.id);
              })
              .map((project) => {
                const isWBD = project.id === "warner-bros-discovery";
                return (
                  <div
                    key={project.id}
                    className={`group ${
                      isWBD
                        ? "wbd-cinematic-card hover:shadow-[0_0_35px_rgba(212,175,55,0.25)] border-portfolio-gold/20"
                        : "border border-portfolio-card hover:border-portfolio-purple/50 bg-portfolio-bgSec/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.1)] hover:-translate-y-1.5"
                    } backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-500`}
                  >
                    <div>
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[9px] ${isWBD ? "text-portfolio-gold" : "text-portfolio-purple"} tracking-wider uppercase`}>
                            {project.projectType}
                          </span>
                          <span className="h-2 w-[1px] bg-portfolio-card" />
                          <span className="font-mono text-[9px] text-portfolio-textSec/65">
                            {project.readTime}
                          </span>
                        </div>
                        {project.score && (
                          <span className={`font-mono text-[9px] border ${isWBD ? "border-portfolio-gold/50 text-portfolio-gold" : "border-portfolio-gold/30 text-portfolio-gold"} px-2 py-0.5 rounded`}>
                            {project.score}
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h3 className={`font-cinzel text-lg md:text-xl text-white font-bold tracking-wide ${isWBD ? "group-hover:text-portfolio-gold" : "group-hover:text-portfolio-purple"} transition-colors`}>
                        {project.title}
                      </h3>
                      <p className="font-cormorant italic text-sm text-portfolio-textSec mt-1 mb-4 leading-relaxed">
                        {project.tagline}
                      </p>

                      {/* Problem & Solution Snippet */}
                      <div className="space-y-3 pt-3 border-t border-portfolio-card/40 text-xs leading-relaxed">
                        <div>
                          <strong className="text-white">Problem:</strong> <span className="text-portfolio-textSec">{project.problem}</span>
                        </div>
                        <div>
                          <strong className={isWBD ? "text-portfolio-gold" : "text-portfolio-purple"}>Solution:</strong> <span className="text-portfolio-textSec">{project.solution}</span>
                        </div>
                        <div className="bg-portfolio-bg border border-portfolio-card/40 p-3 rounded-lg text-white italic">
                          <strong>Impact:</strong> {project.impactText}
                        </div>
                      </div>

                      {/* Frameworks tag list */}
                      <div className="flex flex-wrap gap-1.5 my-4">
                        {project.frameworks.slice(0, 2).map((fw) => (
                          <span key={fw} className="text-[9px] font-mono bg-portfolio-bg px-2 py-0.5 rounded text-portfolio-textSec border border-portfolio-card">
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-portfolio-card/40 mt-4">
                      <div className="flex gap-4 font-mono text-[10px] text-white">
                        {project.metrics.efficiency && <span>Eff: {project.metrics.efficiency}%</span>}
                        {project.metrics.alignment && <span>Align: {project.metrics.alignment}%</span>}
                      </div>
                      <Link
                        href={`/projects/${project.slug}`}
                        onClick={() => addVisitedProject(project.id)}
                        className={`font-mono text-[9px] ${isWBD ? "text-portfolio-gold group-hover:text-portfolio-gold/80" : "text-portfolio-purple group-hover:text-portfolio-blue"} tracking-widest uppercase flex items-center gap-1 transition-colors`}
                      >
                        {isWBD ? "View Case Study" : "View Teardown"}
                        <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>

      </div>
    </section>
  );
}
