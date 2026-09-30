import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });

    const [updated] = await db
      .update(projects)
      .set({
        likesCount: sql`${projects.likesCount} + 1`,
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json({ success: true, likesCount: updated ? updated.likesCount : 1 });
  } catch (error) {
    console.error("Like project error:", error);
    return NextResponse.json({ error: "Failed to like project" }, { status: 500 });
  }
}
