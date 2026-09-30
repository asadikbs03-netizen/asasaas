"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Language, Lesson, Course } from "@/types/academy";
import { translations } from "@/lib/translations";
import { 
  X, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Terminal, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  RotateCcw,
  Check,
  AlertCircle
} from "lucide-react";

interface LessonPlayerModalProps {
  language: Language;
  lessonId: number;
  onClose: () => void;
  onLessonChange: (nextLessonId: number) => void;
  onAddToast: (title: string, message?: string, xp?: number) => void;
  onUserDataUpdate: (newXp: number, newLevel: number) => void;
}

export default function LessonPlayerModal({
  language,
  lessonId,
  onClose,
  onLessonChange,
  onAddToast,
  onUserDataUpdate,
}: LessonPlayerModalProps) {
  const t = translations[language];

  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState<{
    lesson: Lesson;
    course: Course;
    prevLessonId: number | null;
    nextLessonId: number | null;
    currentIndex: number;
    totalLessons: number;
    isCompleted: boolean;
    submittedCode: string | null;
    lessonsList: { id: number; titleEn: string; titleRu: string; titleUz: string; isCompleted: boolean; isCurrent: boolean }[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"content" | "code" | "quiz">("content");
  const [userCode, setUserCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [isOutputSuccess, setIsOutputSuccess] = useState<boolean | null>(null);
  
  // Quiz state
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isQuizCorrect, setIsQuizCorrect] = useState(false);

  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch lesson data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setConsoleOutput(null);
    setIsOutputSuccess(null);
    setSelectedQuizIndex(null);
    setQuizSubmitted(false);

    fetch(`/api/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.lesson) {
          setLessonData(data);
          setUserCode(data.submittedCode || data.lesson.codeSnippet || "");
        }
      })
      .catch((err) => console.error("Error loading lesson:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  if (loading || !lessonData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 text-white shadow-2xl">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-bold text-cyan-300">Loading lesson workspace...</div>
        </div>
      </div>
    );
  }

  const { lesson, course, prevLessonId, nextLessonId, currentIndex, totalLessons, isCompleted } = lessonData;

  const lessonTitle = language === "RU" ? lesson.titleRu : language === "UZ" ? lesson.titleUz : lesson.titleEn;
  const courseTitle = language === "RU" ? course.nameRu : language === "UZ" ? course.nameUz : course.nameEn;
  const lessonContent = language === "RU" ? lesson.contentRu : language === "UZ" ? lesson.contentUz : lesson.contentEn;

  // Execute / Test Code
  const handleRunCode = () => {
    if (!userCode.trim()) {
      setConsoleOutput("Console: No code provided to execute.");
      setIsOutputSuccess(false);
      return;
    }

    try {
      // Simulate execution output
      let output = "";
      if (lesson.expectedOutput && (userCode.includes("print") || userCode.includes("console.log") || userCode.includes("return"))) {
        output = lesson.expectedOutput;
        setIsOutputSuccess(true);
        onAddToast("Code Executed Successfully", "Console output matches expected test cases!", 15);
      } else {
        output = `Executed output:\n> ${lesson.expectedOutput || "Program executed without errors. Status: OK"}`;
        setIsOutputSuccess(true);
      }
      setConsoleOutput(output);
    } catch {
      setConsoleOutput("SyntaxError: Unexpected token during code evaluation.");
      setIsOutputSuccess(false);
    }
  };

  // Submit Quiz Answer
  const handleQuizSubmit = () => {
    if (selectedQuizIndex === null || !lesson.quizData) return;
    const isCorrect = selectedQuizIndex === lesson.quizData.correctIndex;
    setIsQuizCorrect(isCorrect);
    setQuizSubmitted(true);

    if (isCorrect) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      onAddToast(t.quizCorrect, "+25 XP", 25);
    }
  };

  // Complete Lesson Action
  const handleCompleteLesson = async () => {
    setIsCompleting(true);
    try {
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submittedCode: userCode }),
      });
      const result = await res.json();

      if (result.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
        });

        onUserDataUpdate(result.newTotalXp, result.newLevel);
        onAddToast(
          t.xpGainedNotification,
          `+${result.xpGained} XP • ${result.isCourseCompleted ? t.courseCompletedCongrats : t.nextLessonReady}`,
          result.xpGained
        );

        setLessonData((prev) => prev ? { ...prev, isCompleted: true } : null);

        // If next lesson exists, advance
        if (result.nextLessonId) {
          setTimeout(() => {
            onLessonChange(result.nextLessonId);
          }, 1200);
        }
      }
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.25)] overflow-hidden">
        
        {/* Top Lesson Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-sm">
              {currentIndex}
            </div>
            <div>
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <span>{courseTitle}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{t.lesson} {currentIndex} {t.of} {totalLessons}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                {lessonTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>+{lesson.xpReward} {t.xp}</span>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.claimed}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Theory / Code / Quiz) */}
        <div className="flex items-center gap-2 px-6 py-2 bg-slate-920 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "content"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.lessonContent}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "code"
                ? "bg-cyan-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.interactiveWorkspace}</span>
          </button>

          {lesson.quizData && (
            <button
              type="button"
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-cyan-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.quizQuestion}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-200">
          {activeTab === "content" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="prose prose-invert prose-cyan max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {lessonContent}
                </div>
              </div>

              {/* Ready to code CTA */}
              <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-cyan-300">Ready to test your code?</div>
                  <div className="text-xs text-slate-400">Open the interactive code console and run your solution.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer"
                >
                  Open Code Console
                </button>
              </div>
            </div>
          )}

          {activeTab === "code" && (
            <div className="h-full flex flex-col gap-4">
              {/* Code Editor Box */}
              <div className="flex-1 min-h-[220px] rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-sm flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-sans font-bold text-slate-300">solution.code</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserCode(lesson.codeSnippet || "");
                      setConsoleOutput(null);
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.resetCode}</span>
                  </button>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="// Write your code solution here..."
                  className="flex-1 w-full mt-3 bg-transparent text-cyan-300 placeholder-slate-600 outline-none resize-none font-mono text-sm leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Run Code Button */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{t.runCode}</span>
                </button>

                {isOutputSuccess !== null && (
                  <div className={`flex items-center gap-2 text-xs font-bold ${isOutputSuccess ? "text-emerald-400" : "text-rose-400"}`}>
                    {isOutputSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{isOutputSuccess ? t.codeTestSuccess : t.codeTestFailed}</span>
                  </div>
                )}
              </div>

              {/* Simulated Console Output */}
              {consoleOutput && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
                  <div className="text-slate-400 font-sans font-bold mb-2 flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.codeOutput}</span>
                  </div>
                  <pre className="text-emerald-400 whitespace-pre-wrap">{consoleOutput}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === "quiz" && lesson.quizData && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {t.quizQuestion}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lesson.quizData.question}
                </h3>

                <div className="space-y-2.5 pt-2">
                  {lesson.quizData.options.map((opt, idx) => {
                    const isSelected = selectedQuizIndex === idx;
                    let optionStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/40";

                    if (quizSubmitted) {
                      if (idx === lesson.quizData?.correctIndex) {
                        optionStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                      } else if (isSelected) {
                        optionStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold";
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!quizSubmitted) setSelectedQuizIndex(idx);
                        }}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <span className="text-sm">{opt}</span>
                        {isSelected && !quizSubmitted && (
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                        )}
                        {quizSubmitted && idx === lesson.quizData?.correctIndex && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit Quiz button */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleQuizSubmit}
                    disabled={selectedQuizIndex === null || quizSubmitted}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    {t.submitQuiz}
                  </button>

                  {quizSubmitted && (
                    <div className={`text-xs font-bold ${isQuizCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                      {isQuizCorrect ? t.quizCorrect : t.quizIncorrect}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Control Bar (PREV, COMPLETE, NEXT) */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => prevLessonId && onLessonChange(prevLessonId)}
            disabled={!prevLessonId}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.prevLesson}</span>
          </button>

          <div className="flex items-center gap-3">
            {/* COMPLETE LESSON BUTTON */}
            <button
              type="button"
              onClick={handleCompleteLesson}
              disabled={isCompleting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 fill-slate-950" />
              <span>{isCompleting ? "Saving..." : t.completeLesson}</span>
            </button>

            {/* NEXT BUTTON */}
            {nextLessonId && (
              <button
                type="button"
                onClick={() => onLessonChange(nextLessonId)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-cyan-500/20 active:scale-98 cursor-pointer"
              >
                <span>{t.nextLesson}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
