"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { fetchUserProfile, checkDatabaseHealth } from "@/app/actions";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Calendar,
  FileText,
  Heart,
  Settings,
  Flame,
  Sun,
  Moon,
  LogOut,
  PhoneCall,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const store = useStore();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  // Redirect unauthenticated users and sync profile metadata on shell load
  useEffect(() => {
    if (!store.currentUser) {
      router.push("/");
      return;
    }

    async function syncProfile() {
      try {
        const isDb = await checkDatabaseHealth();
        if (isDb) {
          const profile = await fetchUserProfile();
          if (profile) {
            store.setUserName(profile.name || "");
            store.setLanguage((profile.language as any) || "English");
            store.setStreakCount(profile.streaks[0]?.currentStreak || 0);
            store.setPreExamMode(profile.preExamActive);
            
            if (profile.crisisFlags && profile.crisisFlags.length > 0) {
              store.setIsCrisisFlagged(true);
            }
          }
        } else {
          // Database is offline: sync from local store currentUser
          store.setUserName(store.currentUser?.name || "");
          store.setLanguage((store.currentUser?.language as any) || "English");
        }
      } catch (err) {
        console.warn("Failed to sync profile from database, using local store data:", err);
        store.setUserName(store.currentUser?.name || "");
        store.setLanguage((store.currentUser?.language as any) || "English");
      }
    }
    syncProfile();
  }, [pathname, store.currentUser, router]);

  const navItems = [
    { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.chat, href: "/chat", icon: MessageSquare },
    { name: t.journal, href: "/journal", icon: BookOpen },
    { name: t.heatmap, href: "/heatmap", icon: Calendar },
    { name: t.reports, href: "/reports", icon: FileText },
    { name: t.confessions, href: "/confessions", icon: Heart },
    { name: t.settings, href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-dark-bg text-warm-text dark:text-gray-100 flex flex-col md:flex-row font-hind">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-[#FFFDFB] dark:bg-dark-card border-r border-warm-border dark:border-dark-border flex-col justify-between p-4 flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
              न
            </span>
            <span className="text-xl font-bold font-lato text-warm-text dark:text-white">Nazaraana</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "text-warm-text/70 dark:text-gray-300 hover:bg-warm-bg dark:hover:bg-dark-bg"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User controls / Bottom Sidebar */}
        <div className="space-y-2 pt-4 border-t border-warm-border/60 dark:border-dark-border/60">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold font-lato">
              <Flame className="w-4 h-4 fill-amber-500 stroke-amber-500 animate-bounce" />
              <span>{store.streakCount} DAYS</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={store.toggleTheme}
                className="p-1.5 rounded-lg text-warm-text/60 dark:text-gray-400 hover:bg-warm-bg dark:hover:bg-dark-bg transition-colors"
                title="Toggle Theme"
              >
                {store.theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              store.clearLocalData();
              localStorage.removeItem("nazaraana_session");
              signOut({ callbackUrl: "/" });
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Top Bar */}
      <header className="md:hidden bg-[#FFFDFB] dark:bg-dark-card border-b border-warm-border dark:border-dark-border px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-dark-card/80">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
            न
          </span>
          <span className="text-lg font-bold text-warm-text dark:text-white font-lato">Nazaraana</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold font-lato">
            <Flame className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
            <span>{store.streakCount}</span>
          </div>

          <button
            onClick={store.toggleTheme}
            className="p-1.5 rounded-lg text-warm-text/60 dark:text-gray-400 hover:bg-warm-bg dark:hover:bg-dark-bg"
          >
            {store.theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 overflow-y-auto max-h-screen">
        <div className="p-4 md:p-8 max-w-5xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>

      {/* 4. Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FFFDFB]/90 dark:bg-dark-card/90 border-t border-warm-border dark:border-dark-border py-2 px-4 flex justify-between items-center z-40 backdrop-blur-md">
        {navItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? "text-primary scale-105"
                  : "text-warm-text/60 dark:text-gray-400"
              }`}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
        {navItems.slice(5, 7).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? "text-primary scale-105"
                  : "text-warm-text/60 dark:text-gray-400"
              }`}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className="text-[10px] font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 5. Global Crisis Support Helpline Modal Drawer */}
      <AnimatePresence>
        {store.isCrisisFlagged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border max-w-md w-full rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />
              
              <button
                onClick={() => store.setIsCrisisFlagged(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-warm-bg dark:hover:bg-dark-bg text-warm-text/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 text-rose-600 mb-4">
                <PhoneCall className="w-6 h-6 animate-pulse" />
                <h3 className="text-xl font-bold font-lato">{t.crisisTitle}</h3>
              </div>

              <p className="text-sm text-warm-text/80 dark:text-gray-300 leading-relaxed mb-6">
                {t.crisisText}
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="text-xs text-rose-500 uppercase font-bold tracking-wider font-lato">iCall Helpline</div>
                    <div className="text-base font-bold text-warm-text dark:text-white">9152987821</div>
                    <div className="text-[10px] text-warm-text/50">Free, multilingual, emotional guidance</div>
                  </div>
                  <a
                    href="tel:9152987821"
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
                  >
                    Call Now
                  </a>
                </div>

                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="text-xs text-rose-500 uppercase font-bold tracking-wider font-lato">Vandrevala Foundation</div>
                    <div className="text-base font-bold text-warm-text dark:text-white">1860-2662-345</div>
                    <div className="text-[10px] text-warm-text/50">24/7 dedicated exam distress care</div>
                  </div>
                  <a
                    href="tel:18602662345"
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => store.setIsCrisisFlagged(false)}
                  className="text-xs text-warm-text/50 hover:underline"
                >
                  Close this window. I promise I will take care.
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
