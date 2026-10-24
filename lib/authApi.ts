import apiRequest from "./api";

import { LoginRequest, LoginResponse, MeResponse } from "@/types/auth";

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      clubId: data.clubId,
      email: data.email,
      password: data.password,
    }),
  });
}

export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(): Promise<MeResponse> {
  return apiRequest<MeResponse>("/auth/me", {
    method: "GET",
  });
}
