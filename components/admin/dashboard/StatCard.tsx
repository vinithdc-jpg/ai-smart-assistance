import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
}) {
  return (
    <div className="flex min-h-32 items-center justify-between gap-4 rounded-lg border border-border bg-white p-5 transition-colors hover:border-slate-300">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
        </p>
        <p className="mt-3 text-3xl font-semibold tabular-nums text-foreground">
          {value.toLocaleString()}
        </p>
      </div>
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-lg ${iconBackgroundClassName}`}
      >
        <Icon aria-hidden="true" className={`size-5 ${iconClassName}`} />
      </span>
    </div>
  );
}
