"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface BackNavigationLogoutGuardProps {
  loginPath: string;
  logout: () => Promise<unknown>;
  admin?: boolean;
}

export default function BackNavigationLogoutGuard({
  loginPath,
  logout,
  admin = false,
}: BackNavigationLogoutGuardProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const logoutRef = useRef(logout);
  const historyInitializedRef = useRef(false);

  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  useEffect(() => {
    if (!historyInitializedRef.current) {
      window.history.pushState(
        { protectedScreen: true },
        "",
        window.location.href,
      );
      historyInitializedRef.current = true;
    }

    function handleBackNavigation() {
      window.history.pushState(
        { protectedScreen: true },
        "",
        window.location.href,
      );
      setIsOpen(true);
    }

    window.addEventListener("popstate", handleBackNavigation);
    return () => window.removeEventListener("popstate", handleBackNavigation);
  }, []);

  async function confirmLogout() {
    setIsLoading(true);
    try {
      await logoutRef.current();
      router.replace(loginPath);
      setIsOpen(false);
    } catch {
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Log out?"
      message={
        admin
          ? "Going back will log you out of the admin dashboard. Continue?"
          : "Going back will log you out of Smart Ledger AI. Continue?"
      }
      confirmText="Log out"
      variant="logout"
      isLoading={isLoading}
      onClose={() => {
        if (!isLoading) setIsOpen(false);
      }}
      onConfirm={() => void confirmLogout()}
    />
  );
}