export interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;

  managerId: number | null;
  managerName: string;
  teamLeaderId: number;
  teamLeaderName: string;
  hrname: string;

  joiningDate: string;

  contactNumber: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
  bloodGroup: string;

  personalEmail: string;
  aadharNumber: string;

  presentAddress: string;
  permanentAddress: string;

  emergencyContactNumber: string;

  fatherName: string;
  motherName: string;

  designation: string;
  skillSet: string[];

  biometricStatus: string;
  vpnStatus: string;

  active: boolean;
  mustChangePassword: boolean;

  createdAt?: string;
  updatedAt?: string;

  personalDetailsComplete: boolean;
  personalDetailsLocked: boolean;

  verificationStatus: string;
  hrRemarks?: string;

  employeeType: string;

  fullName: string;
  lastName?: string;
  surName?: string;

  accountNumber?: string;
  bankName?: string;
  pfNumber?: string;
  unaNumber?: string;
}