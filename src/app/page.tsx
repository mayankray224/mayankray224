"use client";

import { usePortfolioStore } from "@/store/usePortfolioStore";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";
import OpeningExperience from "@/components/portfolio/OpeningExperience";
import RecruiterDashboard from "@/components/portfolio/RecruiterDashboard";
import HeroSection from "@/components/portfolio/HeroSection";
import FeaturedCenterpiece from "@/components/portfolio/FeaturedCenterpiece";
import AboutMe from "@/components/portfolio/AboutMe";
import WhyProduct from "@/components/portfolio/WhyProduct";
import CareerJourney from "@/components/portfolio/CareerJourney";
import FeaturedProjects from "@/components/portfolio/FeaturedProjects";
import ProductThinking from "@/components/portfolio/ProductThinking";
import ProductToolkit from "@/components/portfolio/ProductToolkit";
import KnowledgeVault from "@/components/portfolio/KnowledgeVault";
import OwleryContact from "@/components/portfolio/OwleryContact";
import BottomNavigation from "@/components/portfolio/BottomNavigation";

export default function PortfolioHome() {
  const { recruiterMode, hasSeenOpening, setRecruiterMode } = usePortfolioStore();
  const hydrated = useHydration();

  if (!hydrated) {
    return <PageSkeleton />;
  }

  // Stage 1: Display magical book intro
  if (!hasSeenOpening) {
    return <OpeningExperience />;
  }

  // Stage 2 & 3: Display switcher wrapper on top of both dashboards
  return (
    <div className="relative min-h-screen bg-portfolio-bg text-white selection:bg-portfolio-gold/30 selection:text-portfolio-gold no-scrollbar">
      
      {/* Floating Global Switcher in the top right (always visible when intro is completed) */}
      <div className="fixed top-6 right-8 z-50 flex items-center gap-2">
        <button
          onClick={() => setRecruiterMode(!recruiterMode)}
          className={`group relative flex items-center gap-2 border px-4 py-2 rounded-full text-xs font-inter font-bold tracking-wider transition-all duration-300 shadow-lg ${
            recruiterMode
              ? "border-amber-500 bg-amber-500 text-slate-950 hover:bg-amber-600 hover:border-amber-600 animate-pulse"
              : "border-portfolio-gold/30 hover:border-portfolio-gold bg-portfolio-bgSec/90 backdrop-blur-md text-portfolio-gold hover:text-white"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              recruiterMode ? "bg-slate-950" : "bg-portfolio-gold"
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              recruiterMode ? "bg-slate-950" : "bg-portfolio-gold"
            }`}></span>
          </span>
          RECRUITER MODE: {recruiterMode ? "ON" : "OFF"}
        </button>
      </div>

      {recruiterMode ? (
        <RecruiterDashboard />
      ) : (
        <>
          <BottomNavigation />
          <HeroSection />
          
          <div className="max-w-[100vw] overflow-hidden">
            <FeaturedCenterpiece />
            <AboutMe />
            <WhyProduct />
            <CareerJourney />
            <FeaturedProjects />
            <ProductThinking />
            <ProductToolkit />
            <KnowledgeVault />
            <OwleryContact />
          </div>

          {/* Floating navigation footer */}
          <footer className="bg-portfolio-bgSec border-t border-portfolio-card/45 py-8 text-center text-xs text-portfolio-textSec">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p>© {new Date().getFullYear()} Mayank Ray. All rights reserved.</p>
              <p className="font-mono text-[10px] tracking-wider uppercase text-portfolio-gold">
                Managed with Mischief & PM Strategy
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
