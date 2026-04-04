
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
  uanNumber?: string;
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
  empId: string;           // Matches private String empId
  name: string;            // Matches private String name
  email: string;           // Matches private String email
  roleId: number;          // Matches private Long roleId (using number in TS)
  reportingId?: string | null; // Matches private String reportingId
  teamId?: number | null;  // Matches private Long teamId
  departmentId: number;    // Matches private Long departmentId
  branchId: number;        // Matches private Long branchId
  joiningDate: string;     // Matches LocalDate (sent as ISO string)
  employeeExperience: string; // Matches the Enum/String on backend
}