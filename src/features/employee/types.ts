import type { UserRole } from "@/shared/auth/authTypes";
import type { Gender, BloodGroup, MaritalStatus } from "../auth/types";

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
  // --- Identity & Contact ---
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

  // --- NEW: Bank Details ---
  bankName: string;        // Added this
  accountNumber: string;   // Added this

  // --- Family Details ---
  fatherName: string;
  fatherDateOfBirth: string;
  fatherOccupation: string;
  fatherAlive: boolean;
  motherName: string;
  motherDateOfBirth: string;
  motherOccupation: string;
  motherAlive: boolean;

  // --- Experienced Specific Fields ---
  unaNumber?: string;
  previousRole?: string;
  oldCompanyName?: string;
  oldCompanyFromDate?: string; // Added this
  oldCompanyEndDate?: string;   // Added this

  // --- Document Keys ---
  aadhaarCard?: any; 
  tc?: any;
  offerLetter?: any;
  experienceCertificate?: any;
  leavingLetter?: any;
}