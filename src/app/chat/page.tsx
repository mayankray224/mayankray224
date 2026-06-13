"use client";

import React, { useState, useEffect, useRef } from "react";
import AppShell from "@/components/shared/AppShell";
import { useStore } from "@/store/useStore";
import { TRANSLATIONS } from "@/lib/translations";
import { fetchChatHistory } from "@/app/actions";
import { authService } from "@/lib/authService";
import { Send, Sparkles, AlertCircle, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | string;
  content: string;
  createdAt: Date | string;
}

export default function ChatPage() {
  const store = useStore();
  const t = TRANSLATIONS[store.language] || TRANSLATIONS.English;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load chat history from DB or local store
  useEffect(() => {
    async function loadHistory() {
      try {
        const isDb = await authService.isDbAvailable();
        if (isDb) {
          const history = await fetchChatHistory();
          setMessages(history);
        } else {
          setMessages(store.localChatMessages as any[]);
        }
      } catch (err) {
        console.warn("Failed to load chat history from database, using local backup:", err);
        setMessages(store.localChatMessages as any[]);
      }
    }
    loadHistory();
  }, [store.localChatMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessageContent = input.trim();
    setInput("");
    
    // Add user message locally
    const userMsg: ChatMessage = {
      id: "chat-u-" + Math.random().toString(),
      role: "user",
      content: userMessageContent,
      createdAt: new Date().toISOString(),
    };
    store.addLocalChatMessage(userMsg as any);
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setStreamingText("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: userMessageContent,
          conversationId: convId,
          userContext: {
            name: store.currentUser?.name || store.userName,
            examType: store.selectedExams[0] || "JEE/NEET",
            comfortSubject: store.comfortSubject || "Physics",
            language: store.language || "English"
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
            if (line.startsWith("__CONVID__:")) {
              setConvId(line.replace("__CONVID__:", "").trim());
            } else if (line.startsWith("__CRISIS__:true")) {
              store.setIsCrisisFlagged(true);
            } else if (line.trim()) {
              // Standard text content
              fullAssistantText += line;
              setStreamingText(fullAssistantText);
            }
          }
        }
      }

      // Streaming finished, push complete message to history list and local store
      const assistantMsg: ChatMessage = {
        id: "chat-a-" + Math.random().toString(),
        role: "assistant",
        content: fullAssistantText,
        createdAt: new Date().toISOString(),
      };
      store.addLocalChatMessage(assistantMsg as any);
      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingText("");
      setIsTyping(false);

    } catch (err) {
      console.error("Chat error:", err);
      // Fallback message
      const errorMsg: ChatMessage = {
        id: "chat-err-" + Math.random().toString(),
        role: "assistant",
        content: "Beta, BhalAI connects slowly sometimes. Please take a deep breath. Can you try typing that again?",
        createdAt: new Date().toISOString(),
      };
      store.addLocalChatMessage(errorMsg as any);
      setMessages((prev) => [...prev, errorMsg]);
      setIsTyping(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[76vh] bg-white dark:bg-dark-card border border-warm-border dark:border-dark-border rounded-3xl shadow-sm warm-shadow overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-warm-border dark:border-dark-border bg-warm-bg/40 dark:bg-dark-card/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
              भ
            </div>
            <div>
              <div className="font-bold text-sm text-warm-text dark:text-white flex items-center gap-1.5">
                <span>{t.bhalAI}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-[10px] text-warm-text/50 dark:text-gray-400">Empathetic Wellness Companion</div>
            </div>
          </div>

          <div className="text-xs text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Healing Active</span>
          </div>
        </div>

        {/* Message Bubble History Box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-warm-bg/10">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto space-y-4 opacity-80">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-warm-text dark:text-white">Namaste, {store.userName || "Beta"}</h3>
                <p className="text-xs text-warm-text/75 dark:text-gray-300 leading-relaxed mt-1">
                  I am BhalAI. Preparing for high-stakes exams can be extremely isolating, and mock test scores can make you question your worth. I am here to listen, not to judge or teach. Tell me, how was your day?
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
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
                    className={`text-[9px] block text-right mt-1.5 opacity-60 font-lato`}
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

          {/* Streaming BhalAI assistant Response Bubble */}
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

          {/* General typing animation block */}
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
            className="flex-1 px-4 py-3 bg-warm-bg/50 dark:bg-dark-bg/40 border border-warm-border dark:border-dark-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-warm-text dark:text-white text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
