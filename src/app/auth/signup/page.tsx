"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/authActions";
import { ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    setLoading(false);
    if (res && res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[100px]"></div>

      <div className="w-full max-w-md z-10">
        <div className="glass-panel rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/25 text-fuchsia-400 mb-4 animate-pulse-slow">
              <Sparkles size={24} />
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
            <p className="text-white/50 text-sm">Join to practice English daily with AI coaching</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 mb-6">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 p-4 text-sm text-teal-400 mb-6">
              <CheckCircle size={18} className="shrink-0" />
              <span>Registration successful! Redirecting to Sign In...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <User size={16} />
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full rounded-2xl glass-input pl-11 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30">
                  <Mail size={16} />
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
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
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl glass-input pl-11 pr-4 py-3.5 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-3.5 text-sm font-bold text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Registering..." : "Create Account"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-white/40">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-bold text-violet-400 hover:text-violet-300 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
