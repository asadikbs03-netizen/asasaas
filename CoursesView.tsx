"use client";

import React, { useState } from "react";
import { Language, Course } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  Terminal, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Gamepad2, 
  Palette, 
  Database, 
  Search, 
  BookOpen, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2,
  Layers
} from "lucide-react";

interface CoursesViewProps {
  language: Language;
  courses: Course[];
  onOpenCourse: (slug: string) => void;
  onStartLesson: (lessonId: number) => void;
}

export default function CoursesView({
  language,
  courses,
  onOpenCourse,
  onStartLesson,
}: CoursesViewProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", labelEn: "All Labs", labelRu: "Все Лаборатории", labelUz: "Barcha Lablar" },
    { id: "Backend & Scripting", labelEn: "Backend", labelRu: "Бэкенд", labelUz: "Backend" },
    { id: "Fullstack Web", labelEn: "Fullstack Web", labelRu: "Веб-разработка", labelUz: "Veb Dasturlash" },
    { id: "Artificial Intelligence", labelEn: "AI & ML", labelRu: "Искусственный Интеллект", labelUz: "Sun'iy Intellekt" },
    { id: "Security & Ops", labelEn: "Cybersecurity", labelRu: "Кибербезопасность", labelUz: "Kiberxavfsizlik" },
    { id: "Graphics & Interactive", labelEn: "Game Dev 3D", labelRu: "3D Игры", labelUz: "3D O'yinlar" },
    { id: "Design & Product", labelEn: "UI/UX Design", labelRu: "Дизайн UI/UX", labelUz: "Dizayn" },
    { id: "Data & Storage", labelEn: "Databases", labelRu: "Базы Данных", labelUz: "Ma'lumotlar Bazasi" },
  ];

  const getCourseName = (c: Course) => {
    if (language === "RU") return c.nameRu;
    if (language === "UZ") return c.nameUz;
    return c.nameEn;
  };

  const getCourseDesc = (c: Course) => {
    if (language === "RU") return c.descriptionRu;
    if (language === "UZ") return c.descriptionUz;
    return c.descriptionEn;
  };

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case "Terminal": return <Terminal className="w-5 h-5" />;
      case "Globe": return <Globe className="w-5 h-5" />;
      case "Cpu": return <Cpu className="w-5 h-5" />;
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5" />;
      case "Gamepad2": return <Gamepad2 className="w-5 h-5" />;
      case "Palette": return <Palette className="w-5 h-5" />;
      case "Database": return <Database className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const filteredCourses = courses.filter((c) => {
    const name = getCourseName(c).toLowerCase();
    const desc = getCourseDesc(c).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = name.includes(q) || desc.includes(q) || c.category.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === "all" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-cyan-400" />
            <span>{t.courses}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {language === "RU" 
              ? "7 специализированных лабораторий Академии с практикой и наградами"
              : language === "UZ"
              ? "7 ta maxsus laboratoriya va interaktiv amaliy darslar"
              : "7 specialized academy labs with hands-on exercises and XP rewards"}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm text-white placeholder-slate-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const label = language === "RU" ? cat.labelRu : language === "UZ" ? cat.labelUz : cat.labelEn;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30"
                  : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const courseName = getCourseName(course);
          const courseDesc = getCourseDesc(course);
          const progress = course.progress || 0;
          const isStarted = course.isEnrolled || progress > 0;

          return (
            <div
              key={course.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/50 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            >
              <div>
                {/* Top badges: Icon, Category, Level */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${course.badgeColor} text-white shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform`}>
                    {getCourseIcon(course.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {course.level}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      +{course.xpReward} {t.xp}
                    </span>
                  </div>
                </div>

                {/* Course Title & Description */}
                <h3 
                  onClick={() => onOpenCourse(course.slug)}
                  className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                >
                  {courseName}
                </h3>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {courseDesc}
                </p>

                {/* Meta details: Lessons & Hours */}
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{course.lessonsCount || course.totalLessons} {t.lessonsCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{course.estimatedHours} {t.hours}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">{t.progress}</span>
                    <span className="font-bold text-cyan-400">{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: START COURSE / CONTINUE / DETAILS */}
              <div className="mt-6 pt-4 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenCourse(course.slug)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-98 cursor-pointer"
                >
                  {isStarted ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{t.continueCourse}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.startCourse}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCourse(course.slug)}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title={t.viewDetails}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
