export type UserRole = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN" | "CFO" | "TEAM_LEADER" | "CEO";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  id: string;
  role: UserRole;
  forcePasswordChange: boolean;
}

export type ExperienceType = 'EXPERIENCED' | 'FRESHER';