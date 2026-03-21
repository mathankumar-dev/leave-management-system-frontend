import type { UserRole } from "../../auth/types";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type HalfDayLeaveType = "FIRST_HALF" | "SECOND_HALF";
export type LeaveType = 'SICK' | 'ANNUAL_LEAVE' | 'MATERNITY' | 'PATERNITY' | 'COMP_OFF' | 'ON_DUTY' | 'VPN' | 'BIOMETRIC';

export type LeaveDecision = 'APPROVED' | 'REJECTED' | 'MEETING_REQUIRED';

export type ODStatus = 'PENDING_TEAM_LEADER' | 'PENDING_MANAGER' | 'PENDING_HR' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  startDateHalfDayType: string | null;
  endDateHalfDayType: string | null;
  isAppointment: boolean | null;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  teamLeaderDecision: string | null;
  teamLeaderDecidedAt: string | null;
  managerDecision: string | null;
  managerDecidedAt: string | null;
  hrDecision: string | null;
  carryForwardUsed: number;
  compOffUsed: number;
  lossOfPayApplied: number;
  pendingLopDays: number | null;
  createdAt: string;
  escalated: boolean;
  escalatedAt: string | null;
  managerId: number;
  version: number;
  attachments: string[];
}

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
  skillSet: string[] ;

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


export interface LeaveDecisionRequest {
  leaveId: number;
  approverId: number;
  decision: LeaveDecision;
  comments?: string;
}

// ==============================
// Employee
// ==============================

export interface Employee {
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


// ==============================
// Approval Request
// ==============================

export interface ApprovalRequest {

  id: number;

  initial: string;

  employee: string;

  dept: string;

  type: string;

  range: string;

  days: number;

  avatarColor?: string;

  appliedOn: string;

  balance: number;

  reason: string;

}


// ==============================
// Dashboard Stats
// ==============================

export interface DashboardStats {

  title: string;

  used: number;

  total: number;

  color: string;

  icon: string;

}


// ==============================
// Chart Data
// ==============================

export interface ChartData {

  month: string;

  Casual: number;

  Sick: number;

  Earned: number;

}



// ==============================
// Notification
// ==============================

export interface Notification {

  id: number;

  type: 'success' | 'info' | 'error' | 'default';

  title: string;

  desc: string;

  time: string;

  unread: boolean;

  category: 'Personal' | 'Team' | 'System' | 'All';

}


// ==============================
// Audit Log
// ==============================

export interface AuditLog {

  action: string;

  target: string;

  actor: string;

  role: 'Manager' | 'Employee' | 'Admin' | 'System Admin';

  time: string;

  timestamp: string;

  status: 'success' | 'error' | 'security' | 'info';

  details: string;

  icon: React.ReactNode;

}


// ==============================
// Profile
// ==============================





export interface PendingLeaveApplication {
  id: number;

  employeeId: number;
  employeeName: string;

  leaveType: LeaveType;

  halfDayType?: HalfDayLeaveType | null;
  startDateHalfDayType?: HalfDayLeaveType | null;
  endDateHalfDayType?: HalfDayLeaveType | null;

  isAppointment: boolean;
  appointment: boolean;

  year: number;

  startDate: string;
  endDate: string;
  days: number;

  reason: string;
  status: string;

  currentApprovalLevel: string;
  requiredApprovalLevels: number;

  teamLeaderId?: number;
  teamLeaderDecision?: string | null;
  teamLeaderDecidedAt?: string | null;

  managerId?: number;
  managerDecision?: string | null;
  managerDecidedAt?: string | null;

  hrId?: number;
  hrDecision?: string | null;
  hrDecidedAt?: string | null;
  hrDecidedBy?: number | null;

  approvedBy?: number | null;
  approvedRole?: string | null;
  approvedAt?: string | null;

  carryForwardUsed: number;
  compOffUsed: number;
  lossOfPayApplied: number;
  pendingLopDays?: number | null;

  createdAt: string;
  updatedAt: string;

  escalated: boolean;
  escalatedAt?: string | null;

  version: number;

  confirmLossOfPay?: boolean;
}


export interface Attachment {
  id: number;
  leaveApplicationId: number;
  fileName: number;
  fileUrl: number;
  fileType: number;
  fileSize: number;
  uploadedAt: number;
}

export interface PendingLeaveApplicationApiResponse {
  leaveApplication: PendingLeaveApplication;
  attachments?: Attachment[];
}

export interface TeamMemberBalance {
  employeeId: number;
  employeeName: string;
  totalAllocated: number | null;
  totalUsed: number | null;
  totalRemaining: number | null;
  compOffBalance: number | null;
  lopPercentage: number | null;
  totalWorkingDays: number | null;
}

export type TeamCalendarResponse = Record<string, TeamMemberBalance[]>;


export type CompOffEntry = {
  workedDate: string;
  plannedLeaveDate?: string | null;
  days: number;
};



export type CompOffRequest = {
  employeeId: number;
  entries: CompOffEntry[];
};



export type CompOffResponse = {
  compoffId: number;
  employeeId: number;
  employeeName: string;
  workedDate: string;
  status: 'PENDING' | 'REJECTED' | 'USED';
  days: number;
  createdAt: number;
}

export type LeaveBreakDown = {
  leaveType: LeaveType;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  halfDayCount: number;
  pendingCount?: number;
}

export interface EmployeeData {
  employeeId: number;
  employeeName: string;
  currentYear: number;
  yearlyAllocated: number;
  yearlyUsed: number;
  yearlyBalance: number;
  monthlyAllocated: number;
  monthlyUsed: number;
  monthlyBalance: number;
  carryForwardTotal: number;
  carryForwardUsed: number;
  carryForwardRemaining: number;
  compoffBalance: number;
  lossOfPayPercentage: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;
  breakdown: LeaveBreakDown[];

}

export interface LeaveTypeBreakdown {
  leaveType: LeaveType;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveBalanceResponse {
  employeeId: number;
  employeeName: string;
  year: number;

  // Total leave statistics
  totalAllocated: number;
  totalUsed: number;
  totalRemaining: number;

  // Comp-Off stats
  compOffBalance: number;
  compOffEarned: number;
  compOffUsed: number;

  lopPercentage: number;

  // Carry Forward
  carriedFromLastYear: number;
  eligibleToCarry: number;

  // Monthly Stats
  currentMonthApproved: number;
  exceededMonthlyLimit: boolean;

  // Working Days
  totalWorkingDays: number;

  // Breakdown per leave type
  breakdown: LeaveTypeBreakdown[];
}

export type TeamPendingLeave = {
  leaveId: number;
  employeeId: number;
  employeeName: string;
  leaveType: LeaveType;
  reason: string;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  days: number;
  appliedAt: string;
}

export type TeamMemberOnLeave = {
  employeeId: number;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface ManagerDashBoardResponse {
  personalStats: EmployeeData;
  teamSize: number;
  teamPendingRequestCount: number;
  teamOnLeaveCount: number;
  pendingTeamRequests: TeamPendingLeave[];
  teamOnLeaveToday: TeamMemberOnLeave[];
}

export interface AdminDashBoardResponse {
  // Admin's Personal View (Consistency)
  personalStats: EmployeeData;

  // Metadata
  currentYear: number;
  lastUpdated: string; // or Date

  // Compliance & Audit Metrics
  totalEmployees: number;
  totalManagers: number;
  newEmployeesPendingOnboarding: number;
  totalPendingLeaves: number;
  totalRejectedLeaves: number;

  // Organization-wide Leave Statistics
  totalLeaveDaysUsedYTD: number;
  totalCarryForwardBalance: number;
  totalCompOffBalance: number;
  averageLossOfPayPercentage: number;

  // Detailed Data Lists
  leaveTypeUsage: GlobalLeaveTypeUsage[];
  recentRejections: RejectedLeaveAudit[];
  complianceIssues: EmployeeCompliance[];
  newEmployeesStatus: OnboardingStatus[];
}

export interface GlobalLeaveTypeUsage {
  leaveType: string; // e.g., "SICK", "VACATION"
  totalAllocated: number;
  totalUsed: number;
  totalBalance: number;
  countOfApplications: number;
  averagePerEmployee: number;
}

export interface RejectedLeaveAudit {
  leaveId: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  rejectedBy: number;
  rejectedByName: string;
  rejectedAt: string;
}

export interface EmployeeCompliance {
  employeeId: number;
  employeeName: string;
  issue: string; // e.g., "Negative Balance Detected"
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  detectedDate: string;
  recommendation: string;
}

export interface OnboardingStatus {
  employeeId: number;
  employeeName: string;
  email: string;
  joiningDate: string;
  daysInCompany: number;
  biometricStatus: string; // Matches your Java BiometricVpnStatus enum
  vpnStatus: string;
  onboardingComplete: boolean;
  completionDate?: string;
}


export interface ODRequest {
  employeeId: number;
  employeeName?: string | null;
  reason: string;
  startDate: string;
  endDate: string;
}

export interface ODResponse {
  id: number;
  employeeId: string;
  employeeName?: string | null;
  reason: string;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  status: ODStatus;
  createdAt: string;
}


export interface MeetingRequest {
  title: string;
  startTime: string;
  endTime: string;
  type?: string;
  locationOrLink?: string;
  agenda?: string;
  priority?: string;
}




export interface TeamMember {
  employeeName: string;
  employeeId: number;
  designation: string | null;
  skills: string | null;
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
export interface EmployeeFilters {
  name?: string;
  email?: string;
  role?: string;
  managerId?: number;
  active?: boolean;
  page?: number;
  size?: number;
}

export type BiometricVpnStatus = 'PENDING' | 'PROVIDED';

export interface EmployeeEntity {
  id: number;
  teamId: number | null;
  teamLeaderId: number | null;
  name: string;
  email: string;
  role: UserRole;
  managerId: number | null;
  active: boolean;

  // HR Dashboard Fields
  joiningDate: string;
  biometricStatus: BiometricVpnStatus;
  vpnStatus: BiometricVpnStatus;
  onboardingCompletedAt: string | null;

  // Audit Fields
  createdAt: string;
  updatedAt: string;
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


export interface PendingOnboardingResponse {
  id: number;
  employeeId : number;
  employeeName: string;
  employeeEmail: string;
  employeeDesignation : string;
  accessType : LeaveType ;
  status :  string;
  reason : string;
  createdAt : string;
  managerDecision : LeaveDecision;
  managerRemarks : string;
  managerDecisionAt : string;
  managerName : string;

}

export interface FlashNewsRequest {
  message: string;
  days: number;
  priority?: number;
}

export interface FlashNews {
  id: number;
  priority: number;
  message: string;
  active: boolean;
  createdAt: string;
}


export type accessManagerDecision = 'APPROVED' | 'REJECTED';
export interface AccessResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  employeeDesignation: string;
  accessType: LeaveType;
  status: string;
  reason: string;
  submittedAt: string;
  createdAt: string;
  managerDecision?: accessManagerDecision;
  managerRemarks?: string;
  managerDecisionAt?: string;
  managerName?: string;

}

export interface AccessRequest {
  accessType : LeaveType;
  reason : string;
}


export interface ManagerAccessDecision{
  decision : LeaveDecision,
  remarks : string;
  managerId : number;
}
export interface AdminAccessDecision {
  decision : LeaveDecision,
  remarks? : string;
}

export interface YearlySummary  {
  year: number;
  totalBasic: number;
  totalHra: number;
  totalConveyance: number;
  totalMedical: number;
  totalOtherAllowance: number;
  totalBonus: number;
  totalIncentive: number;
  totalStipend: number;
  totalPf: number;
  totalEsi: number;
  totalProfessionalTax: number;
  totalTds: number;
  totalLop: number;
  totalGrossSalary: number;
  totalNetSalary: number;
};