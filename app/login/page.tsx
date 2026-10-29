"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, loginUser } from "@/lib/authApi";
import PageLoader from "@/components/PageLoader";
import ThemeToggle from "@/components/ui/ThemeToggle";
import BrandLogo from "@/components/ui/BrandLogo";
import { toast } from "react-toastify";
import useLoginLockout from "@/Function/useLoginLockout";
import {
  ArrowUpRight,
  Check,
  CircleHelp,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";

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
    <main className="login-page-shell backgrouImg relative min-h-dvh overflow-x-hidden overflow-y-auto bg-background px-4 py-4 sm:px-6 sm:py-8 md:py-4">
      <header className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </header>
      <div className="float-soft pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="float-soft pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl [animation-delay:1s]" />

      <div className="relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-2rem)]">
        <div className="page-panel-in grid w-full overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:grid-cols-[0.95fr_1fr] lg:grid-cols-[1.04fr_0.96fr]">
          <section className="login-hero-panel relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#1d4ed8] via-[#4338ca] to-[#312e81] p-6 text-white md:flex lg:p-9">
            <div className="pointer-events-none absolute -left-24 top-28 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-8 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="relative flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/15 shadow-lg shadow-indigo-950/20 backdrop-blur-sm">
                <span className="text-sm font-extrabold tracking-tight text-white">
                  SL
                </span>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                Smart Ledger AI
              </span>
            </div>

            <div className="login-hero-content relative my-8 space-y-5 md:my-6 lg:my-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-blue-50 backdrop-blur-sm sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_10px_rgba(165,243,252,0.8)]" />
                SMART CLUB FINANCE
              </div>
              <div className="space-y-3">
                <h1 className="max-w-lg text-3xl font-semibold leading-[1.12] tracking-tight lg:text-[2.65rem]">
                  Your club finances. Clearer than ever.
                </h1>
                <p className="max-w-md text-sm leading-6 text-blue-50/85 lg:text-[15px]">
                  Manage members, track payments, and uncover financial
                  insights with your AI-powered ledger assistant.
                </p>
              </div>
              <LoginDashboardPreview />
            </div>

            <p className="relative text-xs text-blue-100/75">
              A clearer view of your club, all in one place.
            </p>
          </section>

          <section className="login-form-panel flex flex-col justify-center p-5 sm:p-10">
            <div className="login-mobile-brand mb-6 flex justify-center md:hidden sm:mb-8">
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

function LoginDashboardPreview() {
  return (
    <div
      aria-label="Illustrative Smart Ledger dashboard preview"
      className="login-dashboard-preview relative mt-6 rounded-2xl border border-white/15 bg-[#0b1220]/50 p-3 shadow-[0_20px_50px_rgba(9,12,36,0.28)] backdrop-blur-md sm:p-4"
    >
      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] bg-blue-400/15 blur-2xl login-preview-glow" />
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold text-white/90 sm:text-xs">
            Club overview
          </p>
          <p className="mt-0.5 text-[9px] text-blue-100/55 sm:text-[10px]">
            Illustrative dashboard preview
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/6 px-2 py-1 text-[9px] font-medium text-blue-100/70">
          DEMO DATA
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="login-preview-float rounded-xl border border-white/10 bg-white/[0.07] p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] text-blue-100/65 sm:text-[10px]">
              Total members
            </span>
            <UsersRound className="size-3.5 text-blue-200" aria-hidden="true" />
          </div>
          <p className="mt-1.5 text-lg font-semibold leading-none tracking-tight sm:text-xl">
            248
          </p>
          <p className="mt-1 text-[9px] text-blue-100/55">Sample figure</p>
        </div>
        <div className="login-preview-float-delayed rounded-xl border border-white/10 bg-white/[0.07] p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] text-blue-100/65 sm:text-[10px]">
              Payments received
            </span>
            <WalletCards
              className="size-3.5 text-violet-200"
              aria-hidden="true"
            />
          </div>
          <p className="mt-1.5 text-lg font-semibold leading-none tracking-tight sm:text-xl">
            ₹12,840
          </p>
          <p className="mt-1 text-[9px] text-blue-100/55">Sample figure</p>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-[1.15fr_0.85fr] gap-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[9px] font-medium text-blue-50/85 sm:text-[10px]">
              Payment activity
            </span>
            <span className="flex items-center gap-0.5 text-[8px] text-emerald-200 sm:text-[9px]">
              <ArrowUpRight className="size-3" aria-hidden="true" />
              Sample
            </span>
          </div>
          <svg
            aria-label="Illustrative payment activity chart"
            role="img"
            viewBox="0 0 180 48"
            className="mt-2 h-9 w-full sm:h-11"
            preserveAspectRatio="none"
          >
            <path
              d="M2 39 C18 35 22 36 34 27 S55 32 68 22 S88 28 101 17 S122 23 137 12 S159 17 178 5"
              fill="none"
              stroke="rgba(165,180,252,0.22)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M2 39 C18 35 22 36 34 27 S55 32 68 22 S88 28 101 17 S122 23 137 12 S159 17 178 5"
              fill="none"
              stroke="#a5b4fc"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="178" cy="5" r="3" fill="#c4b5fd" />
          </svg>
          <div className="mt-1 flex items-center justify-between text-[8px] text-blue-100/45">
            <span>Activity trend</span>
            <span>Illustrative</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3">
          <div>
            <p className="text-[9px] font-medium text-blue-50/85 sm:text-[10px]">
              Recent transaction
            </p>
            <p className="mt-2 truncate text-[9px] text-blue-100/60 sm:text-[10px]">
              Sample member
            </p>
            <p className="mt-0.5 text-sm font-semibold sm:text-base">₹2,500</p>
          </div>
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-300/10 px-1.5 py-0.5 text-[8px] font-medium text-emerald-200 sm:text-[9px]">
            <Check className="size-2.5" aria-hidden="true" />
            Demo entry
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-xl border border-violet-200/15 bg-violet-300/8 px-2.5 py-2 sm:px-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-300/15 text-violet-100">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-medium uppercase tracking-wider text-violet-100/60 sm:text-[9px]">
            Ask your AI assistant
          </p>
          <p className="mt-0.5 truncate text-[10px] font-medium text-white/90 sm:text-[11px]">
            “Who has outstanding payments?”
          </p>
        </div>
        <CircleHelp
          className="size-3.5 shrink-0 text-violet-100/60"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
