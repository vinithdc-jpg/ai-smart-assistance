"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/authApi";
import PageLoader from "@/components/PageLoader";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        await getCurrentUser();
        if (mounted) {
          setCheckingAuth(false);
        }
      } catch (error) {
        const status = error instanceof Error && "status" in error
          ? (error as Error & { status?: number }).status
          : undefined;

        if (status === 401 || status === 403 || status === 404) {
          router.replace(`/login?from=${encodeURIComponent(pathname)}`);
        } else if (mounted) {
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (checkingAuth) {
    return <PageLoader label="Checking your session" />;
  }

  return children;
}
