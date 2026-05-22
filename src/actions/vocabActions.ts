"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addVocabulary(formData: FormData) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Not authenticated" };
  }

  const word = formData.get("word") as string;
  const banglaMeaning = formData.get("banglaMeaning") as string;
  const pronunciation = formData.get("pronunciation") as string;
  const exampleSentence = formData.get("exampleSentence") as string;

  if (!word || !banglaMeaning) {
    return { error: "Word and Bangla Meaning are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) return { error: "User not found" };

    await prisma.vocabulary.create({
      data: {
        userId: user.id,
        word: word.trim(),
        banglaMeaning: banglaMeaning.trim(),
        pronunciation: pronunciation ? pronunciation.trim() : null,
        exampleSentence: exampleSentence ? exampleSentence.trim() : null,
        learned: false,
      },
    });

    // Award 10 XP for saving a word!
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: 10 },
      },
    });

    revalidatePath("/vocab");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Add vocabulary error:", error);
    return { error: error.message || "Failed to add word" };
  }
}

export async function toggleLearned(vocabId: string, currentStatus: boolean) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.vocabulary.update({
      where: { id: vocabId },
      data: { learned: !currentStatus },
    });

    // Retrieve user and update XP (award 5 XP for learning/marking a word)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    if (user && !currentStatus) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { increment: 5 },
        },
      });
    }

    revalidatePath("/vocab");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Toggle learned error:", error);
    return { error: error.message || "Failed to update word status" };
  }
}

export async function deleteVocabulary(vocabId: string) {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.vocabulary.delete({
      where: { id: vocabId },
    });

    revalidatePath("/vocab");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Delete vocabulary error:", error);
    return { error: error.message || "Failed to delete word" };
  }
}
