"use client";

import { useState } from "react";
import { submitGrammarCorrection } from "@/actions/grammarActions";
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle, HelpCircle, History, Copy, Check, ChevronDown } from "lucide-react";

const TEMPLATES = [
  "He go market yesterday",
  "I has a pen",
  "She dont like apple",
];

export default function GrammarPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    originalText: string;
    correctedText: string;
    explanation: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await submitGrammarCorrection(text);
      if (res && res.error) {
        setError(res.error);
      } else if (res) {
        setResult({
          originalText: res.originalText as string,
          correctedText: res.correctedText as string,
          explanation: res.explanation as string,
        });
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.correctedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateClick = (t: string) => {
    setText(t);
    setError(null);
  };

  return (
    <div className="relative min-h-screen py-10 px-4 md:px-8">
      {/* Decorative background gradients */}
      <div className="absolute top-[10%] left-[-15%] h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-[150px]"></div>
      <div className="absolute bottom-[10%] right-[-15%] h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[120px]"></div>

      <div className="mx-auto max-w-7xl z-10 relative">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <Sparkles size={20} />
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              AI Grammar <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent text-glow-purple">Corrector</span>
            </h1>
          </div>
          <p className="text-white/50 text-sm pl-13">Enter your sentences to receive instant grammatical corrections, syntax tweaks, and tutoring breakdowns</p>
        </div>

        {/* Action Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel: Input */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Input Text</h3>
              
              {error && (
                <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <textarea
                    rows={6}
                    maxLength={500}
                    placeholder="e.g. He go market yesterday and i has to follow him."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-2xl glass-input px-5 py-4 text-sm resize-none leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-xs text-white/40 mt-2">
                    <span>Write naturally, AI will polish it.</span>
                    <span>{text.length}/500 chars</span>
                  </div>
                </div>

                {/* Quick Templates */}
                <div>
                  <span className="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2.5">Try common errors:</span>
                  <div className="flex flex-wrap gap-2">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTemplateClick(t)}
                        className="rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 px-3.5 py-2 text-xs font-medium text-white/70 hover:text-white transition-all cursor-pointer"
                      >
                        "{t}"
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !text.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-4 text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "AI is reviewing your grammar..." : "Correct Grammar (+15 XP)"}
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Output & Explanation */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="relative h-12 w-12 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-violet-400 animate-spin"></div>
                </div>
                <h4 className="text-white font-bold mb-1">Analyzing syntax...</h4>
                <p className="text-white/40 text-xs">Reviewing grammar, context, prepositions, and tenses.</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">AI Correction Results</h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-teal-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy Result
                      </>
                    )}
                  </button>
                </div>

                {/* Comparison block */}
                <div className="space-y-4">
                  {/* Original text card */}
                  <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-4 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                      <AlertTriangle size={12} />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400/80 block mb-1">Original Text</span>
                      <p className="text-sm font-semibold text-red-300 line-through">"{result.originalText}"</p>
                    </div>
                  </div>

                  {/* Corrected text card */}
                  <div className="rounded-2xl border border-teal-500/10 bg-teal-500/[0.02] p-4 flex items-start gap-3 shadow-[0_0_20px_rgba(20,184,166,0.02)]">
                    <span className="h-6 w-6 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                      <CheckCircle size={12} />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400/80 block mb-1">AI Corrected</span>
                      <p className="text-sm font-extrabold text-teal-400">"{result.correctedText}"</p>
                    </div>
                  </div>
                </div>

                {/* Explanation accordion */}
                <div className="rounded-2xl border border-white/5 bg-white/2 p-5">
                  <div className="flex items-center gap-2 mb-3 text-white/80">
                    <HelpCircle size={16} className="text-fuchsia-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">Grammar Coach Breakdown</span>
                  </div>
                  <div className="text-xs text-white/60 leading-relaxed space-y-2 whitespace-pre-line">
                    {result.explanation}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <span className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-6">
                  <HelpCircle size={32} />
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Check Your Grammar</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">
                  Type a sentence in the left panel to review side-by-side diff corrections and master English tenses.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
