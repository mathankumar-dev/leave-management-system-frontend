
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type HalfDayLeaveType = "FIRST_HALF" | "SECOND_HALF";
export type LeaveType = "SICK" | "CASUAL" | "EARNED_LEAVES" | "COMP_OFF";

export type LeaveDecision = 'APPROVED' | 'REJECTED' | 'MEETING_REQUIRED';

export interface LeaveRecord {
  id: number;
  employeeId: number;
  leaveType: LeaveType;
  halfDayType: string | null;
  year: number;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy: number | null;
  approvedRole: string | null;
  approvedAt: string | null;
  carryForwardUsed: number;
  compOffUsed: number;
  lossOfPayApplied: number;
  createdAt: string;
  updatedAt: string;
  escalated: boolean;
  escalatedAt: string | null;
  managerId: number;
  version: number;
  attachments: string[];
}


export interface LeaveDecisionRequest {
  leaveId: number;
  managerId: number;
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

export interface ProfileData {

  name?: string;
  role: string;

  email: string;

  phone: string;

  id: number;

  photo: string;

  department: string;

  designation: string;

  joiningDate: string;

  workLocation: string;

  managerName: string;
  managerId?: number;

  employmentType: 'Full-time' | 'Contract' | 'Intern';

  dob: string;

  gender: string;

  bloodGroup?: string;

  nationality: string;

  address: string;

  linkedin?: string;

  github?: string;

  skills: string[];

}



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
  leaveType : LeaveType;
  allocatedDays : number;
  usedDays : number;
  remainingDays : number;
  halfDayCount : number;
}

export interface EmployeeData  {
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

export type TeamPendingLeave = {
  leaveId : number;
  employeeId : number;
  employeeName : string;
  leaveType : LeaveType;
  reason : string;
  status : LeaveStatus;
  startDate : string;
  endDate : string;
  days : number;
  appliedAt : string;
}

export type TeamMemberOnLeave = {
  employeeId : number;
  employeeName : string;
  leaveType : LeaveType;
  startDate : string;
  endDate : string;
  daysRemaining : number;
}

export interface ManagerDashBoardResponse  {
  personalStats : EmployeeData;
  teamSize : number;
  teamPendingRequestCount : number;
  teamOnLeaveCount : number;
  pendingTeamRequests : TeamPendingLeave[];
  teamOnLeaveToday : TeamMemberOnLeave[];
}