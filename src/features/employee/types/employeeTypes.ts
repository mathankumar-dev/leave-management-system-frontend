import type { ExperienceType, UserRole } from "@/shared/auth/authTypes";
import type { Gender } from "@/shared/types";


// export type EmployeeExperience = 'FRESHER' | 'EXPERIENCED';
// export interface Employee {
//   empId: number;
//   teamId?: number | null;
//   departmentId: number;
//   name: string;
//   email: string;
//   role: string;
//   employeeExperience: EmployeeExperience;
//   reportingId: number | null;
//   branchId: number;
// }

// export interface ProfileResponse {
//   employee: Employee;

// }

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  managerId?: number | null;
  teamLeaderId?: number | null;
  teamLeaderName?: string | null;
  managerName?: string;
  hrname?: string | null;
  active: boolean;
  joiningDate: string;
  biometricStatus: string;
  vpnStatus: string;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  mustChangePassword?: boolean;
  contactNumber: string | null;
  gender: Gender;
  aadharNumber: string | null;
  personalEmail: string | null;
  dateOfBirth: string | null;
  presentAddress: string | null;
  permanentAddress: string | null;
  bloodGroup: string | null;
  emergencyContactNumber: string | null;
  fatherName: string | null;
  motherName: string | null;
  designation: string | null;
  skillSet: string | null;
  personalDetailsComplete: boolean | null;
  personalDetailsLocked: boolean | null;
  employeeExperience: ExperienceType;
  verificationStatus: string;
}

export interface Employee {
  managerId: null;
  active: any;
  joiningDate: string | number | Date;
  biometricStatus: string;
  vpnStatus: string;
  department?: string;
  id: number | null | undefined;
  color: string;
  initial?: string | null;
  name: string;
  email: string;
  dept: string;
  role: string;
  status: string;
  employeeId: number;
  employeeName: string;
  totalAllocated: number;
  totalUsed: number;
  totalRemaining: number;
  compOffBalance: number;
  lopPercentage: number;
  totalWorkingDays: number | null;
}

export interface TeamMember {
  employeeName: string;
  employeeId: number;
  designation: string | null;
  skills: string | null;
}



