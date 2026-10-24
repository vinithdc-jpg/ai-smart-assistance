import apiRequest from "./api";

export interface ReportFilters {
  clubId?: string;
  startDate?: string;
  endDate?: string;
  staffId?: string;
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ReportStats {
  totalRevenue: number;
  totalReceived: number;
  totalPending: number;
  totalMembers: number;
  totalClubs: number;
  activeStaff: number;
  chart: ReportChartPoint[];
}

export interface ReportChartPoint {
  date: string;
  revenue: number;
  received: number;
  pending: number;
}

export interface ClubPaymentStatusRecord {
  clubId: string;
  clubName: string;
  pending: number;
  partial: number;
  completed: number;
}

export interface StaffPerformanceRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  onboarded_members: number | string;
  transactions_count: number | string;
  transaction_value: number | string;
}

export interface TransactionRecord {
  id: string;
  slip_no: string | null;
  invoice_no: string | null;
  created_date: string;
  amount_taken_date: string;
  types: string | null;
  payment_status: string | null;
  payment_method: string | null;
  debit_amount: number | string;
  received_amount: number | string;
  balance_amount: number | string;
  total_amount_with_gst: number | string;
  member_first_name: string | null;
  member_last_name: string | null;
  member_number: string | null;
  member_email?: string | null;
  member_phone?: string | null;
  staff_first_name: string | null;
  staff_last_name: string | null;
  remarks?: string | null;
  club_id?: string | null;
}

export interface PaginatedReportResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function buildQuery(filters: ReportFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  }
  return params.toString();
}

export const getDashboardStats = async (filters: ReportFilters) => {
  const query = buildQuery(filters);
  const data = await apiRequest<{ success: boolean; data: ReportStats }>(`/reports/stats?${query}`, { method: "GET" });
  return data;
};

export const getStaffPerformance = async (filters: ReportFilters) => {
  const query = buildQuery(filters);
  const data = await apiRequest<PaginatedReportResponse<StaffPerformanceRecord>>(`/reports/staff-performance?${query}`, { method: "GET" });
  return data;
};

export const getStaffOptions = async (filters: Pick<ReportFilters, "clubId"> = {}) => {
  const query = buildQuery(filters);
  return apiRequest<{
    success: boolean;
    data: Pick<StaffPerformanceRecord, "id" | "first_name" | "last_name">[];
  }>(`/reports/staff-options?${query}`, { method: "GET" });
};

  export const getClubPaymentStatus = async (
    filters: Pick<ReportFilters, "clubId" | "limit"> = { limit: 10 },
  ) => {
    const query = buildQuery(filters);
    return apiRequest<{
      success: boolean;
      data: ClubPaymentStatusRecord[];
    }>(`/reports/payment-status?${query}`, { method: "GET" });
  };

export const getTransactionRecords = async (filters: ReportFilters) => {
  const query = buildQuery(filters);
  const data = await apiRequest<PaginatedReportResponse<TransactionRecord>>(`/reports/transaction-records?${query}`, { method: "GET" });
  return data;
};

export const exportTransactionRecords = async (
  filters: ReportFilters,
  format: "csv" | "xlsx" | "pdf",
) => {
  const query = buildQuery({ ...filters, page: undefined, limit: undefined });
  const params = new URLSearchParams(query);
  params.set("format", format);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const response = await fetch(`${apiUrl}/reports/export?${params}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message || "Unable to export report.");
  }

  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = `financial-transactions.${format}`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
