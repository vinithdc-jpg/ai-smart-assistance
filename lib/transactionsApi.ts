import apiRequest from "./api";

export interface ApiTransaction {
  id: string;
  created_date?: string;
  amount_taken_date: string;
  slip_no: string | null;
  invoice_no?: string | null;
  debit_amount: number | string;
  received_amount: number | string;
  balance_amount: number | string;
  payment_status: string;
  payment_method?: string | null;
  types?: string | null;
  amount_excluding_gst?: number | string | null;
  cgst_amount?: number | string | null;
  sgst_amount?: number | string | null;
  total_gst_amount?: number | string | null;
  total_amount_with_gst?: number | string | null;
  remarks?: string | null;
  member_id?: string | null;
  club_id?: string | null;
  member_first_name?: string | null;
  member_last_name?: string | null;
  member_number?: string | null;
  member_email?: string | null;
  member_phone?: string | null;
}

export interface TransactionListResponse {
  success: boolean;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  transactions: ApiTransaction[];
}

export interface TransactionPayload {
  memberId: string;
  amount: number;
  receivedAmount?: number;
  date?: string;
  slipNo?: string;
  invoiceNo?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionType?: string;
  remarks?: string;
}

export interface TransactionUpdatePayload {
  amount?: number;
  invoiceNo?: string | null;
  transactionType?: string;
  paymentStatus?: string;
  receivedAmount?: number;
  balanceAmount?: number;
  paymentMethod?: string;
  remarks?: string;
  date?: string;
}

export interface TransactionMutationResponse {
  success: boolean;
  message?: string;
  transaction?: ApiTransaction;
}

export function getTransactions(
  params: {
    memberId?: string;
    clubId?: string;
    page?: number;
    limit?: number;
    paymentStatus?: string;
    transactionType?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
  } = {},
) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      if (key === "clubId" && value === "all") return;
      query.set(key, String(value));
    }
  });
  return apiRequest<TransactionListResponse>(`/transactions${query.toString() ? `?${query}` : ""}`);
}

export function createTransaction(payload: TransactionPayload) {
  return apiRequest<TransactionMutationResponse>("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTransaction(transactionId: string, payload: TransactionUpdatePayload) {
  return apiRequest<TransactionMutationResponse>(
    `/transactions/${encodeURIComponent(transactionId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export function deleteTransaction(transactionId: string) {
  return apiRequest<{ success: boolean; message: string }>(
    `/transactions/${encodeURIComponent(transactionId)}`,
    { method: "DELETE" },
  );
}
