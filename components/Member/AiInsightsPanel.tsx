"use client";

import { Sparkles, X } from "lucide-react";
import FormDialog from "@/components/ui/FormDialog";

interface AiInsightsPanelProps {
  isOpen: boolean;
  memberName: string;
  loading: boolean;
  error: string;
  summary: string;
  onClose: () => void;
  onGenerate: () => void;
}

export default function AiInsightsPanel({
  isOpen,
  memberName,
  loading,
  error,
  summary,
  onClose,
  onGenerate,
}: AiInsightsPanelProps) {
  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="AI member summary"
      className="max-w-xl"
    >
      <section className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">AI Summary</h2>
              <p className="mt-0.5 truncate text-sm text-muted">
                {memberName}&apos;s payment history
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close AI summary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 min-h-32 rounded-md border border-border bg-background p-4">
          {loading ? (
            <div
              className="space-y-3"
              role="status"
              aria-label="Generating AI summary"
              aria-busy="true"
            >
              <div className="h-4 w-4/5 animate-pulse rounded-md bg-muted" />
              <div className="h-4 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-11/12 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
            </div>
          ) : error ? (
            <div className="space-y-3">
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600"
              >
                {error}
              </p>
              <button
                type="button"
                onClick={onGenerate}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Try again
              </button>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/80">
              {summary}
            </p>
          )}
        </div>
      </section>
    </FormDialog>
  );
}
