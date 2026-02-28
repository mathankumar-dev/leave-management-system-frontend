// 1. Standardize the Role type to match your Backend JSON
export type UserRole = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  [x: string]: any;
  id: any;
  role: any;
  token: string;
  id: number;
  role: UserRole; 
  forcePasswordChange : boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole; 
  department : string | null;
  managerId: number | null;
  active: boolean;
  joiningDate: string;
  biometricStatus: string;
  vpnStatus: string;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  mustChangePassword? : boolean;
}

