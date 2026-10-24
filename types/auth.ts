export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export interface Club {
  clubId: string;
  title: string;
  phone: string | null;
  status: string;
}

export interface LoginRequest {
  clubId: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  staff: Staff;
  club: Club;
}

export interface MeResponse {
  success: boolean;
  staff: Staff;
  club: Club;
}

export interface ApiError {
  success: false;
  message: string;
}
