# Nazaraana — Product Case Study

> **GenAI-powered emotional wellness companion for Indian exam aspirants.**
> Built for a national hackathon. Upgraded to portfolio-grade.

---

## 1. Project Overview

**Nazaraana (नज़राना)** — literally meaning "a gift" in Urdu/Hindi — is a culturally resonant emotional
wellness companion for students preparing for India's most competitive examinations: JEE, NEET, UPSC,
CUET, Board Exams, and more.

At its core, Nazaraana pairs a warm, multilingual AI companion called **BhalAI** with a connected data
engine that tracks stress, burnout, and emotional patterns over time. Unlike productivity tools that measure
output, Nazaraana measures the invisible: anxiety, loneliness, parental pressure, and the fear of failure.

**Stack:** Next.js 15 · TypeScript · Zustand · Tailwind CSS · Framer Motion · Anthropic Claude · Vitest

---

## 2. Problem Statement

### Student stress is invisible.

India produces over 2.5 million JEE aspirants and 2.0 million NEET aspirants annually. Existing ed-tech tools
track study hours, syllabus coverage, and rank percentile — but none track **emotional wellbeing**.

The consequences are severe:
- India has one of the highest rates of student suicide globally (NCRB data: ~10,000+ student suicides/year).
- 87% of Kota coaching students report chronic anxiety (AIIMS study, 2023).
- Most students never disclose mental health struggles to family due to stigma.

**The gap:** Tools that understand what students are feeling, not just what they are studying.

---

## 3. User Research

Primary user interviews and survey responses identified five recurring emotional states:

| Emotion | Source | Prevalence |
|---------|--------|-----------|
| Exam anxiety | Mock tests, syllabus backlog | Extremely high |
| Burnout | 14–16 hour study days | High |
| Parental pressure | Comparison culture, family expectations | Very high |
| Loneliness | Hostel isolation, drop years | High |
| Comparison syndrome | Coaching rank boards, social media | Extremely high |

**Key insight:** Students needed a companion that understood Indian cultural context — the concept of a
"badi didi" (elder sister) or a "mausi" (aunt) who listens without judging and uses the same code-switched
Hinglish that students actually speak.

---

## 4. Product Requirements (PRD Summary)

### Must-Have
- [x] Multilingual AI companion (Hinglish, Hindi, regional languages)
- [x] Daily mood check-in with stress/energy/sleep/confidence sliders
- [x] Private journal with AI emotional analysis
- [x] Stress heatmap calendar (colour-coded by day)
- [x] Crisis detection → immediate helpline escalation
- [x] Weekly wellness report
- [x] Anonymous confession wall
- [x] Zero-database setup (localStorage persistence)

### Should-Have
- [x] Trust-building onboarding screen (what BhalAI can/cannot do)
- [x] Memory layer (BhalAI remembers past journals and check-ins)
- [x] Pre-exam mode (calming protocol within 72 hours of exam date)
- [x] Comprehensive test suite (Vitest + RTL)

### Could-Have
- [ ] Native mobile app (React Native)
- [ ] Long-term emotion trend prediction
- [ ] Community support circles

---

## 5. Design Decisions

### Warm Visual Language
The design system uses terracotta orange (`#e25c1d`) as the primary colour — evoking warmth, safety,
and Indian cultural aesthetics (saffron, clay pots, sunrise). Secondary rose accents suggest gentleness.
Avoided clinical whites and cold blues common in mental health apps.

### Indian Context First
All copy uses culturally resonant phrases: "beta," "chai break," "suno," "padhai," "dil ki baat."
The app acknowledges uniquely Indian pressures: JEE coaching culture, drop years, hostel loneliness,
parental comparison. BhalAI never uses Western therapy terminology ("cognitive distortions," "CBT") that
would feel foreign or alienating.

### BhalAI Personality
BhalAI is modelled on the archetype of a wise, warm, maternal figure — not a bot. She:
- Uses code-switching Hinglish naturally
- Remembers what you told her yesterday
- Never lectures or prescribes
- Always validates before advising
- Escalates gently to human support when needed

### Privacy by Design
The decision to use localStorage rather than a database was not a technical compromise — it was a feature.
Students are more likely to be honest in a journal that they know no one can read. Zero server = zero breach risk.

---

## 6. Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Next.js 15 App Router               │
│  /         /onboarding   /dashboard   /chat          │
│  /journal  /heatmap      /reports     /confessions   │
│  /welcome  /privacy      /faq         /about         │
└─────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────┐
│            Zustand Store (useStore.ts)               │
│  Single source of truth for:                         │
│  • User Profile + Auth state                         │
│  • Journal Entries + AI analysis                     │
│  • Mood Check-ins                                    │
│  • Chat History                                      │
│  • Heatmap Data                                      │
│  • Weekly Reports                                    │
│  Persisted via: localStorage (zustand/middleware)    │
└─────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────┐
│              AI Layer (src/lib/ai/)                  │
│  claude.ts           → Chat responses               │
│  claude.ts           → Journal analysis             │
│  claude.ts           → Crisis detection             │
│  claude.ts           → Weekly report generation     │
│  assessmentEngine.ts → Mathematical wellness metrics│
│                                                      │
│  Mode detection:                                     │
│  • ANTHROPIC_API_KEY set → Real Claude API          │
│  • Not set              → Offline mock mode         │
└─────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────┐
│         Testing Layer (Vitest + RTL)                 │
│  useStore.test.ts     → Auth + session persistence  │
│  crisis.test.ts       → Crisis detection coverage   │
│  assessmentEngine.test.ts → Wellness metric math    │
└─────────────────────────────────────────────────────┘
```

---

## 7. AI Prompting Strategy

### Emotional Analysis (Journal)
Journal content is analysed using a two-pass approach:
1. **Keyword classification**: A curated lexicon of ~60 emotional cues (low/medium/high distress) scores the text.
2. **Trigger detection**: Specific patterns (relationship, mock tests, parental pressure, hostel loneliness, financial stress) are detected with whole-word matching to avoid false positives.
3. **Stress score**: Derived from cue density and trigger severity, then bounded to 0–100.

### Crisis Detection
Crisis detection runs on every journal entry and chat message before the main AI response is generated.
A list of ~35 crisis keywords (in English and Hindi transliterations) is matched against the input.
If matched → `isCrisis: true, severity: "high"` → immediate helpline escalation overrides all other responses.
If API is available, a secondary Claude check runs for nuanced crisis detection beyond keyword matching.

### Memory Layer
The BhalAI system prompt is dynamically built with:
- Student name, exam type, comfort subject, exam date
- Last 3 mood check-in summaries
- Last 3 journal entries (truncated to key excerpts)
This ensures BhalAI can reference past pain points naturally without requiring a vector database.

### Intent Classification (Chat)
Chat messages are classified into 8 intents before generating a response:
`Greeting | Relationship | Coaching | Parent | Academic | Loneliness | Motivation | Fallback`
Each intent maps to a specifically crafted response template that is personalised with user context before delivery.

---

## 8. Challenges Faced

### Challenge 1: Disconnected Data Flows
**Problem:** Early versions had dashboard, heatmap, and AI responses reading from different, unsynced data sources.
**Solution:** Refactored to a single Zustand store as the universal source of truth. All screens now read from and write to the same state.

### Challenge 2: Hallucinated Insights
**Problem:** Without a real API key, mock responses were generic and felt disconnected from user data.
**Solution:** Built a comprehensive keyword-based mock AI that reads actual store data (journals, check-ins) and generates personalised responses even offline.

### Challenge 3: Onboarding Persistence
**Problem:** After login, some users were being re-routed to onboarding even after completion, due to stale state.
**Solution:** Fixed Zustand `persist` middleware configuration and added a `welcomeScreenSeen` flag so returning users bypass the trust screen.

### Challenge 4: AI Response Quality
**Problem:** Initial AI responses were repetitive, generic, and lacked the cultural warmth required.
**Solution:** Rewrote the intent classification system with 8 distinct emotional pathways, personalised with user context (exam type, comfort subject, memory from past entries).

### Challenge 5: Vercel Deployment Block
**Problem:** Next.js 15.0.3 was flagged as vulnerable (CVE-2025-29927) by Vercel's security scanner.
**Solution:** Upgraded to `^15.3.4` (patched), removed stale `package-lock.json` so Vercel generates a fresh install, added `overrides` block to enforce safe transitive dependencies.

---

## 9. Final Solution

The completed Nazaraana product is a **connected wellness engine** where every data point feeds every feature:

```
User writes journal
        ↓
AI analyses emotion, stress score, triggers, crisis flag
        ↓
Stress score saved to store
        ↓
Heatmap updates with correct colour (green → red → crisis crimson)
        ↓
Dashboard metrics recalculate
        ↓
Weekly report generates personalised, compassionate narrative
        ↓
BhalAI references journal context in next conversation
```

No screen operates in isolation. Every interaction makes the companion smarter about the student.

---

## 10. Judging Results (Hackathon Evaluation)

| Criterion | Approach |
|-----------|----------|
| **Code Quality** | TypeScript strict mode, modular architecture, single-responsibility components, Zustand for state management |
| **Security** | Next.js 15.3.4+ (patched CVEs), `poweredByHeader: false`, localStorage-only data (no server breach risk), bcrypt password hashing |
| **Efficiency** | localStorage means zero DB latency; offline mock mode means zero API cost; heatmap computed client-side in O(n) |
| **Accessibility** | WCAG AA colour contrast, ARIA labels, keyboard navigation, semantic HTML, screen reader support |
| **Problem Alignment** | Directly addresses student mental health crisis in India; culturally resonant; crisis escalation to real helplines |

---

## 11. Future Roadmap

### Phase 1 (3–6 months)
- **Native mobile app** (React Native) for iOS and Android — offline-first with local SQLite
- **Push notifications** for daily check-in reminders and pre-exam calming prompts
- **Voice journaling** (speech-to-text via Web Speech API)

### Phase 2 (6–12 months)
- **Better AI memory** using vector embeddings (Pinecone/Supabase pgvector) for long-term context without hallucination
- **Long-term emotional trend prediction** — predict burnout risk 2 weeks in advance using trend analysis
- **Counsellor connect** — anonymised referral to verified counsellors if crisis threshold is repeatedly triggered

### Phase 3 (12–18 months)
- **Community support circles** — moderated peer support groups by exam type
- **Parent companion module** — separate interface helping parents understand and support their child's emotional state
- **Research dataset** (anonymised, opt-in) — contribute to academic research on student mental health in India

---

*Built with ❤️ and hope. Nazaraana believes every student deserves to be heard.*
