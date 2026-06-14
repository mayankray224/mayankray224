# Nazaraana (नज़राना) - Student Mental Wellness Companion

Nazaraana is a warm, culturally resonant, GenAI-powered emotional wellness companion tailored specifically for Indian students preparing for high-stakes examinations (JEE, NEET, UPSC, Board Exams, etc.). 

By offering BhalAI—an empathetic, multilingual conversational buddy—alongside dynamic stress tracking, private diary journals, and anonymous confessions, Nazaraana helps carry the mental and emotional load of exam preparation.

---

## 🚀 Key Highlights & Architecture

### 1. 100% Zero-Configuration Local Development
- **No Database Needed:** All authentication, user profiles, session tokens, daily check-ins, journal diaries, chat history, and reports run entirely on client-side state persisted in `localStorage`. 
- **No OAuth/Docker/SMTP setups:** Decoupled from PostgreSQL, Prisma, Google OAuth, and email OTP verification. 
- **Offline Continuity:** Fully interactive without external databases.

### 2. Personalization Engine
- **Wellness Metrics:** Mood, stress, confidence, burnout risk, and mental readiness indices are mathematically derived in real-time using actual user inputs (daily check-ins and journal logs). No mock or randomized scores.
- **Supportive Pre-Exam Protocol:** Automatically activates within 72 hours of the user's exam date, swapping active study recommendations with guided box-breathing exercises, positive affirmations, and calming visual tasks.

### 3. BhalAI Memory Layer
- Claude remembers your target exam, comfort subjects, recent check-ins, and journal entries. Responses reference past events (e.g. SSC mock test anxiety) to create an empathetic, continuous support relationship.

---

## 🛠️ Local Setup Instructions

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
# Required for BhalAI Chat, Journal, and Reports Claude analysis
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Step 3: Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to interact with the application.

---

## 🧪 Testing Coverage

We use **Vitest** and **React Testing Library** to validate authentication, session persistence, onboarding wizard flows, and emotional metric calculations.

To run the unit and integration tests:
```bash
npm run test
```

Test files:
- `src/store/useStore.test.ts` (Validates user registrations, password bcrypt verification, demo login, session persistence, and onboarding sync)
- `src/lib/assessmentEngine.test.ts` (Validates dynamic calculations for stress scores, burnout risks, and readiness indices under poor/excellent metrics inputs)

---

## 📱 Core Feature Checklist

- **Screen 1 (Landing Page):** Welcome page with credential registration, login, and "Try Demo Experience" quick login.
- **Screen 2-6 (Onboarding Wizard):** 5-step onboarding wizard gathering: Name, target exams checklist, preferred language (English, Hindi, Hinglish, Bengali, Marathi, etc.), comfort subject, and exam date. Enforced for all users.
- **Screen 7 (Dashboard):** Dynamic personal greeting, exam countdown timer, mental readiness circle gauge, stress trend timeline, check-in log sliders, and study recommendation check-cards.
- **Screen 8 (BhalAI Chat):** Conversational buddy with character-by-character streaming text, typing indicators, safety support flags, and contextual memory.
- **Screen 9 (Mood Journal):** Writing area styled like standard writing paper, auto-tag categorization, stress score analysis, and entry timeline log.
- **Screen 10 (Heatmap Calendar):** Color-coded daily workload stress squares with detail popups showing coping suggestions.
- **Screen 11 (Weekly reflection):** Comprehensive weekly report containing supportive insights and a downloadable high-resolution graphics card for sharing.
- **Screen 12 (Confession Wall):** Anonymous student message wall with Claude content moderation, emoji react buttons, and support counters.
- **Screen 13 (Settings Configuration):** Quick toggle theme, change target exams, modify comfort subjects, adjust languages, and clear local storage databases.

---

## ♿ Accessibility (WCAG AA Compliance)
- **Keyboard Navigation:** Forms, sliders, inputs, dropdown options, and sidebar items support strict tab indexing and keyboard activation.
- **Aria Labels:** Screen readers are supported via semantic DOM headers and `aria-label`/`aria-hidden` attributes.
- **Contrast Ratios:** Curated color system (curated primary oranges and terracotta rose accents) conforms with WCAG contrast requirements under both light and dark display modes.
