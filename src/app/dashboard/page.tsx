import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Flame, Star, Award, BookOpen, Sparkles, PlusCircle, CheckSquare, Calendar, ChevronRight, History } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      vocabularies: true,
      corrections: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      practiceSessions: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Calculate stats
  const totalVocab = user.vocabularies.length;
  const learnedVocab = user.vocabularies.filter((v) => v.learned).length;
  const vocabPercent = totalVocab > 0 ? Math.round((learnedVocab / totalVocab) * 100) : 0;
  
  // Calculate level based on XP (every 100 XP = 1 level)
  const userLevel = Math.floor(user.xp / 100) + 1;
  const currentLevelXp = user.xp % 100;
  const xpPercent = currentLevelXp; // Since 100 XP is one level, current XP % is the percent

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-8">
      {/* Dynamic Orbs */}
      <div className="absolute top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]"></div>
      <div className="absolute bottom-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-teal-500/5 blur-[100px]"></div>

      <div className="mx-auto max-w-7xl z-10 relative">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Hello, <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent text-glow-purple">{user.name || "Learner"}</span>
            </h1>
            <p className="text-white/50 text-sm">Ready to elevate your English skills today?</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/grammar"
              className="flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 text-sm font-semibold text-white transition-all"
            >
              <Sparkles size={16} className="text-fuchsia-400" />
              Correct Grammar
            </Link>
            <Link
              href="/practice"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-5 py-3 text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.01]"
            >
              <PlusCircle size={16} />
              Practice Daily Challenge
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          
          {/* Streak Widget */}
          <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Current Streak</span>
              <span className="text-4xl font-extrabold text-white block mb-1">{user.streak} Days</span>
              <span className="text-xs text-orange-400 flex items-center gap-1">
                <Flame size={12} className="fill-orange-400" />
                Keep the habit alive!
              </span>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
              <Flame size={28} className="fill-orange-500/10" />
            </div>
          </div>

          {/* Level & XP Widget (Circular Progress) */}
          <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Coach Level</span>
              <span className="text-4xl font-extrabold text-white block mb-1">Lvl {userLevel}</span>
              <span className="text-xs text-violet-300 flex items-center gap-1">
                <Award size={12} />
                {currentLevelXp}/100 XP to next
              </span>
            </div>
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/5"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-violet-500"
                  strokeDasharray={`${xpPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="text-xs font-bold text-violet-300">{xpPercent}%</span>
            </div>
          </div>

          {/* Vocabulary Stats */}
          <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Vocabulary Saved</span>
              <span className="text-4xl font-extrabold text-white block mb-1">{totalVocab} Words</span>
              <span className="text-xs text-teal-400 flex items-center gap-1">
                <BookOpen size={12} />
                {learnedVocab} marked learned
              </span>
            </div>
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/5"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-400"
                  strokeDasharray={`${vocabPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="text-xs font-bold text-teal-400">{vocabPercent}%</span>
            </div>
          </div>

          {/* Total Corrections */}
          <div className="glass-panel rounded-3xl p-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Corrections Given</span>
              <span className="text-4xl font-extrabold text-white block mb-1">{user.corrections.length} Total</span>
              <span className="text-xs text-fuchsia-400 flex items-center gap-1">
                <Sparkles size={12} />
                Grammar skills improving!
              </span>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/25 flex items-center justify-center text-fuchsia-400">
              <Sparkles size={26} />
            </div>
          </div>

        </div>

        {/* Dynamic Activity Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AI Corrections History */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
                    <History size={18} />
                  </span>
                  <h3 className="text-xl font-bold text-white">Recent Corrections</h3>
                </div>
                <Link href="/grammar" className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1">
                  View tool
                  <ChevronRight size={14} />
                </Link>
              </div>

              {user.corrections.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-white/40 text-sm mb-4">No recent corrections found.</p>
                  <Link href="/grammar" className="inline-flex text-xs font-bold bg-violet-500/10 border border-violet-500/25 text-violet-300 rounded-xl px-4 py-2 hover:bg-violet-500/20">
                    Try AI Grammar Tool
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.corrections.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/5 bg-white/2 p-4">
                      <div className="text-xs font-semibold text-red-400 line-through mb-1">"{item.originalText}"</div>
                      <div className="text-sm font-bold text-teal-400 mb-2">"{item.correctedText}"</div>
                      <p className="text-xs text-white/50 line-clamp-2">{item.explanation.replace(/[#*]/g, "")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* IELTS & Practice History */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                    <CheckSquare size={18} />
                  </span>
                  <h3 className="text-xl font-bold text-white">Practice Workouts</h3>
                </div>
                <Link href="/practice" className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1">
                  New Workout
                  <ChevronRight size={14} />
                </Link>
              </div>

              {user.practiceSessions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-white/40 text-sm mb-4">No practice sessions completed yet.</p>
                  <Link href="/practice" className="inline-flex text-xs font-bold bg-teal-500/10 border border-teal-500/25 text-teal-300 rounded-xl px-4 py-2 hover:bg-teal-500/20">
                    Start Daily Challenge
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.practiceSessions.map((session) => (
                    <div key={session.id} className="rounded-2xl border border-white/5 bg-white/2 p-4 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="inline-block rounded-lg bg-teal-500/10 border border-teal-500/20 text-[10px] font-bold text-teal-400 px-2 py-0.5 mb-2">
                          {session.type} Practice
                        </span>
                        <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{session.topic}</h4>
                        <p className="text-xs text-white/50 line-clamp-1">"{session.userResponse}"</p>
                      </div>
                      {session.score && (
                        <div className="text-center">
                          <span className="text-[10px] text-white/40 block">IELTS Band</span>
                          <span className="text-lg font-extrabold text-teal-400 bg-teal-500/10 border border-teal-500/25 rounded-xl px-2.5 py-1">
                            {session.score.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
