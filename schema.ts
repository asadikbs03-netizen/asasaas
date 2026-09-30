import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar").notNull().default("/avatars/asad.png"),
  bio: text("bio").default("Cyber Cadet at ASAD IT ACADEMY"),
  title: text("title").default("Full-Stack Developer"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(350),
  coins: integer("coins").notNull().default(120),
  streak: integer("streak").notNull().default(5),
  language: text("language").notNull().default("RU"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  labId: text("lab_id").notNull(), // python-lab, web-lab, ai-lab, cyber-lab, game-lab, ui-ux-studio, db-lab
  nameEn: text("name_en").notNull(),
  nameRu: text("name_ru").notNull(),
  nameUz: text("name_uz").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(), // Beginner, Intermediate, Advanced
  xpReward: integer("xp_reward").notNull().default(500),
  totalLessons: integer("total_lessons").notNull().default(6),
  estimatedHours: integer("estimated_hours").notNull().default(12),
  icon: text("icon").notNull().default("Code"),
  badgeColor: text("badge_color").notNull().default("from-blue-500 to-indigo-600"),
  descriptionEn: text("description_en").notNull(),
  descriptionRu: text("description_ru").notNull(),
  descriptionUz: text("description_uz").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  titleEn: text("title_en").notNull(),
  titleRu: text("title_ru").notNull(),
  titleUz: text("title_uz").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryRu: text("summary_ru").notNull(),
  summaryUz: text("summary_uz").notNull(),
  contentEn: text("content_en").notNull(),
  contentRu: text("content_ru").notNull(),
  contentUz: text("content_uz").notNull(),
  codeSnippet: text("code_snippet"),
  expectedOutput: text("expected_output"),
  xpReward: integer("xp_reward").notNull().default(50),
  quizData: jsonb("quiz_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0), // 0 to 100
  isStarted: boolean("is_started").notNull().default(true),
  isCompleted: boolean("is_completed").notNull().default(false),
  currentLessonId: integer("current_lesson_id"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userLessons = pgTable("user_lessons", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  isCompleted: boolean("is_completed").notNull().default(false),
  submittedCode: text("submitted_code"),
  completedAt: timestamp("completed_at"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  tags: text("tags").notNull().default("React, TypeScript"),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleRu: text("title_ru").notNull(),
  titleUz: text("title_uz").notNull(),
  descEn: text("desc_en").notNull(),
  descRu: text("desc_ru").notNull(),
  descUz: text("desc_uz").notNull(),
  icon: text("icon").notNull().default("Award"),
  xpReward: integer("xp_reward").notNull().default(100),
  category: text("category").notNull().default("General"),
  targetValue: integer("target_value").notNull().default(1),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0),
  isUnlocked: boolean("is_unlocked").notNull().default(false),
  isClaimed: boolean("is_claimed").notNull().default(false),
  unlockedAt: timestamp("unlocked_at"),
});

export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userCourses: many(userCourses),
  userLessons: many(userLessons),
  projects: many(projects),
  userAchievements: many(userAchievements),
  aiMessages: many(aiMessages),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  userCourses: many(userCourses),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  userLessons: many(userLessons),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));
