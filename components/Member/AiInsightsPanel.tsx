"use client";

interface AiInsightsPanelProps {
  loading: boolean;
  error: string;
  summary: string;
  onGenerate: () => void;
}

export default function AiInsightsPanel({
  loading,
  error,
  summary,
  onGenerate,
}: AiInsightsPanelProps) {
  return (
    <section
      id="ai-insights"
      className="rounded-3xl border border-border bg-white p-5 shadow-[0_12px_40px_rgba(31,35,80,0.06)]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">AI Insights</h2>
          <p className="text-xs text-muted">
            Generate a concise explanation from this member&apos;s payment history.
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Generating..." : "Generate summary"}
        </button>
      </div>
      {error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
      {summary ? (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/80">
          {summary}
        </p>
      ) : null}
    </section>
  );
}
