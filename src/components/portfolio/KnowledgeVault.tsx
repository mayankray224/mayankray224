"use client";

import { useEffect, useState } from "react";
import { getKnowledgeNotes } from "@/lib/notion";
import { KnowledgeNote } from "@/lib/portfolioMockData";
import { Library, Search, ChevronDown, ChevronUp, FileCode, Tag } from "lucide-react";

export default function KnowledgeVault() {
  const [notes, setNotes] = useState<KnowledgeNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<KnowledgeNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotes() {
      const data = await getKnowledgeNotes();
      setNotes(data);
      setFilteredNotes(data);
    }
    loadNotes();
  }, []);

  // Filter notes
  useEffect(() => {
    let result = notes;

    if (selectedTag !== "All") {
      result = result.filter((n) => n.tags.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    setFilteredNotes(result);
  }, [searchQuery, selectedTag, notes]);

  // Aggregate all unique tags from notes
  const allTags = ["All", ...Array.from(new Set(notes.flatMap((n) => n.tags)))];

  const toggleExpandNote = (id: string) => {
    setExpandedNoteId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="relative min-h-screen w-full bg-portfolio-bg py-24 px-6 md:px-12 flex flex-col items-center overflow-hidden border-t border-portfolio-card"
      id="restricted-section"
    >
      {/* Background purple glow */}
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-portfolio-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10">
        
        {/* Title Block */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 text-portfolio-gold mb-2">
            <Library size={18} />
            <span className="font-mono text-xs tracking-[0.3em] uppercase">Archive Library</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-4xl text-white font-bold tracking-wide">
            The Restricted Section
          </h2>
          <p className="font-cormorant italic text-lg text-portfolio-textSec mt-3 max-w-xl">
            A secure reading vault of database syntax guides, operational models, and framework checklists.
          </p>
        </div>

        {/* Search and Tag filter panel */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-portfolio-card bg-portfolio-bgSec/60 backdrop-blur-sm p-4 rounded-xl mb-10">
          
          {/* Tags list */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded font-mono text-[9px] tracking-wider uppercase transition-colors duration-300 ${
                  selectedTag === tag
                    ? "bg-portfolio-gold text-portfolio-bg font-bold border border-portfolio-gold"
                    : "bg-portfolio-bg hover:bg-portfolio-card border border-portfolio-card text-portfolio-textSec"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search reference logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-portfolio-bg border border-portfolio-card text-white text-xs font-inter pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-portfolio-gold transition-all"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-portfolio-textSec/60" />
          </div>

        </div>

        {/* Notion-styled reading logs list */}
        <div className="border border-portfolio-card bg-portfolio-bgSec/30 backdrop-blur-md rounded-2xl overflow-hidden divide-y divide-portfolio-card/60">
          
          {filteredNotes.map((note) => {
            const isExpanded = expandedNoteId === note.id;

            return (
              <div
                key={note.id}
                className={`transition-colors duration-300 ${isExpanded ? "bg-portfolio-bgSec/30" : "hover:bg-portfolio-bgSec/10"}`}
              >
                {/* Header click bar */}
                <div
                  onClick={() => toggleExpandNote(note.id)}
                  className="flex items-center justify-between p-6 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <FileCode className={isExpanded ? "text-portfolio-gold" : "text-portfolio-textSec/60"} size={18} />
                    <div>
                      <h4 className="font-cinzel text-sm md:text-md text-white font-semibold tracking-wide hover:text-portfolio-gold transition-colors">
                        {note.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-mono text-[9px] text-portfolio-textSec/50 uppercase">
                          {note.category}
                        </span>
                        <span className="h-2 w-[1px] bg-portfolio-card" />
                        <span className="font-mono text-[9px] text-portfolio-textSec/50">
                          {note.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Tags */}
                    <div className="hidden md:flex items-center gap-1.5">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[8px] border border-portfolio-card/85 bg-portfolio-bgSec px-2 py-0.5 rounded text-portfolio-textSec"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-portfolio-gold" /> : <ChevronDown size={16} className="text-portfolio-textSec" />}
                  </div>
                </div>

                {/* Content block */}
                {isExpanded && (
                  <div className="px-6 pb-8 pt-2 border-t border-portfolio-card/40 animate-fade-in duration-500">
                    <div className="font-inter text-xs md:text-sm text-portfolio-textSec leading-relaxed space-y-4 max-w-4xl">
                      
                      {note.content.split("\n\n").map((para, idx) => {
                        // Render Code snippets block
                        if (para.includes("```")) {
                          const lang = para.split("\n")[0].replace("```", "").trim();
                          const code = para
                            .replace(/```[a-z]*/, "")
                            .replace("```", "")
                            .trim();

                          return (
                            <div key={idx} className="my-4 border border-portfolio-card bg-[#090b10] rounded-xl overflow-hidden shadow-lg font-mono text-xs">
                              <div className="flex items-center justify-between px-4 py-2 bg-[#0d1017] border-b border-portfolio-card text-[9px] text-portfolio-textSec tracking-wider uppercase font-semibold">
                                <span>{lang || "Code Block"}</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-portfolio-gold" />
                              </div>
                              <pre className="p-4 overflow-x-auto text-portfolio-gold">
                                <code>{code}</code>
                              </pre>
                            </div>
                          );
                        }

                        // Render standard Markdown headers
                        if (para.startsWith("###")) {
                          return (
                            <h5 key={idx} className="font-cinzel text-xs md:text-sm text-white font-bold tracking-wide mt-6">
                              {para.replace("###", "").trim()}
                            </h5>
                          );
                        }

                        // Render list items
                        if (para.startsWith("- ")) {
                          return (
                            <ul key={idx} className="list-disc pl-5 space-y-1.5">
                              {para.split("\n").map((li, lidx) => (
                                <li key={lidx}>{li.replace("-", "").trim()}</li>
                              ))}
                            </ul>
                          );
                        }

                        return <p key={idx}>{para}</p>;
                      })}

                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredNotes.length === 0 && (
            <div className="p-12 text-center">
              <p className="font-cormorant italic text-lg text-portfolio-textSec">
                No logs found matching your criteria in the Restricted database...
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
