import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, courses, lessons, userCourses, userLessons } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const [user] = await db.select().from(users).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const courseLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, course.id))
      .orderBy(asc(lessons.orderIndex));

    const userLessonRecords = await db
      .select()
      .from(userLessons)
      .where(eq(userLessons.userId, user.id));

    // Find the next incomplete lesson
    const firstIncompleteLesson = courseLessons.find(
      (l) => !userLessonRecords.some((ul) => ul.lessonId === l.id && ul.isCompleted)
    );

    const targetLessonId = firstIncompleteLesson ? firstIncompleteLesson.id : courseLessons[0]?.id;

    // Check if userCourse record exists
    const [existingEnrollment] = await db
      .select()
      .from(userCourses)
      .where(and(eq(userCourses.userId, user.id), eq(userCourses.courseId, course.id)))
      .limit(1);

    if (!existingEnrollment) {
      await db.insert(userCourses).values({
        userId: user.id,
        courseId: course.id,
        progress: 0,
        isStarted: true,
        isCompleted: false,
        currentLessonId: targetLessonId,
      });
    } else {
      await db
        .update(userCourses)
        .set({
          isStarted: true,
          currentLessonId: targetLessonId,
          updatedAt: new Date(),
        })
        .where(eq(userCourses.id, existingEnrollment.id));
    }

    return NextResponse.json({
      success: true,
      course,
      targetLessonId,
      isEnrolled: true,
    });
  } catch (error) {
    console.error("Start course error:", error);
    return NextResponse.json({ error: "Failed to start course" }, { status: 500 });
  }
}
