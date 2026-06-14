<p align="center">
  <img src="public/nazaraana-logo.png" alt="Nazaraana Logo" width="80" />
</p>

<h1 align="center">Nazaraana (नज़राना)</h1>
<p align="center"><strong>GenAI-powered emotional wellness companion for Indian exam aspirants.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.4-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Anthropic-Claude-orange?logo=anthropic" />
  <img src="https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 📖 Overview

Nazaraana is a warm, culturally resonant emotional wellness companion tailored for students preparing for high-stakes Indian examinations — JEE, NEET, UPSC, CUET, Board Exams, and more.

By pairing **BhalAI** — an empathetic, multilingual AI companion — with dynamic stress tracking, private journal analysis, and a live wellness heatmap, Nazaraana helps carry the invisible mental load of exam preparation.

**India produces 2.5M+ JEE aspirants and 2M+ NEET aspirants annually. Existing tools track productivity. Nazaraana tracks wellbeing.**

---

## ✨ Features

### 🤖 BhalAI — Your Wellness Companion
- Warm, maternal conversational AI modelled on the "badi didi" archetype
- Full **Hinglish / multilingual** support (Hindi, English, Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, Gujarati)
- **Memory Layer** — references your recent journals and check-ins in conversation
- **Intent Classification** — 8 emotional pathways (Relationship, Coaching, Parent Pressure, Academic, Loneliness, Motivation, Greeting, Fallback)
- **Crisis Escalation** — detects 35+ distress signals, instantly surfaces helpline numbers

### 📊 Connected Wellness Engine
- **Daily Mood Check-in** — stress, energy, sleep, and confidence sliders (1–10)
- **Mann Ki Diary** — private journal with AI emotion/stress analysis and tag extraction
- **Stress Heatmap** — 30-day colour-coded calendar (green → amber → red → crisis crimson)
- **Weekly Wellness Report** — personalised narrative generated from your data
- **Mental Readiness Score** — mathematically derived from stress, sleep, confidence, and journal frequency

### 🛡️ Trust & Safety
- **Trust-Building Onboarding** — Screen 0 explains what BhalAI can/cannot do before setup
- **Privacy by Design** — all data stored in `localStorage` only; nothing leaves your device
- **Zero-Config** — works fully offline without any database or API key

### 🌐 Product Pages
- `/about` — BhalAI origin story and capabilities
- `/faq` — 10-question FAQ with collapsible answers
- `/privacy` — Full privacy policy
- `/terms` — Terms of use

---

## 🏗️ Architecture

```
Next.js 15 App Router
        │
        ▼
Zustand Store (Single Source of Truth)
  • User Profile + Auth
  • Journals + AI analysis
  • Mood Check-ins
  • Chat History
  • Crisis Flags
  • Weekly Reports
        │
        ▼
AI Layer (src/lib/ai/claude.ts)
  • Offline mock mode (no API key needed)
  • Real Claude 3.5 Sonnet (with ANTHROPIC_API_KEY)
  • Crisis detection → helpline escalation
  • Journal emotion analysis
  • Weekly report generation
        │
        ▼
localStorage (via Zustand persist middleware)
```

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment (optional — for real AI)
```bash
cp .env.example .env
# Add your Anthropic API key to enable real Claude responses
# ANTHROPIC_API_KEY=your_key_here
# Without it, the app runs in full offline mock mode
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 4. Build for production
```bash
npm run build
npm start
```

---

## 🧪 Testing

Nazaraana uses **Vitest** + **React Testing Library** for unit and integration tests.

### Run all tests
```bash
npm test
```

### Test coverage

| Test File | What It Tests |
|-----------|--------------|
| `src/store/useStore.test.ts` | User registration, login, session persistence, onboarding completion, demo login, logout |
| `src/lib/ai/crisis.test.ts` | Crisis detection for 10+ phrase variants, journal analysis CRITICAL path, safe text non-flagging |
| `src/lib/assessmentEngine.test.ts` | Stress score math, burnout risk, readiness score under poor/excellent/mixed conditions |

### Test structure
```
src/
  store/
    useStore.test.ts         ← Auth flow tests
  lib/
    assessmentEngine.test.ts ← Wellness metric tests
    ai/
      crisis.test.ts         ← Crisis + journal analysis tests
```

---

## 🤖 AI Capabilities

### Offline Mock Mode (default — no API key needed)
- Full intent classification across 8 emotional categories
- Keyword-based journal emotion analysis
- Crisis detection with helpline escalation
- Personalised responses using your store data (name, exam, comfort subject)

### Real AI Mode (with `ANTHROPIC_API_KEY`)
- Claude 3.5 Sonnet for nuanced, contextual conversations
- Advanced journal analysis with structured JSON responses
- AI-generated weekly wellness reports
- Streaming character-by-character responses

---

## 🔒 Privacy & Security

- **Zero server data** — all your journals, check-ins, and chat history live only in your browser's `localStorage`
- **No analytics** — no tracking pixels, ad networks, or analytics SDKs
- **Secure passwords** — bcrypt hashing with salt rounds = 10
- **Crisis escalation** — real Indian helpline numbers surfaced immediately when distress is detected
- **Next.js 15.3.4+** — latest patched version, no known CVEs, `X-Powered-By` header suppressed

---

## 🗺️ User Flow

```
Landing (/) → Register/Login
      ↓
Welcome Screen (/welcome)   ← "What BhalAI can/cannot do" + Privacy notice
      ↓
Onboarding Wizard (/onboarding)  ← Name, exam, language, comfort subject, date
      ↓
Dashboard (/dashboard)       ← Readiness score, check-in, study recommendations
      ↓
BhalAI Chat (/chat)          ← Streaming AI companion
Mann Ki Diary (/journal)     ← Private journal + AI analysis
Heatmap (/heatmap)           ← 30-day stress calendar
Reports (/reports)           ← Weekly wellness narrative
Confessions (/confessions)   ← Anonymous student wall
Settings (/settings)         ← Profile, theme, language, data clear
```

---

## ⚠️ Known Limitations

- BhalAI is not a therapist and cannot provide medical advice
- Offline mock mode responses are keyword-driven and may occasionally miss nuance
- All data is cleared if the user clears browser storage
- Real AI features require an Anthropic API key (not included)
- next-auth v4 is used (v5 migration planned for next major version)

---

## 🛣️ Future Roadmap

- 📱 **Native mobile app** (React Native, offline-first with SQLite)
- 🧠 **Long-term trend prediction** using vector embeddings for burnout forecasting
- 👥 **Community support circles** moderated by exam type
- 📞 **Counsellor referral** when crisis threshold is repeatedly exceeded
- 🎙️ **Voice journaling** via Web Speech API
- 👨‍👩‍👧 **Parent companion module** to help families understand student stress

---

## 📄 Documentation

- [Case Study](docs/case-study.md) — Full product case study (problem, research, architecture, AI strategy, challenges)
- [Privacy Policy](/privacy) — Data handling and user rights
- [Terms of Use](/terms) — Usage terms and disclaimers
- [About BhalAI](/about) — Capabilities, limitations, and origin story
- [FAQ](/faq) — 10 common questions answered

---

## 🚨 Crisis Support

If you or someone you know is in distress:

- **iCall**: 9152987821 (Mon–Sat, 8am–10pm)
- **Vandrevala Foundation**: 1860-2662-345 (24/7)
- **Emergency Services**: 112

---

## ♿ Accessibility

- WCAG AA colour contrast compliance
- Full keyboard navigation support
- ARIA labels and semantic HTML throughout
- Screen reader compatible

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for every student who studies alone at 2am.<br/>
  <em>Nazaraana believes every student deserves to be heard.</em>
</p>
