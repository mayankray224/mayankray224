# Nazaraana: GenAI-Powered Emotional Wellness Platform

Nazaraana is a production-ready emotional wellness platform for Indian students preparing for high-stakes examinations (such as NEET, JEE, UPSC, CAT, GATE, and board exams). At its center is **BhalAI**, an empathetic companion that helps students process mock-test stress, burnout, loneliness, and academic anxiety.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Student User]) -->|HTTP / JSON| Frontend[Next.js 15 App Router]
    Frontend -->|Server Actions| Actions[Next.js Server Actions]
    Frontend -->|API Streams| ChatAPI[Chat API /api/chat]
    
    Actions -->|Prisma Client| DB[(PostgreSQL Database)]
    ChatAPI -->|Prisma Client| DB
    
    Actions -->|Claude SDK| ClaudeAI[Claude API: claude-3-5-sonnet]
    ChatAPI -->|Claude SDK| ClaudeAI
    
    subgraph LocalState [Local State]
        Zustand[Zustand Store] -->|Persists Preferences| LS[LocalStorage]
        Translations[Translations Dictionary] -->|10 Indian Languages| Zustand
    end
```

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript, TailwindCSS, Framer Motion, Zustand, Recharts, Lucide Icons.
- **Backend:** Next.js Server Actions, Next.js API Routes (Streaming Responses).
- **Database & Auth:** PostgreSQL, Prisma ORM, NextAuth (Credentials OTP & Google Login).
- **AI Engine:** Claude API (Sonnet-3.5), Centralized AI Services.

---

## 📂 Project Folder Structure

```
├── prisma/
│   ├── schema.prisma         # Prisma Schema (User, Exam, Subject, MoodCheckin, Journal, Confessions, Reactions)
│   └── seed.ts               # Database Seed Script (Anonymous confessions wall & reactions)
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── actions.ts        # Core Server Actions (Onboarding sync, journals logging, confessions react)
│   │   ├── layout.tsx        # Global Layout (Provider setups, CSS variables)
│   │   ├── page.tsx          # Screen 1: Landing Page (Google, Email OTP, and Demo logins)
│   │   ├── onboarding/       # Screens 2-6: Step-by-Step Onboarding Wizard
│   │   ├── dashboard/        # Screen 7: Readiness score, Heatmap overview, Study router
│   │   ├── chat/             # Screen 8: Full-screen BhalAI Chat with streaming
│   │   ├── journal/          # Screen 9: Handcrafted Mood Diary Timeline
│   │   ├── heatmap/          # Screen 10: Expanded Stress Analytics Calendar & Drawer
│   │   ├── reports/          # Screen 11: Weekly AI wellness reflections & Canvas PNG Share
│   │   ├── confessions/      # Screen 12: Moderated Anonymous Confessions Wall & Reactions
│   │   ├── settings/         # Screen 13: UI Language selectors, Exam configuration, About BhalAI
│   │   └── api/
│   │       ├── auth/         # NextAuth API routing handlers
│   │       └── chat/         # Claude streaming chat API endpoint
│   ├── components/
│   │   ├── LandingClient.tsx # Client landing portal forms
│   │   └── shared/
│   │       ├── AppShell.tsx  # Authenticated header/footer shell with Global Crisis helplines modal
│   │       └── Providers.tsx # Client NextAuth SessionProvider wrappers
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configurations (Demo user self-seeding & OTP credential handlers)
│   │   ├── translations/     # Localized string definitions for 10 Indian Languages
│   │   ├── db/
│   │   │   └── prisma.ts     # Client singleton instance
│   │   └── ai/
│   │       ├── claude.ts     # Centralized Claude SDK invocation handlers & fallback mock generators
│   │       └── prompts.ts    # System instructions (BhalAI personality rules, Journal and study prompts)
│   └── store/
│       └── useStore.ts       # Zustand Reactive UI States (Active language switcher, dark themes, crisis status)
├── tailwind.config.ts        # Custom Nazaraana brand palette extensions
├── tsconfig.json
├── package.json
└── .env
```

---

## 🔑 Environment Setup

Create a `.env` file at the root of the project:

```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/nazaraana?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="nazaraana_secret_session_key"

# Authentication Provider Keys (Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Companion API Key (Anthropic)
# Replace with your actual key to activate Claude Sonnet. BhalAI falls back to 
# high-quality, simulated local responses if this key is omitted or left as default.
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

---

## ⚡ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database & Migrations
Ensure a PostgreSQL server is running, then run migrations to initialize schema tables:
```bash
npx prisma migrate dev --name init
```

### 3. Seed Database
Populate the anonymous confessions wall with seed reactions and baseline posts:
```bash
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🚀 Deployment to Vercel

Nazaraana is designed for seamless Vercel deployment:

### 1. Push Code to Github
Create a private repository and push your project code:
```bash
git init
git add .
git commit -m "Initial commit - Nazaraana platform"
git remote add origin <your-git-repo>
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your repository.
3. In **Build & Development Settings**, keep default commands.
4. Add all environment variables from `.env` in the Vercel Dashboard under **Environment Variables**.
5. Click **"Deploy"**.

### 3. Database Deployment
You can deploy a serverless PostgreSQL instance on:
- **Vercel Postgres** (Add Integration directly to the project).
- **Supabase** or **Neon**.
Update the `DATABASE_URL` in Vercel settings to point to your deployed production database connection string, then trigger a redeployment.
