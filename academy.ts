export type Language = "EN" | "RU" | "UZ";

export type ViewMode = 
  | "campus" 
  | "courses" 
  | "course_details" 
  | "lesson" 
  | "projects" 
  | "leaderboard" 
  | "achievements" 
  | "profile" 
  | "ai_assistant";

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string | null;
  title: string | null;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  language: Language;
}

export interface Lesson {
  id: number;
  courseId: number;
  orderIndex: number;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  summaryEn: string;
  summaryRu: string;
  summaryUz: string;
  contentEn: string;
  contentRu: string;
  contentUz: string;
  codeSnippet: string | null;
  expectedOutput: string | null;
  xpReward: number;
  quizData: {
    question: string;
    options: string[];
    correctIndex: number;
  } | null;
}

export interface Course {
  id: number;
  slug: string;
  labId: string;
  nameEn: string;
  nameRu: string;
  nameUz: string;
  category: string;
  level: string;
  xpReward: number;
  totalLessons: number;
  estimatedHours: number;
  icon: string;
  badgeColor: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUz: string;
  lessonsCount?: number;
  lessons?: Lesson[];
  progress?: number;
  isEnrolled?: boolean;
  isCompleted?: boolean;
  currentLessonId?: number | null;
}

export interface Project {
  id: number;
  userId: number;
  title: string;
  category: string;
  description: string;
  tags: string;
  demoUrl: string | null;
  repoUrl: string | null;
  likesCount: number;
  createdAt: string;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string;
  isOwner?: boolean;
}

export interface Achievement {
  id: number;
  code: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  descEn: string;
  descRu: string;
  descUz: string;
  icon: string;
  xpReward: number;
  category: string;
  targetValue: number;
  isUnlocked?: boolean;
  isClaimed?: boolean;
  progress?: number;
}

export interface LeaderboardUser {
  id: number;
  username: string;
  name: string;
  avatar: string;
  title: string | null;
  level: number;
  xp: number;
  coins: number;
  streak: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "xp" | "error";
  title: string;
  message?: string;
  xp?: number;
}
