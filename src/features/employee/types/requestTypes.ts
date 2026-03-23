import type { Gender, BloodGroup, MaritalStatus } from "@/features/auth/types";
import type { UserRole } from "@/shared/auth/authTypes";

export interface PersonalDetailsRequest {
  firstName: string;
  lastName: string;
  surName: string;
  contactNumber: string;
  gender: Gender;
  aadharNumber: string;
  personalEmail: string;
  dateOfBirth: string;
  presentAddress: string;
  permanentAddress: string;
  bloodGroup: BloodGroup;
  maritalStatus: MaritalStatus;
  emergencyContactNumber?: string;
  designation: string;
  skillSet: string;

  bankName: string;
  accountNumber: string;

  fatherName: string;
  fatherDateOfBirth: string;
  fatherOccupation: string;
  fatherAlive: boolean;
  motherName: string;
  motherDateOfBirth: string;
  motherOccupation: string;
  motherAlive: boolean;

  unaNumber?: string;
  previousRole?: string;
  oldCompanyName?: string;
  oldCompanyFromDate?: string;
  oldCompanyEndDate?: string;

  aadhaarCard?: any;
  tc?: any;
  offerLetter?: any;
  experienceCertificate?: any;
  leavingLetter?: any;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  teamId?: number | null;
  teamLeaderId?: number | null;
  managerId?: number | null;
  joiningDate: string;
}