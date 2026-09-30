"use client";

import React, { useState, useRef, useEffect } from "react";
import { Language } from "@/types/academy";
import { translations } from "@/lib/translations";
import { X, Send, Bot, User as UserIcon, Sparkles, Code2, RotateCcw, Lightbulb } from "lucide-react";

interface AiAssistantModalProps {
  language: Language;
  onClose: () => void;
  onAddToast: (title: string, message?: string, xp?: number) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function AiAssistantModal({
  language,
  onClose,
  onAddToast,
}: AiAssistantModalProps) {
  const t = translations[language];

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content: t.aiGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, language }),
      });

      const data = await res.json();
      if (data.reply) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        onAddToast("ASAD AI Response", "New technical insights generated", 10);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered a connection glitch. Please try asking again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    t.prompt1,
    t.prompt2,
    t.prompt3,
    t.prompt4,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[88vh] flex flex-col rounded-3xl bg-slate-900 border border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.25)] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <Bot className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">{t.aiTitle}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  AI v2.4 Active
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.aiSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    id: "greeting",
                    role: "assistant",
                    content: t.aiGreeting,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.role === "assistant";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAi ? "justify-start" : "justify-end"}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed ${
                    isAi
                      ? "bg-slate-950 border border-purple-500/20 text-slate-200 shadow-md"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium shadow-md shadow-cyan-600/20"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {msg.content}
                  </div>
                  <div className={`mt-2 text-[10px] ${isAi ? "text-slate-500" : "text-cyan-200"} text-right font-mono`}>
                    {msg.timestamp}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>{t.aiThinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 sm:px-6 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <div className="text-[11px] font-bold text-purple-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.suggestedPrompts}</span>
          </div>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-purple-950/60 border border-slate-700/80 hover:border-purple-500/40 text-slate-300 hover:text-purple-200 text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.aiInputPlaceholder}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white transition-all shadow-md shadow-purple-500/30 disabled:opacity-40 cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
