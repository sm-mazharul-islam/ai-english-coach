"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkGrammar } from "@/lib/ai";
import { revalidatePath } from "next/cache";

export async function submitGrammarCorrection(text: string) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Not authenticated" };
  }

  if (!text || text.trim().length === 0) {
    return { error: "Please enter some text to correct" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) return { error: "User not found" };

    // Get correction from AI helper
    const result = await checkGrammar(text);

    // Save correction in database
    await prisma.correction.create({
      data: {
        userId: user.id,
        originalText: text.trim(),
        correctedText: result.correctedText,
        explanation: result.explanation,
      },
    });

    // Award 15 XP for taking the initiative to correct grammar!
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: 15 },
      },
    });

    revalidatePath("/grammar");
    revalidatePath("/dashboard");

    return {
      success: true,
      originalText: text.trim(),
      correctedText: result.correctedText,
      explanation: result.explanation,
    };
  } catch (error: any) {
    console.error("Grammar correction error:", error);
    return { error: error.message || "Failed to process grammar check" };
  }
}
