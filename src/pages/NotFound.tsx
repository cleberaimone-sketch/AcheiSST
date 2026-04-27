"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Github, Twitter, MessageCircle } from "lucide-react";

const NotFound = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="fixed top-0 z-50 w-full bg-background/95 border-b border-border">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6">
          <div className="hidden md:flex items-center justify-between relative">
            <nav className="flex items-center gap-8">
              <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.12em]">
                Schedule
              </Link>
              <Link href="/speakers" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.12em]">
                Speakers
              </Link>
              <span className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.12em] cursor-default">FAQ</span>
            </nav>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="text-foreground text-[34px] leading-none font-medium tracking-tight">Ship</span>
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 border border-border text-[10px] font-mono leading-none text-muted-foreground">
                26
              </span>
            </Link>

            <nav className="flex items-center gap-7">
              <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.12em]">
                Tickets
              </Link>
            </nav>
          </div>

          <div className="md:hidden flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1.5">
              <span className="text-foreground text-lg leading-none font-medium tracking-tight">Ship</span>
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 border border-border text-[10px] font-mono leading-none text-muted-foreground">
                26
              </span>
            </Link>
            <button className="p-2 text-foreground" onClick={() => setMobileOpen((prev) => !prev)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-border px-6 pb-5 pt-4 flex flex-col gap-4 bg-background">
            <Link href="/schedule" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.12em]">
              Schedule
            </Link>
            <Link href="/speakers" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.12em]">
              Speakers
            </Link>
            <Link href="/schedule" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-[0.12em]">
              Tickets
            </Link>
          </nav>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-6 md:px-10 pt-28 md:pt-36 pb-12">
        <div className="relative w-full max-w-5xl border border-dashed border-border min-h-[360px] md:min-h-[460px] flex flex-col items-center justify-center gap-8">
          <span className="absolute -top-3 -left-3 text-muted-foreground text-2xl leading-none">+</span>

          <svg width="150" height="110" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <polygon points="67,10 95,60 39,60" stroke="hsl(37 20% 70%)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
            <circle cx="95" cy="60" r="25" stroke="hsl(37 20% 70%)" strokeWidth="1" fill="none" />
            <path d="M95 60 L95 35 A25 25 0 0 1 116.6 47.5 Z" fill="hsl(37 52% 24%)" />
          </svg>

          <h1 className="text-[72px] md:text-[100px] font-medium tracking-tight leading-none">404</h1>
        </div>
      </main>

      <footer className="border-t border-border px-6 md:px-12 py-5">
        <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors">
              Event T&Cs
            </Link>
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <div className="flex items-center gap-3">
              <Github className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <Twitter className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
