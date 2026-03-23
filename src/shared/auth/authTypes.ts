export type UserRole = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN" | "CFO" | "TEAM_LEADER" | "CEO";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  role: UserRole;
  forcePasswordChange: boolean;
}