"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import Logout from "../ui/Logout";
import ThemeToggle from "../ui/ThemeToggle";
import BrandLogo from "../ui/BrandLogo";

interface HeaderProps {
  onLogout: () => void;
  ButtonName?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onAddTransaction?: () => void;
  gstRate?: number;
  clubId?: string;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md dark:bg-slate-950/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-16 lg:px-8">
        {/* Logo / Brand Section */}
        <div className="flex items-center gap-3">
          <BrandLogo className="w-24 sm:w-28 lg:w-32" />
        </div>
        {/* Actions Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/ai-chat"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 sm:px-3.5 text-sm font-semibold text-[#5b4dff] shadow-sm transition-colors hover:bg-slate-50 dark:text-violet-300 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI-assist</span>
          </Link>

          <Logout onLogout={onLogout} compact />
        </div>
      </div>
    </header>
  );
}
