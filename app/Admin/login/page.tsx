"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, getAdminMe } from "@/lib/adminApi";
import Link from "next/link";
import PageLoader from "@/components/PageLoader";
import ThemeToggle from "@/components/ui/ThemeToggle";
import BrandLogo from "@/components/ui/BrandLogo";
import { toast } from "react-toastify";
import useLoginLockout from "@/Function/useLoginLockout";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const {
    remainingSeconds,
    getCurrentLockoutSeconds,
    recordFailedAttempt,
    resetAttempts,
  } = useLoginLockout("super-admin", email);

  useEffect(() => {
    let mounted = true;

    async function redirectAuthenticatedAdmin() {
      try {
        await getAdminMe();
        if (!mounted) return;

        const from = new URLSearchParams(window.location.search).get("from");
        const returnPath =
          from && from.startsWith("/Admin/") && !from.startsWith("//")
            ? from
            : "/Admin/dashboard";
        router.replace(returnPath);
      } catch {
        if (mounted) setCheckingSession(false);
      }
    }

    void redirectAuthenticatedAdmin();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checkingSession) {
    return <PageLoader label="Checking admin session" />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (getCurrentLockoutSeconds() > 0) return;

    setLoading(true);
    try {
      await adminLogin(email, password);
      resetAttempts();
      const from = new URLSearchParams(window.location.search).get("from");
      const returnPath =
        from && from.startsWith("/Admin/") && !from.startsWith("//")
          ? from
          : "/Admin/dashboard";
      router.replace(returnPath);
    } catch (requestError) {
      const status =
        typeof requestError === "object" &&
        requestError !== null &&
        "status" in requestError
          ? requestError.status
          : undefined;
      if (status === 400 || status === 401 || status === 403) {
        const lockoutSeconds = recordFailedAttempt();
        if (lockoutSeconds > 0) {
          toast.error(
            `Too many failed attempts. Try again in ${lockoutSeconds} seconds.`,
          );
          return;
        }
      }
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Admin login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-x-hidden overflow-y-auto bg-background px-4 py-4 sm:px-6 sm:py-8 dark:bg-background">
      <header className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </header>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-md items-center justify-center sm:min-h-[calc(100dvh-4rem)]">
        <div className="w-full overflow-hidden rounded-[22px] border border-border bg-white p-6 shadow-[0_22px_60px_rgba(54,58,120,0.12)] sm:p-9">
          <div className="mb-7 flex items-center justify-center gap-2.5">
            <BrandLogo className="w-36 sm:w-40" />
          </div>
          <div className="space-y-2 text-center">
            <p className="mx-auto mb-3 w-fit rounded-full bg-primary-soft px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-primary">
              Super Admin Portal
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back, Administrator
            </h1>
            <p className="text-xs leading-5 text-muted">
              Enter your authorized credentials to access the autonomous
              financial core.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="form-floating-field">
              <span className="form-floating-label">
                Administrative Identity
              </span>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder=" "
                className="form-floating-input h-11 w-full rounded-xl border border-border bg-[#f7f8ff] px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-ring/40"
                required
              />
            </label>
            <label className="form-floating-field">
              <span className="form-floating-label">
                Master Passkey
              </span>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder=" "
                className="form-floating-input h-11 w-full rounded-xl border border-border bg-[#f7f8ff] px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-ring/40"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loading || remainingSeconds > 0}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white shadow-[0_10px_24px_rgba(93,95,239,0.28)] transition-all hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : remainingSeconds > 0
                  ? `Try again in ${remainingSeconds}s`
                  : "Sign In to Ledger Console  →"}
            </button>
          
            <Link
              href="/"
              className="text-xs font-medium text-primary hover:text-primary-hover transition-colors focus:outline-none"
            >
              Login as Staff
            </Link>
          </form>
          <div className="mt-6 grid grid-cols-3 border-t border-border pt-4 text-[9px] font-medium text-muted">
            <span>
              Compliance
              <br />
              Audit
            </span>
            <span className="text-center">
              System
              <br />
              Telemetry
            </span>
            <span className="text-right">
              Security
              <br />
              Desk
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
