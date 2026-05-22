"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/actions/authActions";
import { ArrowRight, Mail, Lock, AlertCircle, Sparkles, UserCheck } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await loginUser(formData);
      if (res && res.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (e: any) {
      // In NextAuth, a successful redirect triggers a system exception inside server action.
      // We ignore standard redirect error behaviors as the browser will redirect automatically.
      console.log("Redirecting...");
    }
  };

  const handleQuickFill = () => {
    setEmail("test@example.com");
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px]"></div>

      <div className="w-full max-w-md z-10">
        <div className="glass-panel rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/25 text-violet-400 mb-4 animate-pulse-slow">
              <Sparkles size={24} />
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
            <p className="text-white/50 text-sm">Continue your daily English habit training</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 mb-6">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl glass-input pl-11 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl glass-input pl-11 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-3.5 text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Signing In..." : "Sign In"}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Fill Test Mode Button */}
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-white/20 text-xs font-semibold uppercase tracking-wider">Demo Access</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickFill}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 py-3 text-xs font-semibold text-violet-300 transition-all cursor-pointer"
          >
            <UserCheck size={14} />
            Quick-Fill Test Account
          </button>

          <p className="mt-8 text-center text-xs text-white/40">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-bold text-violet-400 hover:text-violet-300 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
