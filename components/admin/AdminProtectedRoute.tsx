"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAdminMe } from "@/lib/adminApi";
import PageLoader from "@/components/PageLoader";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [verificationError, setVerificationError] = useState(false);
  const [checkAttempt, setCheckAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    async function checkAuth() {
      setCheckingAuth(true);
      setVerificationError(false);

      try {
        await getAdminMe(controller.signal);
        if (mounted) {
          setCheckingAuth(false);
        }
      } catch (error) {
        const status = error instanceof Error && "status" in error
          ? (error as Error & { status?: number }).status
          : undefined;

        if (status === 401 || status === 403 || status === 404) {
          router.replace(`/Admin/login?from=${encodeURIComponent(pathname)}`);
        } else if (mounted) {
          setVerificationError(true);
          setCheckingAuth(false);
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    checkAuth();

    return () => {
      mounted = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [checkAttempt, pathname, router]);

  if (checkingAuth) {
    return <PageLoader label="Checking admin session" />;
  }

  if (verificationError) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
        <div>
          <p role="alert" className="text-sm text-muted">
            Unable to verify your admin session. Please try again.
          </p>
          <button
            type="button"
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setCheckAttempt((attempt) => attempt + 1)}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
