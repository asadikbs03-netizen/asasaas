"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Language, Achievement } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  X, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Code2, 
  Flame, 
  Compass, 
  FolderGit2, 
  Bot, 
  Trophy 
} from "lucide-react";

interface AchievementsModalProps {
  language: Language;
  achievements: Achievement[];
  onClose: () => void;
  onClaimReward: (achievementId: number, xpGained: number, newTotalXp: number, newLevel: number) => void;
  onAddToast: (title: string, message?: string, xp?: number) => void;
}

export default function AchievementsModal({
  language,
  achievements,
  onClose,
  onClaimReward,
  onAddToast,
}: AchievementsModalProps) {
  const t = translations[language];
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const getBadgeIcon = (code: string) => {
    switch (code) {
      case "first_code": return <Code2 className="w-6 h-6" />;
      case "streak_3": return <Flame className="w-6 h-6" />;
      case "lab_explorer": return <Compass className="w-6 h-6" />;
      case "project_creator": return <FolderGit2 className="w-6 h-6" />;
      case "ai_whisperer": return <Bot className="w-6 h-6" />;
      case "master_rank": return <Trophy className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const handleClaim = async (ach: Achievement) => {
    setClaimingId(ach.id);
    try {
      const res = await fetch(`/api/achievements/${ach.id}/claim`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        onClaimReward(ach.id, data.reward, data.newTotalXp, data.newLevel);
        onAddToast(
          `${t.claimedToast}${data.reward} XP!`,
          language === "RU" ? "Награда успешно зачислена в профиль!" : "Reward added to your cadet profile!",
          data.reward
        );
      }
    } catch (err) {
      console.error("Claim error:", err);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{t.achievementsTitle}</h2>
              <div className="text-xs text-slate-400">{t.achievementsSubtitle}</div>
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

        {/* Badges Grid */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const title = language === "RU" ? ach.titleRu : language === "UZ" ? ach.titleUz : ach.titleEn;
            const desc = language === "RU" ? ach.descRu : language === "UZ" ? ach.descUz : ach.descEn;
            const isUnlocked = ach.isUnlocked;
            const isClaimed = ach.isClaimed;
            const isClaiming = claimingId === ach.id;

            return (
              <div
                key={ach.id}
                className={`flex flex-col justify-between p-5 rounded-3xl border transition-all ${
                  isClaimed
                    ? "bg-slate-950/80 border-slate-800"
                    : isUnlocked
                    ? "bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "bg-slate-950/40 border-slate-800/80 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {/* Badge Icon */}
                    <div className={`p-3 rounded-2xl border ${
                      isUnlocked
                        ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                    }`}>
                      {getBadgeIcon(ach.code)}
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      +{ach.xpReward} {t.xp}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>

                {/* Claim Button / Status */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {ach.category}
                  </span>

                  {isClaimed ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.claimed}</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(ach)}
                      disabled={isClaiming}
                      className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isClaiming ? "Claiming..." : t.claimReward}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t.locked}</span>
                    </div>
                  )}
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
