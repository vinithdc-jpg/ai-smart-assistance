"use client";

import Link from "next/link";
import ManageButton from "../ui/Buuton";
import Logout from "../ui/Logout";
import ThemeToggle from "../ui/ThemeToggle";
import BrandLogo from "../ui/BrandLogo";
import { UserRound } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
  ButtonName: string;
  onNewChat?: () => void;
}

export default function ChatHeader({
  onLogout,
  ButtonName,
  onNewChat,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:px-8">
        {/* Brand Logo & Active Status */}
        <div className="min-w-0 shrink">
          <BrandLogo className="w-20 sm:w-32 lg:w-36" />
        </div>

        {/* Right Section: Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          {onNewChat && (
            <button
              type="button"
              onClick={onNewChat}
              aria-label="Start new conversation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 text-xs font-medium text-foreground/80 shadow-sm transition-all hover:border-primary/40 hover:bg-primary-soft hover:text-primary active:scale-[0.98] sm:w-auto sm:gap-1.5 sm:px-3.5"
            >
              <svg
                className="h-4 w-4 text-muted sm:h-3.5 sm:w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="sr-only sm:not-sr-only">New chat</span>
            </button>
          )}

          <Link href="/Member" aria-label={ButtonName} title={ButtonName}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary transition-colors hover:bg-primary hover:text-white sm:hidden">
              <UserRound aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline-flex">
              <ManageButton ButtonName={ButtonName} />
            </span>
          </Link>
          <Logout onLogout={onLogout} compactOnMobile />
        </div>
      </div>
    </header>
  );
}
