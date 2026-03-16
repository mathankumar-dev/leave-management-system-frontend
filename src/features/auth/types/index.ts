export type UserRole = "EMPLOYEE" | "MANAGER" | "HR" | "ADMIN" | "TEAM_LEADER";

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


export const GenderMap = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;
export type Gender = (typeof GenderMap)[keyof typeof GenderMap];

export const BloodGroupMap = {
  A_POSITIVE: "A_POSITIVE",
  A_NEGATIVE: "A_NEGATIVE",
  B_POSITIVE: "B_POSITIVE",
  B_NEGATIVE: "B_NEGATIVE",
  O_POSITIVE: "O_POSITIVE",
  O_NEGATIVE: "O_NEGATIVE",
  AB_POSITIVE: "AB_POSITIVE",
  AB_NEGATIVE: "AB_NEGATIVE",
} as const;
export type BloodGroup = (typeof BloodGroupMap)[keyof typeof BloodGroupMap];

export const MaritalStatusMap = {
  SINGLE: "SINGLE",
  MARRIED: "MARRIED",
  DIVORCED: "DIVORCED",
  WIDOWED: "WIDOWED",
} as const;
export type MaritalStatus = (typeof MaritalStatusMap)[keyof typeof MaritalStatusMap];

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  managerId: number | null;
  teamLeaderId?: number | null;
  teamLeaderName?: string | null; 
  managerName: string;
  hrname? : string | null;
  active: boolean;
  joiningDate: string;
  biometricStatus: string;
  vpnStatus: string;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  mustChangePassword?: boolean;
  
  contactNumber: string | null;
  gender: Gender | null;
  aadharNumber: string | null;
  personalEmail: string | null;
  dateOfBirth: string | null;
  presentAddress: string | null;
  permanentAddress: string | null;
  bloodGroup: BloodGroup | null;
  emergencyContactNumber: string | null;
  fatherName: string | null;
  motherName: string | null;
  designation: string | null;
  skillSet: string | null;
  personalDetailsComplete: boolean | null;
  personalDetailsLocked: boolean | null;
}

export interface PersonalDetailsRequest {
  contactNumber: string;
  gender: Gender;
  aadharNumber: string;
  personalEmail: string;
  dateOfBirth: string; 
  presentAddress: string;
  permanentAddress: string;
  bloodGroup: BloodGroup;
  maritalStatus: MaritalStatus;
  emergencyContactNumber: string;
  designation: string;
  skillSet: string;

  fatherName: string;
  fatherDateOfBirth: string;
  fatherOccupation: string;
  fatherAlive: boolean;

  motherName: string;
  motherDateOfBirth: string;
  motherOccupation: string;
  motherAlive: boolean;
}