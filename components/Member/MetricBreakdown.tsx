import type { Member } from "@/types/member";
import { formatMoney } from "./money";

interface MetricBreakdownProps {
  member: Member;
  onViewHistory?: () => void;
  onAddNote?: () => void;
}

export default function MetricBreakdown({
  member,
  onViewHistory,
  onAddNote,
}: MetricBreakdownProps) {
  const realization =
    member.totalAmount > 0
      ? Math.min(100, (member.receivedAmount / member.totalAmount) * 100)
      : 0;
  const standing = realization >= 80 ? "Optimal" : realization >= 50 ? "Watch" : "At Risk";

  const rows = [
    {
      dimension: "Total Invoiced",
      value: formatMoney(member.totalAmount),
      status: "Agreed",
      statusClass: "bg-slate-100 text-slate-600",
    },
    {
      dimension: "Realized Capital",
      value: formatMoney(member.receivedAmount),
      status: `${realization.toFixed(1)}% Settled`,
      statusClass: "bg-emerald-50 text-emerald-600",
    },
    {
      dimension: "Unsettled Balance",
      value: formatMoney(member.balanceAmount),
      status: member.balanceAmount > 0 ? "In Flight" : "Cleared",
      statusClass:
        member.balanceAmount > 0
          ? "bg-violet-50 text-violet-600"
          : "bg-emerald-50 text-emerald-600",
    },
    {
      dimension: "Account Standing",
      value: standing === "Optimal" ? "Good Tier" : standing,
      status: standing,
      statusClass:
        standing === "Optimal"
          ? "bg-emerald-50 text-emerald-600"
          : standing === "Watch"
            ? "bg-amber-50 text-amber-600"
            : "bg-red-50 text-red-600",
    },
  ];

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-[0_12px_40px_rgba(31,35,80,0.06)]">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        2. Structured Metric Breakdown
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-[#f6f7ff] text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="w-[44%] px-4 py-2.5 font-semibold">Metric Dimension</th>
              <th className="w-[28%] px-4 py-2.5 font-semibold">Value</th>
              <th className="w-[28%] px-4 py-2.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.dimension} className="border-t border-border">
                <td className="px-4 py-2.5 text-muted">{row.dimension}</td>
                <td className="px-4 py-2.5 font-semibold">{row.value}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${row.statusClass}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onViewHistory}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View Ledger History
        </button>
        <button
          type="button"
          onClick={onAddNote}
          className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-soft"
        >
          + Add Note
        </button>
      </div>
    </section>
  );
}
