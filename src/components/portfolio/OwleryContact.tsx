"use client";

import { useState } from "react";
import { Send, Mail, Linkedin, Github, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "@/app/portfolioActions";

export default function OwleryContact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    linkedin: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [owlFlap, setOwlFlap] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert("Please fill in all required slots before calling the owl!");
      return;
    }

    setIsSending(true);
    setOwlFlap(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await submitContactForm(formState);
      if (response.success) {
        setIsSent(true);
        setSuccessMsg(response.message || "🦉 Your owl has reached Mayank.");
        setFormState({ name: "", email: "", company: "", linkedin: "", message: "" });
        // Auto reset success message after 5 seconds
        setTimeout(() => {
          setIsSent(false);
          setSuccessMsg(null);
        }, 5000);
      } else {
        setErrorMsg(response.message || "Failed to dispatch scroll.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An unexpected failure occurred while dispatching the owl.");
    } finally {
      setIsSending(false);
      setOwlFlap(false);
    }
  };

  return (
    <section
      className="relative min-h-screen w-full bg-portfolio-bgSec py-24 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden border-t border-portfolio-card"
      id="contact"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-portfolio-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10 flex flex-col lg:flex-row gap-12 items-stretch">
        
        {/* Left Card: Owlery Animation & Links */}
        <div className="w-full lg:w-1/2 border border-portfolio-gold/10 bg-portfolio-bg/40 backdrop-blur-md rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl">
          {/* Corner borders */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-portfolio-gold/20 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-portfolio-gold/20 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-portfolio-gold/20 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-portfolio-gold/20 rounded-br-lg" />

          <div>
            <div className="flex items-center gap-2 text-portfolio-gold mb-2">
              <Mail size={16} />
              <span className="font-mono text-xs tracking-[0.3em] uppercase">Communications Hub</span>
            </div>
            
            <h2 className="font-cinzel text-3xl text-white font-bold tracking-wide">
              The Owlery
            </h2>

            <p className="font-cormorant italic text-lg text-portfolio-textSec mt-4 leading-relaxed">
              \"Send an owl to deliver your scrolls.\" Let's connect, share product reviews, or discuss team collaborations.
            </p>
          </div>

          {/* Animated SVG Owl */}
          <div className="my-8 flex justify-center items-center">
            <div className={`relative transition-all duration-[2200ms] ${
              isSending ? "scale-90 -translate-y-24 opacity-0 rotate-12" : "scale-100"
            }`}>
              <svg viewBox="0 0 100 100" fill="none" className="w-32 h-32 stroke-portfolio-gold" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Owl Body */}
                <path d="M50 20 C35 32 32 50 35 70 C38 85 45 90 50 90 C55 90 62 85 65 70 C68 50 65 32 50 20 Z" fill="rgba(212, 175, 55, 0.03)" />
                
                {/* Left Wing */}
                <path
                  d="M34 50 Q15 48 30 75"
                  className={`origin-right transition-transform ${owlFlap ? "animate-bounce" : ""}`}
                />
                
                {/* Right Wing */}
                <path
                  d="M66 50 Q85 48 70 75"
                  className={`origin-left transition-transform ${owlFlap ? "animate-bounce" : ""}`}
                />

                {/* Big Owl Eyes */}
                <circle cx="43" cy="42" r="7" fill="rgba(6, 7, 10, 0.8)" />
                <circle cx="43" cy="42" r="2" fill="#D4AF37" />
                <circle cx="57" cy="42" r="7" fill="rgba(6, 7, 10, 0.8)" />
                <circle cx="57" cy="42" r="2" fill="#D4AF37" />

                {/* Beak */}
                <path d="M50 48 L48 53 L52 53 Z" fill="#D4AF37" />

                {/* Horns / Tufts */}
                <path d="M38 27 L33 21 C33 21 42 24 45 27" />
                <path d="M62 27 L67 21 C67 21 58 24 55 27" />

                {/* Branch support */}
                <path d="M25 80 L75 80" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

              {isSending && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[9px] text-portfolio-gold tracking-widest uppercase">
                  Flying...
                </span>
              )}
            </div>
          </div>

          {/* Social Channels Grid for easy touch targets */}
          <div className="space-y-4 w-full">
            <div className="h-[1px] w-full bg-portfolio-card" />
            
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px] w-full">
              <a
                href="mailto:mayankray224@gmail.com"
                className="flex items-center justify-center gap-2 bg-portfolio-bgSec/60 hover:bg-portfolio-bgSec border border-portfolio-card/60 hover:border-portfolio-gold p-3.5 rounded-xl text-white transition-all active:scale-95 text-center"
              >
                <Mail size={16} className="text-portfolio-gold" />
                Email
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-portfolio-bgSec/60 hover:bg-portfolio-bgSec border border-portfolio-card/60 hover:border-portfolio-gold p-3.5 rounded-xl text-white transition-all active:scale-95 text-center"
              >
                <Linkedin size={16} className="text-blue-400" />
                LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-portfolio-bgSec/60 hover:bg-portfolio-bgSec border border-portfolio-card/60 hover:border-portfolio-gold p-3.5 rounded-xl text-white transition-all active:scale-95 text-center"
              >
                <Github size={16} className="text-slate-350" />
                GitHub
              </a>
              <a
                href="#resume"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Downloading Mayank Ray's Premium PM Resume (PDF)...");
                }}
                className="flex items-center justify-center gap-2 bg-portfolio-bgSec/60 hover:bg-portfolio-bgSec border border-portfolio-card/60 hover:border-portfolio-gold p-3.5 rounded-xl text-white transition-all active:scale-95 text-center"
              >
                <FileText size={16} className="text-portfolio-purple" />
                Resume
              </a>
              <a
                href="#calendar"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Opening Cal.com scheduling widget...");
                }}
                className="col-span-2 flex items-center justify-center gap-2 bg-portfolio-gold/10 hover:bg-portfolio-gold border border-portfolio-gold/30 hover:text-portfolio-bg p-3.5 rounded-xl text-portfolio-gold transition-all active:scale-95 text-center font-bold"
              >
                <Calendar size={16} />
                Book Calendar (Cal.com)
              </a>
            </div>
          </div>
        </div>

        {/* Right Card: Contact Form */}
        <div className="w-full lg:w-1/2 border border-portfolio-card bg-portfolio-bg/20 backdrop-blur-md rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-lg">
          <div>
            <span className="font-mono text-[10px] tracking-widest text-portfolio-textSec/60 uppercase block mb-6">
              Write your Scroll
            </span>

            {isSent ? (
              <div className="border border-portfolio-gold/30 bg-portfolio-gold/5 p-6 rounded-xl flex flex-col items-center justify-center text-center py-16 animate-fade-in">
                <CheckCircle2 size={44} className="text-portfolio-gold animate-bounce mb-4" />
                <h4 className="font-cinzel text-lg text-white font-bold tracking-wide">
                  Scroll Dispatched!
                </h4>
                <p className="font-cormorant italic text-sm text-portfolio-textSec mt-2 max-w-xs font-semibold">
                  {successMsg || "🦉 Your owl has reached Mayank."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="border border-red-500/30 bg-red-500/5 p-3.5 rounded-lg text-red-400 font-mono text-[11px] text-center">
                    ⚠️ {errorMsg}
                  </div>
                )}
                
                <div>
                  <label className="font-mono text-[10px] text-portfolio-textSec tracking-wider uppercase block mb-2">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name..."
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-portfolio-bgSec border border-portfolio-card text-white text-xs font-inter px-4 py-3 rounded-lg focus:outline-none focus:border-portfolio-gold transition-all"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] text-portfolio-textSec tracking-wider uppercase block mb-2">
                    Sender Address (Email)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-portfolio-bgSec border border-portfolio-card text-white text-xs font-inter px-4 py-3 rounded-lg focus:outline-none focus:border-portfolio-gold transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-portfolio-textSec tracking-wider uppercase block mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Linear..."
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                      className="w-full bg-portfolio-bgSec border border-portfolio-card text-white text-xs font-inter px-4 py-3 rounded-lg focus:outline-none focus:border-portfolio-gold transition-all"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-portfolio-textSec tracking-wider uppercase block mb-2">
                      LinkedIn (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="linkedin.com/in/username"
                      value={formState.linkedin}
                      onChange={(e) => setFormState({ ...formState, linkedin: e.target.value })}
                      className="w-full bg-portfolio-bgSec border border-portfolio-card text-white text-xs font-inter px-4 py-3 rounded-lg focus:outline-none focus:border-portfolio-gold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-portfolio-textSec tracking-wider uppercase block mb-2">
                    Scroll Contents (Message)
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your inquiry..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-portfolio-bgSec border border-portfolio-card text-white text-xs font-inter px-4 py-3 rounded-lg focus:outline-none focus:border-portfolio-gold transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-portfolio-gold border border-portfolio-gold text-portfolio-bg font-inter text-xs tracking-widest uppercase font-semibold hover:bg-transparent hover:text-portfolio-gold transition-all duration-300 rounded-lg shadow-lg shadow-portfolio-gold/5"
                >
                  {isSending ? "Dispatching..." : "Send Letter via Owl"}
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center border-t border-portfolio-card/40 pt-6">
            <p className="font-cormorant italic text-md text-portfolio-textSec/70">
              "Let's build products people love."
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
