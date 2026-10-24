import apiRequest from "./api";

export interface GstRateResponse {
  success: boolean;
  gstRate: number;
  message?: string;
}

export async function getGstRate(): Promise<GstRateResponse> {
  return apiRequest<GstRateResponse>("/settings/gst", {
    method: "GET",
  });
}

export async function updateGstRate(gstRate: number): Promise<GstRateResponse> {
  return apiRequest<GstRateResponse>("/settings/gst", {
    method: "PATCH",
    body: JSON.stringify({ gstRate }),
  });
}
