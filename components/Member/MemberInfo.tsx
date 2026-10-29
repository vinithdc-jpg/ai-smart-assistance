import { Mail, Phone, CalendarDays, MoreHorizontal, Trash2 } from "lucide-react";
import type { Member } from "@/types/member";
import {
  formatCurrency as formatFixedCurrency,
  formatMoney,
  memberInitials,
} from "./money";

interface MemberInfoProps {
  member: Member;
  formatCurrency?: (amount: number) => string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MemberInfo({
  member,
  formatCurrency = formatMoney,
  onEdit,
  onDelete,
}: MemberInfoProps) {
  const realization =
    member.totalAmount > 0
      ? Math.min(100, (member.receivedAmount / member.totalAmount) * 100)
      : 0;
  const status = (member.status || "active").toLowerCase();

  return (
    <section className="rounded-md border border-border bg-white p-4 shadow-[0_12px_40px_rgba(31,35,80,0.06)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4f46e5] text-sm font-bold text-white">
            {memberInitials(member.name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-foreground">
                {member.name}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  status === "active"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-xs text-muted">ID: {member.id}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-primary-soft hover:text-primary"
              title="Edit member"
              aria-label="Edit member"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
              title="Delete member"
              aria-label="Delete member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-[auto_1fr] sm:items-center">
        <span className="flex items-center gap-2 text-muted">
          <Mail className="h-4 w-4 shrink-0" /> Email
        </span>
        <strong className="truncate font-medium sm:text-right">
          {member.email || "Not available"}
        </strong>
        <span className="flex items-center gap-2 text-muted">
          <Phone className="h-4 w-4 shrink-0" /> Phone
        </span>
        <strong className="font-medium sm:text-right">
          {member.phone || "Not available"}
        </strong>
        <span className="flex items-center gap-2 text-muted">
          <CalendarDays className="h-4 w-4 shrink-0" /> Member Since
        </span>
        <strong className="font-medium sm:text-right">
          {member.memberSince || "—"}
        </strong>
      </div>

      <div className="mt-5 rounded-md bg-[#f6f7ff] p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-muted">Collection Realization</span>
          <span className="font-semibold text-emerald-600">
            {realization.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-500"
            style={{ width: `${realization}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>Settled: {formatCurrency(member.receivedAmount)}</span>
          <span>Due: {formatFixedCurrency(member.balanceAmount, 2)}</span>
        </div>
      </div>
    </section>
  );
}
