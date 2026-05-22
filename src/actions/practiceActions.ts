"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { gradeIELTSRecord } from "@/lib/ai";
import { revalidatePath } from "next/cache";

export async function submitPracticeSession(
  topic: string,
  prompt: string,
  responseText: string,
  type: string
) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Not authenticated" };
  }

  if (!responseText || responseText.trim().split(/\s+/).length < 3) {
    return { error: "Response must be at least 3 words long to grade" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) return { error: "User not found" };

    // Get IELTS evaluation from AI helper
    const result = await gradeIELTSRecord(prompt, responseText);

    // Save practice session in database
    await prisma.practiceSession.create({
      data: {
        userId: user.id,
        topic,
        prompt,
        userResponse: responseText.trim(),
        aiFeedback: result.aiFeedback,
        score: Math.round(result.score), // Store rounded score
        type,
      },
    });

    // Award 50 XP for completing a practice workout!
    // Also, handle user streak updates.
    // Check if the user was active today, if not increase streak
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    let streakIncrement = 0;

    if (user.lastActiveDate) {
      const lastActiveStr = user.lastActiveDate.toISOString().split("T")[0];
      if (lastActiveStr !== todayStr) {
        // Last active was in the past, increment streak
        // Simple logic: if active yesterday or earlier, increment streak (for MVP)
        streakIncrement = 1;
      }
    } else {
      streakIncrement = 1;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: 50 },
        streak: streakIncrement > 0 ? { increment: streakIncrement } : undefined,
        lastActiveDate: now,
      },
    });

    // Create progress record if not exist
    await prisma.progress.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: todayStr,
        },
      },
      update: {
        lessonsCompleted: { increment: 1 },
        xpEarned: { increment: 50 },
      },
      create: {
        userId: user.id,
        date: todayStr,
        lessonsCompleted: 1,
        vocabularyCount: 0,
        currentStreak: user.streak + streakIncrement,
        xpEarned: 50,
      },
    });

    revalidatePath("/practice");
    revalidatePath("/dashboard");

    return {
      success: true,
      aiFeedback: result.aiFeedback,
      score: result.score,
    };
  } catch (error: any) {
    console.error("Practice submission error:", error);
    return { error: error.message || "Failed to submit workout" };
  }
}
