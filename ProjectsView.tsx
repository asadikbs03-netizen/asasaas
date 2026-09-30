"use client";

import React, { useState } from "react";
import { Language, Project } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  FolderGit2, 
  Plus, 
  Heart, 
  ExternalLink, 
  Code2, 
  Sparkles, 
  User as UserIcon,
  Tag
} from "lucide-react";

interface ProjectsViewProps {
  language: Language;
  projects: Project[];
  onOpenCreateModal: () => void;
  onLikeProject: (projectId: number) => void;
}

export default function ProjectsView({
  language,
  projects,
  onOpenCreateModal,
  onLikeProject,
}: ProjectsViewProps) {
  const t = translations[language];
  const [filter, setFilter] = useState<"all" | "my">("all");
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.isOwner);

  const handleLike = (id: number) => {
    if (!likedIds.includes(id)) {
      setLikedIds((prev) => [...prev, id]);
      onLikeProject(id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Create Project CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-cyan-400" />
            <span>{t.myProjects}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {language === "RU"
              ? "Витрина студенческих проектов, веб-сервисов и открытого кода"
              : language === "UZ"
              ? "Talabalar loyihalari, veb xizmatlar va ochiq kodlar vitrinasi"
              : "Showcase of cadet student projects, fullstack apps, and open-source repos"}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.createProject}</span>
        </button>
      </div>

      {/* Filter Tabs (All Projects vs My Projects) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-850"
          }`}
        >
          {t.filterAll} ({projects.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("my")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "my"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-850"
          }`}
        >
          {t.myProjects} ({projects.filter((p) => p.isOwner).length})
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            {language === "RU" ? "Нет опубликованных проектов" : "No projects published yet"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {language === "RU"
              ? "Создайте свой первый проект и получите +150 XP и бейдж Архитектора!"
              : "Create your first project and earn +150 XP and Architect badge!"}
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all cursor-pointer"
          >
            {t.createProject}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isLiked = likedIds.includes(project.id);

            return (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] group"
              >
                <div>
                  {/* Category & Owner Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {project.category}
                    </span>
                    {project.isOwner && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {t.you}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-semibold text-slate-300"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Author, Likes & Links */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  {/* Author Avatar & Name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
                      {project.authorAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.authorAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-300 truncate">
                      {project.authorName || project.authorUsername || "Cadet"}
                    </span>
                  </div>

                  {/* Actions: Likes & External Links */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLike(project.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isLiked
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : "bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-750"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                      <span>{project.likesCount + (isLiked ? 1 : 0)}</span>
                    </button>

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Source Code"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-colors"
                        title="Live Demo Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
