"use client";

import React, { useState } from "react";
import { Language, Course, Lesson } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Lock, 
  Terminal, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Gamepad2, 
  Palette, 
  Database,
  Layers
} from "lucide-react";

interface CourseDetailsModalProps {
  language: Language;
  course: Course | null;
  onClose: () => void;
  onStartCourse: (slug: string) => void;
  onStartLesson: (lessonId: number) => void;
}

export default function CourseDetailsModal({
  language,
  course,
  onClose,
  onStartCourse,
  onStartLesson,
}: CourseDetailsModalProps) {
  const t = translations[language];
  const [loading, setLoading] = useState(false);

  if (!course) return null;

  const courseName = language === "RU" ? course.nameRu : language === "UZ" ? course.nameUz : course.nameEn;
  const courseDesc = language === "RU" ? course.descriptionRu : language === "UZ" ? course.descriptionUz : course.descriptionEn;
  const progress = course.progress || 0;
  const isStarted = course.isEnrolled || progress > 0;

  const handleMainAction = async () => {
    setLoading(true);
    try {
      if (course.currentLessonId) {
        onStartLesson(course.currentLessonId);
      } else if (course.lessons && course.lessons.length > 0) {
        onStartLesson(course.lessons[0].id);
      } else {
        onStartCourse(course.slug);
      }
    } finally {
      setLoading(false);
    }
  };

  const getLessonTitle = (lesson: Lesson) => {
    if (language === "RU") return lesson.titleRu;
    if (language === "UZ") return lesson.titleUz;
    return lesson.titleEn;
  };

  const getLessonSummary = (lesson: Lesson) => {
    if (language === "RU") return lesson.summaryRu;
    if (language === "UZ") return lesson.summaryUz;
    return lesson.summaryEn;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden">
        {/* Top Header with Gradient */}
        <div className={`relative p-6 sm:p-8 bg-gradient-to-r ${course.badgeColor} text-white`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/40 hover:bg-slate-950/70 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-slate-950/60 backdrop-blur-sm text-cyan-300 border border-white/20">
              {course.category}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-white/20 backdrop-blur-sm text-white">
              {course.level}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {courseName}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
            {courseDesc}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium bg-slate-950/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-300" />
              <span>{course.lessons?.length || course.totalLessons} {t.lessonsCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>~{course.estimatedHours} {t.hours}</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>+{course.xpReward} {t.xpReward}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.progress}: {progress}%</span>
            </div>
          </div>
        </div>

        {/* Syllabus / Lessons Scrollable Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{t.syllabus}</span>
          </h3>

          <div className="space-y-3">
            {course.lessons && course.lessons.length > 0 ? (
              course.lessons.map((lesson, idx) => {
                const isCurrent = course.currentLessonId === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? "bg-cyan-500/10 border-cyan-500/40 shadow-sm"
                        : "bg-slate-850/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-slate-800 text-cyan-400 text-xs font-extrabold border border-slate-700">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {getLessonTitle(lesson)}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {getLessonSummary(lesson)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-bold text-cyan-400">
                        +{lesson.xpReward} {t.xp}
                      </span>
                      <button
                        type="button"
                        onClick={() => onStartLesson(lesson.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span>{t.startLesson}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                No lessons available yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            {t.close}
          </button>

          <button
            type="button"
            onClick={handleMainAction}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            {isStarted ? (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{t.continueCourse}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.startCourse}</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
