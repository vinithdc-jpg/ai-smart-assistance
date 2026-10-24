import { Club } from "./auth";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  admin: AdminUser;
}

export interface AdminMeResponse {
  success: boolean;
  admin: AdminUser;
}

export interface AdminClub extends Club {
  id?: string;
  created_at?: string;
  updated_at?: string;
  staff_count?: number;
  member_count?: number;
}
