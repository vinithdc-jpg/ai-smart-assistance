"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { LogOut } from "lucide-react";

interface LogoutProps {
  onLogout: () => void | Promise<void>;
  compact?: boolean;
  compactOnMobile?: boolean;
}

export default function Logout({ onLogout, compact = false, compactOnMobile = false }: LogoutProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function confirmLogout() {
    setIsLoading(true);
    try {
      await onLogout();
    } finally {
      setIsLoading(false);
      setIsConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        aria-label={compactOnMobile ? "Logout" : undefined}
        title="Logout"
        className={compactOnMobile || compact
          ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm transition-all hover:bg-primary-soft hover:text-primary sm:h-9 sm:w-auto sm:gap-2 sm:px-3.5 sm:text-xs sm:font-medium sm:hover:text-foreground"
          : "inline-flex h-9 items-center justify-center gap-2 rounded-full border border-border bg-white px-3.5 text-xs font-medium text-muted shadow-sm transition-all hover:bg-primary-soft hover:text-foreground"}
      >
        <LogOut className="h-3.5 w-3.5" />
        {compact ? null : <span className={compactOnMobile ? "hidden sm:inline" : undefined}>Logout</span>}
      </button>
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Log out?"
        message="Are you sure you want to log out of Smart Ledger AI?"
        confirmText="Log out"
        variant="logout"
        isLoading={isLoading}
        onClose={() => {
          if (!isLoading) setIsConfirmOpen(false);
        }}
        onConfirm={() => void confirmLogout()}
      />
    </>
  );
}
