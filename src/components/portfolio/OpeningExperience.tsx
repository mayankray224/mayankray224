"use client";

import { useEffect, useState, useRef } from "react";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export default function OpeningExperience() {
  const setHasSeenOpening = usePortfolioStore((state) => state.setHasSeenOpening);
  const [stage, setStage] = useState<"enter" | "book-open" | "text-1" | "text-2" | "exit">("enter");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Skip animation handler
  const handleSkip = () => {
    setStage("exit");
    setTimeout(() => setHasSeenOpening(true), 600);
  };

  // Canvas floating particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      fadeSpeed: number;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * width,
        y: height + 10,
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.003 + 0.001,
      };
    };

    // Pre-populate particles
    for (let i = 0; i < 40; i++) {
      const p = createParticle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background sky
      ctx.fillStyle = "#06070A";
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha -= p.fadeSpeed;

        if (p.alpha <= 0 || p.y < -10) {
          particles[i] = createParticle();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`; // Muted gold glow particles
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#D4AF37";
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Control text/opening animation sequence (Total 5 seconds)
  useEffect(() => {
    // Stage timings:
    // 0s - enter (canvas active, book container fades in)
    // 0.8s - book-open (flipping pages animation)
    // 1.8s - text-1 ("Mischief Managed.")
    // 3.0s - text-2 ("Welcome to the Product Journey of Mayank Ray")
    // 4.4s - exit (fade out container)
    // 5.0s - finished (calls setHasSeenOpening)

    const t1 = setTimeout(() => setStage("book-open"), 800);
    const t2 = setTimeout(() => setStage("text-1"), 1800);
    const t3 = setTimeout(() => setStage("text-2"), 3000);
    const t4 = setTimeout(() => setStage("exit"), 4400);
    const t5 = setTimeout(() => setHasSeenOpening(true), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [setHasSeenOpening]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-portfolio-bg transition-opacity duration-700 ease-in-out ${
        stage === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-8 z-50 flex items-center gap-2 border border-portfolio-gold/30 bg-portfolio-bgSec/60 px-4 py-2 text-xs font-inter tracking-[0.2em] text-portfolio-gold hover:border-portfolio-gold hover:bg-portfolio-gold hover:text-portfolio-bg transition-all duration-300 rounded-full"
      >
        SKIP INTRO
      </button>

      {/* 3D Book Container */}
      <div className="relative flex flex-col items-center justify-center perspective-1000">
        <div
          className={`relative w-80 h-96 md:w-96 md:h-[420px] bg-amber-950/20 border border-portfolio-gold/20 rounded-lg shadow-2xl transition-all duration-1000 transform-style-3d ${
            stage !== "enter" ? "rotate-x-12 scale-105" : "rotate-x-0 scale-95"
          }`}
        >
          {/* Cover Spine */}
          <div className="absolute top-0 bottom-0 left-1/2 w-1.5 bg-portfolio-gold/30 -translate-x-1/2 shadow-inner z-30" />

          {/* Left Page */}
          <div
            className={`absolute top-2 bottom-2 left-2 right-1/2 bg-[#0e1117] border border-portfolio-gold/10 rounded-l-md px-6 py-10 flex flex-col items-center justify-center transition-all duration-1000 z-10`}
          >
            {/* Soft grid lines inside pages to mimic premium books */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02)_0%,transparent_80%)] pointer-events-none" />
            
            <div
              className={`w-full text-center transition-opacity duration-700 ${
                stage === "text-1" || stage === "text-2" ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="font-cinzel text-lg md:text-xl text-portfolio-gold tracking-widest leading-relaxed">
                Mischief Managed.
              </p>
              <div className="mx-auto mt-4 w-12 h-[1px] bg-portfolio-gold/30" />
            </div>
          </div>

          {/* Right Page */}
          <div
            className={`absolute top-2 bottom-2 right-2 left-1/2 bg-[#0e1117] border border-portfolio-gold/10 rounded-r-md px-6 py-10 flex flex-col items-center justify-center transition-all duration-1000 z-10`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02)_0%,transparent_80%)] pointer-events-none" />
            
            <div
              className={`w-full text-center transition-opacity duration-700 delay-300 ${
                stage === "text-2" ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="font-cormorant italic text-sm text-portfolio-textSec tracking-wide">
                Welcome to the Product Journey of
              </p>
              <h2 className="font-cinzel text-md md:text-lg text-white mt-2 tracking-widest font-semibold">
                MAYANK RAY
              </h2>
              <p className="font-inter text-[9px] text-portfolio-gold mt-4 tracking-[0.2em] uppercase">
                Product Builder
              </p>
            </div>
          </div>

          {/* Magical Page Flip Layer */}
          <div
            className={`absolute top-2 bottom-2 right-1/2 left-2 bg-[#12161f] border border-portfolio-gold/10 rounded-l-md transition-all duration-1000 transform-origin-right transform-style-3d z-20 ${
              stage !== "enter" ? "-rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
            }`}
          />
        </div>
      </div>

      {/* Decorative ambient title at the bottom */}
      <div className="mt-12 text-center pointer-events-none select-none">
        <p className="font-inter text-[10px] tracking-[0.4em] text-portfolio-textSec/40 uppercase">
          Equipped with Apple, Stripe & Linear aesthetics
        </p>
      </div>
    </div>
  );
}
