"use client";

import { usePortfolioStore } from "@/store/usePortfolioStore";
import { mockCareerJourney, mockSkills, mockProjects } from "@/lib/portfolioMockData";
import { FileText, Mail, Linkedin, Github, RefreshCw, Calendar, Briefcase, Award } from "lucide-react";
import Link from "next/link";

export default function RecruiterDashboard() {
  const setRecruiterMode = usePortfolioStore((state) => state.setRecruiterMode);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative corner highlights */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />
        
        {/* Recruiter Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Mayank Ray <span className="text-[10px] bg-purple-900/60 border border-purple-800 text-purple-200 px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider font-bold">Recruiter mode (60s Summary)</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5 font-medium">
              AI Product Builder • Ex-Deloitte Analyst • Consumer Technology Enthusiast
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Downloading Mayank Ray's Premium Resume (PDF)...")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold uppercase tracking-wider transition-all rounded-md"
            >
              <FileText size={12} />
              Download Resume
            </button>
          </div>
        </header>

        {/* Dynamic High-Density Recruiter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Info & Core Skills */}
          <div className="space-y-6 border-r border-slate-800/60 pr-0 md:pr-6">
            <div>
              <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-3">Positioning Summary</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Builder of human-centered AI products. Transitioned from operations and analytics pipelines into product thinking, leveraging strong data querying literacy (SQL) and generative AI context engineering to scope, ship, and validate customer metrics.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest">Core Capabilities</h3>
              <div className="space-y-2">
                {mockSkills.map((cat) => (
                  <div key={cat.title} className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">{cat.title.replace(" Spells", "").replace(" Alchemy", "").replace(" Sorcery", "")}</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {cat.skills.map((skill) => (
                        <span key={skill.name} className="text-[9px] bg-slate-950 text-white px-2 py-0.5 rounded border border-slate-800 font-medium" title={skill.example}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Top Shipped Projects */}
          <div className="space-y-6 md:col-span-1 border-r border-slate-800/60 pr-0 md:pr-6">
            <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest">Featured Products Shipped</h3>
            
            <div className="space-y-3">
              {mockProjects.map((project) => (
                <div key={project.id} className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-white uppercase">{project.title.split(" (")[0]}</h4>
                    <span className="text-[9px] font-mono text-purple-400 font-bold uppercase">{project.score ? project.score.split(" ")[0] : "CMS"}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{project.tagline}</p>
                  
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 bg-slate-950 p-1.5 rounded">
                    <span>Eff: {project.metrics.efficiency}%</span>
                    <span>Align: {project.metrics.alignment}%</span>
                    <span>Sec: {project.metrics.security}%</span>
                  </div>
                  
                  <Link href={`/projects/${project.slug}`} className="text-[9px] font-mono text-amber-500 hover:underline block text-right">
                    View PM Case Study →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Professional Experience & Direct Contact */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest">Career Journey Timeline</h3>
            
            <div className="space-y-3">
              {mockCareerJourney.slice(0, 5).map((job) => (
                <div key={job.id} className="bg-slate-900/40 border border-slate-900 p-3 rounded-lg flex justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-white leading-tight">{job.company.split(" Ahmedabad")[0]}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{job.role}</p>
                  </div>
                  <span className="text-[9px] font-mono text-amber-500 shrink-0">{job.period}</span>
                </div>
              ))}
            </div>

            {/* Direct Contact links */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-3">Direct Channels</h4>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <a href="mailto:mayankray224@gmail.com" className="flex items-center gap-1.5 bg-slate-950 p-2 rounded hover:border-amber-500 border border-slate-850 text-slate-350">
                  <Mail size={12} className="text-amber-500" />
                  <span>Email</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-slate-950 p-2 rounded hover:border-amber-500 border border-slate-850 text-slate-350">
                  <Linkedin size={12} className="text-blue-400" />
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-slate-950 p-2 rounded hover:border-amber-500 border border-slate-850 text-slate-350">
                  <Github size={12} className="text-slate-105" />
                  <span>GitHub</span>
                </a>
                <button onClick={() => alert("Opening Scheduler Cal.com...")} className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 p-2 rounded border border-amber-500/30 text-amber-400 transition-all font-bold">
                  <Calendar size={12} />
                  <span>Cal.com</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 pt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>Prerendered via Next.js App Router (Static)</span>
          <span>© {new Date().getFullYear()} Mayank Ray</span>
        </footer>

      </div>
    </div>
  );
}
