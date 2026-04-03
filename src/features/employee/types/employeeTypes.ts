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
  id: string;
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

// export interface PersonalDetails {
//   firstName: string;
//   lastName: string;
//   contactNumber: string;
//   accountNumber: string;
//   bankName: string;
//   pfNumber: string;
//   unaNumber?: string | null;
//   gender: Gender;
//   maritalStatus: MaritalStatus;
//   aadharNumber: string;
//   personalEmail: string;
//   dateOfBirth: string;
//   presentAddress: string;
//   permanentAddress: string;
//   bloodGroup: BloodGroup;

//   emergencyContactNumber: string;
//   fatherName: string;
//   motherName: string;
//   designation: string;
//   skillSet: string;

//   // DOC
//   aadhaarDocPath: string;
//   tcDocPath: string;
//   offerLetterDocPath: string;
//   experienceCertDocPath: string;
//   leavingLetterDocPath: string;

//   previousRole?: string | null;
//   oldCompanyName?: string | null;
//   oldCompanyFromDate?: string | null;
//   oldCompanyEndDate: string | null;


// }

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
  employeeId: string;
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
  employeeId: string;
  designation: string | null;
  skills: string | null;
}



