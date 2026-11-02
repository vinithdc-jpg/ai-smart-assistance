"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import type { Transaction } from "@/types/member";
import { formatCurrency, formatMoney } from "./money";
import PageNavigation from "@/components/ui/PageNavigation";

interface TransactionHistoryProps {
  transactions: Transaction[];
  page: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  gstRate?: number;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onPageChange: (page: number, filter: StatusFilter, query: string) => void;
}

type StatusFilter = "all" | "Completed" | "Partial" | "Pending";

export default function TransactionHistory({
  transactions,
  page,
  totalPages,
  totalCount,
  loading,
  gstRate = 18,
  onEdit,
  onDelete,
  onPageChange,
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    [],
  );

  const pageRows = transactions;
  const totals = transactions.reduce(
    (acc, item) => {
      acc.base += item.amountExcludingGst ?? item.amount;
      acc.gst += item.gstAmount ?? 0;
      acc.total += item.totalWithGst ?? item.amount;
      acc.received += item.received;
      acc.pending += item.balance;
      return acc;
    },
    { base: 0, gst: 0, total: 0, received: 0, pending: 0 },
  );

  return (
    <section
      id="ledger-entries"
      aria-busy={loading}
      className="min-w-0 w-full rounded-md border border-border bg-white p-3 shadow-[0_12px_40px_rgba(31,35,80,0.06)] sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex h-10 items-center gap-1 overflow-x-auto rounded-full bg-[#f4f5ff] p-1 text-sm">
          {(
            [
              [
                "all",
                filter === "all" ? `All Entries (${totalCount})` : "All Entries",
              ],
              ["Completed", "Completed"],
              ["Partial", "Partial"],
              ["Pending", "Pending"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                if (searchTimer.current) clearTimeout(searchTimer.current);
                setFilter(value);
                onPageChange(1, value, query);
              }}
              className={`h-8 shrink-0 rounded-full px-2.5 text-xs font-medium sm:px-3 sm:text-sm ${
                filter === value
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted"
              }`}
            >
              <span className="sm:hidden">
                {value === "all"
                  ? filter === "all"
                    ? `All (${totalCount})`
                    : "All"
                  : value}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full shrink-0 xl:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(
                () => onPageChange(1, filter, nextQuery),
                300,
              );
            }}
            placeholder="Search slip or amt..."
            aria-label="Search transactions by slip number, amount, or date"
            className="member-search-input h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/70 focus:ring-4 focus:ring-ring/20 focus-visible:outline-none"
          />
        </div>
      </div>

      <div className="hidden min-w-0 max-w-full overflow-x-auto overscroll-x-contain lg:block">
        <table className="w-full min-w-[1100px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[11%]" />
            <col className="w-[12%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Slip No</th>
              <th className="px-3 py-3 text-right">Base Amount</th>
              <th className="px-3 py-3 text-right">GST ({gstRate}%)</th>
              <th className="px-3 py-3 text-right">Total (With GST)</th>
              <th className="px-3 py-3 text-right">Received</th>
              <th className="px-3 py-3 text-right">Pending</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading
              ? Array.from({ length: 10 }, (_, index) => (
                  <tr
                    key={`transaction-skeleton-${index}`}
                    className="animate-pulse border-t border-border"
                    aria-hidden="true"
                  >
                    {Array.from({ length: 9 }, (_, cellIndex) => (
                      <td key={cellIndex} className="px-3 py-4">
                        <div className="h-4 rounded bg-slate-200" />
                      </td>
                    ))}
                  </tr>
                ))
              : pageRows.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-t border-border hover:bg-[#f7f8ff]"
              >
                <td className="break-words px-3 py-3.5 text-muted">
                  {transaction.date}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 font-mono font-semibold text-primary">
                  {transaction.slipNo}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right">
                  {formatMoney(
                    transaction.amountExcludingGst ?? transaction.amount,
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right text-muted">
                  {formatMoney(transaction.gstAmount ?? 0)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-emerald-600">
                  {formatMoney(transaction.totalWithGst ?? transaction.amount)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-emerald-600">
                  {formatMoney(transaction.received)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-violet-600">
                  {formatMoney(transaction.balance)}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      transaction.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : transaction.status === "Partial"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit?.(transaction)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-primary-soft hover:text-primary"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete?.(transaction)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              ))}
          </tbody>
          {transactions.length > 0 && !loading ? (
            <tfoot>
              <tr className="border-t border-border bg-[#f6f7ff] text-sm font-semibold">
                <td className="px-3 py-3" colSpan={2}>
                  Page Summary ({transactions.length} Vouchers)
                </td>
                <td className="px-3 py-3 text-right">
                  {formatCurrency(totals.base, 0)}
                </td>
                <td className="px-3 py-3 text-right">
                  {formatCurrency(totals.gst, 0)}
                </td>
                <td className="px-3 py-3 text-right text-emerald-600">
                  {formatCurrency(totals.total, 0)}
                </td>
                <td className="px-3 py-3 text-right text-emerald-600">
                  {formatCurrency(totals.received, 0)}
                </td>
                <td className="px-3 py-3 text-right text-violet-600">
                  {formatCurrency(totals.pending, 0)}
                </td>
                <td
                  className="px-3 py-3 text-xs font-medium text-emerald-600"
                  colSpan={2}
                >
                  Balanced to Registry
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {loading
          ? Array.from({ length: 10 }, (_, index) => (
              <div
                key={`transaction-card-skeleton-${index}`}
                className="animate-pulse rounded-md border border-border bg-[#f7f8ff] p-3"
                aria-hidden="true"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-2/3 space-y-2">
                    <div className="h-4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }, (_, fieldIndex) => (
                    <div key={fieldIndex} className="space-y-1">
                      <div className="h-3 w-12 rounded bg-slate-200" />
                      <div className="h-4 w-20 rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          : pageRows.map((transaction) => (
          <article
            key={transaction.id}
            className="rounded-md border border-border bg-[#f7f8ff] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-semibold text-primary">
                  {transaction.slipNo}
                </p>
                <p className="mt-0.5 text-xs text-muted">{transaction.date}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  transaction.status === "Completed"
                    ? "bg-emerald-50 text-emerald-600"
                    : transaction.status === "Partial"
                      ? "bg-violet-50 text-violet-600"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {transaction.status}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted">Base</dt>
                <dd className="font-semibold">
                  {formatMoney(
                    transaction.amountExcludingGst ?? transaction.amount,
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-muted">GST</dt>
                <dd className="font-semibold">
                  {formatMoney(transaction.gstAmount ?? 0)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Total</dt>
                <dd className="font-semibold text-emerald-600">
                  {formatMoney(transaction.totalWithGst ?? transaction.amount)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Received</dt>
                <dd className="font-semibold text-emerald-600">
                  {formatMoney(transaction.received)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Pending</dt>
                <dd className="font-semibold text-violet-600">
                  {formatMoney(transaction.balance)}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-2">
              <button
                type="button"
                onClick={() => onEdit?.(transaction)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-white hover:text-primary"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(transaction)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
          ))}
        {transactions.length > 0 && !loading ? (
          <div className="rounded-md border border-border bg-[#f6f7ff] p-3 text-sm">
            <p className="font-semibold">
              Page Summary ({transactions.length} Vouchers)
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <p>Total: {formatCurrency(totals.total, 0)}</p>
              <p className="text-emerald-600">
                Received: {formatCurrency(totals.received, 0)}
              </p>
              <p className="text-violet-600">
                Pending: {formatCurrency(totals.pending, 0)}
              </p>
              <p className="text-emerald-600">Balanced to Registry</p>
            </div>
          </div>
        ) : null}
      </div>

      {transactions.length === 0 && !loading ? (
        <div className="py-10 text-center text-sm text-muted">
          No transactions found for this filter.
        </div>
      ) : transactions.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm">
            Showing {(page - 1) * 10 + 1}-
            {Math.min((page - 1) * 10 + transactions.length, totalCount)} of{" "}
            {totalCount}{" "}
            <span className="hidden sm:inline">
              transactions • Ledger Page {page} of {totalPages}
            </span>
            <span className="sm:hidden">
              {" "}
              • Page {page}/{totalPages}
            </span>
          </p>
          <PageNavigation
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => onPageChange(nextPage, filter, query)}
            label="transactions"
          />
        </div>
      ) : null}
    </section>
  );
}
