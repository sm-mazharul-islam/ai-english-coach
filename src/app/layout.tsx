import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Antigravity English AI | Your Smart English Learning Coach",
  description: "Improve your English writing, practice vocabulary, get AI grammar corrections, and train for the IELTS speaking & writing exam with interactive SaaS insights.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">
        <Navbar session={session} />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
