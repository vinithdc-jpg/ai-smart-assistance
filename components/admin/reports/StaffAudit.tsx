"use client";

import { Search } from "lucide-react";
import { Pagination } from "../Pagination";
import StaffRow from "./StaffRow";
import type { StaffPerformanceRecord } from "@/lib/reportsApi";
import Select from "@/components/motion/select";

export default function StaffAudit({
  staff,
  loading,
  error,
  pagination,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onRetry,
}: {
  staff: StaffPerformanceRecord[];
  loading: boolean;
  error: string;
  pagination: { page: number; total: number; totalPages: number };
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}) {
  return (
    <section className="rounded-md border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Staff Performance & Member Onboarding Audit
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Monitor staff activity, member onboarding and transaction
            performance.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {/* Search Input Container */}
          <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-background px-3 sm:w-52">
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input
              placeholder="Search staff..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Select */}
          <label className="sr-only" htmlFor="staff-report-status">
            Staff status
          </label>
          <Select
            id="staff-report-status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="h-10 w-full rounded-md border-border bg-background px-3 text-xs text-foreground sm:w-40"
          >
            <option value="all">All staff</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
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

      <div className="mt-5 overflow-x-auto">
        <div style={{ minWidth: 850 }}>
          <div className="grid grid-cols-[2fr_1.5fr_.8fr_.8fr_1.2fr_.7fr] rounded-md bg-primary-soft/60 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Staff Member</span>
            <span>Role</span>
            <span>Members</span>
            <span>Transactions</span>
            <span>Transaction Value</span>
            <span>Status</span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="px-4 py-6 text-sm text-slate-400">
                Loading staff details...
              </p>
            ) : error ? (
              <p className="px-4 py-6 text-sm text-slate-500">
                Staff records could not be loaded.
              </p>
            ) : staff.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400">
                No staff details found.
              </p>
            ) : (
              staff.map((person) => (
                <StaffRow
                  key={person.id}
                  name={`${person.first_name} ${person.last_name}`.trim()}
                  email={person.email}
                  role={person.role}
                  members={Number(person.onboarded_members)}
                  transactions={Number(person.transactions_count)}
                  amount={formatCurrency(Number(person.transaction_value))}
                  status={person.status}
                  color={
                    person.status === "active"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-600"
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      {!loading && !error && pagination.total > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {pagination.total.toLocaleString("en-IN")} staff records
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
