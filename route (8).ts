import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, projects, achievements, userAchievements } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const [user] = await db.select().from(users).limit(1);
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    const allUsers = await db.select().from(users);

    const formatted = allProjects.map((p) => {
      const author = allUsers.find((u) => u.id === p.userId) || user;
      return {
        ...p,
        authorName: author.name,
        authorUsername: author.username,
        authorAvatar: author.avatar,
        isOwner: user ? p.userId === user.id : false,
      };
    });

    return NextResponse.json({ projects: formatted });
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, description, tags, demoUrl, repoUrl } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Title, category, and description are required" },
        { status: 400 }
      );
    }

    const [user] = await db.select().from(users).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [newProject] = await db
      .insert(projects)
      .values({
        userId: user.id,
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        tags: tags?.trim() || "Fullstack, Cyber",
        demoUrl: demoUrl?.trim() || null,
        repoUrl: repoUrl?.trim() || null,
        likesCount: 0,
      })
      .returning();

    // Reward XP +150 for project creation
    const newXp = user.xp + 150;
    const newLevel = Math.max(1, Math.floor(newXp / 300) + 1);

    await db
      .update(users)
      .set({
        xp: newXp,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Unlock project_creator achievement
    const [projectAch] = await db
      .select()
      .from(achievements)
      .where(eq(achievements.code, "project_creator"))
      .limit(1);

    if (projectAch) {
      const [existingUserAch] = await db
        .select()
        .from(userAchievements)
        .where(
          and(
            eq(userAchievements.userId, user.id),
            eq(userAchievements.achievementId, projectAch.id)
          )
        )
        .limit(1);

      if (!existingUserAch) {
        await db.insert(userAchievements).values({
          userId: user.id,
          achievementId: projectAch.id,
          progress: 1,
          isUnlocked: true,
          isClaimed: false,
          unlockedAt: new Date(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      project: {
        ...newProject,
        authorName: user.name,
        authorUsername: user.username,
        authorAvatar: user.avatar,
        isOwner: true,
      },
      xpGained: 150,
      newTotalXp: newXp,
      newLevel: newLevel,
    });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
