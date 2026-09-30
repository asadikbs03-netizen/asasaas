"use client";

import React, { useState } from "react";
import { Language, User, Course, Achievement, Project } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  X, 
  User as UserIcon, 
  Flame, 
  Sparkles, 
  Coins, 
  Trophy, 
  BookOpen, 
  Award, 
  FolderGit2, 
  Edit3, 
  Check, 
  Play,
  ShieldCheck
} from "lucide-react";

interface ProfileModalProps {
  language: Language;
  user: User | null;
  courses: Course[];
  achievements: Achievement[];
  projects: Project[];
  onClose: () => void;
  onOpenCourse: (slug: string) => void;
  onUpdateUser: (updatedUser: User) => void;
  onAddToast: (title: string, message?: string) => void;
}

export default function ProfileModal({
  language,
  user,
  courses,
  achievements,
  projects,
  onClose,
  onOpenCourse,
  onUpdateUser,
  onAddToast,
}: ProfileModalProps) {
  const t = translations[language];

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const enrolledCourses = courses.filter((c) => c.isEnrolled || (c.progress && c.progress > 0));
  const userProjects = projects.filter((p) => p.isOwner);
  const unlockedBadges = achievements.filter((a) => a.isUnlocked);

  // Next level XP target
  const currentLevelXp = (user.level - 1) * 300;
  const nextLevelXp = user.level * 300;
  const xpInCurrentLevel = Math.max(0, user.xp - currentLevelXp);
  const xpRequiredForNext = 300;
  const levelProgressPct = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100));

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, title, bio }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onUpdateUser(data.user);
        setIsEditing(false);
        onAddToast(t.success, language === "RU" ? "Профиль успешно обновлен!" : "Profile updated successfully!");
      }
    } catch {
      onAddToast(t.error, "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        
        {/* Top Header Card */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border-b border-cyan-500/20">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar with Glow */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[20px]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-950 text-cyan-400">
                    <UserIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[11px] font-extrabold shadow-md">
                Lv.{user.level}
              </div>
            </div>

            {/* Cadet Info & Bio */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {user.name}
                  </h2>
                  <div className="text-xs text-cyan-400 font-mono font-semibold">
                    @{user.username}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="self-center sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? t.cancel : t.editProfile}</span>
                </button>
              </div>

              {/* Bio & Title */}
              {isEditing ? (
                <div className="mt-4 space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Title / Role</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">{t.bio}</label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{saving ? "Saving..." : t.saveChanges}</span>
                  </button>
                </div>
              ) : (
                <div className="mt-2 space-y-1">
                  <div className="text-xs font-semibold text-slate-300">
                    {user.title || "Cyber Academy Cadet"}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {user.bio || "Enthusiastic developer learning next-generation tech stack in ASAD IT ACADEMY."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.xp}</span>
              </div>
              <div className="text-lg font-extrabold text-white">{user.xp.toLocaleString()}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{t.streak}</span>
              </div>
              <div className="text-lg font-extrabold text-white">{user.streak} {t.days}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs font-bold mb-0.5">
                <Coins className="w-3.5 h-3.5" />
                <span>{t.coins}</span>
              </div>
              <div className="text-lg font-extrabold text-white">{user.coins}</div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Level {user.level} &rarr; Level {user.level + 1}</span>
              <span className="text-cyan-400 font-bold">{xpInCurrentLevel} / {xpRequiredForNext} XP ({levelProgressPct}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Tabs/Sections */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* Enrolled Courses */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{t.enrolledCourses} ({enrolledCourses.length})</span>
            </h3>

            {enrolledCourses.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                No courses enrolled yet. Explore courses and start your journey!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enrolledCourses.map((c) => {
                  const name = language === "RU" ? c.nameRu : language === "UZ" ? c.nameUz : c.nameEn;
                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{name}</div>
                        <div className="text-[10px] text-cyan-400 font-semibold">{c.progress || 0}% completed</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenCourse(c.slug);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span>Resume</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Badges & Achievements */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t.recentAchievements} ({unlockedBadges.length})</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {unlockedBadges.map((badge) => {
                const title = language === "RU" ? badge.titleRu : language === "UZ" ? badge.titleUz : badge.titleEn;
                return (
                  <div
                    key={badge.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 text-center flex flex-col items-center gap-1.5 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{title}</div>
                    <div className="text-[10px] text-amber-400 font-semibold">+{badge.xpReward} XP</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cadet's Published Projects */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              <span>{t.completedProjects} ({userProjects.length})</span>
            </h3>

            {userProjects.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                You haven&apos;t published any projects yet. Click &quot;Create Project&quot; in the menu!
              </div>
            ) : (
              <div className="space-y-2">
                {userProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{p.title}</div>
                      <div className="text-[10px] text-slate-400">{p.category}</div>
                    </div>
                    <div className="text-xs font-bold text-rose-400">
                      ❤️ {p.likesCount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
