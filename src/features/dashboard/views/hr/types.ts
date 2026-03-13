// ─── Unions ──────────────────────────────────────────────────────
export type OnboardingStatus = 'PENDING' | 'COMPLETED' | 'IN_PROGRESS';

// ─── Team / Employees ────────────────────────────────────────────
export interface TeamMember {
  employeeId:          number;
  employeeName:        string;
  email:               string;
  yearlyBalance:       number;
  carryForwardBalance: number;
  compOffBalance:      number;
}

export interface TeamStructure {
  managerId:       number;
  managerName:     string;
  teamMemberCount: number;
  teamMembers:     TeamMember[];
}

export interface OnboardingEmployee {
  employeeId:       number;
  employeeName:     string;
  email:            string;
  joiningDate:      string;
  biometricStatus:  OnboardingStatus;
  vpnStatus:        OnboardingStatus;
  daysInOnboarding: number; // negative = future joiner
}

export interface EmployeeOnLeave {
  employeeId:   number;
  employeeName: string;
  leaveType:    string;
  department?:  string;
}

export interface ManagerApprovalStat {
  managerId:       number;
  managerName:     string;
  department?:     string;
  approvedCount?:  number;
  pendingCount?:   number;
  rejectedCount?:  number;
  avgApprovalHrs?: number;
}

// ─── Low Balance ─────────────────────────────────────────────────
export interface LowBalanceEmployee {
  employeeId:       number;
  employeeName:     string;
  totalAllocated:   number;
  totalUsed:        number;
  totalRemaining:   number;
  compOffBalance:   number | null;
  lopPercentage:    number | null;
  totalWorkingDays: number | null;
}

// ─── Exact API Response from GET /dashboard/hr ───────────────────
export interface DashboardResponse {
  currentYear:                number;
  lastUpdated:                string;
  totalEmployees:             number;
  activeEmployees:            number;
  employeesOnLeaveToday:      number;
  totalPendingLeaves:         number;
  totalApprovedLeaves:        number;
  newEmployeesCount:          number;
  pendingBiometricCount:      number;
  pendingVPNCount:            number;
  totalManagersWithApprovals: number;
  teamStructure:              TeamStructure[];
  onboardingPendingList:      OnboardingEmployee[];
  employeesOnLeave:           EmployeeOnLeave[];
  managerApprovalStats:       ManagerApprovalStat[];
}











// export interface DashboardResponse {
//   summaryStats: { compOffUsed?: number | undefined; halfDayLeaves?: number | undefined; avgUtilization?: string | number | undefined; };
//   currentYear: number;
//   lastUpdated: string;
//   totalEmployees: number;
//   activeEmployees: number;
//   employeesOnLeaveToday: number;
//   totalPendingLeaves: number;
//   totalApprovedLeaves: number;
//   newEmployeesCount: number;
//   pendingBiometricCount: number;
//   pendingVPNCount: number;
//   onboardingPendingList: OnboardingEmployee[];
//   employeesOnLeave: any[];
//   totalManagersWithApprovals: number;
//   managerApprovalStats: any[];
//   teamStructure: TeamStructure[];
// }

// export interface OnboardingEmployee {
//   employeeId: number;
//   employeeName: string;
//   email: string;
//   joiningDate: string;
//   biometricStatus: string;
//   vpnStatus: string;
//   daysInOnboarding: number;
// }

// export interface TeamStructure {
//   managerId: number;
//   managerName: string;
//   teamMemberCount: number;
//   teamMembers: TeamMember[];
// }

// export interface TeamMember {
//   employeeId: number;
//   employeeName: string;
//   email: string;
//   yearlyBalance: number;
//   carryForwardBalance: number;
//   compOffBalance: number;
// }
















// // export interface DepartmentData {
// //   name: string;
// //   leaves: number;
// // }

// // export interface ManagerTracking {
// //   name: string;
// //   approved: number;
// //   pending: number;
// //   rejected: number;
// // }


// // export interface ManagerData {
// //   name: string;
// //   department: string;
// //   approved: number;
// //   pending: number;
// //   rejected: number;
// //   avgApprovalHrs: number;
// // }

// // export interface LeaveInsight {
// //   manager: string;
// //   employee: string;
// //   type: string;
// //   date: string;
// // }