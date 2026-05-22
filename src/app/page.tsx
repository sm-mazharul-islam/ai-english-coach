import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, CheckSquare, Award, Star, Flame, Languages } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between px-6 py-12">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[120px]"></div>

      <header className="mx-auto w-full max-w-7xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
            English AI
          </span>
        </div>

        <div>
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] cursor-pointer"
            >
              Dashboard
              <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="text-white/70 hover:text-white text-sm font-semibold px-4 py-2 hover:bg-white/5 rounded-xl transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-xl bg-white text-slate-950 hover:bg-white/90 px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-4xl text-center py-20 z-10 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs text-white/80 backdrop-blur-md mb-8">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span>The Next Generation English Coach Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Master English with a <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent text-glow-purple">
            Personal AI Coach
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
          Daily grammar corrections, interactive speaking workouts, IELTS band grading, streaks tracking, and vocabulary list tools with Bangla translations.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={session ? "/dashboard" : "/auth/signup"}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-8 py-4 text-base font-bold text-white transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-[1.03] cursor-pointer"
          >
            {session ? "Enter Workspace" : "Start Learning Free"}
            <ArrowRight size={18} />
          </Link>
          <a
            href="#features"
            className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:border-white/20"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features" className="mx-auto w-full max-w-6xl py-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="glass-panel glass-card-hover rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
            <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">AI Grammar Corrector</h3>
              <p className="text-sm text-white/50">Instant deep context evaluation, correct sentences, and clear grammatical breakdown.</p>
            </div>
          </div>

          <div className="glass-panel glass-card-hover rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
            <div className="h-12 w-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/25 flex items-center justify-center text-fuchsia-400">
              <Languages size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Bangla Vocab Trainer</h3>
              <p className="text-sm text-white/50">Save custom terms with native meanings, pronunciation guides, and interactive checkboxes.</p>
            </div>
          </div>

          <div className="glass-panel glass-card-hover rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
              <CheckSquare size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">IELTS Workouts</h3>
              <p className="text-sm text-white/50">Practice daily writing or speaking, and receive realistic AI bands (1.0 to 9.0) with feedback.</p>
            </div>
          </div>

          <div className="glass-panel glass-card-hover rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
              <Flame size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Streaks & Habit Building</h3>
              <p className="text-sm text-white/50">Interactive calendar tracking, dynamic daily challenges, and XP milestones.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl text-center text-white/30 text-xs border-t border-white/5 pt-8 z-10">
        &copy; {new Date().getFullYear()} Antigravity English. Built for modern learning.
      </footer>
    </div>
  );
}
