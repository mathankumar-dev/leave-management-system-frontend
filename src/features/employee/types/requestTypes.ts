
import type { UserRole } from "@/shared/auth/authTypes";
import type { BloodGroup, Gender, MaritalStatus } from "@/shared/types";

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  contactNumber: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  aadharNumber: string;
  personalEmail: string;
  dateOfBirth: string;
  presentAddress: string;
  permanentAddress: string;
  bloodGroup: BloodGroup;
  emergencyContactNumber?: string;
  designation: string;
  skillSet: string;
  accountNumber: string;
  bankName: string;
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

}

export type PersonalDetailsRequest = PersonalDetails; 

export interface MultipartSubmission {
    data: PersonalDetails;
    files: {
        aadhaarCard: File;
        tc?: File;
        offerLetter?: File;
        experienceCertificate?: File;
        leavingLetter?: File;
    }
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  teamId?: number | null;
  teamLeaderId?: number | null;
  managerId?: number | null;
  joiningDate: string;
  employeeExperience: string;
}