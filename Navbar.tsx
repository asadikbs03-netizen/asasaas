"use client";

import React from "react";
import { Language, User, ViewMode } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  Compass, 
  BookOpen, 
  FolderGit2, 
  Trophy, 
  Award, 
  Bot, 
  Flame, 
  Sparkles, 
  Coins,
  ShieldCheck,
  User as UserIcon
} from "lucide-react";

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: User | null;
}

export default function Navbar({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  user,
}: NavbarProps) {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Academy Brand */}
          <div 
            onClick={() => onNavigate("campus")}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                {t.academyName}
              </div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400/80">
                Cyber Campus & Tech Hub
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => onNavigate("campus")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === "campus"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t.home}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("courses")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === "courses" || currentView === "course_details" || currentView === "lesson"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.courses}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("projects")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === "projects"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>{t.myProjects}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("leaderboard")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === "leaderboard"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>{t.leaderboard}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("achievements")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === "achievements"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{t.achievements}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("ai_assistant")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === "ai_assistant"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/40"
                  : "text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/30"
              }`}
            >
              <Bot className="w-4 h-4 text-pink-400" />
              <span>{t.aiAssistant}</span>
            </button>
          </nav>

          {/* Right Section: Stats, Language Switcher, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick User Stats (Streak, XP, Level) */}
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                {/* Streak Counter */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
                  title={`${user.streak} days learning streak`}
                >
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                  <span>{user.streak} {t.days}</span>
                </div>

                {/* XP Meter */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold"
                  title="Total Cadet Experience"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{user.xp.toLocaleString()} {t.xp}</span>
                </div>

                {/* Level Badge */}
                <div className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold shadow-sm">
                  Lv. {user.level}
                </div>
              </div>
            )}

            {/* Language Switcher Buttons (EN / RU / UZ) */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(["EN", "RU", "UZ"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === lang
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Cadet Profile Button */}
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border transition-all cursor-pointer ${
                currentView === "profile"
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-850"
              }`}
              title="Open Cadet Profile"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 overflow-hidden border border-cyan-400/50 flex items-center justify-center">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  {user?.name || "Cadet"}
                </div>
                <div className="text-[10px] text-cyan-400 font-medium">
                  {t.profile}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => onNavigate("campus")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentView === "campus" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"
            }`}
          >
            {t.home}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("courses")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentView === "courses" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"
            }`}
          >
            {t.courses}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("projects")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentView === "projects" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"
            }`}
          >
            {t.myProjects}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("leaderboard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentView === "leaderboard" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"
            }`}
          >
            {t.leaderboard}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("achievements")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentView === "achievements" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400"
            }`}
          >
            {t.achievements}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("ai_assistant")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentView === "ai_assistant" ? "bg-purple-500 text-white font-bold" : "text-purple-400"
            }`}
          >
            {t.aiAssistant}
          </button>
        </div>
      </div>
    </header>
  );
}
