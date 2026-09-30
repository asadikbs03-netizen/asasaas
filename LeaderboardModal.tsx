"use client";

import React, { useState } from "react";
import { Language, LeaderboardUser } from "@/types/academy";
import { translations } from "@/lib/translations";
import { X, Trophy, Medal, Flame, Sparkles, User as UserIcon } from "lucide-react";

interface LeaderboardModalProps {
  language: Language;
  leaderboard: LeaderboardUser[];
  currentUserId: number;
  onClose: () => void;
}

export default function LeaderboardModal({
  language,
  leaderboard,
  currentUserId,
  onClose,
}: LeaderboardModalProps) {
  const t = translations[language];
  const [tab, setTab] = useState<"all" | "week">("all");

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);
  const top3 = sortedLeaderboard.slice(0, 3);
  const rest = sortedLeaderboard.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{t.leaderboardTitle}</h2>
              <div className="text-xs text-slate-400">{t.leaderboardSubtitle}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-920 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "all"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {t.allTime}
          </button>
          <button
            type="button"
            onClick={() => setTab("week")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === "week"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {t.thisWeek}
          </button>
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="p-6 bg-slate-950/60 border-b border-slate-800">
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto items-end">
              {/* Rank 2 (Silver) */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-850 border border-slate-700">
                <div className="text-xl mb-1">🥈</div>
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-400 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={top3[1].avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-bold text-white truncate max-w-full">{top3[1].name}</div>
                <div className="text-[11px] font-extrabold text-cyan-400">{top3[1].xp} XP</div>
                <div className="text-[9px] text-slate-400">Lv.{top3[1].level}</div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-400 -translate-y-2 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                <div className="text-2xl mb-1 animate-bounce">🥇</div>
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-400 mb-2 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={top3[0].avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-extrabold text-amber-300 truncate max-w-full">{top3[0].name}</div>
                <div className="text-xs font-extrabold text-cyan-300">{top3[0].xp} XP</div>
                <div className="text-[10px] text-amber-400 font-bold">Lv.{top3[0].level} Champion</div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-slate-850 border border-slate-700">
                <div className="text-xl mb-1">🥉</div>
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-700 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={top3[2].avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-xs font-bold text-white truncate max-w-full">{top3[2].name}</div>
                <div className="text-[11px] font-extrabold text-cyan-400">{top3[2].xp} XP</div>
                <div className="text-[9px] text-slate-400">Lv.{top3[2].level}</div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Leaderboard Table */}
        <div className="flex-1 p-6 overflow-y-auto space-y-2">
          {sortedLeaderboard.map((student, idx) => {
            const isCurrentUser = student.id === currentUserId;

            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isCurrentUser
                    ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    idx === 0 ? "bg-amber-400 text-slate-950 font-black" :
                    idx === 1 ? "bg-slate-300 text-slate-950" :
                    idx === 2 ? "bg-amber-700 text-white" :
                    "bg-slate-800 text-slate-400"
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                    {student.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={student.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-400 m-auto" />
                    )}
                  </div>

                  {/* Cadet Name & Title */}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white flex items-center gap-2 truncate">
                      <span>{student.name}</span>
                      {isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-cyan-400 text-slate-950">
                          {t.you}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {student.title || "Cyber Cadet"}
                    </div>
                  </div>
                </div>

                {/* Stats: Level, Streak & XP */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{student.streak}d</span>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-cyan-400">
                      {student.xp.toLocaleString()} {t.xp}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">
                      Lv. {student.level}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
