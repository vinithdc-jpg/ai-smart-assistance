import type { ApiTransaction } from "@/lib/transactionsApi";
import { Pagination } from "@/components/admin/Pagination";
import { formatTransactionDateTime } from "@/components/Member/money";
import { ActionIconButton } from "@/components/admin/ActionIconButton";
import { Search } from "lucide-react";
import DatePicker from "@/components/Member/DatePicker";
import Select from "@/components/motion/select";

const editFieldClass =
  "mt-1 h-10 w-full rounded-xl border border-border bg-[#f7f8ff] px-3 text-sm text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary focus:bg-white focus:ring-4 focus:ring-ring/40";

export function TransactionsOverview({
  transactionClubFilter,
  loadingTransactions,
  transactions,
  page,
  totalPages,
  onPageChange,
  onFilterChange,
  editingTransaction,
  transactionForm,
  editLoading,
  editError,
  onEdit,
  onFormChange,
  onEditSubmit,
  onCancelEdit,
}: {
  transactionClubFilter: string;
  onFilterChange: (value: string) => void;
  loadingTransactions: boolean;
  transactions: ApiTransaction[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  editingTransaction: ApiTransaction | null;
  transactionForm: {
    receivedAmount: string;
    paymentMethod: string;
    remarks: string;
    date: string;
  };
  editLoading: boolean;
  editError: string;
  onEdit: (transaction: ApiTransaction) => void;
  onFormChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onEditSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
}) {
  return (
    <div className="space-y-4">
      {editingTransaction && (
        <form
          id="admin-transaction-edit-form"
          onSubmit={onEditSubmit}
          className="rounded-2xl border border-border bg-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Edit Transaction
              </h2>
              <p className="text-sm text-muted">
                Update payment details for {editingTransaction.id}.
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <label className="text-sm font-medium text-muted">
              Date
              <DatePicker
                name="date"
                value={transactionForm.date}
                onChange={onFormChange}
                className={editFieldClass}
              />
            </label>
            <label className="form-floating-field">
              <span className="form-floating-label">Received amount</span>
              <input
                required
                min="0"
                step="0.01"
                name="receivedAmount"
                type="number"
                value={transactionForm.receivedAmount}
                placeholder=" "
                onChange={onFormChange}
                onWheel={(e) => e.currentTarget.blur()}
                className={`${editFieldClass} form-floating-input`}
              />
            </label>
            <label className="text-sm font-medium text-muted">
              Payment method
              <Select
                name="paymentMethod"
                value={transactionForm.paymentMethod}
                onChange={onFormChange}
                className={editFieldClass}
              >
                <option value="cash">Cash Deposit</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
              </Select>
            </label>
            <label className="form-floating-field">
              <span className="form-floating-label">Remarks</span>
              <input
                name="remarks"
                value={transactionForm.remarks}
                placeholder=" "
                onChange={onFormChange}
                className={`${editFieldClass} form-floating-input`}
              />
            </label>
          </div>
          {editError && (
            <p className="mt-3 text-sm text-red-600">{editError}</p>
          )}
          <button
            type="submit"
            disabled={editLoading}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {editLoading ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Transaction History
          </h2>
          <p className="text-sm text-muted">
            Review all club transactions or filter by club.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="transactionClubFilter"
              type="search"
              value={transactionClubFilter}
              onChange={(event) => onFilterChange(event.target.value)}
              placeholder="Search club, date, payment, status"
              aria-label="Search transactions by club, date, payment, or status"
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring/40"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loadingTransactions ? (
          <div className="p-6 text-sm text-muted">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-sm text-muted">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f7f8ff] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Date / Created</th>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">Slip</th>
                  <th className="px-4 py-3 text-right">Base Amount</th>
                  <th className="px-4 py-3 text-right">GST</th>
                  <th className="px-4 py-3 text-right">Total (With GST)</th>
                  <th className="px-4 py-3 text-right">Received</th>
                  <th className="px-4 py-3 text-right">Pending</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-border">
                    <td className="px-4 py-3 align-middle text-muted">
                      {formatTransactionDateTime(transaction.amount_taken_date)}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <div className="font-medium text-foreground">
                        {transaction.member_first_name ||
                        transaction.member_last_name
                          ? `${transaction.member_first_name || ""} ${transaction.member_last_name || ""}`.trim()
                          : "Unknown member"}
                      </div>
                      <div className="text-xs text-muted">
                        {transaction.member_number ||
                          transaction.member_id ||
                          "—"}
                      </div>
                      {transaction.member_email && (
                        <div className="text-xs text-muted">
                          {transaction.member_email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {transaction.club_id || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                      {transaction.slip_no || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">
                      ₹
                      {Number(
                        transaction.amount_excluding_gst ??
                          transaction.debit_amount ??
                          0,
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-amber-600 font-semibold">
                      ₹{Number(transaction.total_gst_amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      ₹
                      {Number(
                        transaction.total_amount_with_gst ??
                          transaction.debit_amount ??
                          0,
                      ).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">
                      ₹{Number(transaction.received_amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">
                      ₹{Number(transaction.balance_amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          transaction.payment_status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : transaction.payment_status === "partial"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {transaction.payment_status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionIconButton
                        onClick={() => onEdit(transaction)}
                        alt="Edit transaction"
                        title="Edit transaction"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
