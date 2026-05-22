"use client";

import { useState } from "react";
import { submitPracticeSession } from "@/actions/practiceActions";
import { CheckSquare, ArrowRight, Award, Flame, AlertCircle, Sparkles, BookOpen, PenTool, HelpCircle } from "lucide-react";

const BACKUP_CHALLENGE = {
  topic: "Describe Your Favorite Technology",
  prompt: "Write 3-5 sentences about a technological tool you use every day. Why is it important to you, and how has it changed your life?",
  type: "IELTS",
  difficulty: "INTERMEDIATE"
};

export default function PracticePage() {
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    aiFeedback: string;
    score: number;
  } | null>(null);

  const words = responseText.trim() === "" ? 0 : responseText.trim().split(/\s+/).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (words < 3) {
      setError("Please write at least 3 words to evaluate.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await submitPracticeSession(
        BACKUP_CHALLENGE.topic,
        BACKUP_CHALLENGE.prompt,
        responseText,
        BACKUP_CHALLENGE.type
      );

      if (res && res.error) {
        setError(res.error);
      } else if (res) {
        setResult({
          aiFeedback: res.aiFeedback as string,
          score: res.score as number,
        });
      }
    } catch (err: any) {
      setError("An unexpected error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

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
              <CheckSquare size={20} />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              IELTS & Daily <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent text-glow-purple">Practice</span>
            </h1>
          </div>
          <p className="text-white/50 text-sm pl-13">Submit daily writings and get realistic IELTS Band assessments and constructive linguistic feedback</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Challenge & Response Form */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Daily challenge header */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                  <Flame size={12} />
                  Daily Challenge
                </span>
                <span className="text-xs font-semibold text-white/40">Difficulty: {BACKUP_CHALLENGE.difficulty}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-white mb-3">{BACKUP_CHALLENGE.topic}</h2>
              
              <div className="rounded-2xl border border-white/5 bg-white/2 p-5 mb-8">
                <p className="text-sm font-semibold text-white/80 leading-relaxed">
                  "{BACKUP_CHALLENGE.prompt}"
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 mb-6 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Write Your Response</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="e.g. The technological tool I use every single day is my smartphone. It is incredibly important to me because..."
                    value={responseText}
                    onChange={(e) => {
                      setResponseText(e.target.value);
                      setError(null);
                    }}
                    className="w-full rounded-2xl glass-input px-5 py-4 text-sm resize-none leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-xs text-white/40 mt-2">
                    <span className="flex items-center gap-1">
                      <PenTool size={12} />
                      IELTS writing recommends detailed answers.
                    </span>
                    <span className={`font-bold ${words >= 30 ? "text-teal-400" : "text-white/40"}`}>
                      {words} words
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || words < 3}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-4 text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "AI Coach is grading your response..." : "Submit Response (+50 XP)"}
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: AI Grader Feedback */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="relative h-12 w-12 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-teal-400 animate-spin"></div>
                </div>
                <h4 className="text-white font-bold mb-1">Grading IELTS cues...</h4>
                <p className="text-white/40 text-xs">Assessing coherence, grammar range, and lexical parameters.</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Coach Feedback</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">IELTS Score:</span>
                    <span className="text-lg font-extrabold text-teal-400 bg-teal-500/10 border border-teal-500/30 rounded-xl px-3 py-1 animate-pulse-slow">
                      Band {result.score.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Feedback markdown */}
                <div className="rounded-2xl border border-white/5 bg-white/2 p-6 overflow-y-auto max-h-[420px] leading-relaxed">
                  <div className="text-sm text-white/70 space-y-3 whitespace-pre-line">
                    {result.aiFeedback}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <span className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-6">
                  <Award size={32} />
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Practice Coach Workspace</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">
                  Type your prompt response on the left panel to submit for AI evaluation. Master IELTS speaking and writing standards today!
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
