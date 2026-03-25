export type UserRole = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN" | "CFO" | "TEAM_LEADER" | "CEO";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  role: UserRole;
  forcePasswordChange: boolean;
}