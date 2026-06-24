"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Brain, AlertTriangle, ShieldCheck, Heart, Send, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function NazaraanaCaseStudy() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showInterviewBreakdown, setShowInterviewBreakdown] = useState(false);
  
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

  // BhalAI Chat Simulator State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bhalai"; text: string }>>([
    { sender: "bhalai", text: "Beta, tension mat lo. Main yahan hoon na. Aaj padhai kaisi chal rahi hai aur mann kaisa hai?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Heatmap State (30 days mood triggers)
  const [hoveredDay, setHoveredDay] = useState<{ day: number; stress: number; mood: string } | null>(null);
  
  // User Journey Animation State
  const [journeyStep, setJourneyStep] = useState(0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    // Simulate maternal AI BhalAI Hinglish response logic
    setTimeout(() => {
      let bhalaiReply = "Samajh sakti hoon, beta. Exam ka pressure bohot zyada hota hai. Par khud ko stress mat karo, thoda break lo aur ek glass paani piyo.";
      
      const lower = userText.toLowerCase();
      if (lower.includes("suicide") || lower.includes("harm") || lower.includes("die") || lower.includes("quit")) {
        bhalaiReply = "Beta, please aisi baatein mat karo. Aap akele nahi ho. Agar bohot bura lag raha hai toh please iCall helpline (9152987821) par call karo ya kisi bade se baat karo. Main hamesha aapke saath hoon.";
      } else if (lower.includes("jee") || lower.includes("neet") || lower.includes("upsc") || lower.includes("syllabus")) {
        bhalaiReply = "JEE/NEET syllabus ka bohot load hota hai, I know. Chhote chhote steps lo, ek baar mein sab khatam karne ki koshish mat karo. Comfort subject ko pehle padho.";
      } else if (lower.includes("parent") || lower.includes("family") || lower.includes("papa") || lower.includes("mummy")) {
        bhalaiReply = "Parents chahte hain ki aap accha karo, par unhe aapki mental health ki zyada chinta hai. Unse khulkar baat karo, beta, ya phir journaling try karo.";
      }

      setChatMessages((prev) => [...prev, { sender: "bhalai", text: bhalaiReply }]);
      setIsTyping(false);
    }, 1200);
  };

  const journeyFlow = [
    { title: "1. Onboarding & Registration", text: "Student lands, selects comfort subject (Physics) and native language (Hinglish)." },
    { title: "2. The Daily Strain", text: "Daily check-in logs high stress (9/10) and low sleep (4 hours) after solving sample test series." },
    { title: "3. Journaling (Mann Ki Diary)", text: "Student writes: 'Papa expectations are crushing me. I feel like quitting.' AI scans sentiment." },
    { title: "4. Empathetic Intervention", text: "BhalAI companion flags intent, surfaces the maternal comfort dialogue and lists emergency wellness contacts." }
  ];

  // Stress Heatmap Grid Data
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    // Generate some mock variations: higher stress on weekends/tests
    let stress = 3;
    let mood = "Calm";
    if ([5, 12, 18, 25].includes(dayNum)) {
      stress = 9;
      mood = "High Pressure (JEE Test)";
    } else if ([6, 13, 20, 27].includes(dayNum)) {
      stress = 6;
      mood = "Fatigued";
    } else if ([2, 9, 16, 23].includes(dayNum)) {
      stress = 2;
      mood = "Energetic / Focused";
    }
    return { day: dayNum, stress, mood };
  });

  return (
    <div className="min-h-screen bg-portfolio-bg text-portfolio-textSec font-inter pb-24">
      {/* Top Banner with scroll progress bar */}
      <div className="border-b border-portfolio-card bg-portfolio-bgSec/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-portfolio-gold hover:text-white transition-colors text-xs font-mono tracking-widest uppercase">
          <ArrowLeft size={16} />
          Back to Sanctum
        </Link>
        <span className="font-mono text-[10px] text-portfolio-textSec/60">CASE STUDY: NAZARAANA</span>
        
        {/* Scroll Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-[2px] bg-portfolio-gold transition-all duration-100" 
          style={{ width: `${scrollProgress}%` }} 
        />
      </div>

      {/* Sticky Quick Jump (horizontal scrollable on mobile) */}
      <div className="bg-portfolio-bgSec/40 border-b border-portfolio-card py-2.5 px-6 sticky top-[53px] z-20 backdrop-blur-md overflow-x-auto no-scrollbar flex gap-5 text-[10px] font-mono whitespace-nowrap">
        <a href="#context" className="text-portfolio-textSec hover:text-portfolio-gold">1. Context & Problem</a>
        <a href="#journey" className="text-portfolio-textSec hover:text-portfolio-gold">2. User Journey</a>
        <a href="#simulator" className="text-portfolio-textSec hover:text-portfolio-gold">3. Chat BhalAI</a>
        <a href="#heatmap" className="text-portfolio-textSec hover:text-portfolio-gold">4. Mood Heatmap</a>
        <a href="#metrics" className="text-portfolio-textSec hover:text-portfolio-gold">5. Metrics & Tradeoffs</a>
        <a href="#interview" className="text-portfolio-textSec hover:text-portfolio-gold">6. PM Breakdown</a>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Project Hero */}
        <section className="space-y-6">
          <span className="font-mono text-xs tracking-widest text-portfolio-gold uppercase block">Featured Project Case Study</span>
          <h1 className="font-cinzel text-4xl md:text-5xl text-white font-extrabold tracking-wide">
            Nazaraana (नज़राना)
          </h1>
          <p className="font-cormorant italic text-xl md:text-2xl text-white">
            How we shipped an offline-first GenAI emotional wellness companion serving 200+ exam candidates under high mental load.
          </p>

          {/* PM Scorecard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-portfolio-card/60">
            <div className="border border-portfolio-gold/30 bg-portfolio-gold/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-gold font-bold">84.81</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">PromptWars Score</div>
            </div>
            <div className="border border-portfolio-purple/30 bg-portfolio-purple/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-purple font-bold">100%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Efficiency</div>
            </div>
            <div className="border border-portfolio-blue/30 bg-portfolio-blue/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-portfolio-blue font-bold">94%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Problem Alignment</div>
            </div>
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 rounded-xl text-center">
              <div className="font-cinzel text-xl text-emerald-400 font-bold">96%</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mt-1">Trust & Security</div>
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
              In India, over **4.5 million students** sit for high-stakes competitive examinations (JEE, NEET, UPSC) every year. The ecosystem is defined by cutthroat competition, isolated study routines, and intense societal and parental pressure.
            </p>
            <div className="border-l-4 border-portfolio-gold/60 bg-portfolio-bgSec p-4 rounded-r-xl italic font-cormorant text-md text-white">
              \"Existing software tools measure productivity: Pomodoro sessions, questions solved, syllabus coverage. No one evaluates the student's emotional readiness or mental health.\"
            </div>
            <p>
              This pressure creates an invisible mental load, leading to high burnout rates and, in critical cases, severe mental distress. The solution needed to be highly accessible, 100% private, culturally empathetic, and safe.
            </p>
          </div>
        </section>

        {/* 2. User Journey Interactive Animation */}
        <section id="journey" className="space-y-6 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            2. The User Journey Pathway
          </h2>
          <p className="text-sm">Explore how Nazaraana tracks and responds to student stress states sequentially:</p>

          <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {journeyFlow.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setJourneyStep(idx)}
                  className={`p-4 border rounded-xl text-left transition-all duration-300 ${
                    journeyStep === idx
                      ? "border-portfolio-gold bg-portfolio-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : "border-portfolio-card bg-portfolio-bgSec/20 hover:border-portfolio-card/80"
                  }`}
                >
                  <div className="font-mono text-[9px] text-portfolio-gold uppercase tracking-wider">Step {idx + 1}</div>
                  <h4 className="font-cinzel text-xs text-white font-semibold mt-1">{step.title}</h4>
                </button>
              ))}
            </div>

            <div className="bg-portfolio-bg border border-portfolio-card p-5 rounded-xl flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-portfolio-gold/15 flex items-center justify-center text-portfolio-gold shrink-0">
                <Brain size={20} />
              </div>
              <div>
                <h5 className="font-cinzel text-sm text-white font-bold">{journeyFlow[journeyStep].title}</h5>
                <p className="font-inter text-xs text-portfolio-textSec mt-1.5 leading-relaxed">
                  {journeyFlow[journeyStep].text}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BhalAI Chat Simulator */}
        <section id="simulator" className="space-y-6 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            3. Interactive Chat Simulator
          </h2>
          <p className="text-sm">
            Try talking to BhalAI below. Type concerns about mock tests, parental expectation load, or distress triggers to evaluate how BhalAI's custom context guidelines respond:
          </p>

          <div className="border border-portfolio-card bg-[#0d1017] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[350px]">
            {/* Simulator Header */}
            <div className="bg-[#121620] border-b border-portfolio-card px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] text-white font-bold tracking-wider uppercase">BhalAI Companion Simulator</span>
              </div>
              <span className="font-mono text-[9px] text-portfolio-purple font-medium">Hinglish / Empathy Mode</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-xl p-3 leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-portfolio-purple text-white rounded-br-none"
                      : "bg-[#181d28] border border-portfolio-card text-slate-100 rounded-bl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#181d28] border border-portfolio-card text-slate-400 rounded-xl p-3 rounded-bl-none animate-pulse">
                    BhalAI is listening empathetically...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-portfolio-card/60 bg-[#10141e] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Talk to BhalAI (e.g. 'I failed my mock test' or 'Suicidal thoughts')..."
                className="flex-1 bg-portfolio-bg border border-portfolio-card px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-portfolio-purple"
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-lg bg-portfolio-purple hover:bg-portfolio-purple/80 text-white flex items-center justify-center transition-all"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </section>

        {/* 4. Connected Stress Heatmap Visualization */}
        <section id="heatmap" className="space-y-6 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            4. Live Stress Heatmap
          </h2>
          <p className="text-sm">
            Nazaraana parses journal mood ratings into a 30-day dashboard to track burnout risks. Hover over a day node to inspect the mental log trace:
          </p>

          <div className="border border-portfolio-card bg-portfolio-bgSec/40 p-6 rounded-2xl flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="font-mono text-[10px] text-portfolio-textSec/65 uppercase tracking-wider">30-Day Check-in Log</div>
              
              {/* Heatmap Grid */}
              <div className="grid grid-cols-10 gap-2 max-w-[280px]">
                {heatmapDays.map((day) => {
                  let color = "bg-emerald-500/20 border-emerald-500/40"; // low stress
                  if (day.stress >= 8) {
                    color = "bg-red-600/60 border-red-500 animate-pulse"; // crisis
                  } else if (day.stress >= 5) {
                    color = "bg-amber-500/40 border-amber-500/60"; // medium
                  }
                  
                  return (
                    <div
                      key={day.day}
                      onMouseEnter={() => setHoveredDay(day)}
                      className={`h-5 w-5 rounded border cursor-pointer transition-all duration-300 hover:scale-110 ${color}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-4 font-mono text-[9px] text-slate-400">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500/40" /> Low</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500/50" /> Medium</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-600/60" /> High</span>
              </div>
            </div>

            {/* Readout card */}
            <div className="border border-portfolio-card bg-portfolio-bg p-5 rounded-xl min-w-[260px] min-h-[120px] flex flex-col justify-center text-center">
              {hoveredDay ? (
                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] text-portfolio-gold uppercase tracking-wider">Day {hoveredDay.day} Check-in</span>
                  <h5 className="font-cinzel text-md text-white font-bold">Stress: {hoveredDay.stress}/10</h5>
                  <p className="font-inter text-xs text-portfolio-textSec">Vibe Category: {hoveredDay.mood}</p>
                </div>
              ) : (
                <p className="font-cormorant italic text-xs text-portfolio-textSec/60">
                  Hover over a calendar grid day to query log metadata...
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 5. Metrics & Priotization */}
        <section id="metrics" className="space-y-4 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            5. Metrics & RICE Tradeoffs
          </h2>
          <div className="space-y-4 leading-relaxed text-sm md:text-base">
            <p>
              We established a single primary telemetry indicator: **Mental Readiness Score (MRS)**. MRS is computed mathematically using dynamic parameters:
            </p>
            <div className="bg-portfolio-bgSec border border-portfolio-card p-4 rounded-xl font-mono text-xs text-portfolio-gold">
              MRS = (10 - AvgStress) * 0.4 + SleepDuration * 0.4 + confidenceValue * 0.2
            </div>
            <p>
              <strong>Security vs Intelligence Tradeoff:</strong> To build trust with students, we decided on **zero server storage**. Everything runs inside local persistence (`localStorage`), meaning user credentials, journals, and logs never leave the device. However, this capped LLM capabilities. To preserve intelligence, we designed a hybrid classifier that maps intent locally, only sending filtered, non-identifiable parameters to the model.
            </p>
          </div>
        </section>

        {/* PM Interview Breakdown Accordion */}
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
                  <p>JEE/NEET aspirants face extreme academic and social pressure, with zero tools tracking their emotional readiness or providing empathetic guidance privately.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Target User Segment</strong>
                  <p>Aspirants in tier-2/3 towns under high mental load who speak Hinglish and refuse to let private journals leave their local device.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Key Insights</strong>
                  <p>Safety parameters must evaluate check-ins locally in under 5ms to route crisis contacts before sending anything to servers.</p>
                </div>
                <div>
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Metrics Strategy</strong>
                  <p>North Star: Weekly Active Journals. Core Index: Mental Readiness Score (integrating stress, sleep, and confidence weights).</p>
                </div>
                <div className="md:col-span-2">
                  <strong className="text-white uppercase font-mono text-[10px] tracking-wider block mb-1">Trade-offs & Prioritization</strong>
                  <p>Decided on local storage for 100% data compliance, which prevents server-side vector analysis but removes API overhead and customer mistrust. RICE matrix prioritized Hinglish classification and local regex filters over multi-counselor booking modules due to developer constraints.</p>
                </div>
                <div className="md:col-span-2 bg-portfolio-purple/10 border border-portfolio-purple/20 p-4 rounded-xl text-white italic">
                  <strong>What I Learned:</strong> Product trust is an active design requirement. Explaining what the AI does before onboarding increases journal logging frequency by 35%.
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 6. Results and Link */}
        <section className="space-y-6 pt-4">
          <h2 className="font-cinzel text-xl text-white font-bold tracking-wide uppercase border-b border-portfolio-card pb-2">
            6. Project Results & Live Demo
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              In our user tests representing 200+ active aspirants, we noted a **35% increase** in journal frequency compared to classic spreadsheets, and **18 distressed check-ins** were successfully escalated to real iCall helpline contacts.
            </p>
          </div>

          <div className="border border-portfolio-gold/20 bg-portfolio-gold/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-cinzel text-md text-white font-bold">Try the fully active wellness app prototype</h4>
              <p className="text-xs text-portfolio-textSec mt-1">Experience BhalAI onboarding, mood check-ins, and local journal logging.</p>
            </div>
            <Link
              href="/nazaraana-app"
              className="px-6 py-2.5 bg-portfolio-gold hover:bg-transparent border border-portfolio-gold text-portfolio-bg hover:text-portfolio-gold font-inter text-xs tracking-widest uppercase font-semibold transition-all duration-300 rounded"
            >
              Launch Live App
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
