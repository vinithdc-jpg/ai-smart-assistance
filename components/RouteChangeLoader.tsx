"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PageLoader from "@/components/PageLoader";

export default function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
  const isLoading = pendingUrl !== null && pendingUrl !== currentUrl;

  useEffect(() => {
    const startLoading = (nextUrl: string) => {
      if (nextUrl !== `${window.location.pathname}${window.location.search}`) {
        setPendingUrl(nextUrl);
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin) {
        startLoading(`${url.pathname}${url.search}`);
      }
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    const notifyHistoryChange = (url?: string | URL | null) => {
      if (url === null || url === undefined) return;
      const nextUrl = new URL(url.toString(), window.location.href);
      if (nextUrl.origin === window.location.origin) {
        startLoading(`${nextUrl.pathname}${nextUrl.search}`);
      }
    };

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      notifyHistoryChange(args[2]);
      return result;
    };
    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      notifyHistoryChange(args[2]);
      return result;
    };

    const handlePopState = () => {
      startLoading(`${window.location.pathname}${window.location.search}`);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  if (!isLoading) return null;

  return <PageLoader label="Loading page" overlay />;
}