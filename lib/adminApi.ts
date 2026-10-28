import apiRequest from "./api";
import { AdminLoginResponse, AdminMeResponse, AdminClub } from "@/types/admin";
import { Staff } from "@/types/auth";

export async function adminLogin(
  email: string,
  password: string,
): Promise<AdminLoginResponse> {
  return apiRequest<AdminLoginResponse>("/AdminAuth/adminLogin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function adminLogout(): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest("/AdminAuth/adminLogout", {
    method: "POST",
  });
}

export async function getAdminMe(signal?: AbortSignal): Promise<AdminMeResponse> {
  return apiRequest<AdminMeResponse>("/AdminAuth/adminMe", {
    method: "GET",
    signal,
  });
}

export async function getClubs(page = 1): Promise<{
  success: boolean;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  clubs: AdminClub[];
}> {
  return apiRequest<{ success: boolean; count: number; page: number; limit: number; totalPages: number; clubs: AdminClub[] }>(`/club/getclub?page=${page}&limit=10`, {
    method: "GET",
  });
}

export async function createClub(payload: {
  club_id: string;
  title: string;
  phone?: string;
  status?: string;
}) {
  return apiRequest<{ success: boolean; club: AdminClub }>("/club/createclub", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateClub(
  clubId: string,
  payload: {
    title?: string;
    phone?: string;
    status?: string;
  },
) {
  return apiRequest<{ success: boolean; club: AdminClub }>(
    `/club/${encodeURIComponent(clubId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deactivateClub(clubId: string) {
  return apiRequest<{ success: boolean; club: AdminClub }>(
    `/club/${encodeURIComponent(clubId)}`,
    {
      method: "DELETE",
    },
  );
}

export async function getStaffByClub(
  clubId: string,
  page = 1,
  search = "",
): Promise<{ success: boolean; count: number; page: number; limit: number; totalPages: number; staff: Staff[] }> {
  const params = new URLSearchParams({ page: String(page), limit: "10" });
  if (clubId && clubId !== "all") params.set("clubId", clubId);
  if (search.trim()) params.set("search", search.trim());
  return apiRequest<{ success: boolean; count: number; page: number; limit: number; totalPages: number; staff: Staff[] }>(
    `/staff/getAllStaff?${params.toString()}`,
    {
      method: "GET",
    },
  );
}

// Staff payload type
export interface StaffPayload {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role?: string;
  status?: string;
  club_id?: string;
}

// Create staff
export async function createStaff(
  payload: StaffPayload,
): Promise<{ success: boolean; staff: Staff }> {
  return apiRequest<{ success: boolean; staff: Staff }>("/staff/createstaff", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Update staff
export async function updateStaff(
  staffId: string,
  payload: Partial<StaffPayload>,
): Promise<{ success: boolean; staff: Staff }> {
  return apiRequest<{ success: boolean; staff: Staff }>(
    `/staff/${encodeURIComponent(staffId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

// Delete staff
export async function deleteStaff(
  staffId: string,
  clubId?: string,
): Promise<{ success: boolean }> {
  let url = `/staff/${encodeURIComponent(staffId)}`;
  if (clubId && clubId !== "all") {
    url += `?clubId=${encodeURIComponent(clubId)}`;
  }
  return apiRequest<{ success: boolean }>(url, {
    method: "DELETE",
  });
}

// GST Settings
export { getGstRate, updateGstRate } from "./settingsApi";
