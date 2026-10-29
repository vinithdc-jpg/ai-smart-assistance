"use client";

import { FileText, X } from "lucide-react";
import type { Transaction } from "@/types/member";
import { formatCurrency } from "./money";
import Select from "@/components/motion/select";

export type TransactionFormState = {
  date: string;
  amount: string;
  receivedAmount: string;
  slipNo: string;
  invoiceNo: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionType: string;
  remarks: string;
};

interface TransactionFormProps {
  form: TransactionFormState;
  editingTransaction: Transaction | null;
  memberName: string;
  gstRate: number;
  amountExcludingGst: number;
  cgstAmount: number;
  sgstAmount: number;
  totalAmountWithGst: number;
  previousPaidVal: number;
  currentEnteredPayVal: number;
  newEffectiveReceived: number;
  currentPendingBalance: number;
  error: string;
  loading: boolean;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const fieldClass =
  "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm leading-none text-foreground outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "flex min-h-[16px] items-center text-muted";
const removeScroll =
  "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export default function TransactionForm({
  form,
  editingTransaction,
  memberName,
  gstRate,
  amountExcludingGst,
  cgstAmount,
  sgstAmount,
  totalAmountWithGst,
  previousPaidVal,
  currentEnteredPayVal,
  newEffectiveReceived,
  currentPendingBalance,
  error,
  loading,
  onChange,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-white p-4 shadow-[0_12px_40px_rgba(31,35,80,0.06)] sm:p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-snug lg:text-lg">
              {editingTransaction
                ? "Edit Transaction & GST Ledger Entry"
                : "New Transaction & GST Ledger Entry"}
            </h2>
            <p className="hidden text-xs text-muted sm:block">
              Post real-time journal entry for {memberName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid items-end gap-4 sm:grid-cols-3">
        <label className="form-floating-field">
          <span className="form-floating-label">Total Amount (₹)</span>
          <input
            required
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={onChange}
            disabled={Boolean(editingTransaction)}
            className={`${fieldClass} ${removeScroll} form-floating-input`}
            placeholder=" "
          />
        </label>
        <label className="form-floating-field">
          <span className="form-floating-label">
            {editingTransaction ? "Additional Payment (₹)" : "Received Amount (₹)"}
          </span>
          <input
            required
            name="receivedAmount"
            type="number"
            min="0"
            step="0.01"
            value={form.receivedAmount}
            onChange={onChange}
            className={`${fieldClass} ${removeScroll} form-floating-input`}
            placeholder=" "
          />
        </label>
        <label className="space-y-1 text-xs font-medium hidden">
          <span className={labelClass}>Slip No</span>
          <input
            disabled
            name="slipNo"
            type="text"
            value={
              editingTransaction ? form.slipNo : "Auto-generated (e.g. SL-001)"
            }
            className={`${fieldClass} cursor-not-allowed font-mono text-muted`}
          />
        </label>
        <label className="form-floating-field">
          <span className="form-floating-label">Invoice No (Optional)</span>
          <input
            name="invoiceNo"
            type="text"
            value={form.invoiceNo}
            onChange={onChange}
            disabled={Boolean(editingTransaction)}
            className={`${fieldClass} form-floating-input`}
            placeholder=" "
          />
        </label>
        <label className="space-y-1 text-xs font-medium">
          <span className={labelClass}>Payment Method</span>
          <Select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={onChange}
            className="h-11"
          >
            <option value="cash">Cash Deposit</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
          </Select>
        </label>
        <label className="space-y-1 text-xs font-medium">
          <span className={labelClass}>Category Type</span>
          <Select
            name="transactionType"
            value={form.transactionType}
            onChange={onChange}
            disabled={Boolean(editingTransaction)}
            className="h-11"
          >
            <option value="membership">Membership Subscription</option>
            <option value="amc">AMC</option>
            <option value="other">Other</option>
          </Select>
        </label>
        <label className="form-floating-field sm:col-span-2">
          <span className="form-floating-label">Remarks / Ledger Annotation</span>
          <input
            name="remarks"
            type="text"
            value={form.remarks}
            onChange={onChange}
            className={`${fieldClass} form-floating-input`}
            placeholder=" "
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-[#ecebff] bg-[#f7f6ff] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-primary">
              <FileText className="h-3.5 w-3.5" />
            </span>
            {editingTransaction
              ? "Payment & Pending Calculation"
              : "Automated GST Compliance Calculation"}
          </span>
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Configured Tax: {gstRate}%
          </span>
        </div>

        {editingTransaction ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <GstBox label="Total (With GST)" value={totalAmountWithGst} />
            <GstBox
              label="Previously Paid"
              value={previousPaidVal}
              tone="blue"
            />
            <GstBox
              label="New Payment"
              value={currentEnteredPayVal}
              tone="green"
            />
            <GstBox
              label="Updated Received"
              value={newEffectiveReceived}
              tone="green"
            />
            <GstBox
              label="Remaining Pending"
              value={currentPendingBalance}
              tone={currentPendingBalance > 0 ? "amber" : "green"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <GstBox label="Base Amount" value={amountExcludingGst} />
            <GstBox
              label={`CGST (${(gstRate / 2).toFixed(1)}%)`}
              value={cgstAmount}
            />
            <GstBox
              label={`SGST (${(gstRate / 2).toFixed(1)}%)`}
              value={sgstAmount}
            />
            <GstBox label="Total (inc. GST)" value={totalAmountWithGst} />
            <GstBox
              label="Pending Balance"
              value={currentPendingBalance}
              tone={currentPendingBalance > 0 ? "green" : "green"}
              highlight
            />
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-2xl px-4 text-sm font-semibold text-muted hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-2xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : editingTransaction
              ? "Save Ledger Transaction"
              : "Commit Ledger Transaction"}
        </button>
      </div>
    </form>
  );
}

function GstBox({
  label,
  value,
  tone,
  highlight,
}: {
  label: string;
  value: number;
  tone?: "blue" | "green" | "amber";
  highlight?: boolean;
}) {
  const toneClass =
    tone === "green"
      ? "text-emerald-600"
      : tone === "amber"
        ? "text-amber-600"
        : tone === "blue"
          ? "text-sky-600"
          : "text-foreground";
  return (
    <div
      className={`flex min-h-19 min-w-0 flex-col justify-center rounded-2xl border p-3 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-border bg-white"
      }`}
    >
      <p className="break-words text-[11px] text-muted">{label}</p>
      <p className={`mt-1 break-words text-xs font-semibold sm:text-sm ${toneClass}`}>
        {formatCurrency(value, 2)}
      </p>
    </div>
  );
}
