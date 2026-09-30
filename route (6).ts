import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, courses, lessons, userLessons } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId)) return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });

    const [user] = await db.select().from(users).limit(1);
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const [course] = await db.select().from(courses).where(eq(courses.id, lesson.courseId)).limit(1);
    const allCourseLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, lesson.courseId))
      .orderBy(asc(lessons.orderIndex));

    const userLessonRecords = user
      ? await db.select().from(userLessons).where(eq(userLessons.userId, user.id))
      : [];

    const currentIndex = allCourseLessons.findIndex((l) => l.id === lessonId);
    const prevLessonId = currentIndex > 0 ? allCourseLessons[currentIndex - 1].id : null;
    const nextLessonId = currentIndex < allCourseLessons.length - 1 ? allCourseLessons[currentIndex + 1].id : null;

    const userLessonStatus = userLessonRecords.find((ul) => ul.lessonId === lessonId);

    const lessonsNavigation = allCourseLessons.map((l, idx) => ({
      id: l.id,
      orderIndex: l.orderIndex,
      titleEn: l.titleEn,
      titleRu: l.titleRu,
      titleUz: l.titleUz,
      isCompleted: userLessonRecords.some((ul) => ul.lessonId === l.id && ul.isCompleted),
      isCurrent: l.id === lessonId,
    }));

    return NextResponse.json({
      lesson,
      course,
      prevLessonId,
      nextLessonId,
      currentIndex: currentIndex + 1,
      totalLessons: allCourseLessons.length,
      isCompleted: userLessonStatus?.isCompleted || false,
      submittedCode: userLessonStatus?.submittedCode || null,
      lessonsList: lessonsNavigation,
    });
  } catch (error) {
    console.error("Get lesson error:", error);
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 });
  }
}
