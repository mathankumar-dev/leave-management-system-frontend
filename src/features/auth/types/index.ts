// 1. Standardize the Role type to match your Backend JSON
export type UserRole = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  role: UserRole; 
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole; 
  managerId: number | null;
  active: boolean;
  joiningDate: string;
  biometricStatus: string;
  vpnStatus: string;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

