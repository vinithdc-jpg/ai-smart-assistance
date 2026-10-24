import apiRequest from "./api";

export interface ApiMember {
  id: string;
  member_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  pending_amount: number | string;
  amc_status: string;
  club_id: string;
  created_date?: string;
}

export interface MemberListResponse {
  success: boolean;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  members: ApiMember[];
}

export interface MemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  memberId?: string; // auto-generated server-side; not required from client
  pendingAmount?: number;
  amcStatus?: string;
}

export interface MemberUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pendingAmount?: number;
  amcStatus?: string;
}

export interface MemberMutationResponse {
  success: boolean;
  message?: string;
  member?: ApiMember;
}

export interface MemberSummaryResponse {
  success: boolean;
  data: {
    member: {
      id: string;
      memberId: string;
      firstName: string;
      lastName: string;
      email: string | null;
      phone: string | null;
      pendingAmount: number | string;
      amcStatus: string;
    };
    summary: {
      totalAmount: number | string;
      receivedAmount: number | string;
      balanceAmount: number | string;
      transactionCount: number;
    };
    transactions: Array<{
      id: string;
      amount_taken_date: string;
      slip_no: string | null;
      invoice_no?: string | null;
      debit_amount: number | string;
      received_amount: number | string;
      balance_amount: number | string;
      payment_status: string | null;
      amount_excluding_gst?: number | string | null;
      cgst_amount?: number | string | null;
      sgst_amount?: number | string | null;
      total_gst_amount?: number | string | null;
      total_amount_with_gst?: number | string | null;
      types?: string | null;
      payment_method?: string | null;
      remarks?: string | null;
    }>;
  };
}

export interface TransactionSummaryResponse {
  success: boolean;
  memberId: string;
  memberName: string;
  stats: {
    totalReceived: number | string;
    latestBalance: number | string | null;
    transactionCount: number;
    partialCount: number;
    completedCount: number;
    pendingCount: number;
    failedCount: number;
    lastPaymentDate: string | null;
  };
  summary: string;
  generatedAt: string;
}

export function getMembers(params: { search?: string; page?: number; limit?: number; clubId?: string } = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.clubId && params.clubId !== "all") query.set("clubId", params.clubId);
  return apiRequest<MemberListResponse>(`/members${query.toString() ? `?${query}` : ""}`);
}

export function createMember(payload: MemberPayload) {
  return apiRequest<MemberMutationResponse>("/members", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMember(memberId: string, payload: MemberUpdatePayload) {
  return apiRequest<MemberMutationResponse>(
    `/members/${encodeURIComponent(memberId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export function getMemberSummary(memberId: string) {
  return apiRequest<MemberSummaryResponse>(`/members/${encodeURIComponent(memberId)}/summary`);
}

export function generateTransactionSummary(memberId: string) {
  return apiRequest<TransactionSummaryResponse>("/members/transaction-summary", {
    method: "POST",
    body: JSON.stringify({ memberId }),
  });
}

export function deleteMember(memberId: string) {
  return apiRequest<{ success: boolean; message: string }>(`/members/${encodeURIComponent(memberId)}`, { method: "DELETE" });
}
