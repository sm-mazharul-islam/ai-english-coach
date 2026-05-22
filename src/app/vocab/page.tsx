import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VocabManager from "./VocabManager";
import { BookOpen } from "lucide-react";

export default async function VocabPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      vocabularies: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-8">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[-15%] h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-[150px]"></div>
      <div className="absolute bottom-[10%] right-[-15%] h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[120px]"></div>

      <div className="mx-auto max-w-7xl z-10 relative">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <BookOpen size={20} />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Vocabulary <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent text-glow-purple">Trainer</span>
            </h1>
          </div>
          <p className="text-white/50 text-sm pl-13">Build your native English lexical resource with custom Bangla translation lists</p>
        </div>

        {/* Manager Component */}
        <VocabManager initialVocab={user.vocabularies} />
      </div>
    </div>
  );
}
