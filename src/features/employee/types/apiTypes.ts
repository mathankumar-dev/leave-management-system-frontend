import type { UserRole } from "@/shared/auth/authTypes";

export interface EmployeeEntity {
  id: number;
  teamId: number | null;
  teamLeaderId: number | null;
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

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}