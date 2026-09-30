import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, achievements, userAchievements } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const achievementId = parseInt(id, 10);
    if (isNaN(achievementId)) return NextResponse.json({ error: "Invalid achievement ID" }, { status: 400 });

    const [user] = await db.select().from(users).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, achievementId)).limit(1);
    if (!achievement) return NextResponse.json({ error: "Achievement not found" }, { status: 404 });

    const [userAch] = await db
      .select()
      .from(userAchievements)
      .where(and(eq(userAchievements.userId, user.id), eq(userAchievements.achievementId, achievementId)))
      .limit(1);

    if (!userAch || !userAch.isUnlocked) {
      return NextResponse.json({ error: "Achievement is not unlocked yet" }, { status: 400 });
    }

    if (userAch.isClaimed) {
      return NextResponse.json({ error: "Achievement already claimed" }, { status: 400 });
    }

    // Mark claimed
    await db
      .update(userAchievements)
      .set({ isClaimed: true })
      .where(eq(userAchievements.id, userAch.id));

    // Add XP reward
    const reward = achievement.xpReward || 100;
    const newXp = user.xp + reward;
    const newLevel = Math.max(1, Math.floor(newXp / 300) + 1);

    await db
      .update(users)
      .set({
        xp: newXp,
        level: newLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      reward,
      newTotalXp: newXp,
      newLevel: newLevel,
      achievementId,
    });
  } catch (error) {
    console.error("Claim achievement error:", error);
    return NextResponse.json({ error: "Failed to claim achievement" }, { status: 500 });
  }
}
