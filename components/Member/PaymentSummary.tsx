import { CircleCheck, Clock3, FileText, IndianRupee } from "lucide-react";
import type { Member } from "@/types/member";
import { formatCurrency, formatMoney } from "./money";

interface PaymentSummaryProps {
  member: Member;
  transactionCount: number;
}

export default function PaymentSummary({
  member,
  transactionCount,
}: PaymentSummaryProps) {
  const cards = [
    {
      label: "Agreed Total",
      value: formatMoney(member.totalAmount),
      subtext: "Agreed ledger value",
      valueClass: "text-foreground",
      icon: <IndianRupee className="h-4 w-4" />,
      iconClass: "bg-[#eef0ff] text-primary",
    },
    {
      label: "Received",
      value: formatMoney(member.receivedAmount),
      subtext: "Summary processed",
      valueClass: "text-emerald-600",
      icon: <CircleCheck className="h-4 w-4" />,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending Due",
      value: formatCurrency(member.balanceAmount, 2),
      subtext: "Across vouchers",
      valueClass: "text-violet-600",
      icon: <Clock3 className="h-4 w-4" />,
      iconClass: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total Slips",
      value: String(transactionCount),
      subtext: "Logged entries",
      valueClass: "text-foreground",
      icon: <FileText className="h-4 w-4" />,
      iconClass: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex min-h-[96px] flex-col rounded-[20px] border border-border bg-white p-3 shadow-[0_10px_30px_rgba(31,35,80,0.05)] sm:min-h-[118px] sm:p-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              {card.label}
            </span>
            <span className={`rounded-lg p-1.5 ${card.iconClass}`}>{card.icon}</span>
          </div>
          <strong
            className={`mt-2 block truncate text-xl font-bold tracking-tight sm:mt-3 sm:text-2xl ${card.valueClass}`}
          >
            {card.value}
          </strong>
          <p className="mt-auto pt-1 text-xs text-muted">{card.subtext}</p>
        </div>
      ))}
    </section>
  );
}
