import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, courses, lessons, userCourses, userLessons, projects, achievements, userAchievements } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { eq, desc, asc } from "drizzle-orm";

export async function GET() {
  try {
    await seedDatabase();

    // 1. Get main user
    const [user] = await db.select().from(users).limit(1);

    // 2. Get all courses with lessons count
    const allCourses = await db.select().from(courses).orderBy(asc(courses.id));
    const allLessons = await db.select().from(lessons).orderBy(asc(lessons.orderIndex));
    const userCourseRecords = await db.select().from(userCourses).where(eq(userCourses.userId, user.id));
    const userLessonRecords = await db.select().from(userLessons).where(eq(userLessons.userId, user.id));

    const coursesWithProgress = allCourses.map((c) => {
      const courseLessons = allLessons.filter((l) => l.courseId === c.id);
      const enrollment = userCourseRecords.find((uc) => uc.courseId === c.id);
      const completedLessonCount = courseLessons.filter((l) =>
        userLessonRecords.some((ul) => ul.lessonId === l.id && ul.isCompleted)
      ).length;

      const progress = courseLessons.length > 0 ? Math.round((completedLessonCount / courseLessons.length) * 100) : 0;
      const isCompleted = courseLessons.length > 0 && completedLessonCount === courseLessons.length;
      
      // Determine current lesson
      const firstIncompleteLesson = courseLessons.find(
        (l) => !userLessonRecords.some((ul) => ul.lessonId === l.id && ul.isCompleted)
      );

      return {
        ...c,
        lessonsCount: courseLessons.length,
        lessons: courseLessons,
        progress: enrollment ? progress : 0,
        isEnrolled: !!enrollment,
        isCompleted: isCompleted,
        currentLessonId: firstIncompleteLesson ? firstIncompleteLesson.id : (courseLessons[0]?.id || null),
      };
    });

    // 3. Get all achievements with user status
    const allAchievements = await db.select().from(achievements).orderBy(asc(achievements.id));
    const userAchievementRecords = await db.select().from(userAchievements).where(eq(userAchievements.userId, user.id));

    const achievementsWithStatus = allAchievements.map((ach) => {
      const record = userAchievementRecords.find((ua) => ua.achievementId === ach.id);
      return {
        ...ach,
        isUnlocked: record ? record.isUnlocked : false,
        isClaimed: record ? record.isClaimed : false,
        progress: record ? record.progress : 0,
      };
    });

    // 4. Get projects
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    const allUsers = await db.select().from(users);

    const projectsWithAuthor = allProjects.map((p) => {
      const author = allUsers.find((u) => u.id === p.userId) || user;
      return {
        ...p,
        authorName: author.name,
        authorUsername: author.username,
        authorAvatar: author.avatar,
        isOwner: p.userId === user.id,
      };
    });

    // 5. Get leaderboard (sorted by XP descending)
    const leaderboardUsers = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        avatar: users.avatar,
        title: users.title,
        level: users.level,
        xp: users.xp,
        coins: users.coins,
        streak: users.streak,
      })
      .from(users)
      .orderBy(desc(users.xp))
      .limit(20);

    return NextResponse.json({
      user,
      courses: coursesWithProgress,
      achievements: achievementsWithStatus,
      projects: projectsWithAuthor,
      leaderboard: leaderboardUsers,
    });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json({ error: "Failed to initialize academy data" }, { status: 500 });
  }
}
