import {
  CreditCard,
  DollarSign,
  CircleDollarSign,
  Users,
  Building2,
} from "lucide-react";

import StatCard2 from "./StatCard2";
import type { ReportStats } from "@/lib/reportsApi";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function StatCards({
  stats,
  loading,
  error,
  onRetry,
}: {
  stats: ReportStats;
  loading: boolean;
  error: string;
  onRetry: () => void;
}) {
  const cards = [
    { title: "Revenue", value: formatCurrency(stats.totalRevenue), description: "Total billed in selected period", icon: <DollarSign size={18} /> },
    { title: "Received", value: formatCurrency(stats.totalReceived), description: "Payments received in selected period", icon: <CircleDollarSign size={18} /> },
    { title: "Pending", value: formatCurrency(stats.totalPending), description: "Outstanding balance in selected period", icon: <CreditCard size={18} /> },
    { title: "Members", value: stats.totalMembers.toLocaleString("en-IN"), description: "Members added in selected period", icon: <Users size={18} /> },
    { title: "Active Staff", value: stats.activeStaff.toLocaleString("en-IN"), description: "Currently active staff", icon: <CreditCard size={18} /> },
    { title: "Active Clubs", value: stats.totalClubs.toLocaleString("en-IN"), description: "Currently active clubs", icon: <Building2 size={18} /> },
  ];

  if (error) {
    return (
      <section role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>Unable to load report metrics. {error}</span>
          <button type="button" onClick={onRetry} className="font-semibold underline">Retry</button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section aria-label="Loading report metrics" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => <div key={card.title} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />)}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((stat) => (
        <StatCard2
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </section>
  );
}
