export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: string;
  score?: string;
  metrics: {
    efficiency?: number;
    alignment?: number;
    security?: number;
    impact?: string;
  };
  glowColor: string;
  accentColor: string;
  slug: string;
  problem: string;
  solution: string;
  impactText: string;
  frameworks: string[];
  readTime: string;
  projectType: string;
}

export interface CareerNode {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
  learnings: string[];
  impact: string;
}

export interface SkillDetail {
  name: string;
  level: number; // out of 100
  example: string;
}

export interface SkillCategory {
  title: string;
  skills: SkillDetail[];
}

export interface PensieveThought {
  id: string;
  title: string;
  category: "Teardowns" | "PRDs" | "Case Studies" | "Metrics" | "Frameworks" | "Experiments";
  summary: string;
  content: string;
  readTime: string;
  date: string;
}

export interface KnowledgeNote {
  id: string;
  title: string;
  category: "Product Discovery" | "SQL & Analytics" | "Agile & Delivery" | "Product Strategy" | "General PM";
  content: string;
  date: string;
  tags: string[];
}

export const mockProjects: Project[] = [
  {
    id: "nazaraana",
    title: "Nazaraana (नज़राना)",
    tagline: "GenAI Emotional Wellness Companion for Indian Exam Aspirants",
    category: "AI & Consumer Wellness",
    score: "84.81 Score",
    metrics: {
      efficiency: 100,
      alignment: 94,
      security: 96,
      impact: "Adopted by 200+ mock exam takers, driving 35% weekly retention in distress moderation."
    },
    glowColor: "group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]",
    accentColor: "portfolio-gold",
    slug: "nazaraana",
    problem: "High-stakes exam aspirants face extreme isolation and mental load, with zero private or culturally empathetic stress tracking support.",
    solution: "An offline-first wellness portal pairing BhalAI (empathetic multilingual Hinglish companion) with local journal sentiment checks.",
    impactText: "Helped 200+ candidates manage academic anxiety and facilitated 18 critical crisis moderation escalations.",
    frameworks: ["Double Diamond Discovery", "Dynamic Context Prompting", "Zustand Local State Persistence"],
    readTime: "8 min read",
    projectType: "AI Wellness Product"
  },
  {
    id: "warner-bros-discovery",
    title: "Warner Bros. Discovery",
    tagline: "From Streaming Platform to Franchise Ecosystem",
    category: "Product Strategy",
    score: "Featured",
    metrics: {
      efficiency: 94,
      alignment: 98,
      security: 92,
      impact: "IP-led growth strategy designed to transform subscribers into fans and monetize community, gaming, and licensing."
    },
    glowColor: "group-hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]",
    accentColor: "portfolio-gold",
    slug: "warner-bros-discovery",
    problem: "WBD doesn't have a content problem—it has a conversion problem. In India's price-sensitive market, owning Game of Thrones is not enough if users won't pay upfront.",
    solution: "An IP-led growth strategy that lowers the entry barrier (free ad tier), builds fandom (community discussion Hubs), and monetizes the entire fan journey ecosystem.",
    impactText: "IP-led growth strategy projecting 30% retention uplift in active viewer cohorts.",
    frameworks: ["Ecosystem Value Modeling", "Franchise Loop Acquisition", "Cohort Conversion Dynamics"],
    readTime: "6 min read",
    projectType: "Product Strategy"
  },
  {
    id: "crunchyroll-ai",
    title: "Crunchyroll AI Recommendation Engine",
    tagline: "Context-Aware Anime Recommendations to Boost Session Lengths",
    category: "AI & Streaming Platforms",
    score: "92.40 Score",
    metrics: {
      efficiency: 88,
      alignment: 96,
      security: 90,
      impact: "Designed custom transformer-based metadata parser increasing discovery by 24%."
    },
    glowColor: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]",
    accentColor: "portfolio-purple",
    slug: "crunchyroll-ai",
    problem: "Standard collaborative recommendation models fail to account for mood-dependent, contextual watch sessions.",
    solution: "A transformer-based metadata tagging engine weighting local time, weather, and active pacing signals for real-time recommendations.",
    impactText: "Simulated discovery scores climbed 24% and average session watch duration increased by 15%.",
    frameworks: ["Contextual Transformers", "RICE Prioritization Matrix", "A/B Testing Cohort Modeling"],
    readTime: "6 min read",
    projectType: "Streaming Platform Engine"
  },
  {
    id: "blinkit",
    title: "Blinkit Product Teardown",
    tagline: "Introducing Blinkit Health Mode: A Wellness-First Quick Commerce Toggle",
    category: "Product Teardown",
    score: "91.20 Score",
    metrics: {
      efficiency: 89,
      alignment: 95,
      security: 91,
      impact: "Projected 8% AOV expansion and 12% boost in 90-day cohort retention rates."
    },
    glowColor: "group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]",
    accentColor: "portfolio-gold",
    slug: "blinkit",
    problem: "Quick commerce interfaces drive intense impulse purchases of high-sugar snacks, causing user diet-cheating regret and lack of nutrition filters.",
    solution: "A wellness-first toggle ('Health Mode') restructuring product rankings to highlight fresh, organic, low-sugar alternatives dynamically.",
    impactText: "Modeled to unlock $2.4M incremental ARR via organic merchant ad sponsorships and Health Pass subscription tiers.",
    frameworks: ["Behavioral Design Nudges", "Conversion Funnel Diagnostics", "AOV Cohort Monetization"],
    readTime: "5 min read",
    projectType: "Quick Commerce Teardown"
  },
  {
    id: "testbook",
    title: "Testbook Product Teardown",
    tagline: "Optimizing the Onboarding Funnel for Non-Metro Exam Candidates",
    category: "Growth & User Experience",
    score: "87.50 Score",
    metrics: {
      efficiency: 92,
      alignment: 90,
      security: 85,
      impact: "Redesigned onboarding flows, decreasing drop-off rates by 18% in simulated cohorts."
    },
    glowColor: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]",
    accentColor: "portfolio-blue",
    slug: "testbook",
    problem: "Registration flows for tier-2 and tier-3 users suffered a 42% drop-off due to visual clutter and SMS OTP timeout latencies.",
    solution: "Funnel restructuring introducing 3-step progressive onboarding question paths and WhatsApp secondary OTP triggers.",
    impactText: "Simulated completion rates boosted from 58% to 76%, reducing OTP timeout exceptions by 30%.",
    frameworks: ["Miller's Law Cognitive Restructuring", "Funnel Conversion Analytics", "Friction Audit Mapping"],
    readTime: "5 min read",
    projectType: "UX Growth Teardown"
  }
];

export const mockCareerJourney: CareerNode[] = [
  {
    id: "nirma",
    company: "Nirma University",
    role: "Bachelor of Technology",
    period: "2018 - 2022",
    location: "Ahmedabad, India",
    achievements: [
      "Graduated with a strong foundation in computer engineering and systems design.",
      "Led college tech fest organizing committee, managing a team of 40+ students."
    ],
    learnings: [
      "Discovered interest in tech business strategy and user psychology.",
      "Mastered core engineering principles: Databases, Distributed Systems, Software Design."
    ],
    impact: "Synthesized technical foundations needed to collaborate natively with backend & AI engineers."
  },
  {
    id: "deloitte",
    company: "Deloitte India",
    role: "Analyst",
    period: "2022 - 2023",
    location: "Ahmedabad, India",
    achievements: [
      "Engineered automated data pipelines reducing analytics prep times by 40%.",
      "Designed and shipped 3 internal reporting dashboards adopted across regional PMO teams."
    ],
    learnings: [
      "Learned how to extract requirements from non-technical business stakeholders.",
      "Developed mastery in SQL, ETL structures, and metrics definition."
    ],
    impact: "Enabled 200+ corporate employees with self-serve data discovery, replacing manual Excel trackers."
  },
  {
    id: "steel",
    company: "S.S. Steel Industries",
    role: "Operations Manager",
    period: "2023 - Present",
    location: "Ahmedabad, India",
    achievements: [
      "Led digital transformation of supply tracking logs into a centralized dashboard system.",
      "Redesigned scheduling algorithms, saving 15% in supply-line delays."
    ],
    learnings: [
      "Learned execution under tight constraints and manual operation workflows.",
      "Gained empathy for non-digital operators using software under high stress."
    ],
    impact: "Digitized operational workflow, boosting weekly delivery throughput by 22%."
  },
  {
    id: "promptwars-event",
    company: "PromptWars Ahmedabad 2026",
    role: "Competition Participant",
    period: "2026",
    location: "Ahmedabad, India",
    achievements: [
      "Competed in the regional generative AI builder hackathon event.",
      "Engineered multi-turn context boundaries and Hinglish validation constraints for LLM agents."
    ],
    learnings: [
      "Learned core prompt architecture boundaries and structural JSON parsing constraints.",
      "Balanced LLM response latency tradeoffs against guardrail security checks."
    ],
    impact: "Secured an elite 84.81 overall PM score ranking, demonstrating zero-to-one engineering output."
  },
  {
    id: "nazaraana-build",
    company: "Shipped Nazaraana",
    role: "AI Product Builder (Founder)",
    period: "2026",
    location: "Ahmedabad, India",
    achievements: [
      "Designed and shipped an offline-first wellness companion using Zustand persistence and Claude AI.",
      "Programmed local crisis detection models checking 35+ distress parameters."
    ],
    learnings: [
      "Executed end-to-end product development: scoping, UI layouts, testing.",
      "Balanced device-level storage privacy (no database) against server-side model latency."
    ],
    impact: "Shipped fully functional web companion running offline with 200+ test users and 100% data compliance."
  },
  {
    id: "future",
    company: "Future Product Leadership",
    role: "Product Manager",
    period: "Next Phase",
    location: "Ahmedabad, India",
    achievements: [
      "Aiming to build user-centered products leveraging AI, streaming platforms, or gaming ecosystems.",
      "Bringing strong execution, user empathy, analytics expertise, and engineering literacy."
    ],
    learnings: [
      "Continuous curiosity in generative UI, context-aware platforms, and agentic workflows."
    ],
    impact: "Ready to scale customer metrics, drive zero-to-one product initiatives, and lead high-performing teams."
  }
];

export const mockSkills: SkillCategory[] = [
  {
    title: "Product Core Spells",
    skills: [
      { name: "Product Discovery", level: 95, example: "Applied double-diamond research at Deloitte to map user experience barriers." },
      { name: "PRD Writing", level: 98, example: "Authored end-to-end specifications for Crunchyroll's context recommendation engine." },
      { name: "Prioritization (RICE/WSJF)", level: 92, example: "Prioritized BhalAI's feature roadmap balancing local vs LLM classification latency." },
      { name: "Roadmapping", level: 90, example: "Created phased launch maps for Nazaraana's transition from offline mock to real LLM services." },
      { name: "Stakeholder Management", level: 88, example: "Aligned engineering, design, and operations at S.S. Steel for ERP digitization." },
      { name: "User Stories & Mockups", level: 94, example: "Figma wireframed the entire mobile-inspired student wellness dashboard dashboard." }
    ]
  },
  {
    title: "Analytics Alchemy",
    skills: [
      { name: "SQL & Querying", level: 92, example: "Wrote complex analytical JOINs and subqueries to audit user cohorts at Deloitte." },
      { name: "Excel Modeling", level: 90, example: "Built financial and operational cost-benefit models for steel supply runs." },
      { name: "KPI & Metric Definition", level: 95, example: "Defined primary North Star metrics (Readiness Score) and secondary safety loops for Nazaraana." },
      { name: "Dashboarding", level: 94, example: "Created executive reporting tools in PowerBI/Tableau adopted by 200+ employees." }
    ]
  },
  {
    title: "Technical Sorcery",
    skills: [
      { name: "Prompt Engineering", level: 96, example: "Designed contextual prompt structures and system boundaries for BhalAI's Hinglish responses." },
      { name: "AI/LLM Architecture", level: 90, example: "Implemented client-side guardrails and classification models for wellness distress checks." },
      { name: "Django & Python", level: 85, example: "Developed backend APIs and batch scheduler jobs during academic and freelance builds." },
      { name: "Next.js & Frontend", level: 88, example: "Coded responsive portfolio interfaces and state logic using Zustand and Tailwind." }
    ]
  }
];

export const mockPensieveThoughts: PensieveThought[] = [
  {
    id: "warner-bros-discovery-case",
    title: "Case Study: Warner Bros. Discovery IP Ecosystem Strategy",
    category: "Case Studies",
    summary: "An IP-led growth strategy for Warner Bros. Discovery in India, converting price-sensitive viewers into lifetime fans through ecosystem monetization.",
    date: "June 2026",
    readTime: "6 min read",
    content: `### 1. The Strategy
Warner Bros. Discovery owns some of the world's most valuable premium entertainment IP (Harry Potter, DC, Game of Thrones, HBO Originals). Yet, in price-sensitive emerging markets like India, WBD faces slow subscriber growth due to competition from local content and sports.

### 2. The Conversion Moat
WBD doesn't have a content problem; it has a conversion problem. By introducing a low-barrier free tier and building interactive fan discussion hubs inside the platform, WBD can hook viewers, build active communities, and monetize the complete lifecycle (merchandise, games, events) instead of just subscriptions.`
  },
  {
    id: "crunchyroll-prd",
    title: "PRD: Crunchyroll AI Contextual Recommendation Engine",
    category: "PRDs",
    summary: "A detailed product requirement document for serving context-aware anime recommendation nodes based on real-time mood and watch history.",
    date: "May 2026",
    readTime: "8 min read",
    content: `### 1. Executive Summary
Crunchyroll's current recommendation relies on classic collaborative filtering. However, anime consumption is heavily mood-dependent. This PRD details a "Context-Aware Anime Recommendations" engine that uses real-time user sentiments, recent search history, and watch context (e.g. late-night chill vs afternoon hype) to recommend personalized modules, aiming to increase average session length by 15%.

### 2. User Personas
* **Hype Hunter (Aman, 19)**: Watches high-energy action (Shonen) while studying or after gaming. Needs fast, stimulating content.
* **Cozy Binger (Riya, 24)**: Watches comforting slice-of-life or romance anime late at night to decompress. Needs slow, low-intensity recommendations.

### 3. Core Features
1. **Real-time Mood / Vibe Classifier**: Simple 3-emoji quick-check on homepage to seed the recommendations immediately.
2. **Contextual Watch Transformer**: Integrates localized factors (local time, weather, active viewing speed) to rank suggestions.
3. **Interactive Prioritization Matrix (RICE)**: Prioritizes recommendation nodes dynamically based on developer bandwidth.

### 4. Metrics & KPIs
* **North Star**: Average Session Watch Duration (minutes).
* **Secondary Metric**: 7-day watch retention and click-through-rate (CTR) on the custom recommendation hub.
`
  },
  {
    id: "testbook-teardown",
    title: "Product Teardown: Testbook Onboarding Optimization",
    category: "Product Teardowns",
    summary: "Analyzing the registration friction points for users in tier-2 and tier-3 Indian cities, proposing a low-bandwidth conversational signup.",
    date: "April 2026",
    readTime: "6 min read",
    content: `### The Problem
Testbook has over 20M+ registered users, but the drop-off during registration for aspirants in non-metro regions is 42%. High bandwidth page layouts, complex language selection grids, and mandatory phone validations with OTP latency create severe drop-off vectors.

### Insights & Discoveries
1. **OTP Latency**: In tier-3 towns, SMS delivery can take up to 45 seconds, exceeding the standard 30s session timeout.
2. **Mental Overload**: Displaying 30+ exams on a single onboarding screen confuses students who are early in their preparation journey.

### Proposed Solution: The 'Gram-Friendly' Signup Flow
- **SMS/WhatsApp Dual OTP Integration**: Trigger WhatsApp confirmation codes alongside SMS, reducing OTP validation failures by 30%.
- **Stepwise Gamification**: Instead of a massive list of checkboxes, ask 3 simple questions (Language -> Stream -> Goal Exam).
- **Expected Metrics**: Onboarding completion rates are modeled to increase from 58% to 76%.
`
  },
  {
    id: "ai-wellness-case",
    title: "Case Study: Scaling BhalAI's Guardrails in Wellness Apps",
    category: "Case Studies",
    summary: "How we balanced local client privacy constraints with complex emotional safety classification pathways, without ballooning operational costs.",
    date: "March 2026",
    readTime: "10 min read",
    content: `### 1. Context
Nazaraana was built to support students under immense exam stress. When dealing with mental wellness, safety is paramount. An incorrect response from BhalAI during a crisis state could have serious real-world consequences.

### 2. Design Tradeoffs
* **Server-side LLM Analysis**: High intelligence, but introduces latency (~2s) and high API costs. Requires user data to leave the client device.
* **Client-side Regex & Mock Classification**: Instantaneous (5ms), runs entirely offline, costs $0, keeps 100% privacy, but lacks contextual parsing.

### 3. The Hybrid Guardrail Pipeline
We developed a tiered client-side validation system:
- **Tier 1 (Instant Local Regex)**: 35+ core high-risk keywords (e.g. self-harm, exit, quit life) analyzed instantly in 5ms. If detected, triggers the Crisis Support Card showing immediate hotlines (iCall, Vandrevala).
- **Tier 2 (Contextual LLM Parsing)**: If online and non-flagged, the text is evaluated by Claude with clear instructions to refuse clinical advice and redirect to human systems for persistent low mood.
`
  }
];

export const mockKnowledgeNotes: KnowledgeNote[] = [
  {
    id: "wbd-ecosystem-framework",
    title: "IP Ecosystem Value Modeling Framework",
    category: "Product Strategy",
    date: "2026-06-20",
    tags: ["Product Strategy", "Monetization", "Ecosystem", "LTV"],
    content: `### IP-Led Ecosystem Value Model
Standard streaming platforms model user value purely on a recurring monthly subscription fee (SaaS equivalent). For premium IP holders, this under-monetizes fans. The ecosystem model maps user lifetime value across multiple nodes:

\`\`\`
[Streaming Acquisition] → [Community Engagement] → [Merchandise / Gaming] → [Events / Parks]
\`\`\`

### Operational Checklist for Franchise Loops
- **Phase 1: Free Tier Funnel**: Lower the initial trial barrier to decrease customer acquisition cost (CAC).
- **Phase 2: Fandom Retention Moat**: Introduce discussion forums and creator collabs to drive organic referrals and session time.
- **Phase 3: Ecosystem Monetization**: Launch video game integrations, limited screenings, and local merchandise partnerships to scale average revenue per user (ARPU).`
  },
  {
    id: "sql-pm-queries",
    title: "SQL Reference Guide for Product Managers",
    category: "SQL & Analytics",
    date: "2026-05-15",
    tags: ["SQL", "Cohort Analysis", "Retention", "KPIs"],
    content: `### Cohort Retention Query
This query analyzes monthly user retention by tracing initial signup date alongside monthly active triggers:

\`\`\`sql
WITH cohorts AS (
  -- Find the signup month of each user
  SELECT 
    user_id, 
    DATE_TRUNC('month', created_at) AS cohort_month
  FROM users
),
activity AS (
  -- Record the months in which users trigger active sessions
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('month', session_start) AS activity_month
  FROM sessions
)
SELECT 
  c.cohort_month,
  EXTRACT(MONTH FROM AGE(a.activity_month, c.cohort_month)) AS period_offset,
  COUNT(DISTINCT c.user_id) AS active_users
FROM cohorts c
JOIN activity a ON c.user_id = a.user_id
GROUP BY 1, 2
ORDER BY 1, 2;
\`\`\`

### Funnel Drop-off Query
Tracks step-by-step conversion rates in onboarding funnels:
\`\`\`sql
SELECT
  COUNT(CASE WHEN step = 'landed' THEN 1 END) AS land_count,
  COUNT(CASE WHEN step = 'registered' THEN 1 END) AS reg_count,
  COUNT(CASE WHEN step = 'completed_onboarding' THEN 1 END) AS comp_count,
  ROUND(100.0 * COUNT(CASE WHEN step = 'registered' THEN 1 END) / COUNT(CASE WHEN step = 'landed' THEN 1 END), 2) AS land_to_reg_conv
FROM user_onboarding_logs;
\`\`\`
`
  },
  {
    id: "agile-estimation",
    title: "Agile Estimation: Beyond Story Points",
    category: "Agile & Delivery",
    date: "2026-04-10",
    tags: ["Agile", "Scrum", "Velocity", "Product Delivery"],
    content: `### The Problem with Story Points
Engineers frequently anchor story points to hours (e.g. 1 point = 4 hours). This defeats the purpose of sizing complexity and leads to velocity inflation.

### Alternative: T-Shirt Sizing with RICE Overlay
1. **Sizing (Complexity & Risk)**:
   - **XS**: Tiny config change, zero external dependencies.
   - **S**: Standard feature, clear design, isolated testing.
   - **M**: Multi-file refactor, moderate testing, small database schema change.
   - **L**: Third-party integration, migration risk, high compliance overhead.
   - **XL**: Architectural change, data migration, high cross-team dependencies.

2. **Commitment Metric**: Focus on **Cycle Time** (time taken from 'In Progress' to 'Done') rather than sprint commitment capacity. A high cycle time indicates blockage or poorly scoped PRDs.
`
  },
  {
    id: "product-discovery-checklist",
    title: "Zero-to-One Product Discovery Checklist",
    category: "Product Discovery",
    date: "2026-03-22",
    tags: ["Discovery", "User Research", "MVP", "Double Diamond"],
    content: `### Phase 1: Problem Space Definition
- [ ] Conducted at least 15 qualitative customer interviews.
- [ ] User personas represent actual qualitative patterns, not idealized clients.
- [ ] Stated the problem in a single sentence: *\"[Target segment] feels [pain point] when trying to [goal] due to [obstacle].\"*

### Phase 2: Solution Mapping
- [ ] Map out the "Before" user journey (step-by-step current workaround).
- [ ] Frame "How Might We" (HMW) statements for key friction steps.
- [ ] RICE prioritize solutions (Reach, Impact, Confidence, Effort).

### Phase 3: MVP Scoping
- [ ] Define the absolute core flow (must be functional, usable, and safe).
- [ ] Setup metrics telemetry (which click confirms value verification?).
- [ ] Draft compliance/privacy checklist (localStorage constraints, data minimization).
`
  }
];
