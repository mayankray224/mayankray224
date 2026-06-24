"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Github, Linkedin, FileText, Compass, FolderKanban } from "lucide-react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const AnimatedCounter = ({ end, duration = 1500, decimals = 0, suffix = "" }: { end: number; duration?: number; decimals?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const start = 0;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start + progress * (end - start);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const setRecruiterMode = usePortfolioStore((state) => state.setRecruiterMode);

  // Mouse trail particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const trails: Array<{
      x: number;
      y: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Add trail particles
      const colors = ["#D4AF37", "#8B5CF6", "#60A5FA"]; // gold, purple, blue
      for (let i = 0; i < 2; i++) {
        trails.push({
          x: mouseX + (Math.random() * 10 - 5),
          y: mouseY + (Math.random() * 10 - 5),
          size: Math.random() * 3 + 1,
          alpha: 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Limit trail array size and animate
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw starry dots
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      const starCount = isMobile ? 8 : 15;
      for (let i = 0; i < starCount; i++) {
        const starX = (Math.sin(i * 12345.67) * 0.5 + 0.5) * width;
        const starY = (Math.cos(i * 98765.43) * 0.5 + 0.5) * height;
        ctx.beginPath();
        ctx.arc(starX, starY, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw trails (desktop/cursor only)
      if (!isMobile) {
        for (let i = trails.length - 1; i >= 0; i--) {
          const t = trails[i];
          t.alpha -= 0.02;
          t.size -= 0.02;

          if (t.alpha <= 0 || t.size <= 0) {
            trails.splice(i, 1);
          } else {
            ctx.beginPath();
            ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
            ctx.fillStyle = t.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = t.color;
            ctx.globalAlpha = t.alpha;
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1.0; // reset
        ctx.shadowBlur = 0; // reset
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-portfolio-bg flex flex-col justify-between items-center px-6 py-8 overflow-hidden"
      id="hero"
    >
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none z-0" />

      {/* Floating lanterns & Great Hall candles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Lantern 1 */}
        <div
          className="absolute w-6 h-10 bg-gradient-to-t from-portfolio-gold/50 to-orange-500/20 blur-[1px] rounded-t-xl rounded-b-md animate-float-lantern-slow left-[10%] bottom-0"
          style={{ animationDelay: "0s" }}
        />
        {/* Lantern 2 */}
        <div
          className="absolute w-8 h-12 bg-gradient-to-t from-portfolio-purple/40 to-indigo-500/10 blur-[2px] rounded-t-xl rounded-b-md animate-float-lantern-med left-[45%] bottom-0"
          style={{ animationDelay: "5s" }}
        />
        {/* Lantern 3 */}
        <div
          className="absolute w-5 h-8 bg-gradient-to-t from-portfolio-blue/50 to-cyan-500/25 blur-[1px] rounded-t-xl rounded-b-md animate-float-lantern-fast left-[80%] bottom-0"
          style={{ animationDelay: "10s" }}
        />
        {/* Lantern 4 */}
        <div
          className="absolute w-7 h-11 bg-gradient-to-t from-portfolio-gold/40 to-amber-500/15 blur-[2px] rounded-t-xl rounded-b-md animate-float-lantern-slow left-[70%] bottom-0"
          style={{ animationDelay: "15s" }}
        />
        {/* Great Hall Floating Candles visual overlays */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-candle {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .enchanted-candle {
            animation: float-candle 7s ease-in-out infinite;
          }
        `}} />
        {Array.from({ length: 30 }).map((_, i) => {
          const left = (i * 3.3) + 1 + (i % 2 === 0 ? 0.8 : -0.8);
          const top = 4 + (i % 3) * 6 + (i % 5) * 2;
          const height = 10 + (i % 4) * 4;
          const delay = (i * -0.7).toFixed(1);
          const opacity = 0.25 + (i % 3) * 0.15;
          return (
            <div
              key={i}
              className="absolute w-[2px] bg-gradient-to-b from-amber-100 via-portfolio-gold to-transparent rounded-full shadow-[0_0_8px_#D4AF37] enchanted-candle animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                height: `${height}px`,
                animationDelay: `${delay}s`,
                opacity: opacity,
              }}
            />
          );
        })}
      </div>

      {/* Header bar */}
      <div className="w-full max-w-6xl flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-portfolio-gold tracking-widest text-lg font-bold">M.R</span>
          <span className="h-4 w-[1px] bg-portfolio-textSec/30" />
          <span className="font-mono text-[9px] tracking-widest text-portfolio-textSec/60 uppercase">
            AI Product Builder
          </span>
        </div>
      </div>

      {/* Hero Body Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl z-10 mt-12 md:mt-6">
        <span className="font-mono text-xs md:text-sm tracking-[0.35em] text-portfolio-gold uppercase mb-4 block">
          BUILDING PRODUCTS THAT MATTER
        </span>

        <h1 className="font-cinzel text-5xl md:text-8xl tracking-[0.05em] text-white font-bold leading-tight select-none mb-6">
          MAYANK RAY
        </h1>

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-portfolio-purple/35 bg-portfolio-purple/5 backdrop-blur-md rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-portfolio-purple animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs tracking-wider text-portfolio-purple font-medium uppercase">
              Ex-Deloitte Analyst • Product Builder • AI Explorer
            </span>
          </div>
          <span className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-portfolio-textSec/75 uppercase">
            AI Products • Consumer Technology • Streaming Platforms
          </span>
        </div>

        <p className="font-cormorant italic text-xl md:text-3xl text-portfolio-textSec/90 max-w-2xl leading-relaxed mb-10">
          Building products at the intersection of technology, empathy, and business impact.
        </p>

        {/* Action Button Deck */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-xl mb-12 px-4 sm:px-0">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => scrollToSection("sorting-hat")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-portfolio-gold border border-portfolio-gold text-portfolio-bg font-inter text-xs tracking-widest uppercase font-semibold hover:bg-transparent hover:text-portfolio-gold transition-all duration-300 rounded-lg glow-gold active:scale-95"
            >
              <Compass size={14} />
              Explore Journey
            </button>

            <button
              onClick={() => scrollToSection("room-of-requirement")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-portfolio-bgSec border border-portfolio-gold/30 hover:border-portfolio-gold text-white font-inter text-xs tracking-widest uppercase font-medium transition-all duration-300 rounded-lg active:scale-95"
            >
              <FolderKanban size={14} />
              View Projects
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center h-12 w-12 bg-portfolio-bgSec/60 hover:bg-portfolio-bgSec border border-portfolio-textSec/20 hover:border-portfolio-gold text-portfolio-textSec hover:text-portfolio-gold transition-all duration-300 rounded-lg"
              title="GitHub"
            >
              <Github size={18} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center h-12 w-12 bg-portfolio-bgSec/60 hover:bg-portfolio-bgSec border border-portfolio-textSec/20 hover:border-portfolio-gold text-portfolio-textSec hover:text-portfolio-gold transition-all duration-300 rounded-lg"
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="#resume"
              onClick={(e) => {
                e.preventDefault();
                alert("Downloading Mayank Ray's Premium PM Resume (PDF)...");
              }}
              className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-portfolio-bgSec/60 hover:bg-portfolio-bgSec border border-portfolio-textSec/20 hover:border-portfolio-gold text-portfolio-textSec hover:text-portfolio-gold transition-all duration-300 rounded-lg text-xs font-inter font-medium tracking-widest uppercase whitespace-nowrap"
            >
              <FileText size={16} />
              Resume
            </a>
          </div>
        </div>

        {/* Premium Metrics Strip */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-portfolio-card/40">
          <div className="group border border-portfolio-card bg-portfolio-bgSec/40 hover:border-portfolio-gold/50 p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className="font-cinzel text-xl md:text-2xl text-portfolio-gold font-bold">
              <AnimatedCounter end={2} suffix="+ Years" />
            </div>
            <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">Experience</div>
          </div>
          <div className="group border border-portfolio-card bg-portfolio-bgSec/40 hover:border-portfolio-purple/50 p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <div className="font-cinzel text-xl md:text-2xl text-portfolio-purple font-bold">
              <AnimatedCounter end={200} suffix="+" />
            </div>
            <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">Employees Impacted</div>
          </div>
          <div className="group border border-portfolio-card bg-portfolio-bgSec/40 hover:border-portfolio-gold/50 p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className="font-cinzel text-xl md:text-2xl text-portfolio-gold font-bold">
              <AnimatedCounter end={84.81} decimals={2} />
            </div>
            <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">PromptWars Score</div>
          </div>
          <div className="group border border-portfolio-card bg-portfolio-bgSec/40 hover:border-portfolio-blue/50 p-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(96,165,250,0.1)]">
            <div className="font-cinzel text-xl md:text-2xl text-portfolio-blue font-bold">
              <AnimatedCounter end={1} suffix=" Shipped" />
            </div>
            <div className="font-inter text-[9px] tracking-wider text-portfolio-textSec uppercase mt-1">AI Product Built</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection("sorting-hat")}
        className="flex flex-col items-center gap-2 text-portfolio-textSec/50 hover:text-portfolio-gold transition-colors duration-300 z-10 mt-8"
      >
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase">Scroll to Discover</span>
        <ArrowDown size={14} className="animate-bounce" />
      </button>
    </section>
  );
}
