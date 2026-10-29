import { FileSpreadsheet, Plus, Sparkles } from "lucide-react";

interface WorkspaceHeroProps {
  gstRate: number;
  clubId?: string;
  onExport: () => void;
  onAiInsights: () => void;
  onRecordPayment: () => void;
}

export default function WorkspaceHero({
  gstRate,
  clubId,
  onExport,
  onAiInsights,
  onRecordPayment,
}: WorkspaceHeroProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          <span>Staff workspace</span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
            Auto GST {gstRate}% Active
          </span>
          {clubId ? <span className="text-muted">ID: {clubId}</span> : null}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#171a33] sm:text-[1.75rem] lg:text-3xl">
          Member Payment Summary & Ledger
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-2 min-[375px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onRecordPayment}
          className="inline-flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover sm:w-auto sm:px-4"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Record payment</span>
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-foreground shadow-sm hover:bg-primary-soft sm:w-auto sm:px-4"
        >
          <FileSpreadsheet className="h-4 w-4 shrink-0" />
          <span className="truncate">Export</span>
          <span className="hidden sm:inline">Statement</span>
        </button>
        <button
          type="button"
          onClick={onAiInsights}
          className="inline-flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-md bg-[#ecebff] px-3 text-sm font-semibold text-primary hover:bg-[#ddd9ff] min-[375px]:col-span-2 sm:w-auto sm:px-4"
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          AI Insights
        </button>
      </div>
    </div>
  );
}
