"use client";

import { useEffect, useState } from "react";
import { getPensieveThoughts } from "@/lib/notion";
import { PensieveThought } from "@/lib/portfolioMockData";
import { BrainCircuit, Search, Sparkles, X, Clock, Calendar } from "lucide-react";

export default function ProductThinking() {
  const [thoughts, setThoughts] = useState<PensieveThought[]>([]);
  const [filteredThoughts, setFilteredThoughts] = useState<PensieveThought[]>([]);
  const [selectedThought, setSelectedThought] = useState<PensieveThought | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function loadThoughts() {
      const data = await getPensieveThoughts();
      setThoughts(data);
      setFilteredThoughts(data);
    }
    loadThoughts();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = thoughts;

    if (selectedCategory !== "All") {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q)
      );
    }

    setFilteredThoughts(result);
  }, [searchQuery, selectedCategory, thoughts]);

  const categories = ["All", "PRDs", "Product Teardowns", "Case Studies"];

  return (
    <section
      className="relative min-h-screen w-full bg-portfolio-bg py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden border-t border-portfolio-card"
      id="pensieve"
    >
      {/* Background soft blue glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-portfolio-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 text-portfolio-blue mb-2">
            <BrainCircuit size={18} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase">Memory Pool</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide">
            The Pensieve
          </h2>
          <p className="font-cormorant italic text-lg text-portfolio-textSec mt-3 max-w-xl">
            Peering into floating memories of product teardowns, structural framework designs, and tactical iterations.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-portfolio-card bg-portfolio-bgSec/60 backdrop-blur-md p-4 rounded-xl mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-wider uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-portfolio-blue text-portfolio-bg font-bold border border-portfolio-blue shadow-md shadow-portfolio-blue/10"
                    : "bg-portfolio-bg hover:bg-portfolio-card border border-portfolio-card text-portfolio-textSec"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Filter thoughts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-portfolio-bg border border-portfolio-card text-white text-xs font-inter pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-portfolio-blue transition-all"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-portfolio-textSec/60" />
          </div>
        </div>

        {/* Floating Orbs Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThoughts.map((thought) => (
            <div
              key={thought.id}
              onClick={() => setSelectedThought(thought)}
              className="group cursor-pointer border border-portfolio-card bg-portfolio-bgSec/40 hover:bg-portfolio-bgSec hover:border-portfolio-blue/40 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
            >
              {/* Ethereal glowing orb background indicator */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-portfolio-blue/5 rounded-full blur-xl group-hover:bg-portfolio-blue/15 group-hover:scale-125 transition-all duration-500" />
              
              <div>
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] tracking-wider text-portfolio-blue uppercase">
                    {thought.category}
                  </span>
                  <span className="font-mono text-[9px] text-portfolio-textSec/50">
                    {thought.date}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-cinzel text-md text-white font-semibold tracking-wide group-hover:text-portfolio-blue transition-colors">
                  {thought.title}
                </h4>

                {/* Summary */}
                <p className="font-inter text-xs text-portfolio-textSec mt-3 line-clamp-3 leading-relaxed">
                  {thought.summary}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-portfolio-card/40">
                <span className="font-mono text-[9px] text-portfolio-textSec/50 flex items-center gap-1">
                  <Clock size={10} />
                  {thought.readTime}
                </span>
                <span className="font-mono text-[9px] text-portfolio-blue tracking-widest uppercase flex items-center gap-1">
                  Extract Memory
                  <Sparkles size={10} className="animate-pulse" />
                </span>
              </div>
            </div>
          ))}

          {filteredThoughts.length === 0 && (
            <div className="col-span-full border border-dashed border-portfolio-card bg-portfolio-bgSec/20 p-12 rounded-2xl text-center">
              <p className="font-cormorant italic text-lg text-portfolio-textSec">
                No memories found in the database matching that description...
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Floating Memory Orb Details Modal */}
      {selectedThought && (
        <div className="fixed inset-0 z-50 bg-portfolio-bg/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative border border-portfolio-blue/30 bg-portfolio-bgSec w-full max-w-2xl p-6 md:p-8 rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Corner Close Button */}
            <button
              onClick={() => setSelectedThought(null)}
              className="absolute top-4 right-4 text-portfolio-textSec hover:text-portfolio-blue transition-colors"
            >
              <X size={20} />
            </button>

            {/* Category / Read time */}
            <div className="flex flex-wrap items-center gap-4 text-portfolio-textSec/60 font-mono text-[10px] tracking-wider uppercase mb-2">
              <span className="text-portfolio-blue">{selectedThought.category}</span>
              <span className="h-3 w-[1px] bg-portfolio-card" />
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {selectedThought.date}
              </span>
              <span className="h-3 w-[1px] bg-portfolio-card" />
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {selectedThought.readTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-cinzel text-xl md:text-2xl text-white font-bold tracking-wide mt-2">
              {selectedThought.title}
            </h3>
            
            <div className="mt-4 p-4 border-l-2 border-portfolio-blue/40 bg-portfolio-blue/5 rounded-r-lg font-cormorant italic text-md text-portfolio-textSec">
              {selectedThought.summary}
            </div>

            {/* Body Markdown Content Render */}
            <div className="mt-8 font-inter text-xs md:text-sm text-portfolio-textSec leading-relaxed space-y-6">
              {selectedThought.content.split("\n\n").map((para, idx) => {
                if (para.startsWith("###")) {
                  return (
                    <h5 key={idx} className="font-cinzel text-sm md:text-md text-white font-bold tracking-wide mt-6 border-b border-portfolio-card pb-1">
                      {para.replace("###", "").trim()}
                    </h5>
                  );
                }
                if (para.startsWith("* ")) {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-2">
                      {para.split("\n").map((li, lidx) => (
                        <li key={lidx}>{li.replace("*", "").trim()}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{para}</p>;
              })}
            </div>

            {/* Footer buttons */}
            <div className="mt-10 pt-4 border-t border-portfolio-card flex justify-end gap-3">
              <button
                onClick={() => setSelectedThought(null)}
                className="px-5 py-2 border border-portfolio-card hover:border-portfolio-blue text-white font-mono text-xs rounded-lg transition-colors"
              >
                Close Memory
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
