
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

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  managerId: number | null;
  teamLeaderId?: number | null;
  teamLeaderName?: number | null;
  managerName: string;
  active: boolean;
  joiningDate: string;
  biometricStatus: string;
  vpnStatus: string;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  mustChangePassword?: boolean;
  contactNumber : number | null;
  gender : number | null;
  aadharNumber : number | null;
  personalEmail : number | null;
  dateOfBirth : number | null;
  presentAddress : number | null;
  permanentAddress : number | null;
  bloodGroup : number | null;
  emergencyContactNumber : number | null;
  fatherName : number | null;
  motherName : number | null;
  designation : number |null;
  skillSet : number | null;
  personalDetailsComplete : boolean | null;
  personalDetailsLocked : boolean | null;
}

