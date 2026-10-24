"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import TransactionRow from "./TransactionRow";
import Select from "@/components/motion/select";
import { Pagination } from "../Pagination";
import type { TransactionRecord } from "@/lib/reportsApi";
import type { ReportFilters, StaffPerformanceRecord } from "@/lib/reportsApi";
import { formatTransactionDateTime } from "@/components/Member/money";

export default function TransactionRecords({
  transactions,
  loading,
  error,
  pagination,
  search,
  onSearchChange,
  staffOptions,
  filters,
  onFilterChange,
  onPageChange,
  onRetry,
}: {
  transactions: TransactionRecord[];
  loading: boolean;
  error: string;
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    limit?: number;
  };
  search: string;
  onSearchChange: (value: string) => void;
  staffOptions: Pick<
    StaffPerformanceRecord,
    "id" | "first_name" | "last_name"
  >[];
  filters: ReportFilters;
  onFilterChange: (name: "staffId" | "status" | "type", value: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionRecord | null>(null);

  useEffect(() => {
    if (!selectedTransaction) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTransaction(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedTransaction]);

  const firstRecord =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * (pagination.limit || 8) + 1;
  const lastRecord = Math.min(
    pagination.page * (pagination.limit || 8),
    pagination.total,
  );

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Detailed Transaction Records
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Complete transaction history and audit information.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 md:col-span-2">
          <Search size={15} className="text-slate-400" />

          <input
            placeholder="Search transactions by the name..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full text-xs outline-none placeholder:text-slate-400"
          />
        </div>

        <Select
          value={filters.type || "all"}
          onChange={(event) => onFilterChange("type", event.target.value)}
          className="h-10 rounded-lg px-3 text-xs"
        >
          <option value="all">All Types</option>
          <option value="membership">Membership</option>
          <option value="amc">AMC</option>
          <option value="service">Service</option>
        </Select>

        <Select
          value={filters.status || "all"}
          onChange={(event) => onFilterChange("status", event.target.value)}
          className="h-10 rounded-lg px-3 text-xs"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
        </Select>

        <Select
          value={filters.staffId || "all"}
          onChange={(event) => onFilterChange("staffId", event.target.value)}
          className="h-10 rounded-lg px-3 text-xs"
        >
          <option value="all">All Staff</option>
          {staffOptions.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.first_name} {staff.last_name}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <div style={{ minWidth: 1020 }}>
          <div className="grid grid-cols-[1.2fr_1.3fr_1fr_1.2fr_1fr_.8fr_auto] gap-2 rounded-lg bg-[#f5f7ff] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Transaction</span>
            <span>Member</span>
            <span>Type</span>
            <span>Processed By</span>
            <span>Revenue</span>
            <span>Status</span>
            <span>View</span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="px-4 py-6 text-sm text-slate-400">
                Loading transaction details...
              </p>
            ) : error ? (
              <p className="px-4 py-6 text-sm text-slate-500">
                Transaction records could not be loaded.
              </p>
            ) : transactions.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400">
                No transactions found.
              </p>
            ) : (
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  id={transaction.slip_no || transaction.id}
                  createdDate={transaction.created_date}
                  member={
                    `${transaction.member_first_name || ""} ${transaction.member_last_name || ""}`.trim() ||
                    "Unknown member"
                  }
                  type={transaction.types || "Unknown"}
                  staff={
                    `${transaction.staff_first_name || ""} ${transaction.staff_last_name || ""}`.trim() ||
                    "Unassigned"
                  }
                  amount={formatCurrency(
                    Number(
                      transaction.total_amount_with_gst ||
                        transaction.debit_amount ||
                        0,
                    ),
                  )}
                  status={formatStatus(transaction.payment_status)}
                  onView={() => setSelectedTransaction(transaction)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500" aria-live="polite">
          Showing {firstRecord.toLocaleString("en-IN")}–
          {lastRecord.toLocaleString("en-IN")} of{" "}
          {pagination.total.toLocaleString("en-IN")} transactions
        </p>
        {!loading && !error && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>

      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </section>
  );
}

function TransactionDetails({
  transaction,
  onClose,
}: {
  transaction: TransactionRecord;
  onClose: () => void;
}) {
  const member =
    `${transaction.member_first_name || ""} ${transaction.member_last_name || ""}`.trim() ||
    "Unknown member";
  const staff =
    `${transaction.staff_first_name || ""} ${transaction.staff_last_name || ""}`.trim() ||
    "Unassigned";
  const details = [
    ["Transaction ID", transaction.id],
    ["Receipt", transaction.slip_no || "Not provided"],
    ["Invoice", transaction.invoice_no || "Not provided"],
    [
      "Transaction date",
      formatTransactionDateTime(
        transaction.amount_taken_date || transaction.created_date,
      ),
    ],
    ["Member", member],
    ["Member number", transaction.member_number || "Not provided"],
    [
      "Member contact",
      [transaction.member_email, transaction.member_phone]
        .filter(Boolean)
        .join(" · ") || "Not provided",
    ],
    ["Processed by", staff],
    ["Type", transaction.types || "Unknown"],
    ["Payment method", transaction.payment_method || "Not provided"],
    [
      "Revenue",
      formatCurrency(
        Number(
          transaction.total_amount_with_gst || transaction.debit_amount || 0,
        ),
      ),
    ],
    ["Received", formatCurrency(Number(transaction.received_amount || 0))],
    ["Pending", formatCurrency(Number(transaction.balance_amount || 0))],
    ["Status", formatStatus(transaction.payment_status)],
    ["Remarks", transaction.remarks || "No remarks"],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-detail-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3
              id="transaction-detail-title"
              className="text-lg font-bold text-slate-900"
            >
              Transaction details
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {transaction.slip_no || transaction.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close transaction details"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </header>
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div
              key={label}
              className={label === "Remarks" ? "sm:col-span-2" : ""}
            >
              <dt className="text-[11px] font-semibold uppercase text-slate-400">
                {label}
              </dt>
              <dd className="mt-1 wrap-break-word text-sm text-slate-800">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatStatus(value: string | null) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown";
}
