"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, CheckSquare, Award, LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar({ session }: { session: any }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Award },
    { href: "/vocab", label: "Vocabulary", icon: BookOpen },
    { href: "/grammar", label: "AI Grammar", icon: Sparkles },
    { href: "/practice", label: "IELTS & Practice", icon: CheckSquare },
  ];

  if (pathname.startsWith("/auth") || pathname === "/") {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-sans text-xl font-bold tracking-tight text-white">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 bg-clip-text text-transparent text-glow-purple">
            Antigravity
          </span>
          <span className="text-sm font-medium text-white/50">English AI</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User Info / Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-white/50">Daily Learner</span>
            <span className="text-sm font-semibold text-white">{session?.user?.name || "User"}</span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300">
            <UserIcon size={18} />
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-200 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
