
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type HalfDayLeaveType = "FIRST_HALF" | "SECOND_HALF";
export type LeaveType = 'SICK'|'ANNUAL_LEAVE'|'MATERNITY'|'PATERNITY'|'COMP_OFF';

export type LeaveDecision = 'APPROVED' | 'REJECTED' | 'MEETING_REQUIRED';

export type ODStatus = 'PENDING_TEAM_LEADER'| 'PENDING_MANAGER' | 'PENDING_HR' | 'APPROVED' | 'REJECTED' | 'CANCELLED' ;

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

  joiningDate: string;

  contactNumber: string;
  gender: string;
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

  createdAt?: string;
  updatedAt?: string;

  personalDetailsComplete: boolean;
  personalDetailsLocked: boolean;

  photo?: string;
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
  department: string;
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





export interface LeaveApplication {
  employeeId: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  halfDayType?: HalfDayLeaveType;
  confirmLossOfPay?: boolean;

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


export interface ODRequest {
  employeeId: number;
  reason: string;
  fromDate: string;
  toDate: string;
}

export interface ODResponse {
  id : number;
  employeeId : string;
  reason : string;
  fromDate : string;
  toDate : string;
  status : ODStatus;
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


export interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;

  managerId: number;
  managerName: string;

  designation: string;
  joiningDate: string;

  contactNumber: string;
  dateOfBirth: string;
  gender: string;

  presentAddress: string;
  permanentAddress: string;

  bloodGroup: string;

  fatherName: string;
  motherName: string;

  emergencyContactNumber: string;

  personalEmail: string;
  aadharNumber: string;

  skillSet: string[];

  biometricStatus: string;
  vpnStatus: string;

  personalDetailsLocked: boolean;

  photo?: string;
}


export interface TeamMember {
  employeeName : string;
  employeeId : number;
  designation : string | null;
  skills : string | null;
}