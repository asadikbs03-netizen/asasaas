import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, courses, lessons, userCourses, userLessons, achievements, userAchievements } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId)) return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const submittedCode = body.submittedCode || "";

    const [user] = await db.select().from(users).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const [course] = await db.select().from(courses).where(eq(courses.id, lesson.courseId)).limit(1);
    const allCourseLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, lesson.courseId))
      .orderBy(asc(lessons.orderIndex));

    // Check if already completed
    const [existingRecord] = await db
      .select()
      .from(userLessons)
      .where(and(eq(userLessons.userId, user.id), eq(userLessons.lessonId, lessonId)))
      .limit(1);

    const isFirstTimeCompletion = !existingRecord || !existingRecord.isCompleted;

    if (!existingRecord) {
      await db.insert(userLessons).values({
        userId: user.id,
        lessonId: lesson.id,
        isCompleted: true,
        submittedCode: submittedCode,
        completedAt: new Date(),
      });
    } else if (!existingRecord.isCompleted) {
      await db
        .update(userLessons)
        .set({
          isCompleted: true,
          submittedCode: submittedCode || existingRecord.submittedCode,
          completedAt: new Date(),
        })
        .where(eq(userLessons.id, existingRecord.id));
    }

    // Award XP
    const xpReward = isFirstTimeCompletion ? (lesson.xpReward || 50) : 10;
    const newTotalXp = user.xp + xpReward;
    const newLevel = Math.max(1, Math.floor(newTotalXp / 300) + 1);

    await db
      .update(users)
      .set({
        xp: newTotalXp,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Calculate course progress
    const allUserLessonRecords = await db
      .select()
      .from(userLessons)
      .where(eq(userLessons.userId, user.id));

    const completedLessonCount = allCourseLessons.filter((l) =>
      allUserLessonRecords.some((ul) => ul.lessonId === l.id && ul.isCompleted)
    ).length;

    const progress = Math.round((completedLessonCount / allCourseLessons.length) * 100);
    const isCourseCompleted = completedLessonCount === allCourseLessons.length;

    // Find next lesson
    const currentIndex = allCourseLessons.findIndex((l) => l.id === lessonId);
    const nextLesson = currentIndex < allCourseLessons.length - 1 ? allCourseLessons[currentIndex + 1] : null;

    // Update userCourses record
    const [existingEnrollment] = await db
      .select()
      .from(userCourses)
      .where(and(eq(userCourses.userId, user.id), eq(userCourses.courseId, course.id)))
      .limit(1);

    if (existingEnrollment) {
      await db
        .update(userCourses)
        .set({
          progress: progress,
          isCompleted: isCourseCompleted,
          currentLessonId: nextLesson ? nextLesson.id : lesson.id,
          updatedAt: new Date(),
        })
        .where(eq(userCourses.id, existingEnrollment.id));
    } else {
      await db.insert(userCourses).values({
        userId: user.id,
        courseId: course.id,
        progress: progress,
        isStarted: true,
        isCompleted: isCourseCompleted,
        currentLessonId: nextLesson ? nextLesson.id : lesson.id,
      });
    }

    // Check & trigger achievements
    const newlyUnlockedAchievements: string[] = [];
    
    // Achievement: First code
    const [firstCodeAch] = await db.select().from(achievements).where(eq(achievements.code, "first_code")).limit(1);
    if (firstCodeAch) {
      const [userAch] = await db.select().from(userAchievements).where(and(eq(userAchievements.userId, user.id), eq(userAchievements.achievementId, firstCodeAch.id))).limit(1);
      if (!userAch) {
        await db.insert(userAchievements).values({
          userId: user.id,
          achievementId: firstCodeAch.id,
          progress: 1,
          isUnlocked: true,
          isClaimed: false,
          unlockedAt: new Date(),
        });
        newlyUnlockedAchievements.push(firstCodeAch.titleEn);
      }
    }

    // Achievement: Master rank if xp >= 1500
    if (newTotalXp >= 1500) {
      const [masterAch] = await db.select().from(achievements).where(eq(achievements.code, "master_rank")).limit(1);
      if (masterAch) {
        const [userAch] = await db.select().from(userAchievements).where(and(eq(userAchievements.userId, user.id), eq(userAchievements.achievementId, masterAch.id))).limit(1);
        if (!userAch) {
          await db.insert(userAchievements).values({
            userId: user.id,
            achievementId: masterAch.id,
            progress: newTotalXp,
            isUnlocked: true,
            isClaimed: false,
            unlockedAt: new Date(),
          });
          newlyUnlockedAchievements.push(masterAch.titleEn);
        }
      }
    }

    return NextResponse.json({
      success: true,
      xpGained: xpReward,
      newTotalXp,
      newLevel,
      progress,
      isCourseCompleted,
      nextLessonId: nextLesson ? nextLesson.id : null,
      newlyUnlockedAchievements,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    return NextResponse.json({ error: "Failed to complete lesson" }, { status: 500 });
  }
}
