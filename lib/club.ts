export interface ClubStatistics {
  totalClubs: number;
  activeClubs: number;
  inactiveClubs: number;
  totalStaff: number;
}

interface ClubStatisticsResponse {
  success: boolean;
  data: ClubStatistics;
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getClubStatistics = async (): Promise<ClubStatistics> => {
  const response = await fetch(`${API_URL}/club/statistics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch club statistics: ${response.status}`);
  }

  const result: ClubStatisticsResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch statistics");
  }

  return result.data;
};
