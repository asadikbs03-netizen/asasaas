"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Language, Project } from "@/types/academy";
import { translations } from "@/lib/translations";
import { X, Sparkles, FolderGit2, Globe, Code2, Tag, FileText } from "lucide-react";

interface CreateProjectModalProps {
  language: Language;
  onClose: () => void;
  onProjectCreated: (newProject: Project, xpGained: number, newTotalXp: number, newLevel: number) => void;
  onAddToast: (title: string, message?: string, xp?: number) => void;
}

export default function CreateProjectModal({
  language,
  onClose,
  onProjectCreated,
  onAddToast,
}: CreateProjectModalProps) {
  const t = translations[language];

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fullstack Web");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("React, Next.js, TypeScript");
  const [demoUrl, setDemoUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "Fullstack Web",
    "Backend & Scripting",
    "Artificial Intelligence",
    "Cybersecurity",
    "Game Dev 3D",
    "UI/UX Design",
    "Data & Storage",
    "Mobile App",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(language === "RU" ? "Укажите название проекта" : "Please enter project name");
      return;
    }
    if (!description.trim()) {
      setError(language === "RU" ? "Укажите описание проекта" : "Please describe your project");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          tags,
          demoUrl: demoUrl.trim() || null,
          repoUrl: repoUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success && data.project) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        onProjectCreated(data.project, data.xpGained, data.newTotalXp, data.newLevel);
        onAddToast(t.projectCreatedSuccess, `+${data.xpGained} XP`, data.xpGained);
        onClose();
      } else {
        setError(data.error || "Failed to create project");
      }
    } catch {
      setError("Network error creating project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t.newProjectTitle}</h2>
              <div className="text-xs text-cyan-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>+150 {t.xp} for publishing</span>
              </div>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.projectNameLabel} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.projectNamePlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm text-white placeholder-slate-600 outline-none transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.categoryLabel} *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm text-white outline-none transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.descriptionLabel} *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm text-white placeholder-slate-600 outline-none resize-none transition-all"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.tagsLabel}</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={t.tagsPlaceholder}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm text-white placeholder-slate-600 outline-none transition-all"
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.demoUrlLabel}</span>
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://my-demo-app.com"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.repoUrlLabel}</span>
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/project"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-sm text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? "Publishing..." : t.publishProjectBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
