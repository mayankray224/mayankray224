"use client";

import React, { useState, useEffect, useRef } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { Send, Sparkles, HeartHandshake } from "lucide-react";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const store = useStore();
  const hydrated = useHydration();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Filter messages for current user
  const userMessages = store.localChatMessages.filter((m) => m.userId === store.userId);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, streamingText, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessageContent = input.trim();
    setInput("");
    
    // Add user message locally
    store.addChatMessage("user", userMessageContent);
    setIsTyping(true);
    setStreamingText("");

    // Gather history context (last 6 messages)
    const recentHistory = userMessages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content
    }));

    // Gather previous checkins memory
    const userCheckins = store.localMoodCheckins
      .filter((c) => c.userId === store.userId)
      .slice(0, 5)
      .map((c) => `Mood: "${c.moodText || "Logged Check-in"}" (Stress: ${c.stressScore}/10, Energy: ${c.energyScore}/10, Sleep: ${c.sleepHours}h)`);

    // Gather previous journals memory
    const userJournals = store.localJournals
      .filter((j) => j.userId === store.userId)
      .slice(0, 3)
      .map((j) => `Reflected: "${j.content.substring(0, 100)}..." (Emotion summary: "${j.emotionSummary || "None"}")`);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: userMessageContent,
          history: recentHistory,
          userContext: {
            name: store.name,
            examType: store.examType,
            examDate: store.examDate,
            comfortSubject: store.comfortSubject,
            language: store.language,
          },
          memory: {
            checkins: userCheckins,
            journals: userJournals,
          }
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullAssistantText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (line.startsWith("__CRISIS__:true")) {
              store.setIsCrisisFlagged(true);
            } else if (line.trim() && !line.startsWith("__CRISIS__:false") && !line.startsWith("__CONVID__:")) {
              fullAssistantText += line;
              setStreamingText(fullAssistantText);
            }
          }
        }
      }

      // Streaming finished, save assistant message
      store.addChatMessage("assistant", fullAssistantText);
      setStreamingText("");
      setIsTyping(false);

    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = "Beta, BhalAI connects slowly sometimes. Please take a deep breath. Can you try typing that again?";
      store.addChatMessage("assistant", errorMsg);
      setIsTyping(false);
    }
  };

  if (!hydrated) {
    return <PageSkeleton />;
  }

  return (
    <AppShell>
      <div className="flex flex-col h-[76vh] bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border rounded-3xl shadow-sm warm-shadow overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-warm-border dark:border-dark-border bg-warm-bg/40 dark:bg-dark-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold" aria-hidden="true">
              भ
            </div>
            <div>
              <div className="font-bold text-sm text-warm-text dark:text-white flex items-center gap-1.5">
                <span>{t.bhalAI}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
              </div>
              <div className="text-[10px] text-warm-text/50 dark:text-gray-400">Empathetic Wellness Companion</div>
            </div>
          </div>

          <div className="text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>AI Healing Active</span>
          </div>
        </div>

        {/* Message Bubble History Box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-warm-bg/10">
          
          {userMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto space-y-4 opacity-80 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <HeartHandshake className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-base text-warm-text dark:text-white">Namaste, {store.name || "Beta"}</h3>
                <p className="text-xs text-warm-text/75 dark:text-gray-300 leading-relaxed mt-1">
                  I am BhalAI. Preparing for high-stakes exams can be extremely isolating, and mock test scores can make you question your worth. I am here to listen, not to judge or teach. Tell me, how was your day?
                </p>
              </div>
            </div>
          )}

          {userMessages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 animate-fade-in">
                    भ
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white dark:bg-dark-bg border border-warm-border dark:border-dark-border text-warm-text dark:text-gray-100 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span
                    className="text-[9px] block text-right mt-1.5 opacity-60 font-lato"
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Streaming Response Bubble */}
          {streamingText && (
            <div className="flex justify-start items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 animate-pulse">
                भ
              </div>
              <div className="max-w-[80%] bg-white dark:bg-dark-bg border border-warm-border dark:border-dark-border text-warm-text dark:text-gray-100 rounded-2xl rounded-tl-none p-3.5 text-sm leading-relaxed shadow-sm">
                <p className="whitespace-pre-line">{streamingText}</p>
                <span className="w-1.5 h-3.5 bg-primary/60 inline-block animate-pulse ml-0.5 align-middle"></span>
              </div>
            </div>
          )}

          {/* Typing animation block */}
          {isTyping && !streamingText && (
            <div className="flex justify-start items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                भ
              </div>
              <div className="bg-white dark:bg-dark-bg border border-warm-border dark:border-dark-border rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-warm-border dark:border-dark-border bg-white dark:bg-dark-card flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={t.moodPrompt}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 px-4 py-3 bg-warm-bg/50 dark:bg-dark-bg/40 border border-warm-border dark:border-dark-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-warm-text dark:text-white text-sm"
            aria-label="Type your message to BhalAI"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
