import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Nazaraana Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        isDemo: { label: "Is Demo", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, isDemo } = credentials;

        // 1. DEMO LOG-IN OR BYPASS
        const isDemoLogin = isDemo === "true" || (email === "demo@nazaraana.ai" && password === "demo123");

        if (isDemoLogin) {
          try {
            let user = await prisma.user.findUnique({
              where: { email: "demo@nazaraana.ai" },
              include: { exams: true, subjects: true },
            });

            if (!user) {
              const hashedPassword = bcrypt.hashSync("demo123", 10);
              
              user = await prisma.user.create({
                data: {
                  email: "demo@nazaraana.ai",
                  password: hashedPassword,
                  name: "Aarav Sharma",
                  language: "Hinglish",
                  theme: "light",
                  age: 19,
                  exams: {
                    create: {
                      examType: "JEE Mains",
                      examDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                    },
                  },
                  subjects: {
                    createMany: {
                      data: [
                        { name: "Physics", isComfortSubject: true },
                        { name: "Chemistry", isComfortSubject: false },
                      ]
                    }
                  },
                },
                include: { exams: true, subjects: true },
              });

              const userRef = user.id;
              await prisma.moodCheckin.createMany({
                data: [
                  { userId: userRef, moodText: "Mock test went bad, syllabus backlog is piling up", stressScore: 82, confidenceScore: 40, burnoutRisk: 75, moodScore: 45, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
                  { userId: userRef, moodText: "Felt very lonely. Talked to BhalAI, did a small breathing exercise.", stressScore: 68, confidenceScore: 50, burnoutRisk: 65, moodScore: 55, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
                  { userId: userRef, moodText: "Chai break with friends, revision went okay today", stressScore: 52, confidenceScore: 65, burnoutRisk: 50, moodScore: 72, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
                ]
              });

              await prisma.journalEntry.createMany({
                data: [
                  {
                    userId: userRef,
                    content: "I spent 12 hours studying organic chemistry today but when I sat down for the mock paper, I blanked out. I feel like all my hard work is going to waste. Mummy expects me to clear JEE this year, and I can't bear the thought of failing them.",
                    emotionSummary: "Scared of failure, feeling academic pressure.",
                    tags: ["jee-prep", "burnout", "mock-test"],
                    stressScore: 80,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                  },
                  {
                    userId: userRef,
                    content: "Spoke to BhalAI and focused only on Physics (my comfort subject) for 30 minutes. It felt good to solve simple questions again. Maybe I am not completely hopeless. Still anxious but calmer.",
                    emotionSummary: "Regaining confidence, calm progress.",
                    tags: ["physics", "small-wins", "hopeful"],
                    stressScore: 55,
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                  }
                ]
              });

              await prisma.streak.create({
                data: {
                  userId: userRef,
                  currentStreak: 3,
                  longestStreak: 5,
                  lastActive: new Date(),
                }
              });

              await prisma.copingStrategy.createMany({
                data: [
                  { userId: userRef, strategyText: "Box Breathing (4-4-4): Calm exam anxiety under 2 minutes", helped: true },
                  { userId: userRef, strategyText: "Chai & Sigh: Walk to the local stall, take a long sigh.", helped: false },
                ]
              });
            }

            return user;
          } catch (dbError) {
            console.warn("Database connection failed during demo login. Bypassing with static user details.", dbError);
            return {
              id: "demo-user",
              name: "Aarav Sharma",
              email: "demo@nazaraana.ai",
              language: "Hinglish",
              theme: "light",
              age: 19
            };
          }
        }

        // 2. STANDARD EMAIL + PASSWORD LOGIN
        if (!email || !password) {
          throw new Error("Please specify your email and password.");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new Error("No student account found with this email. Please sign up!");
          }

          // Verify hashed password
          const isValid = bcrypt.compareSync(password, user.password);
          if (!isValid) {
            throw new Error("Invalid password code. Please check your credentials.");
          }

          return user;
        } catch (err: any) {
          console.error("Auth error:", err);
          // If database is offline but it matches a local register attempt or default demo account:
          if (email === "demo@nazaraana.ai" && password === "demo123") {
            return {
              id: "demo-user",
              name: "Aarav Sharma",
              email: "demo@nazaraana.ai",
              language: "Hinglish",
              theme: "light",
              age: 19
            };
          }
          throw new Error(err.message || "Database is offline. Please use Demo Login!");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.language = (user as any).language || "English";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        (session.user as any).language = token.language || "English";
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/", // Redirect error screens back to landing
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
