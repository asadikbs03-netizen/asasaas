"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Language, ViewMode, User, Course, Achievement, Project, LeaderboardUser, ToastMessage } from "@/types/academy";
import { translations } from "@/lib/translations";
import Navbar from "@/components/Navbar";
import Campus3D from "@/components/Campus3D";
import CoursesView from "@/components/CoursesView";
import CourseDetailsModal from "@/components/CourseDetailsModal";
import LessonPlayerModal from "@/components/LessonPlayerModal";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectsView from "@/components/ProjectsView";
import ProfileModal from "@/components/ProfileModal";
import LeaderboardModal from "@/components/LeaderboardModal";
import AchievementsModal from "@/components/AchievementsModal";
import AiAssistantModal from "@/components/AiAssistantModal";
import ToastContainer from "@/components/ToastContainer";
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Bot, 
  Trophy, 
  Award, 
  FolderGit2, 
  Layers, 
  ShieldCheck, 
  Flame,
  Zap,
  Terminal,
  BookOpen
} from "lucide-react";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("RU");
  const [currentView, setCurrentView] = useState<ViewMode>("campus");
  
  // Data state
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Active states
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = translations[language];

  // Add Toast Notification
  const addToast = useCallback((title: string, message?: string, xp?: number) => {
    const id = Date.now().toString() + Math.random().toString();
    const type = xp ? "xp" : "success";
    setToasts((prev) => [...prev, { id, title, message, xp, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Load
  const fetchAcademyData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/init");
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
        if (data.user.language) setLanguage(data.user.language as Language);
      }
      if (data.courses) setCourses(data.courses);
      if (data.achievements) setAchievements(data.achievements);
      if (data.projects) setProjects(data.projects);
      if (data.leaderboard) setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error("Failed to load ASAD IT ACADEMY:", err);
      addToast("Initialization Error", "Please refresh the page to retry.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchAcademyData();
  }, [fetchAcademyData]);

  // Global ESC Key Listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeLessonId !== null) setActiveLessonId(null);
        else if (selectedCourseSlug !== null) setSelectedCourseSlug(null);
        else if (showCreateProjectModal) setShowCreateProjectModal(false);
        else if (currentView !== "campus" && currentView !== "courses" && currentView !== "projects") {
          setCurrentView("campus");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLessonId, selectedCourseSlug, showCreateProjectModal, currentView]);

  // Handle Language Change
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (user) {
      setUser((prev) => (prev ? { ...prev, language: newLang } : null));
      fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      }).catch(console.error);
    }
    addToast(
      newLang === "RU" ? "Язык интерфейса изменен на Русский" : newLang === "UZ" ? "Interfeys tili O'zbek tiliga o'zgartirildi" : "Language changed to English",
      "ASAD IT ACADEMY"
    );
  };

  // Open Course by slug
  const handleOpenCourse = (slug: string) => {
    setSelectedCourseSlug(slug);
  };

  // Start course directly or continue
  const handleStartCourse = async (slug: string) => {
    try {
      const res = await fetch(`/api/courses/${slug}/start`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.targetLessonId) {
        setSelectedCourseSlug(null);
        setActiveLessonId(data.targetLessonId);
        addToast(
          t.courseEnrolledSuccess,
          language === "RU" ? "Открытие интерактивного урока..." : "Opening interactive lesson...",
          20
        );
      }
    } catch (err) {
      console.error("Start course error:", err);
    }
  };

  // Start specific lesson
  const handleStartLesson = (lessonId: number) => {
    setSelectedCourseSlug(null);
    setActiveLessonId(lessonId);
  };

  // Handle User Data Update from completed lesson / achievement
  const handleUserDataUpdate = (newTotalXp: number, newLevel: number) => {
    setUser((prev) => (prev ? { ...prev, xp: newTotalXp, level: newLevel } : null));
    // Refresh course list progress
    fetchAcademyData();
  };

  // Handle Project Creation
  const handleProjectCreated = (newProject: Project, xpGained: number, newTotalXp: number, newLevel: number) => {
    setProjects((prev) => [newProject, ...prev]);
    setUser((prev) => (prev ? { ...prev, xp: newTotalXp, level: newLevel } : null));
    setCurrentView("projects");
  };

  // Handle Like Project
  const handleLikeProject = async (projectId: number) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, likesCount: data.likesCount } : p))
        );
        addToast("Liked Project", "Feedback sent to cadet developer!");
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Handle Claim Achievement
  const handleClaimAchievement = (achId: number, xpGained: number, newTotalXp: number, newLevel: number) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === achId ? { ...a, isClaimed: true } : a))
    );
    setUser((prev) => (prev ? { ...prev, xp: newTotalXp, level: newLevel } : null));
  };

  // Active Selected Course Object
  const selectedCourse = courses.find((c) => c.slug === selectedCourseSlug) || null;

  // Active in-progress course for quick continue banner
  const activeCourse = courses.find((c) => c.isEnrolled && !c.isCompleted) || courses[0];

  if (loading && !user) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#060913]">
        <div className="flex flex-col items-center gap-4 text-center p-8">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse">
            <ShieldCheck className="w-9 h-9 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="text-xl font-extrabold tracking-wider text-cyan-400">
            ASAD IT ACADEMY
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Initializing 3D Cyber Campus & PostgreSQL Database...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        language={language}
        onLanguageChange={handleLanguageChange}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* 1. VIEW: 3D Campus View (Home) */}
        {currentView === "campus" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Quick Status & Continue Banner */}
            <div className="flex flex-col lg:flex-row items-stretch gap-6">
              {/* Main 3D Campus Window */}
              <div className="flex-1">
                <Campus3D
                  language={language}
                  courses={courses}
                  onOpenCourse={handleOpenCourse}
                  onEnterLesson={handleStartLesson}
                  onAddToast={addToast}
                />
              </div>

              {/* Sidebar Quick Action Cards */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                {/* Active Learning Track Resume Card */}
                {activeCourse && (
                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          {t.yourCurrentProgress}
                        </span>
                        <span className="font-bold text-slate-300">{activeCourse.progress || 0}%</span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-1">
                        {language === "RU" ? activeCourse.nameRu : language === "UZ" ? activeCourse.nameUz : activeCourse.nameEn}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {language === "RU" ? activeCourse.descriptionRu : language === "UZ" ? activeCourse.descriptionUz : activeCourse.descriptionEn}
                      </p>

                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-3">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${activeCourse.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartCourse(activeCourse.slug)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 cursor-pointer active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{t.continueCourse}</span>
                    </button>
                  </div>
                )}

                {/* AI Assistant Quick Card */}
                <div 
                  onClick={() => setCurrentView("ai_assistant")}
                  className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
                      <Bot className="w-4 h-4 text-pink-400" />
                      <span>{t.aiTitle}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {language === "RU" ? "Нужна помощь с кодом?" : language === "UZ" ? "Kod yozishda yordam kerakmi?" : "Need help debugging code?"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === "RU" ? "Задайте вопрос ASAD AI и разберите сложные задачи" : "Ask ASAD AI to explain algorithms & architecture"}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-300">
                    <span>{t.aiAssistant}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-pink-400" />
                  </div>
                </div>

                {/* Create Project Banner Card */}
                <div 
                  onClick={() => setShowCreateProjectModal(true)}
                  className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                        {t.createProject}
                      </div>
                      <div className="text-[11px] text-cyan-400 font-semibold">
                        +150 XP Reward
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Courses Grid Preview */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                    <Layers className="w-6 h-6 text-cyan-400" />
                    <span>{t.courses}</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === "RU" ? "Выберите лабораторию для прохождения интерактивных модулей" : "Explore hands-on cyber engineering tracks"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentView("courses")}
                  className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{t.filterAll} ({courses.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <CoursesView
                language={language}
                courses={courses}
                onOpenCourse={handleOpenCourse}
                onStartLesson={handleStartLesson}
              />
            </div>
          </div>
        )}

        {/* 2. VIEW: Courses Browser */}
        {currentView === "courses" && (
          <CoursesView
            language={language}
            courses={courses}
            onOpenCourse={handleOpenCourse}
            onStartLesson={handleStartLesson}
          />
        )}

        {/* 3. VIEW: Projects */}
        {currentView === "projects" && (
          <ProjectsView
            language={language}
            projects={projects}
            onOpenCreateModal={() => setShowCreateProjectModal(true)}
            onLikeProject={handleLikeProject}
          />
        )}

        {/* 4. VIEW: Leaderboard */}
        {currentView === "leaderboard" && (
          <LeaderboardModal
            language={language}
            leaderboard={leaderboard}
            currentUserId={user?.id || 1}
            onClose={() => setCurrentView("campus")}
          />
        )}

        {/* 5. VIEW: Achievements */}
        {currentView === "achievements" && (
          <AchievementsModal
            language={language}
            achievements={achievements}
            onClose={() => setCurrentView("campus")}
            onClaimReward={handleClaimAchievement}
            onAddToast={addToast}
          />
        )}

        {/* 6. VIEW: Profile */}
        {currentView === "profile" && (
          <ProfileModal
            language={language}
            user={user}
            courses={courses}
            achievements={achievements}
            projects={projects}
            onClose={() => setCurrentView("campus")}
            onOpenCourse={handleOpenCourse}
            onUpdateUser={(updated) => setUser(updated)}
            onAddToast={addToast}
          />
        )}

        {/* 7. VIEW: AI Assistant */}
        {currentView === "ai_assistant" && (
          <AiAssistantModal
            language={language}
            onClose={() => setCurrentView("campus")}
            onAddToast={addToast}
          />
        )}
      </main>

      {/* MODAL: Course Details (Syllabus & Start Course / Start Lesson) */}
      {selectedCourse && (
        <CourseDetailsModal
          language={language}
          course={selectedCourse}
          onClose={() => setSelectedCourseSlug(null)}
          onStartCourse={handleStartCourse}
          onStartLesson={handleStartLesson}
        />
      )}

      {/* MODAL: Interactive Lesson Player (Study guide, code sandbox, quiz, next/prev) */}
      {activeLessonId !== null && (
        <LessonPlayerModal
          language={language}
          lessonId={activeLessonId}
          onClose={() => setActiveLessonId(null)}
          onLessonChange={(nextId) => setActiveLessonId(nextId)}
          onAddToast={addToast}
          onUserDataUpdate={handleUserDataUpdate}
        />
      )}

      {/* MODAL: Create Project */}
      {showCreateProjectModal && (
        <CreateProjectModal
          language={language}
          onClose={() => setShowCreateProjectModal(false)}
          onProjectCreated={handleProjectCreated}
          onAddToast={addToast}
        />
      )}

      {/* Global Toast Feedback Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
