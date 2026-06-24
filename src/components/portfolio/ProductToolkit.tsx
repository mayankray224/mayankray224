"use client";

import { useState } from "react";
import { mockSkills, SkillDetail, SkillCategory } from "@/lib/portfolioMockData";
import { BookOpen, Wand2, Sparkles, CheckCircle2 } from "lucide-react";

export default function ProductToolkit() {
  const [activeSkill, setActiveSkill] = useState<SkillDetail | null>(null);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  const getGlowColor = (catIndex: number) => {
    switch (catIndex) {
      case 0:
        return "border-portfolio-gold bg-portfolio-gold/5 shadow-[0_0_20px_rgba(212,175,55,0.15)]";
      case 1:
        return "border-portfolio-purple bg-portfolio-purple/5 shadow-[0_0_20px_rgba(139,92,246,0.15)]";
      case 2:
        return "border-portfolio-blue bg-portfolio-blue/5 shadow-[0_0_20px_rgba(96,165,250,0.15)]";
      default:
        return "border-portfolio-gold bg-portfolio-gold/5";
    }
  };

  const getTextColor = (catIndex: number) => {
    switch (catIndex) {
      case 0: return "text-portfolio-gold";
      case 1: return "text-portfolio-purple";
      case 2: return "text-portfolio-blue";
      default: return "text-portfolio-gold";
    }
  };

  const getProgressBg = (catIndex: number) => {
    switch (catIndex) {
      case 0: return "bg-portfolio-gold";
      case 1: return "bg-portfolio-purple";
      case 2: return "bg-portfolio-blue";
      default: return "bg-portfolio-gold";
    }
  };

  return (
    <section
      className="relative min-h-screen w-full bg-portfolio-bgSec py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden border-t border-portfolio-card"
      id="spellbook"
    >
      {/* Ambient background gold glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-portfolio-gold/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10">
        
        {/* Header Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-portfolio-gold mb-2">
            <BookOpen size={18} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase">Rune Grimoire</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide">
            Spellbook of Skills
          </h2>
          <p className="font-cormorant italic text-lg text-portfolio-textSec mt-3 max-w-xl">
            Unveiling active spells of design discovery, analytical queries, and model orchestrations.
          </p>
        </div>

        {/* Layout: Spellbook UI split */}
        <div className="flex flex-col lg:flex-row gap-10 items-stretch min-h-[480px]">
          
          {/* Left Side: Grimoire Navigation (Tabs) */}
          <div className="w-full lg:w-1/3 flex flex-col justify-start gap-4">
            {mockSkills.map((cat, idx) => (
              <button
                key={cat.title}
                onClick={() => {
                  setActiveCategoryIdx(idx);
                  setActiveSkill(null);
                }}
                className={`relative flex items-center justify-between p-5 border rounded-xl text-left transition-all duration-300 ${
                  activeCategoryIdx === idx
                    ? getGlowColor(idx) + " text-white"
                    : "border-portfolio-card bg-portfolio-bg/30 text-portfolio-textSec hover:border-portfolio-card/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wand2 size={16} className={activeCategoryIdx === idx ? getTextColor(idx) : "text-portfolio-textSec/60"} />
                  <span className="font-cinzel text-sm font-semibold tracking-wide">
                    {cat.title}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-portfolio-textSec/50">
                  {cat.skills.length} Spells
                </span>
              </button>
            ))}

            {/* Default Example Card on Left (for showing selected skill) */}
            <div className="hidden lg:block border border-portfolio-card bg-portfolio-bg/40 backdrop-blur-md p-6 rounded-xl relative overflow-hidden flex-1">
              <div className="absolute top-2 right-2 text-portfolio-gold/30">
                <Sparkles size={20} className="animate-shimmer" />
              </div>
              
              {activeSkill ? (
                <div className="space-y-4 animate-fade-in">
                  <span className="font-mono text-[9px] text-portfolio-gold tracking-widest uppercase">
                    Spell Formulation
                  </span>
                  <h4 className="font-cinzel text-md text-white font-bold tracking-wide">
                    {activeSkill.name}
                  </h4>
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-portfolio-textSec mb-1">
                      <span>Mana Affinity</span>
                      <span>{activeSkill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-portfolio-bgSec rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBg(activeCategoryIdx)}`}
                        style={{ width: `${activeSkill.level}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-white uppercase tracking-wider mb-1">
                      <CheckCircle2 size={10} className="text-portfolio-gold" />
                      Practical Cast Log
                    </div>
                    <p className="font-inter text-xs text-portfolio-textSec leading-relaxed italic">
                      "{activeSkill.example}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-portfolio-textSec/40 font-cormorant italic">
                  <p className="text-sm">Hover over or click a skill badge to extract the spell logs...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Skill Runes Grid */}
          <div className="w-full lg:w-2/3 border border-portfolio-card bg-portfolio-bg/30 backdrop-blur-md rounded-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-portfolio-textSec/60 uppercase block mb-6">
                Active Skills - {mockSkills[activeCategoryIdx].title}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockSkills[activeCategoryIdx].skills.map((skill) => {
                  const isSkillActive = activeSkill?.name === skill.name;
                  return (
                    <div
                      key={skill.name}
                      onMouseEnter={() => setActiveSkill(skill)}
                      onClick={() => setActiveSkill(skill)}
                      className={`group cursor-pointer p-4 border rounded-xl transition-all duration-300 ${
                        isSkillActive
                          ? getGlowColor(activeCategoryIdx)
                          : "border-portfolio-card bg-portfolio-bgSec/60 hover:border-portfolio-card/80 hover:bg-portfolio-bgSec"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-inter text-xs md:text-sm text-white font-medium group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                        <span className={`font-mono text-[10px] ${isSkillActive ? getTextColor(activeCategoryIdx) : "text-portfolio-textSec/40"}`}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1 w-full bg-portfolio-bg/60 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSkillActive ? getProgressBg(activeCategoryIdx) : "bg-portfolio-textSec/20"
                          }`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Tooltip Example display */}
            {activeSkill && (
              <div className="lg:hidden border-t border-portfolio-card/60 mt-8 pt-6 space-y-3 animate-fade-in">
                <span className="font-mono text-[9px] text-portfolio-gold tracking-widest uppercase">
                  Cast Log
                </span>
                <h5 className="font-cinzel text-xs text-white font-bold">{activeSkill.name}</h5>
                <p className="font-inter text-xs text-portfolio-textSec italic">
                  "{activeSkill.example}"
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
