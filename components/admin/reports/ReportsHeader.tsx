"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Select from "@/components/motion/select";

export default function ReportsHeader({
  activeRange,
  startDate,
  endDate,
  exporting,
  exportError,
  onRangeChange,
  onCustomRange,
  onExport,
}: {
  activeRange: string;
  startDate: string;
  endDate: string;
  exporting: boolean;
  exportError: string;
  onRangeChange: (range: string) => void;
  onCustomRange: (startDate: string, endDate: string) => void;
  onExport: (format: "csv" | "xlsx" | "pdf") => void;
}) {
  const [format, setFormat] = useState<"csv" | "xlsx" | "pdf">("csv");
  const [dateError, setDateError] = useState("");

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Financial Reports & Audit Ledger
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Comprehensive financial insights, staff performance, member
            activity, and transaction audit records.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="report-export-format">
            Export format
          </label>
          <Select
            id="report-export-format"
            value={format}
            onChange={(event) => setFormat(event.target.value as typeof format)}
            className="h-10 w-full rounded-lg border-border bg-background px-3 text-sm text-foreground dark:bg-card"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="pdf">PDF</option>
          </Select>
          <button
            type="button"
            disabled={exporting}
            onClick={() => onExport(format)}
            className="flex h-10 w-full min-w-28 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            <Download size={16} />
            {exporting ? "Preparing..." : "Export"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        {["Today", "Last 7 Days", "Last Month", "This Month", "Custom Range"].map(
            (item) => (
            <button
              type="button"
              key={item}
              onClick={() => onRangeChange(item)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                item === activeRange
                  ? "bg-primary text-white shadow-sm"
                  : "bg-primary-soft text-foreground hover:bg-primary/10"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      {activeRange === "Custom Range" && (
        <form
          key={`${activeRange}-${startDate}-${endDate}`}
          className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const customStartDate = String(formData.get("startDate") || "");
            const customEndDate = String(formData.get("endDate") || "");
            if (!customStartDate || !customEndDate || customStartDate > customEndDate) {
              setDateError("Choose an end date on or after the start date.");
              return;
            }
            setDateError("");
            onCustomRange(customStartDate, customEndDate);
          }}
        >
          <label className="form-floating-field">
            <span className="form-floating-label">Start date</span>
            <input name="startDate" type="date" required defaultValue={startDate} placeholder=" " className="form-floating-input h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground" />
          </label>
          <label className="form-floating-field">
            <span className="form-floating-label">End date</span>
            <input name="endDate" type="date" required defaultValue={endDate} placeholder=" " className="form-floating-input h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground" />
          </label>
          <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover">
            Apply dates
          </button>
        </form>
      )}
      {dateError && <p role="alert" className="mt-2 text-sm text-red-600">{dateError}</p>}
      {exportError && <p role="alert" className="mt-3 text-sm text-red-600">{exportError}</p>}
    </section>
  );
}
