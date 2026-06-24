"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, Heart, Send, HelpCircle, ChevronDown, ChevronUp, Sliders, CheckCircle2 } from "lucide-react";

export default function BlinkitCaseStudy() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showInterviewBreakdown, setShowInterviewBreakdown] = useState(false);
  const [healthModeActive, setHealthModeActive] = useState(false);

  // Monitor scroll for progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Blinkit Mock Products list for simulation
  const standardProducts = [
    { name: "Lays Potato Chips - Classic Salted", category: "Snacks", calories: "152 kcal", healthScore: "2/10", price: "₹20", highlight: false },
    { name: "Coca Cola Soft Drink - 750ml", category: "Beverages", calories: "330 kcal", healthScore: "1/10", price: "₹45", highlight: false },
    { name: "Hershey's Chocolate Syrup", category: "Sweetner", calories: "230 kcal", healthScore: "2/10", price: "₹120", highlight: false }
  ];

  const healthyProducts = [
    { name: "Epigamia Natural Greek Yogurt", category: "Dairy", calories: "60 kcal", healthScore: "9/10", price: "₹45", highlight: true },
    { name: "True Elements Rolled Oats - 500g", category: "Breakfast", calories: "180 kcal", healthScore: "10/10", price: "₹190", highlight: true },
    { name: "Farmley Premium Roasted Almonds", category: "Nuts", calories: "120 kcal", healthScore: "9/10", price: "₹240", highlight: true }
  ];

  return (
    <div className="min-h-screen bg-portfolio-bg text-portfolio-textSec font-inter pb-24">
      {/* Top Banner with reading scroll progress */}
      <div className="border-b border-portfolio-card bg-portfolio-bgSec/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-portfolio-gold hover:text-white transition-colors text-xs font-mono tracking-widest uppercase">
          <ArrowLeft size={16} />
          Back to Sanctum
        </Link>
        <span className="font-mono text-[10px] text-portfolio-textSec/60">CASE STUDY: BLINKIT TEARDOWN</span>
        
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-portfolio-gold transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      {/* Sticky Quick Jump (horizontal scrollable on mobile) */}
      <div className="bg-portfolio-bgSec/40 border-b border-portfolio-card py-2.5 px-6 sticky top-[53px] z-20 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-5 text-[10px] font-mono whitespace-nowrap">
        <a href="#context" className="text-portfolio-textSec hover:text-portfolio-gold">1. Context & Problem</a>
        <a href="#audit" className="text-portfolio-textSec hover:text-portfolio-gold">2. Experience Audit</a>
        <a href="#recommendation" className="text-portfolio-textSec hover:text-portfolio-gold">3. Health Mode Recommendation</a>
        <a href="#simulation" className="text-portfolio-textSec hover:text-portfolio-gold font-bold text-portfolio-gold">4. Interactive Prototype</a>
        <a href="#metrics" className="text-portfolio-textSec hover:text-portfolio-gold">5. Business Case & Metrics</a>
        <a href="#interview" className="text-portfolio-textSec hover:text-portfolio-gold">6. PM Interview Grid</a>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Project Hero */}
        <section className="space-y-6">
          <span className="font-mono text-xs tracking-widest text-portfolio-gold uppercase block">Product Growth & Quick Commerce Teardown</span>
          <h1 className="font-cinzel text-4xl md:text-5xl text-white font-extrabold tracking-wide">
            Blinkit Product Teardown
          </h1>
          <p className="font-cormorant italic text-xl md:text-2xl text-white">
            Designing "Blinkit Health Mode" — A toggle-based shopping engine proposed to unlock a high-margin wellness grocery subscription segment.
          </p>

          {/* Key Expected Outcomes Scorecard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-portfolio-card/60">
            <div className="border border-portfolio-gold/30 bg-portfolio-gold/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-gold font-bold">+8%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">AOV Expansion</div>
            </div>
            <div className="border border-portfolio-purple/30 bg-portfolio-purple/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-purple font-bold">12%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">90d Cohort Retention Lift</div>
            </div>
            <div className="border border-portfolio-blue/30 bg-portfolio-blue/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-blue font-bold">₹2.4 Cr</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Incremental ARR</div>
            </div>
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-emerald-400 font-bold">5 Min</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Estimated Read</div>
            </div>
          </div>
        </section>

        {/* 1. Problem Space */}
        <section id="context" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            1. Problem & Context
          </h2>
          <div className="space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              Quick commerce has revolutionized Indian urban grocery shopping. However, current layout structures focus heavily on driving high-frequency impulse snacks during micro-moments.
            </p>
            <div className="border-l-4 border-portfolio-gold/60 bg-portfolio-bgSec p-4 rounded-r-xl italic font-cormorant text-md text-white">
              \"Health-conscious consumers trying to adhere to dietary checksheets experience visual friction, guilt, and purchase regret as chips, chocolates, and carbonated beverages dominate search feeds and checkout carousels.\"
            </div>
            <p>
              By ignoring health customization, platforms fail to capture the recurring weekly grocery cycles of high-income wellness demographics. We need a way to filter choices seamlessly without adding click latency.
            </p>
          </div>
        </section>

        {/* User Persona */}
        <section className="space-y-4">
          <h3 className="font-cinzel text-xs text-portfolio-gold tracking-[0.2em] uppercase">Target User Persona</h3>
          <div className="border border-portfolio-card bg-portfolio-bgSec p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start">
            <div className="h-10 w-10 rounded-full bg-portfolio-gold/15 flex items-center justify-center text-portfolio-gold shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <h4 className="font-cinzel text-sm text-white font-bold">Vikas, 28 • The Wellness Optimist</h4>
              <p className="text-xs text-portfolio-textSec leading-relaxed mt-2">
                "I order groceries weekly on Blinkit. But checkout banners aggressively push chocolates and sugary items right when I'm checking out. I want a clean, zero-friction interface to buy organic, low-glycemic foods without constant visual temptations."
              </p>
            </div>
          </div>
        </section>

        {/* 2. Experience Analysis */}
        <section id="audit" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            2. Current Experience Audit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="border border-red-500/20 bg-red-950/10 p-5 rounded-xl space-y-2">
              <h4 className="text-red-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                <AlertTriangle size={14} /> What's Broken (Pain Points)
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-300">
                <li>Aggressive checkout cross-selling pushes high-sugar chips and soft drinks.</li>
                <li>Zero aggregate macro-nutrient calculation or dietary checklist sorting (e.g. Diabetic-safe, Gluten-free).</li>
                <li>Healthy alternative products are buried deep within product list scrolls, taking 4+ taps to search.</li>
              </ul>
            </div>

            <div className="border border-emerald-500/20 bg-emerald-950/10 p-5 rounded-xl space-y-2">
              <h4 className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} /> What's Working (Strengths)
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-300">
                <li>10-minute delivery consistency remains top tier.</li>
                <li>Standard checkout and one-click OTP payment loops have high conversion.</li>
                <li>Search indexes support autocomplete queries accurately.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. PM Recommendation: Blinkit Health Mode */}
        <section id="recommendation" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            3. Recommendation: Blinkit Health Mode
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              We propose **Blinkit Health Mode** — a global toggle at the top of the interface. When turned **ON**, it filters out items with high glycemic indices or high sugar content, prioritizes organic/fresh items in product ranking, and embeds nutrient checks on checkout.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-portfolio-bgSec p-4 rounded-xl border border-portfolio-card">
                <h5 className="font-cinzel text-xs text-white font-bold uppercase">Business Rationale</h5>
                <p className="text-[11px] text-portfolio-textSec mt-1 leading-relaxed">Health Mode targets urban premium cohorts, shifting order ratios to high-margin organic sellers.</p>
              </div>
              <div className="bg-portfolio-bgSec p-4 rounded-xl border border-portfolio-card">
                <h5 className="font-cinzel text-xs text-portfolio-purple font-bold uppercase">Revenue Loop</h5>
                <p className="text-[11px] text-portfolio-textSec mt-1 leading-relaxed">Charges organic brand partnerships a sponsored search placement premium (CPC bidding).</p>
              </div>
              <div className="bg-portfolio-bgSec p-4 rounded-xl border border-portfolio-card">
                <h5 className="font-cinzel text-xs text-portfolio-blue font-bold uppercase">Retention Focus</h5>
                <p className="text-[11px] text-portfolio-textSec mt-1 leading-relaxed">Converts sporadic snack buyers into loyal, weekly recurring organic grocery subscribers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Interactive Simulation */}
        <section id="simulation" className="space-y-6 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
              4. Interactive Prototype Simulation
            </h2>
            
            {/* Health Mode Toggle */}
            <div className="flex items-center gap-2.5 bg-portfolio-bgSec border border-portfolio-card px-4 py-1.5 rounded-full">
              <span className="font-mono text-[9px] tracking-wider text-slate-400 uppercase font-bold">Health Mode</span>
              <button
                onClick={() => setHealthModeActive(!healthModeActive)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  healthModeActive ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    healthModeActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`font-mono text-[9px] font-bold uppercase ${healthModeActive ? "text-emerald-400" : "text-slate-500"}`}>
                {healthModeActive ? "ON" : "OFF"}
              </span>
            </div>
          </div>
          <p className="text-sm">
            Toggle Health Mode above to see how Blinkit's product ranking index and visual recommendations instantly adapt:
          </p>

          {/* Interactive Mock Interface */}
          <div className="border border-portfolio-card bg-[#0d1017] rounded-2xl overflow-hidden shadow-2xl">
            {/* Mock Header */}
            <div className="bg-[#121620] border-b border-portfolio-card px-5 py-3 flex justify-between items-center text-xs">
              <div className="font-mono font-bold text-white tracking-widest uppercase">BLINKIT INTERFACE MOCK</div>
              <div className="font-mono text-[9px] text-slate-400">10-Minute Cart View</div>
            </div>

            {/* Products Layout */}
            <div className="p-6 space-y-4">
              <div className="font-mono text-[9px] text-slate-400 uppercase tracking-wider mb-2">Search Results: "Weekly Snacks"</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(healthModeActive ? healthyProducts : standardProducts).map((product, idx) => (
                  <div 
                    key={idx} 
                    className={`border p-4 rounded-xl flex flex-col justify-between h-40 transition-all duration-300 ${
                      product.highlight 
                        ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.08)]" 
                        : "border-portfolio-card bg-portfolio-bgSec/20"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-mono text-[8px] uppercase text-portfolio-gold bg-portfolio-gold/5 border border-portfolio-gold/25 px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>
                        <span className={`font-mono text-[8px] font-bold ${
                          healthModeActive ? "text-emerald-400" : "text-red-400"
                        }`}>
                          Health Score: {product.healthScore}
                        </span>
                      </div>
                      <h4 className="font-cinzel text-xs text-white font-bold tracking-wide mt-2 leading-snug line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="font-mono text-[9px] text-slate-500 mt-1">Calories: {product.calories}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-portfolio-card/45">
                      <span className="font-mono text-xs text-white font-bold">{product.price}</span>
                      <button className={`px-3 py-1 rounded font-mono text-[8px] font-bold uppercase transition-all ${
                        healthModeActive 
                          ? "bg-emerald-500 text-slate-950 hover:bg-emerald-600" 
                          : "bg-portfolio-gold text-slate-950 hover:bg-portfolio-gold/80"
                      }`}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Recommendation Banner */}
              <div className="mt-4 p-4 border border-portfolio-card bg-[#111520] rounded-xl flex items-center justify-between flex-wrap gap-4 text-xs">
                <div>
                  <div className="font-mono text-[8px] text-portfolio-purple uppercase tracking-widest font-bold">Checkout Prime Offer</div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                    {healthModeActive 
                      ? "Healthy alternative picked! Save 15% on unsweetened greek yogurt."
                      : "Add a pack of carbonated soft drink for just ₹25 more!"
                    }
                  </p>
                </div>
                <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
                  healthModeActive 
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" 
                    : "border-portfolio-purple/35 text-portfolio-purple bg-portfolio-purple/5"
                }`}>
                  {healthModeActive ? "AOV Optimization" : "Impulse Boost"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Metrics & Rationale */}
        <section id="metrics" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            5. Telemetry & Expected Business Impact
          </h2>
          <div className="space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              To measure the feature lifecycle validation, we map target indicators across the user acquisition pipeline:
            </p>
            <div className="bg-portfolio-bgSec border border-portfolio-card p-4 rounded-xl font-mono text-xs text-portfolio-gold space-y-1.5">
              <div>• <strong>Primary Conversion</strong>: Health Mode Toggle Adoption Rate (Target: 18% of weekly active buyers within 60 days).</div>
              <div>• <strong>AOV Expansion</strong>: Organic AOV Lift vs Standard AOV Sessions (Model forecast: +8.4% AOV due to premium pricing of healthy organic brands).</div>
              <div>• <strong>Retention Metric</strong>: 90-day repeat cohort order retention lift (Target: +12% lift in premium household customer slots).</div>
            </div>
            <p>
              <strong>Organic Ads Monetization Potential:</strong> We can charge brands like Epigamia or True Elements a sponsored placement bid premium. By matching customer macro selections directly to native query suggestions, CPC returns are modeled to increase sponsored ad revenues by 22%.
            </p>
          </div>
        </section>

        {/* 6. PM Interview Breakdown Accordion */}
        <section id="interview" className="border border-portfolio-purple/20 bg-portfolio-purple/5 rounded-2xl overflow-hidden pt-2">
          <div
            onClick={() => setShowInterviewBreakdown(!showInterviewBreakdown)}
            className="flex items-center justify-between p-6 cursor-pointer select-none bg-portfolio-purple/10 hover:bg-portfolio-purple/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="text-portfolio-purple" size={20} />
              <div>
                <h3 className="font-cinzel text-md text-white font-bold tracking-wide">PM Interview Breakdown</h3>
                <p className="text-[10px] text-portfolio-purple font-mono uppercase tracking-wider mt-0.5">Core Product Frameworks</p>
              </div>
            </div>
            {showInterviewBreakdown ? <ChevronUp className="text-portfolio-purple" size={18} /> : <ChevronDown className="text-portfolio-purple" size={18} />}
          </div>

          {showInterviewBreakdown && (
            <div className="p-6 border-t border-portfolio-purple/20 space-y-6 text-xs md:text-sm text-portfolio-textSec leading-relaxed animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Problem Statement</strong>
                  <p>Standard quick-commerce shopping pathways aggressively optimize for unhealthy impulse snacking, leaving health-conscious users feeling visually overwhelmed and regretful.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Target User Segment</strong>
                  <p>Health-conscious urban professionals, fitness checksheeters, and customers with strict dietary boundaries (e.g. low-glycemic, diabetic, gluten-free).</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Key Insights</strong>
                  <p>Health-conscious cohorts display a 30% higher AOV baseline but drop off quickly when finding alternative organic snacks requires deep scrolls and multiple queries.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Metrics Strategy</strong>
                  <p>North Star: Healthy Repeat Grocery Cohorts (LTV). Guardrails: Conversion drop-off inside Health Mode sessions.</p>
                </div>
                <div className="md:col-span-2">
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Trade-offs & Prioritization</strong>
                  <p>Decided to implement a simple global search switch ("Health Mode") rather than multi-layered onboarding checkboxes. This sacrifices micro-level diet specificity but maintains checkout speed. Scoped out complex nutrient chart aggregations in MVP to prevent catalog query lag.</p>
                </div>
                <div className="md:col-span-2 bg-portfolio-purple/10 border border-portfolio-purple/20 p-4 rounded-xl text-white italic">
                  <strong>What I Learned:</strong> Choice reduction is a key product value. By allowing users to switch the app into a focused wellness catalog with one tap, we increase transaction speeds and brand trust.
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
