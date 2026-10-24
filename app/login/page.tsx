"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, loginUser } from "@/lib/authApi";
import PageLoader from "@/components/PageLoader";
import ThemeToggle from "@/components/ui/ThemeToggle";
import BrandLogo from "@/components/ui/BrandLogo";
import { toast } from "react-toastify";
import useLoginLockout from "@/Function/useLoginLockout";

export default function LoginPage() {
  const router = useRouter();

  const [clubId, setClubId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const {
    remainingSeconds,
    getCurrentLockoutSeconds,
    recordFailedAttempt,
    resetAttempts,
  } = useLoginLockout("staff", `${clubId}:${email}`);

  useEffect(() => {
    let mounted = true;

    async function redirectAuthenticatedUser() {
      try {
        await getCurrentUser();
        if (!mounted) return;

        const from = new URLSearchParams(window.location.search).get("from");
        const returnPath =
          from && from.startsWith("/") && !from.startsWith("//")
            ? from
            : "/ai-chat";
        router.replace(returnPath);
      } catch {
        if (mounted) setCheckingSession(false);
      }
    }

    void redirectAuthenticatedUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checkingSession) {
    return <PageLoader label="Checking your session" />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (getCurrentLockoutSeconds() > 0) return;

    setLoading(true);

    try {
      await loginUser({ clubId, email, password });
      resetAttempts();
      const from = new URLSearchParams(window.location.search).get("from");
      const returnPath =
        from && from.startsWith("/") && !from.startsWith("//")
          ? from
          : "/ai-chat";
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
          : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="backgrouImg relative min-h-dvh overflow-x-hidden overflow-y-auto bg-background px-4 py-4 sm:px-6 sm:py-8">
      <header className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </header>
      <div className="float-soft pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="float-soft pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl [animation-delay:1s]" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-5xl items-center justify-center sm:min-h-[calc(100dvh-4rem)]">
        <div className="page-panel-in grid w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.28)] lg:grid-cols-[1.05fr_1fr]">
          <section className="hidden flex-col justify-between bg-linear-to-br from-primary to-indigo-500 p-10 text-white lg:flex">
            <div className="flex items-center gap-3">
              <div className="button-smooth relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary/90 to-primary/70 shadow-lg shadow-primary/25 ring-1 ring-white/20">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  SL
                </span>

                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Smart Ledger AI
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                Member insights, payments, and chat in one place.
              </h1>
              <p className="max-w-sm text-sm leading-6 text-white/80">
                Sign in to ask ledger questions, look up members, and review
                payment summaries with a clean staff workspace.
              </p>
            </div>
            <p className="text-xs text-white/70">Staff portal access only</p>
          </section>

          <section className="flex flex-col justify-center p-5 sm:p-10">
            <div className="mb-6 flex justify-center lg:hidden sm:mb-8">
              <BrandLogo className="w-40" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Staff Login
              </h2>
              <p className="text-sm text-muted">
                Enter your details to access your portal account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-8">
              <label htmlFor="clubId" className="form-floating-field">
                <span className="form-floating-label">
                  Club ID
                </span>
                <input
                  id="clubId"
                  name="clubId"
                  type="text"
                  value={clubId}
                  onChange={(event) => setClubId(event.target.value)}
                  placeholder=" "
                  className="form-floating-input h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted/70 transition-all duration-200 ease-out hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/60"
                  required
                />
              </label>

              <label htmlFor="email" className="form-floating-field">
                <span className="form-floating-label">
                  Email address
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder=" "
                  className="form-floating-input h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted/70 transition-all duration-200 ease-out hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/60"
                  required
                />
              </label>

              <label htmlFor="password" className="form-floating-field">
                <span className="form-floating-label">
                  Password
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder=" "
                  className="form-floating-input h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted/70 transition-all duration-200 ease-out hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-ring/60"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={loading || remainingSeconds > 0}
                className="button-smooth mt-2 flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-[0_10px_24px_rgba(93,95,239,0.28)] hover:bg-primary-hover hover:shadow-[0_16px_30px_rgba(93,95,239,0.32)] focus:outline-none focus:ring-4 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : remainingSeconds > 0 ? (
                  `Try again in ${remainingSeconds}s`
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => router.push("/Admin/login")}
                className="text-xs font-medium text-primary transition-colors duration-200 ease-out hover:-translate-y-0.5 hover:text-primary-hover focus:outline-none"
              >
                Admin Login &rarr;
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
