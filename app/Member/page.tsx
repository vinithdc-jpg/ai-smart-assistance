"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Member/Header";
import MemberSearch from "@/components/Member/MemberSearch";
import MemberInfo from "@/components/Member/MemberInfo";
import PaymentSummary from "@/components/Member/PaymentSummary";
import TransactionHistory from "@/components/Member/TransactionHistory";
import TransactionForm, {
  type TransactionFormState,
} from "@/components/Member/TransactionForm";
import MemberForm, {
  type MemberFormState,
} from "@/components/Member/MemberForm";
import WorkspaceHero from "@/components/Member/WorkspaceHero";
import AiInsightsPanel from "@/components/Member/AiInsightsPanel";
import {
  MemberSummarySkeleton,
} from "@/components/Member/MemberSkeletons";
import {
  calcGst,
  formatMemberSince,
  formatTransactionDateTime,
  toIndiaDateValue,
} from "@/components/Member/money";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getCurrentUser, logoutUser } from "@/lib/authApi";
import {
  createMember,
  deleteMember,
  generateTransactionSummary,
  getMemberSummary,
  getMembers,
  updateMember,
  type ApiMember,
} from "@/lib/membersApi";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/lib/transactionsApi";
import { getGstRate } from "@/lib/settingsApi";
import ConfirmModal from "@/components/ui/ConfirmModal";
import FormDialog from "@/components/ui/FormDialog";
import PopMessage, { type PopMessageType } from "@/components/ui/PopMessage";
import type { Member, Transaction } from "@/types/member";
import { toast } from "react-toastify";

const numberValue = (value: number | string | null | undefined) =>
  Number(value || 0);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const emptyMemberForm: MemberFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  memberId: "",
  pendingAmount: "0", // not shown on create; only used in edit mode
  amcStatus: "active",
};

function todayValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateValue(value: string) {
  return toIndiaDateValue(value) || todayValue();
}

function emptyTransactionForm(): TransactionFormState {
  return {
    date: todayValue(),
    amount: "",
    receivedAmount: "",
    slipNo: "",
    invoiceNo: "",
    paymentStatus: "completed",
    paymentMethod: "cash",
    transactionType: "membership",
    remarks: "",
  };
}

function mapPaymentStatus(
  status: string | null | undefined,
): Transaction["status"] {
  const normalized = status?.toLowerCase();
  if (normalized === "partial") return "Partial";
  if (normalized === "pending") return "Pending";
  return "Completed";
}

function toMember(
  member: ApiMember,
  summary?: {
    totalAmount: number | string;
    receivedAmount: number | string;
    balanceAmount: number | string;
  },
): Member {
  return {
    id: member.member_id,
    name: `${member.first_name} ${member.last_name}`.trim(),
    email: member.email,
    phone: member.phone,
    totalAmount: numberValue(summary?.totalAmount),
    receivedAmount: numberValue(summary?.receivedAmount),
    balanceAmount: numberValue(summary?.balanceAmount ?? member.pending_amount),
    status: member.amc_status,
    memberSince: formatMemberSince(member.created_date),
  };
}

export default function MemberPaymentSummary() {
  const router = useRouter();
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [selectedApiMember, setSelectedApiMember] = useState<ApiMember | null>(
    null,
  );
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberTransactions, setMemberTransactions] = useState<Transaction[]>(
    [],
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState<MemberFormState>(emptyMemberForm);
  const [editingMember, setEditingMember] = useState<ApiMember | null>(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionForm, setTransactionForm] =
    useState<TransactionFormState>(emptyTransactionForm);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editFormToFocus, setEditFormToFocus] = useState<
    "member" | "transaction" | null
  >(null);
  const [transactionFormError, setTransactionFormError] = useState("");
  const [transactionFormLoading, setTransactionFormLoading] = useState(false);
  const [gstRate, setGstRate] = useState<number>(18);
  const [clubId, setClubId] = useState("");
  const [memberToDelete, setMemberToDelete] = useState<ApiMember | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [popMsg, setPopMsg] = useState<{
    message: string;
    type: PopMessageType;
  } | null>(null);

  useEffect(() => {
    const formId =
      editFormToFocus === "member" && editingMember
        ? "member-edit-form"
        : editFormToFocus === "transaction" && editingTransaction
          ? "transaction-form"
          : null;
    if (!formId) return;

    const frame = window.requestAnimationFrame(() => {
      const form = document.getElementById(formId);
      if (!form) return;
      form
        .querySelector<HTMLElement>(
          "input:not(:disabled), select:not(:disabled), textarea:not(:disabled)",
        )
        ?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [editFormToFocus, editingMember, editingTransaction]);

  const selectedApiMemberRef = useRef<ApiMember | null>(null);

  useEffect(() => {
    selectedApiMemberRef.current = selectedApiMember;
  }, [selectedApiMember]);

  useEffect(() => {
    getGstRate()
      .then((res) => {
        if (res.success && res.gstRate !== undefined) {
          setGstRate(res.gstRate);
        }
      })
      .catch((err) => {
        console.error("Failed to load GST rate:", err);
      });
    getCurrentUser()
      .then((res) => setClubId(res.club?.clubId || ""))
      .catch(() => undefined);
  }, []);

  const loadSummary = useCallback(async (member: ApiMember) => {
    setSelectedApiMember(member);
    selectedApiMemberRef.current = member;
    setSummaryLoading(true);
    setError("");
    setAiSummary("");
    setAiSummaryError("");
    try {
      const response = await getMemberSummary(member.id);
      setSelectedMember(toMember(member, response.data.summary));
      setMemberTransactions(
        response.data.transactions.map((transaction) => {
          const baseAmt =
            numberValue(transaction.amount_excluding_gst) ||
            numberValue(transaction.debit_amount) ||
            numberValue(transaction.received_amount) +
              numberValue(transaction.balance_amount);
          const totalWithGst =
            numberValue(transaction.total_amount_with_gst) ||
            numberValue(transaction.debit_amount) ||
            numberValue(transaction.received_amount) +
              numberValue(transaction.balance_amount);
          const gstAmt =
            numberValue(transaction.total_gst_amount) ||
            (totalWithGst > baseAmt ? totalWithGst - baseAmt : 0);

          return {
            id: transaction.id,
            date: formatTransactionDateTime(transaction.amount_taken_date),
            dateValue: toDateValue(transaction.amount_taken_date),
            slipNo: transaction.slip_no || "-",
            invoiceNo: transaction.invoice_no || "",
            amount: baseAmt,
            amountExcludingGst: baseAmt,
            gstAmount: gstAmt,
            totalWithGst: totalWithGst,
            received: numberValue(transaction.received_amount),
            balance: numberValue(transaction.balance_amount),
            status: mapPaymentStatus(transaction.payment_status),
            paymentMethod: transaction.payment_method || "",
            remarks: transaction.remarks || "",
            transactionType: transaction.types || "membership",
          };
        }),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load member summary.",
      );
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadMembers = useCallback(
    async (search = "", requestedPage = 1, preferredMemberId?: string) => {
      setLoading(true);
      setError("");
      setSearchQuery(search);
      try {
        const response = await getMembers({
          search,
          page: requestedPage,
          limit: 20,
        });
        setMembers(response.members);
        setPage(response.page);
        setTotalPages(response.totalPages);
        if (response.members.length > 0) {
          const preferred =
            response.members.find(
              (member) => member.id === preferredMemberId,
            ) ||
            response.members.find(
              (member) => member.id === selectedApiMemberRef.current?.id,
            ) ||
            response.members[0];
          await loadSummary(preferred);
        } else {
          setSelectedApiMember(null);
          setSelectedMember(null);
          setMemberTransactions([]);
          setAiSummary("");
          setError("No members found.");
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load members.",
        );
      } finally {
        setLoading(false);
      }
    },
    [loadSummary],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMembers(), 0);
    return () => window.clearTimeout(timer);
  }, [loadMembers]);

  function handleFormChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleTransactionFormChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;
    setTransactionForm((current) => ({ ...current, [name]: value }));
  }

  function startEditing(member: ApiMember) {
    setEditFormToFocus("member");
    setEditingMember(member);
    setFormError("");
    setShowMemberForm(true);
    setForm({
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email || "",
      phone: member.phone || "",
      memberId: member.member_id,
      pendingAmount: String(member.pending_amount || 0),
      amcStatus: member.amc_status,
    });
  }

  function resetForm() {
    setEditingMember(null);
    setForm(emptyMemberForm);
    setFormError("");
    setShowMemberForm(false);
  }

  function openCreateTransactionForm() {
    setEditingTransaction(null);
    setTransactionForm(emptyTransactionForm());
    setTransactionFormError("");
    setShowTransactionForm(true);
  }

  function startEditingTransaction(transaction: Transaction) {
    setEditFormToFocus("transaction");
    setEditingTransaction(transaction);
    setTransactionFormError("");
    setShowTransactionForm(true);
    setTransactionForm({
      date: transaction.dateValue || todayValue(),
      amount: String(transaction.amountExcludingGst ?? transaction.amount),
      receivedAmount: "0",
      slipNo: transaction.slipNo === "-" ? "" : transaction.slipNo,
      invoiceNo: transaction.invoiceNo,
      paymentStatus: transaction.status.toLowerCase(),
      paymentMethod: transaction.paymentMethod || "cash",
      transactionType: transaction.transactionType || "membership",
      remarks: transaction.remarks,
    });
  }

  function resetTransactionForm() {
    setEditingTransaction(null);
    setTransactionForm(emptyTransactionForm());
    setTransactionFormError("");
    setShowTransactionForm(false);
  }

  async function handleMemberSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const email = form.email.trim().toLowerCase();
      if (!emailPattern.test(email)) {
        throw new Error("Please enter a valid email address, such as example@example.com.");
      }
      const pendingAmount = Number(form.pendingAmount);
      if (!Number.isFinite(pendingAmount) || pendingAmount < 0) {
        throw new Error("Pending amount must be a non-negative number.");
      }
      const preferredMemberId = editingMember?.id;
      if (editingMember) {
        await updateMember(editingMember.id, {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email,
          phone: form.phone.trim(),
          pendingAmount,
          amcStatus: form.amcStatus,
        });
      } else {
        await createMember({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email,
          phone: form.phone.trim(),
          amcStatus: form.amcStatus,
        });
        toast.success("Member created successfully.");
      }
      resetForm();
      await loadMembers(searchQuery, page, preferredMemberId);
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Failed to save member.",
      );
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(member: ApiMember) {
    setMemberToDelete(member);
  }

  async function confirmDeleteMember() {
    if (!memberToDelete) return;
    setError("");
    try {
      await deleteMember(memberToDelete.id);
      await loadMembers(searchQuery, page);
      setMemberToDelete(null);
      setPopMsg({ message: "Member deleted successfully.", type: "success" });
    } catch (requestError) {
      setMemberToDelete(null);
      setPopMsg({
        message:
          requestError instanceof Error
            ? requestError.message
            : "Failed to delete member.",
        type: "error",
      });
    }
  }

  async function handleTransactionSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!selectedApiMember) return;

    setTransactionFormLoading(true);
    setTransactionFormError("");
    try {
      const baseAmountInput = Number(transactionForm.amount);
      const enteredPayAmount = Number(transactionForm.receivedAmount || 0);
      if (!Number.isFinite(baseAmountInput) || baseAmountInput <= 0)
        throw new Error("Amount must be greater than 0.");
      if (!Number.isFinite(enteredPayAmount) || enteredPayAmount < 0) {
        throw new Error("Payment amount cannot be negative.");
      }

      const amountExcl = baseAmountInput;
      let totalGst, totalWithGst;

      const isAmountChanged = editingTransaction
        ? amountExcl !==
          Number(
            editingTransaction.amountExcludingGst ?? editingTransaction.amount,
          )
        : false;

      if (
        editingTransaction &&
        !isAmountChanged &&
        editingTransaction.totalWithGst !== undefined
      ) {
        totalWithGst = Number(editingTransaction.totalWithGst);
        totalGst = Number(editingTransaction.gstAmount || 0);
      } else {
        totalGst = Math.round(((amountExcl * gstRate) / 100) * 100) / 100;
        totalWithGst = Math.round((amountExcl + totalGst) * 100) / 100;
      }

      if (editingTransaction) {
        const previousReceived = Number(editingTransaction.received || 0);
        const newTotalReceived = previousReceived + enteredPayAmount;

        if (newTotalReceived > totalWithGst) {
          throw new Error(
            `Total received (Previous ₹${previousReceived.toFixed(2)} + New ₹${enteredPayAmount.toFixed(2)} = ₹${newTotalReceived.toFixed(2)}) cannot exceed Total with GST (₹${totalWithGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}). Maximum payment towards pending is ₹${(totalWithGst - previousReceived).toLocaleString("en-IN", { minimumFractionDigits: 2 })}.`,
          );
        }

        const calculatedBalance = Math.max(totalWithGst - newTotalReceived, 0);
        const autoStatus =
          calculatedBalance === 0 && newTotalReceived > 0
            ? "completed"
            : newTotalReceived > 0
              ? "partial"
              : "pending";

        const finalStatus =
          transactionForm.paymentStatus &&
          transactionForm.paymentStatus !== "completed" &&
          transactionForm.paymentStatus !== "pending" &&
          transactionForm.paymentStatus !== "partial"
            ? transactionForm.paymentStatus
            : autoStatus;

        const updatePayload: {
          receivedAmount: number;
          balanceAmount: number;
          invoiceNo: string | null;
          transactionType: string;
          paymentStatus: string;
          paymentMethod: string;
          remarks: string;
          amount?: number;
        } = {
          receivedAmount: newTotalReceived,
          balanceAmount: calculatedBalance,
          invoiceNo: transactionForm.invoiceNo.trim() || null,
          transactionType: transactionForm.transactionType.trim(),
          paymentStatus: finalStatus,
          paymentMethod: transactionForm.paymentMethod.trim(),
          remarks: transactionForm.remarks.trim(),
        };

        if (isAmountChanged) {
          updatePayload.amount = amountExcl;
        }

        await updateTransaction(editingTransaction.id, updatePayload);
      } else {
        if (enteredPayAmount > totalWithGst) {
          throw new Error(
            `Received amount cannot be greater than total amount with GST (₹${totalWithGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}).`,
          );
        }

        const calculatedBalance = Math.max(totalWithGst - enteredPayAmount, 0);
        const autoStatus =
          calculatedBalance === 0 && enteredPayAmount > 0
            ? "completed"
            : enteredPayAmount > 0
              ? "partial"
              : "pending";

        const finalStatus =
          transactionForm.paymentStatus &&
          transactionForm.paymentStatus !== "completed" &&
          transactionForm.paymentStatus !== "pending" &&
          transactionForm.paymentStatus !== "partial"
            ? transactionForm.paymentStatus
            : autoStatus;

        await createTransaction({
          memberId: selectedApiMember.id,
          amount: baseAmountInput,
          receivedAmount: enteredPayAmount,
          invoiceNo: transactionForm.invoiceNo.trim(),
          paymentStatus: finalStatus,
          paymentMethod: transactionForm.paymentMethod.trim(),
          transactionType:
            transactionForm.transactionType.trim() || "membership",
          remarks: transactionForm.remarks.trim(),
        });
        toast.success("Transaction created successfully.");
      }

      resetTransactionForm();
      setShowTransactionForm(true);
      setTransactionForm(emptyTransactionForm());
      await loadMembers(searchQuery, page, selectedApiMember.id);
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Failed to save transaction.",
      );
    } finally {
      setTransactionFormLoading(false);
    }
  }

  async function handleDeleteTransaction(transaction: Transaction) {
    setTransactionToDelete(transaction);
  }

  async function confirmDeleteTransaction() {
    if (!transactionToDelete || !selectedApiMember) return;
    setError("");
    try {
      await deleteTransaction(transactionToDelete.id);
      if (editingTransaction?.id === transactionToDelete.id)
        resetTransactionForm();
      await loadMembers(searchQuery, page, selectedApiMember.id);
      setTransactionToDelete(null);
      setPopMsg({
        message: "Transaction deleted successfully.",
        type: "success",
      });
    } catch (requestError) {
      setTransactionToDelete(null);
      setPopMsg({
        message:
          requestError instanceof Error
            ? requestError.message
            : "Failed to delete transaction.",
        type: "error",
      });
    }
  }

  async function handleGenerateAiSummary() {
    if (!selectedMember) return;
    setAiSummaryLoading(true);
    setAiSummaryError("");
    try {
      const response = await generateTransactionSummary(selectedMember.id);
      setAiSummary(response.summary);
    } catch (requestError) {
      setAiSummaryError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to generate AI summary.",
      );
    } finally {
      setAiSummaryLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      router.replace("/login");
    }
  }

  function exportStatement() {
    if (!selectedMember) return;
    const header = [
      "Date",
      "Slip No",
      "Base Amount",
      "GST",
      "Total",
      "Received",
      "Pending",
      "Status",
    ];
    const rows = memberTransactions.map((item) =>
      [
        item.date,
        item.slipNo,
        item.amountExcludingGst ?? item.amount,
        item.gstAmount ?? 0,
        item.totalWithGst ?? item.amount,
        item.received,
        item.balance,
        item.status,
      ].join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedMember.id}-statement.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const gstPreview = calcGst(Number(transactionForm.amount || 0), gstRate);
  const isAmountValChanged = editingTransaction
    ? Number(transactionForm.amount || 0) !==
      Number(editingTransaction.amountExcludingGst ?? editingTransaction.amount)
    : false;
  const totalAmountWithGst =
    editingTransaction &&
    !isAmountValChanged &&
    editingTransaction.totalWithGst !== undefined
      ? Number(editingTransaction.totalWithGst)
      : gstPreview.totalAmountWithGst;
  const currentEnteredPayVal = Number(transactionForm.receivedAmount || 0);
  const previousPaidVal = editingTransaction
    ? Number(editingTransaction.received || 0)
    : 0;
  const newEffectiveReceived = editingTransaction
    ? previousPaidVal +
      (Number.isFinite(currentEnteredPayVal) ? currentEnteredPayVal : 0)
    : Number.isFinite(currentEnteredPayVal)
      ? currentEnteredPayVal
      : 0;
  const currentPendingBalance = Math.max(
    totalAmountWithGst - newEffectiveReceived,
    0,
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased dark:bg-background">
        <Header
          onLogout={handleLogout}
          gstRate={gstRate}
          clubId={clubId}
        />
        <main className="mx-auto max-w-7xl space-y-4 overflow-x-hidden px-3 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
          <WorkspaceHero
            gstRate={gstRate}
            clubId={clubId}
            onExport={exportStatement}
            onAiInsights={() => {
              document.getElementById("ai-insights")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            onRecordPayment={openCreateTransactionForm}
          />

          <div className="relative z-20 rounded-2xl border border-border bg-white px-3 py-3 shadow-[0_10px_30px_rgba(31,35,80,0.04)] sm:rounded-3xl sm:px-4">
            <MemberSearch
              members={members}
              selectedMember={selectedApiMember}
              loading={loading}
              onSearch={(query) => loadMembers(query, 1)}
              onSelect={(member) => void loadSummary(member)}
              onAdd={() => {
                setEditingMember(null);
                setForm(emptyMemberForm);
                setFormError("");
                setShowMemberForm(true);
              }}
              onEdit={startEditing}
              onDelete={handleDelete}
              page={page}
              totalPages={totalPages}
              onPageChange={(nextPage) => loadMembers(searchQuery, nextPage)}
            />
          </div>

          {showMemberForm ? (
            <FormDialog
              isOpen={showMemberForm}
              onClose={resetForm}
              isLoading={formLoading}
              ariaLabel={editingMember ? "Edit member" : "Add member"}
              className="max-w-4xl"
            >
            <div id={editingMember ? "member-edit-form" : undefined}>
              <MemberForm
                form={form}
                editing={Boolean(editingMember)}
                loading={formLoading}
                error={formError}
                onChange={handleFormChange}
                onSubmit={handleMemberSubmit}
                onCancel={resetForm}
              />
            </div>
            </FormDialog>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">
              {error}
            </p>
          ) : null}

          {summaryLoading ? (
            <MemberSummarySkeleton />
          ) : selectedMember ? (
            <>
              <div className="grid items-start gap-4 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] xl:gap-6">
                <div className="xl:col-start-1">
                  <MemberInfo
                    member={selectedMember}
                    onEdit={() =>
                      selectedApiMember
                        ? startEditing(selectedApiMember)
                        : undefined
                    }
                    onDelete={() =>
                      selectedApiMember
                        ? void handleDelete(selectedApiMember)
                        : undefined
                    }
                  />
                </div>
                <div className="xl:col-start-1">
                  <PaymentSummary
                    member={selectedMember}
                    transactionCount={memberTransactions.length}
                  />
                </div>
                <div className="min-w-0 space-y-4 xl:col-start-2 xl:row-start-1 xl:row-span-4">
                  {showTransactionForm ? (
                    <FormDialog
                      isOpen={showTransactionForm}
                      onClose={resetTransactionForm}
                      isLoading={transactionFormLoading}
                      ariaLabel={
                        editingTransaction
                          ? "Edit transaction"
                          : "Add transaction"
                      }
                      className="max-w-5xl"
                    >
                    <div id="transaction-form">
                      <TransactionForm
                        form={transactionForm}
                        editingTransaction={editingTransaction}
                        memberName={selectedMember.name}
                        gstRate={gstRate}
                        amountExcludingGst={gstPreview.amountExcludingGst}
                        cgstAmount={gstPreview.cgstAmount}
                        sgstAmount={gstPreview.sgstAmount}
                        totalAmountWithGst={totalAmountWithGst}
                        previousPaidVal={previousPaidVal}
                        currentEnteredPayVal={currentEnteredPayVal}
                        newEffectiveReceived={newEffectiveReceived}
                        currentPendingBalance={currentPendingBalance}
                        error={transactionFormError}
                        loading={transactionFormLoading}
                        onChange={handleTransactionFormChange}
                        onSubmit={handleTransactionSubmit}
                        onCancel={resetTransactionForm}
                      />
                    </div>
                    </FormDialog>
                  ) : null}
                  <TransactionHistory
                    transactions={memberTransactions}
                    gstRate={gstRate}
                    onEdit={startEditingTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </div>
                <div className="xl:col-start-1">
                  <AiInsightsPanel
                    loading={aiSummaryLoading}
                    error={aiSummaryError}
                    summary={aiSummary}
                    onGenerate={() => void handleGenerateAiSummary()}
                  />
                </div>
              </div>
            </>
          ) : null}
        </main>
        <footer className="border-t border-border bg-white/80 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p>Smart Ledger AI • Autonomous Payment & Compliance Core</p>
            <p>
              System Status:{" "}
              <span className="font-semibold text-emerald-600">Operational</span>{" "}
              • © 2025 Smart Ledger Systems Inc.
            </p>
          </div>
        </footer>
        <ConfirmModal
          isOpen={Boolean(memberToDelete)}
          title="Delete member?"
          message={
            memberToDelete
              ? `Delete ${memberToDelete.member_id}? This action cannot be undone.`
              : ""
          }
          confirmText="Delete member"
          onClose={() => setMemberToDelete(null)}
          onConfirm={() => void confirmDeleteMember()}
        />
        <ConfirmModal
          isOpen={Boolean(transactionToDelete)}
          title="Delete transaction?"
          message={
            transactionToDelete
              ? `Delete transaction ${transactionToDelete.slipNo}? This action cannot be undone.`
              : ""
          }
          confirmText="Delete transaction"
          onClose={() => setTransactionToDelete(null)}
          onConfirm={() => void confirmDeleteTransaction()}
        />
        {popMsg && (
          <PopMessage
            message={popMsg.message}
            type={popMsg.type}
            onClose={() => setPopMsg(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
