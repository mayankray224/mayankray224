"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Tv, 
  Users, 
  Gamepad2, 
  Flame, 
  Globe, 
  ShoppingBag, 
  Compass, 
  Film, 
  Zap, 
  HelpCircle, 
  ChevronRight, 
  Clock, 
  Target, 
  AlertTriangle,
  Rotate3d,
  Layers,
  Heart,
  Crown,
  Share2
} from "lucide-react";

export default function WarnerBrosDiscoveryCaseStudy() {
  const { recruiterMode } = usePortfolioStore();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("hero");

  // Section references for scroll spying and jumping
  const heroRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const landscapeRef = useRef<HTMLDivElement>(null);
  const opportunityRef = useRef<HTMLDivElement>(null);
  const strategyRef = useRef<HTMLDivElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const risksRef = useRef<HTMLDivElement>(null);
  const conclusionRef = useRef<HTMLDivElement>(null);
  const pmThinkingRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Scroll Spy logic
      const scrollPos = window.scrollY + 200;
      if (heroRef.current && scrollPos < heroRef.current.offsetTop + heroRef.current.offsetHeight) {
        setActiveTab("hero");
      } else if (coreRef.current && scrollPos < coreRef.current.offsetTop + coreRef.current.offsetHeight) {
        setActiveTab("core");
      } else if (landscapeRef.current && scrollPos < landscapeRef.current.offsetTop + landscapeRef.current.offsetHeight) {
        setActiveTab("landscape");
      } else if (opportunityRef.current && scrollPos < opportunityRef.current.offsetTop + opportunityRef.current.offsetHeight) {
        setActiveTab("opportunity");
      } else if (strategyRef.current && scrollPos < strategyRef.current.offsetTop + strategyRef.current.offsetHeight) {
        setActiveTab("strategy");
      } else if (ecosystemRef.current && scrollPos < ecosystemRef.current.offsetTop + ecosystemRef.current.offsetHeight) {
        setActiveTab("ecosystem");
      } else if (visionRef.current && scrollPos < visionRef.current.offsetTop + visionRef.current.offsetHeight) {
        setActiveTab("vision");
      } else if (metricsRef.current && scrollPos < metricsRef.current.offsetTop + metricsRef.current.offsetHeight) {
        setActiveTab("metrics");
      } else if (risksRef.current && scrollPos < risksRef.current.offsetTop + risksRef.current.offsetHeight) {
        setActiveTab("risks");
      } else if (conclusionRef.current && scrollPos < conclusionRef.current.offsetTop + conclusionRef.current.offsetHeight) {
        setActiveTab("conclusion");
      } else if (pmThinkingRef.current) {
        setActiveTab("pmthinking");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 110,
        behavior: "smooth"
      });
    }
  };

  // Section 2: Competitive Landscape State
  const [selectedCompetitor, setSelectedCompetitor] = useState("wbd");
  const competitors = {
    netflix: {
      name: "Netflix",
      color: "border-red-600 bg-red-950/10 text-red-400",
      strengths: "Elite personalized recommendation engine, massive global scale, unmatched content volume.",
      weaknesses: "High subscription pricing, no sports rights in India, lacks off-screen physical ecosystem.",
      moat: "Algorithmic discovery loops & high brand loyalty.",
      position: "Volume-based global standard."
    },
    amazon: {
      name: "Amazon Prime Video",
      color: "border-sky-500 bg-sky-950/10 text-sky-400",
      strengths: "Bundled pricing with Prime shipping, strong Bollywood catalog acquisition, high household penetration.",
      weaknesses: "Confusing content discovery UI, weaker premium brand perception for original IP.",
      moat: "E-commerce delivery subscription bundle.",
      position: "Value-focused utility add-on."
    },
    jiohotstar: {
      name: "JioHotstar",
      color: "border-emerald-500 bg-emerald-950/10 text-emerald-400",
      strengths: "IPL Cricket broadcast rights, Disney prestige catalog, massive distribution via Jio network.",
      weaknesses: "Prestige storytelling is not the primary focus, UI feels cluttered with heavy ads.",
      moat: "Sports and cellular data distribution bundles.",
      position: "Mass-market streaming leader."
    },
    wbd: {
      name: "Warner Bros. Discovery",
      color: "border-amber-500 bg-amber-950/10 text-amber-400",
      strengths: "Prestige IP catalog (Game of Thrones, Harry Potter, DC, HBO Originals) with off-screen extensions.",
      weaknesses: "Premium positioning in a price-sensitive market, low direct billing relationships in India.",
      moat: "Irreplaceable, legacy-rich prestige IP.",
      position: "High-value franchise destination."
    }
  };

  // Section 3: Spotlight Reveal State
  const [spotlightClicked, setSpotlightClicked] = useState(false);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPosition({ x, y });
  };

  // Section 4: Interactive Strategy Timeline State
  const [activePhase, setActivePhase] = useState<number>(0);
  const phases = [
    {
      title: "Phase 1: Lower the Entry Barrier",
      tagline: "Freemium Conversion Funnel",
      objective: "Launch an ad-supported free tier in India with curated HBO Pilot episodes and film trailers.",
      customerBenefit: "Allows value-conscious viewers to sample premium narratives before committing capital.",
      businessBenefit: "Scales MAU metrics, captures digital advertising revenues, and seeds retargeting cohorts.",
      outcome: "18% free-to-paid conversion rate in the first 12 months.",
      kpis: "MAU Growth, Ad Impression Yield, Sign-up Funnel Drop-off",
      icon: <Layers size={18} />
    },
    {
      title: "Phase 2: Build Fandom",
      tagline: "In-App Community Engine",
      objective: "Embed discussion forums, interactive watch-parties, and fan theories directly next to series play bars.",
      customerBenefit: "Provides a collaborative space to theorize and connect without shifting to third-party social apps.",
      businessBenefit: "Amplifies user session durations and establishes organic retention moats.",
      outcome: "+15% average watch time per active session.",
      kpis: "Community Participation Rate, 30d Cohort Retention, Viral K-Factor",
      icon: <Users size={18} />
    },
    {
      title: "Phase 3: Expand the IP Ecosystem",
      tagline: "Multi-Surface Monetization",
      objective: "Link streaming accounts directly to merchandise stores, console games, local events, and park tickets.",
      customerBenefit: "Unlock exclusive fandom merchandise, beta game access, and discount screening tickets.",
      businessBenefit: "Monetizes the user across multiple revenue streams, reducing Reliance on pure subscription fees.",
      outcome: "+30% average revenue per user (ARPU) expansion.",
      kpis: "Merchandise Purchase Conversion, Churn Rate, Non-Subscription Revenue",
      icon: <Gamepad2 size={18} />
    }
  ];

  // Section 5: Ecosystem Map State
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const ecosystemNodes = {
    streaming: {
      title: "1. Premium Streaming",
      val: "Prestige streaming portal serving as the initial user landing node.",
      rev: "Ad-supported subscription & Premium tier fees.",
      ret: "Daily/weekly active session triggers.",
      biz: "Establishes direct billing & customer relationship."
    },
    community: {
      title: "2. Discussion Hubs",
      val: "In-app community forums next to video player content.",
      rev: "Sponsored creator events & branded virtual items.",
      ret: "Reduces user exit velocities via social loops.",
      biz: "Drives organic acquisition referrals (K-factor)."
    },
    merchandise: {
      title: "3. Official Merchandise",
      val: "E-commerce integrations for limited collectibles & clothing.",
      rev: "Direct merch sales & licensing royalties.",
      ret: "Extends franchise identity into offline daily life.",
      biz: "Expands ARPU without requiring high content budgets."
    },
    gaming: {
      title: "4. Interactive Gaming",
      val: "Companion mobile games and AAA console links.",
      rev: "In-app purchases, game licensing, & DLC sales.",
      ret: "Engages users during mid-season production gaps.",
      biz: "Cross-monetizes gamers into active streaming cohorts."
    },
    events: {
      title: "5. Screening Events",
      val: "Exclusive theater screenings and fan conventions.",
      rev: "Ticket sales & sponsored brand event collaborations.",
      ret: "Strengthens community affinity with shared physical memories.",
      biz: "Generates localized marketing buzz at low cost."
    },
    licensing: {
      title: "6. Brand Partnerships",
      val: "IP licensing to consumer brands (food, tech, apparel).",
      rev: "Upfront licensing fees & trailing royalty loops.",
      ret: "Establishes constant public brand visibility.",
      biz: "Zero-marginal-cost revenue generation from existing IP."
    },
    parks: {
      title: "7. Experiential Parks",
      val: "Co-branded studio zones in local theme parks.",
      rev: "Ticket commissions & location licensing fees.",
      ret: "The ultimate peak of brand engagement and customer loyalty.",
      biz: "Secures long-term corporate physical assets."
    }
  };

  // Section 8: Risks & Mitigations Flip State
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const risks = [
    {
      risk: "Low Free-to-Paid Conversion",
      mitigation: "Design the free tier as a teaser engine to build curiosity, not a replacement. Limit content seasons, lock finale episodes, and trigger FOMO notifications right at the climax of narrative arcs."
    },
    {
      risk: "Ad-Load Disrupting Premium UI",
      mitigation: "Strict frequency capping (max 2 minutes of ads per hour) and high-value context matches. An ad for a DC collectible model displayed during a Batman film feels like content, not interruption."
    },
    {
      risk: "Strong Competitor Response",
      mitigation: "Double-down on our irreplacable IP. Competitors can buy local content, but they cannot buy decades of Harry Potter, DC comics, or Game of Thrones. Play in areas where we own the franchise rights."
    },
    {
      risk: "High Content Dubbing Costs",
      mitigation: "Focus localization resources strictly on the top 10 prestige titles first. Subtitle or dub only the core assets that command global fandom, rather than the entire bulk catalogue."
    }
  ];

  return (
    <div className="min-h-screen bg-portfolio-bg text-portfolio-textSec font-inter pb-24 relative overflow-hidden">
      {/* Ambient glowing orb background */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-purple-950/15 via-amber-950/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Header Sticky Bar */}
      <div className="border-b border-portfolio-card bg-portfolio-bgSec/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="flex items-center gap-2 text-portfolio-gold hover:text-white transition-colors text-xs font-mono tracking-widest uppercase">
          <ArrowLeft size={16} />
          Back to Sanctum
        </Link>
        <span className="font-mono text-[10px] text-portfolio-textSec/60 hidden sm:inline">STRATEGY CASE STUDY: WARNER BROS. DISCOVERY</span>
        
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-portfolio-gold transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      {/* Sticky Navigation Tabs (Non-recruiter mode only) */}
      {!recruiterMode && (
        <div className="bg-portfolio-bgSec/50 border-b border-portfolio-card py-2.5 px-6 sticky top-[53px] z-40 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-6 text-[10px] font-mono whitespace-nowrap">
          <button onClick={() => scrollTo(heroRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "hero" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>0. Hero</button>
          <button onClick={() => scrollTo(coreRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "core" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>1. Insights</button>
          <button onClick={() => scrollTo(landscapeRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "landscape" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>2. Competitors</button>
          <button onClick={() => scrollTo(opportunityRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "opportunity" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>3. The Gap</button>
          <button onClick={() => scrollTo(strategyRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "strategy" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>4. Phases</button>
          <button onClick={() => scrollTo(ecosystemRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "ecosystem" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>5. Ecosystem</button>
          <button onClick={() => scrollTo(visionRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "vision" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>6. Vision</button>
          <button onClick={() => scrollTo(metricsRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "metrics" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>7. Metrics</button>
          <button onClick={() => scrollTo(risksRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "risks" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>8. Risks</button>
          <button onClick={() => scrollTo(conclusionRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "conclusion" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>9. Recommendation</button>
          <button onClick={() => scrollTo(pmThinkingRef)} className={`hover:text-portfolio-gold transition-colors ${activeTab === "pmthinking" ? "text-portfolio-gold font-bold" : "text-portfolio-textSec"}`}>10. PM Thinking</button>
        </div>
      )}

      {/* Recruiter Mode Banner */}
      {recruiterMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-500 py-2 px-6 text-center text-xs font-mono tracking-wider sticky top-[53px] z-40 backdrop-blur-md flex items-center justify-center gap-2">
          <Crown size={14} className="animate-pulse" />
          <span>RECRUITER MODE ACTIVE: Condensed 2-Minute Executive Summary View</span>
        </div>
      )}

      {/* Main Content Body */}
      <div className="max-w-4xl mx-auto px-6 mt-12 z-10 relative">
        <AnimatePresence mode="wait">
          {recruiterMode ? (
            /* ========================================================
               RECRUITER MODE CONDENSED VIEW
               ======================================================== */
            <motion.div
              key="recruiter-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Condensed Hero */}
              <section className="space-y-4 text-center py-8">
                <span className="font-mono text-xs tracking-widest text-portfolio-gold uppercase block">Recruiter Summary</span>
                <h1 className="font-cinzel text-3xl md:text-5xl text-white font-extrabold tracking-wide leading-tight">
                  Warner Bros. Discovery
                </h1>
                <p className="font-cormorant italic text-lg md:text-xl text-portfolio-textSec max-w-xl mx-auto">
                  From Streaming Platform to Franchise Ecosystem
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="text-[9px] font-mono px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">Product Strategy</span>
                  <span className="text-[9px] font-mono px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">Monetization Loops</span>
                  <span className="text-[9px] font-mono px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">India Market</span>
                </div>
              </section>

              {/* Problem & Insight Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="border border-red-500/20 bg-red-950/5 p-5 rounded-xl space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle size={14} /> The Problem
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300">
                    WBD's premium streaming model struggles in India's price-sensitive environment. While owning global IP (Game of Thrones, DC), WBD faces flat subscriber metrics because consumers hesitate to pay high upfront fees for unfamiliar premium catalog contents.
                  </p>
                </div>
                <div className="border border-portfolio-gold/20 bg-portfolio-gold/5 p-5 rounded-xl space-y-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-portfolio-gold font-bold flex items-center gap-1.5">
                    <Sparkles size={14} /> The Core Insight
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300">
                    <strong>WBD doesn't have a content problem; it has a conversion problem.</strong> By leveraging core IP to build an integrated franchise ecosystem (streaming, community, gaming, merchandising), we monetize the fan lifecycle rather than relying solely on monthly subscription fees.
                  </p>
                </div>
              </section>

              {/* Condensed 3-Phase Strategy */}
              <section className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl space-y-6">
                <h3 className="font-cinzel text-sm text-white font-bold tracking-wider uppercase border-b border-portfolio-card pb-2">
                  The Proposed Strategy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-portfolio-bg p-4 rounded-xl space-y-1">
                    <span className="font-mono text-[9px] text-portfolio-gold font-bold uppercase block">Phase 1: Entry</span>
                    <h4 className="font-cinzel text-xs text-white font-bold">Freemium Funnel</h4>
                    <p className="text-[10px] text-portfolio-textSec leading-relaxed mt-1">Lower CAC via a localized, ad-supported free tier showcasing HBO pilots and trailers.</p>
                  </div>
                  <div className="bg-portfolio-bg p-4 rounded-xl space-y-1">
                    <span className="font-mono text-[9px] text-portfolio-purple font-bold uppercase block">Phase 2: Engage</span>
                    <h4 className="font-cinzel text-xs text-white font-bold">Fandom Hubs</h4>
                    <p className="text-[10px] text-portfolio-textSec leading-relaxed mt-1">Drive in-app community discussions and theory-crafting directly within the play timeline to boost retention.</p>
                  </div>
                  <div className="bg-portfolio-bg p-4 rounded-xl space-y-1">
                    <span className="font-mono text-[9px] text-portfolio-blue font-bold uppercase block">Phase 3: Monetize</span>
                    <h4 className="font-cinzel text-xs text-white font-bold">IP Ecosystem</h4>
                    <p className="text-[10px] text-portfolio-textSec leading-relaxed mt-1">Monetize off-screen touchpoints (merchandise, console games, localized convention ticket sales).</p>
                  </div>
                </div>
              </section>

              {/* Condensed Metrics Dashboard */}
              <section className="border border-portfolio-card bg-portfolio-bgSec/20 p-6 rounded-2xl space-y-4">
                <h3 className="font-cinzel text-sm text-white font-bold tracking-wider uppercase">Projected Business Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-portfolio-card bg-portfolio-bgSec p-3 rounded-lg text-center">
                    <div className="font-mono text-[9px] text-slate-500 uppercase">North Star</div>
                    <div className="font-cinzel text-md text-portfolio-gold font-bold mt-1">Watch Time</div>
                    <div className="text-[8px] text-slate-400 mt-0.5">per Active User</div>
                  </div>
                  <div className="border border-portfolio-card bg-portfolio-bgSec p-3 rounded-lg text-center">
                    <div className="font-mono text-[9px] text-slate-500 uppercase">Conversion</div>
                    <div className="font-cinzel text-md text-portfolio-purple font-bold mt-1">18%</div>
                    <div className="text-[8px] text-slate-400 mt-0.5">Free-to-Paid Cohort</div>
                  </div>
                  <div className="border border-portfolio-card bg-portfolio-bgSec p-3 rounded-lg text-center">
                    <div className="font-cinzel text-md text-portfolio-blue font-bold mt-1">+30%</div>
                    <div className="font-mono text-[9px] text-slate-500 uppercase mt-0.5">ARPU Expansion</div>
                    <div className="text-[8px] text-slate-400 mt-0.5">Ecosystem Mon</div>
                  </div>
                  <div className="border border-portfolio-card bg-portfolio-bgSec p-3 rounded-lg text-center">
                    <div className="font-cinzel text-md text-emerald-400 font-bold mt-1">+15%</div>
                    <div className="font-mono text-[9px] text-slate-500 uppercase mt-0.5">Session Length</div>
                    <div className="text-[8px] text-slate-400 mt-0.5">Fandom Engagement</div>
                  </div>
                </div>
              </section>

              {/* Key Product Decisions & Trade-offs */}
              <section className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="font-cinzel text-sm text-white font-bold tracking-wider uppercase">Key Trade-offs & Decisions</h3>
                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <p>
                    <strong>1. Friction vs. Volume:</strong> Curating a completely free, ad-supported tier risk cannibalizing premium subscribers. However, the decision was made to restrict the free catalog to seasonal pilots and teaser runs, establishing a visual boundary that converts casual viewers through natural narrative hooks.
                  </p>
                  <p>
                    <strong>2. Local Catalog Scale vs. Global IP Moat:</strong> While competitors buy local sports rights and produce mass local content, WBD prioritizes localizing and dubbing core prestige assets first. This manages structural localization costs while doubling down on irreplaceable franchise IPs.
                  </p>
                </div>
              </section>

              {/* Recruiter Conclusion Callout */}
              <div className="bg-portfolio-gold/5 border border-portfolio-gold/20 p-5 rounded-xl text-center">
                <span className="font-mono text-[9px] text-portfolio-gold font-bold tracking-widest uppercase block mb-1">Executive Takeaway</span>
                <p className="font-cormorant italic text-lg text-white">
                  "Streaming is simply the conversion door. The true, long-term business is the integrated franchise ecosystem house."
                </p>
              </div>
            </motion.div>
          ) : (
            /* ========================================================
               FULL FULL INTERACTIVE STRATEGY PRESENTATION
               ======================================================== */
            <motion.div
              key="full-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-24"
            >
              {/* ================= HERO SECTION ================= */}
              <section ref={heroRef} className="space-y-8 text-center pt-8 relative min-h-[70vh] flex flex-col justify-center items-center">
                <span className="font-mono text-xs tracking-widest text-portfolio-gold uppercase block">Featured Strategy Case Study</span>
                
                <h1 className="font-cinzel text-4xl md:text-6xl text-white font-extrabold tracking-wide leading-tight max-w-3xl">
                  Warner Bros. Discovery
                </h1>
                
                <h3 className="font-cormorant italic text-xl md:text-3xl text-portfolio-textSec max-w-2xl">
                  From Streaming Platform to Franchise Ecosystem
                </h3>

                <p className="font-inter text-xs md:text-sm text-slate-400 max-w-lg leading-relaxed">
                  An IP-led growth strategy for Warner Bros. Discovery in India, converting price-sensitive streaming viewers into loyal franchise superfans.
                </p>

                {/* Hero Metadata Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl py-6 border-t border-b border-portfolio-card/45 mt-4">
                  <div className="text-center">
                    <span className="font-mono text-[9px] uppercase text-slate-500 block">Category</span>
                    <span className="font-cinzel text-xs text-white font-bold mt-1 block">Product Strategy</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-[9px] uppercase text-slate-500 block">Est. Reading</span>
                    <span className="font-cinzel text-xs text-white font-bold mt-1 block">6 Minutes</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-[9px] uppercase text-slate-500 block">Difficulty</span>
                    <span className="font-cinzel text-xs text-portfolio-gold font-bold mt-1 block">Advanced</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-[9px] uppercase text-slate-500 block">Focus Market</span>
                    <span className="font-cinzel text-xs text-white font-bold mt-1 block">India (Growth)</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {["Product Strategy", "Streaming", "Consumer Technology", "Growth Strategy", "Business Model Innovation"].map((tag) => (
                    <span key={tag} className="text-[9px] font-mono px-3 py-1 bg-portfolio-bgSec border border-portfolio-card text-portfolio-textSec rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Begin strategy journey button */}
                <button
                  onClick={() => scrollTo(coreRef)}
                  className="flex items-center gap-2 px-6 py-3 bg-portfolio-gold text-portfolio-bg hover:bg-transparent hover:text-portfolio-gold border border-portfolio-gold font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-lg shadow-lg mt-8"
                >
                  <span>Begin Strategy Journey</span>
                  <ChevronRight size={14} />
                </button>
              </section>

              {/* ================= SECTION 1: THE CORE INSIGHT ================= */}
              <section ref={coreRef} className="space-y-8 pt-4">
                <div className="flex items-center gap-2 text-portfolio-gold mb-2">
                  <Film size={18} />
                  <span className="font-mono text-xs tracking-[0.3em] uppercase">The Core Insight</span>
                </div>
                
                {/* Visual Insight banner */}
                <div className="bg-portfolio-gold/5 border border-portfolio-gold/30 p-8 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-portfolio-gold/10 rounded-full blur-xl pointer-events-none" />
                  <h3 className="font-cinzel text-lg md:text-xl text-portfolio-gold uppercase tracking-wider font-bold mb-4">
                    The TL;DR Summary
                  </h3>
                  <p className="font-cormorant italic text-xl md:text-2xl text-white leading-relaxed max-w-2xl">
                    "WBD doesn't have a content problem — it has a conversion problem."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {/* Problem cards */}
                  <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl space-y-3 transition-transform hover:-translate-y-1">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">Problem Node 1</span>
                    <h4 className="font-cinzel text-xs text-white font-bold uppercase">Customer Problem</h4>
                    <p className="text-xs leading-relaxed text-portfolio-textSec">
                      Indian users are highly value-conscious and hesitate to commit upfront subscription fees for premium content catalogs they haven't experienced.
                    </p>
                  </div>

                  <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl space-y-3 transition-transform hover:-translate-y-1">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">Problem Node 2</span>
                    <h4 className="font-cinzel text-xs text-white font-bold uppercase">Market Problem</h4>
                    <p className="text-xs leading-relaxed text-portfolio-textSec">
                      Competitors (Netflix, Amazon, JioHotstar) dominate local regional language libraries and mass live sports, leaving a narrow space for pure streaming models.
                    </p>
                  </div>

                  <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl space-y-3 transition-transform hover:-translate-y-1">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">Problem Node 3</span>
                    <h4 className="font-cinzel text-xs text-white font-bold uppercase">Business Problem</h4>
                    <p className="text-xs leading-relaxed text-portfolio-textSec">
                      Catalog size alone cannot sustain growth in high-churn environments. Monetization models must extend beyond subscriptions.
                    </p>
                  </div>
                </div>
              </section>

              {/* ================= SECTION 2: THE MARKET LANDSCAPE ================= */}
              <section ref={landscapeRef} className="space-y-8 pt-4">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-portfolio-card pb-3">
                  <div className="flex items-center gap-2 text-portfolio-gold">
                    <Globe size={18} />
                    <span className="font-mono text-xs tracking-[0.3em] uppercase">Market Landscape</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Competitive Positioning Matrix</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Select Competitor Tabs */}
                  <div className="lg:col-span-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 no-scrollbar">
                    {Object.entries(competitors).map(([key, comp]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCompetitor(key)}
                        className={`w-full text-left p-4 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink ${
                          selectedCompetitor === key
                            ? comp.color + " border-opacity-100 shadow-md font-bold"
                            : "border-portfolio-card bg-portfolio-bgSec/20 hover:bg-portfolio-card text-portfolio-textSec"
                        }`}
                      >
                        {comp.name}
                      </button>
                    ))}
                  </div>

                  {/* Competitor Card Display */}
                  <div className="lg:col-span-3 border border-portfolio-card bg-portfolio-bgSec/30 p-6 rounded-2xl flex flex-col justify-between h-72">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-cinzel text-md text-white font-bold tracking-wider">
                          {competitors[selectedCompetitor as keyof typeof competitors].name}
                        </h4>
                        <span className="font-mono text-[9px] border border-slate-700 px-2 py-0.5 rounded text-slate-400">
                          {competitors[selectedCompetitor as keyof typeof competitors].position}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 pt-3 border-t border-portfolio-card/45 text-xs">
                        <div>
                          <strong className="text-white block font-mono text-[9px] uppercase tracking-wider mb-0.5">Strengths:</strong>
                          <span className="text-slate-350">{competitors[selectedCompetitor as keyof typeof competitors].strengths}</span>
                        </div>
                        <div>
                          <strong className="text-red-400 block font-mono text-[9px] uppercase tracking-wider mb-0.5">Weaknesses:</strong>
                          <span className="text-slate-350">{competitors[selectedCompetitor as keyof typeof competitors].weaknesses}</span>
                        </div>
                        <div>
                          <strong className="text-portfolio-gold block font-mono text-[9px] uppercase tracking-wider mb-0.5">Unique Moat:</strong>
                          <span className="text-slate-300 italic">"{competitors[selectedCompetitor as keyof typeof competitors].moat}"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= SECTION 3: THE OPPORTUNITY ================= */}
              <section ref={opportunityRef} className="space-y-8 pt-4">
                <div className="flex items-center gap-2 text-portfolio-gold">
                  <Compass size={18} />
                  <span className="font-mono text-xs tracking-[0.3em] uppercase">The Market Opportunity</span>
                </div>

                <p className="text-sm leading-relaxed max-w-2xl">
                  Most platforms focus on mass local production or catalog breadth. However, there is a distinct premium segment in India that has outgrown traditional formats and craves prestige storytelling. Hover or click below to reveal this hidden opportunity.
                </p>

                {/* Spotlight Interactive Box */}
                <div 
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onClick={() => setSpotlightClicked(!spotlightClicked)}
                  className="relative h-[250px] w-full border border-portfolio-card bg-[#04060a] rounded-3xl overflow-hidden cursor-crosshair select-none"
                  style={{
                    backgroundImage: `radial-gradient(circle 90px at ${spotlightPosition.x}% ${spotlightPosition.y}%, transparent 80%, rgba(4, 6, 10, 0.98) 100%)`
                  }}
                >
                  {/* Subtle vector background overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                  {/* Hidden Text Revealed by Spotlight */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 pointer-events-none">
                    <span className="font-mono text-[9px] text-portfolio-gold tracking-[0.25em] uppercase block">Revealed Opportunity</span>
                    <h3 className="font-cinzel text-xl md:text-2xl text-white font-extrabold tracking-wide">
                      "The Gap No One Owns"
                    </h3>
                    <p className="font-cormorant italic text-lg md:text-xl text-portfolio-gold max-w-xl">
                      Prestige storytelling for India's premium audience.
                    </p>
                    <p className="text-[10px] text-slate-400 max-w-md leading-relaxed hidden sm:block">
                      Urban viewers hook onto Game of Thrones, Succession, or The Last of Us, yet no platform has built active communities or offline experience ecosystems around this premium identity.
                    </p>
                  </div>

                  {/* Move/click overlay indicator */}
                  <div className="absolute bottom-4 right-6 font-mono text-[8px] text-slate-500 tracking-wider uppercase pointer-events-none flex items-center gap-1.5">
                    <Zap size={10} className="animate-pulse" />
                    <span>Move cursor to shine spotlight</span>
                  </div>
                </div>
              </section>

              {/* ================= SECTION 4: INTERACTIVE PRODUCT STRATEGY ================= */}
              <section ref={strategyRef} className="space-y-8 pt-4">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-portfolio-card pb-3">
                  <div className="flex items-center gap-2 text-portfolio-gold">
                    <Layers size={18} />
                    <span className="font-mono text-xs tracking-[0.3em] uppercase">Interactive Strategy</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Proposed Phased Roadmap</span>
                </div>

                <div className="space-y-6">
                  {/* Timeline Horizontal Selector */}
                  <div className="grid grid-cols-3 gap-2 border-b border-portfolio-card/45 pb-3">
                    {phases.map((phase, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhase(idx)}
                        className={`py-3 text-center transition-all flex flex-col items-center gap-1.5 border-b-2 ${
                          activePhase === idx
                            ? "border-portfolio-gold text-white font-bold"
                            : "border-transparent text-portfolio-textSec hover:text-white"
                        }`}
                      >
                        <div className={`p-1.5 rounded-full ${activePhase === idx ? "bg-portfolio-gold/10 text-portfolio-gold" : "bg-portfolio-card/30 text-slate-500"}`}>
                          {phase.icon}
                        </div>
                        <span className="font-mono text-[9px] tracking-wider uppercase block">{phase.tagline}</span>
                      </button>
                    ))}
                  </div>

                  {/* Expanded Phase Details */}
                  <div className="border border-portfolio-card bg-portfolio-bgSec/20 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="font-mono text-[9px] text-portfolio-gold uppercase tracking-widest block">Phase {activePhase + 1}</span>
                        <h4 className="font-cinzel text-md md:text-lg text-white font-bold tracking-wide mt-1">
                          {phases[activePhase].title}
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] bg-slate-900 border border-slate-800 px-3 py-1 rounded text-portfolio-gold uppercase">
                        KPI: {phases[activePhase].kpis.split(",")[0]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-portfolio-card/40 text-xs">
                      <div className="space-y-3">
                        <div>
                          <strong className="text-white block font-mono text-[8px] uppercase tracking-wider">Objective:</strong>
                          <p className="text-slate-350 mt-1 leading-relaxed">{phases[activePhase].objective}</p>
                        </div>
                        <div>
                          <strong className="text-portfolio-purple block font-mono text-[8px] uppercase tracking-wider">Customer Benefit:</strong>
                          <p className="text-slate-350 mt-1 leading-relaxed">{phases[activePhase].customerBenefit}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <strong className="text-portfolio-blue block font-mono text-[8px] uppercase tracking-wider">Business Benefit:</strong>
                          <p className="text-slate-350 mt-1 leading-relaxed">{phases[activePhase].businessBenefit}</p>
                        </div>
                        <div className="bg-portfolio-gold/5 border border-portfolio-gold/25 p-3 rounded-lg">
                          <strong className="text-portfolio-gold block font-mono text-[8px] uppercase tracking-wider mb-0.5">Expected Target:</strong>
                          <span className="text-white italic">"{phases[activePhase].outcome}"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= SECTION 5: ECOSYSTEM MAP ================= */}
              <section ref={ecosystemRef} className="space-y-8 pt-4">
                <div className="flex items-center gap-2 text-portfolio-gold">
                  <Users size={18} />
                  <span className="font-mono text-xs tracking-[0.3em] uppercase">Franchise Ecosystem Map</span>
                </div>

                <p className="text-sm leading-relaxed max-w-2xl">
                  Streaming is simply the conversion gate. WBD's true moat lies in monetizing fans across multiple integrated physical and digital channels. Hover over the nodes below to trace the ecosystem loop:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {/* Ecosystem list */}
                  <div className="md:col-span-1 flex flex-col gap-2">
                    {Object.entries(ecosystemNodes).map(([key, node]) => (
                      <div
                        key={key}
                        onMouseEnter={() => setHoveredNode(key)}
                        className={`p-3 border rounded-xl cursor-pointer transition-all duration-300 font-mono text-[10px] tracking-wider uppercase ${
                          hoveredNode === key
                            ? "border-portfolio-gold bg-portfolio-gold/10 text-white font-bold"
                            : "border-portfolio-card bg-portfolio-bgSec/20 hover:border-portfolio-card/80 text-portfolio-textSec"
                        }`}
                      >
                        {node.title}
                      </div>
                    ))}
                  </div>

                  {/* Ecosystem Interactive Node Detail panel */}
                  <div className="md:col-span-2 border border-portfolio-card bg-[#0b0e14] p-6 rounded-2xl flex flex-col justify-between h-72 relative">
                    {/* Circle design */}
                    <div className="absolute top-2 right-4 w-12 h-12 bg-portfolio-gold/5 rounded-full blur-md" />
                    
                    {hoveredNode ? (
                      <div className="space-y-4">
                        <div>
                          <span className="font-mono text-[8px] text-portfolio-gold uppercase tracking-widest">Ecosystem Branch Node</span>
                          <h4 className="font-cinzel text-sm text-white font-bold mt-1">
                            {ecosystemNodes[hoveredNode as keyof typeof ecosystemNodes].title.slice(3)}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-portfolio-card/45 text-[11px] leading-relaxed">
                          <div>
                            <strong className="text-slate-400 block font-mono text-[8px] uppercase tracking-wider">Concept:</strong>
                            <p className="text-slate-200 mt-1">{ecosystemNodes[hoveredNode as keyof typeof ecosystemNodes].val}</p>
                          </div>
                          <div>
                            <strong className="text-portfolio-purple block font-mono text-[8px] uppercase tracking-wider">Revenue Stream:</strong>
                            <p className="text-slate-200 mt-1">{ecosystemNodes[hoveredNode as keyof typeof ecosystemNodes].rev}</p>
                          </div>
                          <div>
                            <strong className="text-portfolio-blue block font-mono text-[8px] uppercase tracking-wider">Retention Value:</strong>
                            <p className="text-slate-200 mt-1">{ecosystemNodes[hoveredNode as keyof typeof ecosystemNodes].ret}</p>
                          </div>
                          <div>
                            <strong className="text-portfolio-gold block font-mono text-[8px] uppercase tracking-wider">Business Moat:</strong>
                            <p className="text-slate-200 mt-1">{ecosystemNodes[hoveredNode as keyof typeof ecosystemNodes].biz}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-65">
                        <Zap size={24} className="text-portfolio-gold/45 mb-2 animate-bounce" />
                        <p className="font-cormorant italic text-md text-portfolio-textSec">
                          Hover over any ecosystem branch node on the left to analyze the cross-monetization dynamics.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* ================= SECTION 6: PRODUCT VISION QUOTE ================= */}
              <section ref={visionRef} className="py-12 border-t border-b border-portfolio-card/45 relative overflow-hidden">
                {/* Subtle moving particles indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-portfolio-purple/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="max-w-2xl mx-auto text-center space-y-4">
                  <span className="font-mono text-[9px] text-slate-500 tracking-[0.3em] uppercase block">The Strategy Vision</span>
                  <blockquote className="font-cinzel text-2xl md:text-3xl text-white font-extrabold leading-normal tracking-wide">
                    "Streaming is the door.
                    <br />
                    The franchise ecosystem is the house."
                  </blockquote>
                  <p className="font-cormorant italic text-sm text-portfolio-gold tracking-wider mt-2">
                    — Positioning WBD as India's premier franchise destination.
                  </p>
                </div>
              </section>

              {/* ================= SECTION 7: SUCCESS METRICS DASHBOARD ================= */}
              <section ref={metricsRef} className="space-y-8 pt-4">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-portfolio-card pb-3">
                  <div className="flex items-center gap-2 text-portfolio-gold">
                    <TrendingUp size={18} />
                    <span className="font-mono text-xs tracking-[0.3em] uppercase">Metrics Dashboard</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Strategic Performance Telemetry</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* North Star */}
                  <div className="border border-portfolio-gold/30 bg-portfolio-gold/5 p-6 rounded-2xl space-y-4 text-center">
                    <span className="font-mono text-[9px] text-portfolio-gold uppercase tracking-widest block font-bold">North Star Metric</span>
                    <div className="h-10 w-10 bg-portfolio-gold/10 rounded-full flex items-center justify-center text-portfolio-gold mx-auto">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-md text-white font-bold uppercase tracking-wider">Monthly Watch Time</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Average monthly viewing minutes per user</p>
                    </div>
                    <div className="pt-2 border-t border-portfolio-card/40">
                      <span className="text-xs text-portfolio-textSec leading-relaxed">If fans watch more content, ad yield, conversion rates, and retention follow automatically.</span>
                    </div>
                  </div>

                  {/* Business Metrics */}
                  <div className="border border-portfolio-card bg-portfolio-bgSec/30 p-6 rounded-2xl space-y-4">
                    <span className="font-mono text-[9px] text-portfolio-purple uppercase tracking-widest block font-bold text-center">Business Metrics</span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-350">Free-to-Paid Conversion</span>
                          <span className="text-portfolio-purple font-mono font-bold">18%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-portfolio-purple h-full" style={{ width: '18%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-350">Ecosystem ARPU Boost</span>
                          <span className="text-portfolio-purple font-mono font-bold">+30%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-portfolio-purple h-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                      <div className="pt-1 text-[10px] text-slate-400 leading-relaxed font-light">
                        Measures the direct health of the commerce funnel: LTV expansion and ad-impression yield rates.
                      </div>
                    </div>
                  </div>

                  {/* Product Metrics */}
                  <div className="border border-portfolio-card bg-portfolio-bgSec/30 p-6 rounded-2xl space-y-4">
                    <span className="font-mono text-[9px] text-portfolio-blue uppercase tracking-widest block font-bold text-center">Product Metrics</span>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-350">Fandom Hub Participation</span>
                          <span className="text-portfolio-blue font-mono font-bold">45%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-portfolio-blue h-full" style={{ width: '45%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-350">Watch-Time Session Lift</span>
                          <span className="text-portfolio-blue font-mono font-bold">+15%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-portfolio-blue h-full" style={{ width: '15%' }} />
                        </div>
                      </div>
                      <div className="pt-1 text-[10px] text-slate-400 leading-relaxed font-light">
                        Monitors platform product health: active/daily user ratios, completion rates, and search placement CTR.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= SECTION 8: RISKS & MITIGATIONS ================= */}
              <section ref={risksRef} className="space-y-8 pt-4">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-portfolio-card pb-3">
                  <div className="flex items-center gap-2 text-portfolio-gold">
                    <AlertTriangle size={18} />
                    <span className="font-mono text-xs tracking-[0.3em] uppercase">Risks & Mitigations</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Tap cards to flip and view mitigations</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {risks.map((item, idx) => {
                    const isFlipped = flippedCards[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleFlip(idx)}
                        className="flip-card-container h-44 w-full cursor-pointer"
                      >
                        <div className={`flip-card-inner w-full h-full relative ${isFlipped ? "flipped" : ""}`} style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
                          
                          {/* Front Side: Risk */}
                          <div className="flip-card-front w-full h-full border border-portfolio-card bg-[#0b0e14] p-5 rounded-2xl flex flex-col justify-between items-start">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-mono text-[9px] text-red-400 font-bold uppercase tracking-wider bg-red-950/10 border border-red-900/35 px-2.5 py-0.5 rounded-full">Risk Factor {idx + 1}</span>
                              <Rotate3d size={14} className="text-slate-500 hover:text-white" />
                            </div>
                            <h4 className="font-cinzel text-xs md:text-sm text-white font-extrabold tracking-wide uppercase leading-snug">
                              {item.risk}
                            </h4>
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Click to see mitigation →</span>
                          </div>

                          {/* Back Side: Mitigation */}
                          <div className="flip-card-back w-full h-full border border-portfolio-gold/20 bg-portfolio-gold/5 p-5 rounded-2xl flex flex-col justify-between items-start">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-mono text-[9px] text-portfolio-gold font-bold uppercase tracking-wider bg-portfolio-gold/10 border border-portfolio-gold/20 px-2.5 py-0.5 rounded-full">Mitigation Strategy</span>
                              <Rotate3d size={14} className="text-portfolio-gold" />
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-350 font-light italic">
                              "{item.mitigation}"
                            </p>
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Click to view risk ←</span>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ================= SECTION 9: FINAL RECOMMENDATION ================= */}
              <section ref={conclusionRef} className="space-y-8 pt-4 py-12">
                <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-8 rounded-3xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-portfolio-gold/5 rounded-full blur-[100px] pointer-events-none" />
                  
                  <span className="font-mono text-xs text-portfolio-gold tracking-[0.4em] uppercase block">Final Keynote Takeaway</span>
                  
                  <h3 className="font-cinzel text-xl md:text-3xl text-white font-bold leading-normal">
                    Transform viewers into lifelong fans.
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-slate-400">
                    <span>Don't build subscribers.</span>
                    <span className="hidden sm:inline">→</span>
                    <span className="text-white">Build fans.</span>
                    <span className="hidden sm:inline">→</span>
                    <span className="text-portfolio-gold">Build ecosystems.</span>
                  </div>

                  <p className="font-cormorant italic text-md md:text-lg text-slate-350 max-w-xl leading-relaxed">
                    By scaling past the traditional video-grid layout and addressing customer conversion barriers directly, Warner Bros. Discovery India secures a high-margin ecosystem positioned for long-term customer lifetime value.
                  </p>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= PM THINKING PANEL (Always visible in both views) ================= */}
        <section ref={pmThinkingRef} className="border border-portfolio-purple/20 bg-portfolio-purple/5 rounded-2xl overflow-hidden pt-2 mt-20">
          <div className="flex items-center gap-3 p-6 bg-portfolio-purple/10 border-b border-portfolio-purple/20">
            <HelpCircle className="text-portfolio-purple animate-pulse" size={20} />
            <div>
              <h3 className="font-cinzel text-md text-white font-bold tracking-wide">Product Thinking Notes</h3>
              <p className="text-[10px] text-portfolio-purple font-mono uppercase tracking-wider mt-0.5">Tactical framework mappings</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-white tracking-wider uppercase font-bold">Problem Framing</h5>
              <p className="text-portfolio-textSec leading-relaxed">Defining WBD's barrier as a conversion funnel bottleneck, not a content library failure.</p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-white tracking-wider uppercase font-bold">Market Analysis</h5>
              <p className="text-portfolio-textSec leading-relaxed">Mapping Netflix's personalization vs. JioHotstar's sports and regional volume models.</p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-white tracking-wider uppercase font-bold">Competitive Strategy</h5>
              <p className="text-portfolio-textSec leading-relaxed">Targeting the high-affinity "prestige storytelling" segment where competitors lack custom social tools.</p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-portfolio-gold tracking-wider uppercase font-bold">Monetization</h5>
              <p className="text-portfolio-textSec leading-relaxed">Unlocking ARPU expansions via interactive gaming links, collections merchandising, and experiences licensing.</p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-portfolio-purple tracking-wider uppercase font-bold">Retention Strategy</h5>
              <p className="text-portfolio-textSec leading-relaxed">Transforming solo video sessions into active community loops through local fandom forums.</p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-portfolio-blue tracking-wider uppercase font-bold">Ecosystem Thinking</h5>
              <p className="text-portfolio-textSec leading-relaxed">Designing nodes that feed off-screen loops (theme parks) from on-screen triggers (video catalog).</p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-white tracking-wider uppercase font-bold">North Star Metrics</h5>
              <p className="text-portfolio-textSec leading-relaxed">Prioritizing Monthly Watch Time per user to ensure structural conversion health before charging fees.</p>
            </div>
            <div className="border border-portfolio-card bg-portfolio-bgSec/60 p-4 rounded-xl space-y-1.5">
              <h5 className="font-cinzel text-[10px] text-white tracking-wider uppercase font-bold">Trade-offs</h5>
              <p className="text-portfolio-textSec leading-relaxed">Balancing free-tier catalog limits against subscription cannibalization rates to preserve value premium.</p>
            </div>
            <div className="border border-portfolio-purple/20 bg-portfolio-purple/5 p-4 rounded-xl flex items-center justify-center text-center">
              <div className="font-cormorant italic text-sm text-portfolio-purple leading-relaxed">
                "Product strategy is the art of deciding which doors to open, and which house to build."
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
