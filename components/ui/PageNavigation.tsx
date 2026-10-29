"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageNavigationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export default function PageNavigation({
  page,
  totalPages,
  onPageChange,
  label = "table",
}: PageNavigationProps) {
  if (totalPages <= 1) return null;

  const firstVisiblePage = Math.max(
    1,
    Math.min(page - 1, totalPages - 2),
  );
  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => firstVisiblePage + index,
  );

  return (
    <nav
      aria-label={`${label} pages`}
      className="flex items-center justify-center gap-1.5 text-sm text-foreground sm:gap-2"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex h-10 items-center gap-1 rounded-md px-2 font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span>Previous</span>
      </button>

      <div className="flex items-center gap-1.5">
        {firstVisiblePage > 1 ? (
          <>
            <button
              type="button"
              aria-label="Page 1"
              onClick={() => onPageChange(1)}
              className="h-10 min-w-10 rounded-md border border-transparent px-3 font-medium text-foreground transition hover:border-border hover:bg-accent"
            >
              1
            </button>
            <span className="px-1 font-semibold text-muted" aria-hidden="true">
              ...
            </span>
          </>
        ) : null}
        {visiblePages.map((visiblePage) => (
          <button
            key={visiblePage}
            type="button"
            aria-current={visiblePage === page ? "page" : undefined}
            aria-label={`Page ${visiblePage}`}
            onClick={() => onPageChange(visiblePage)}
            className={`h-10 min-w-10 rounded-md border px-3 font-medium transition ${
              visiblePage === page
                ? "border-border bg-accent text-foreground"
                : "border-transparent text-foreground hover:border-border hover:bg-accent"
            }`}
          >
            {visiblePage}
          </button>
        ))}
        {firstVisiblePage + visiblePages.length <= totalPages ? (
          <span className="px-1 font-semibold text-muted" aria-hidden="true">
            ...
          </span>
        ) : null}
      </div>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex h-10 items-center gap-1 rounded-md px-2 font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
