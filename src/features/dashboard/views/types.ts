
// =========================
//     HR data types
// ===========================

import type { Variable } from "lucide-react";


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
  rejectedCount: number;
  managerId: number;
  managerName: string;
  teamSize: number;
  approvalsThisYear: number;
  pendingRequests: number;
  approvalRate: number;
  lastApprovalData: number;
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

// ------------- payslip salary --------------//

//   export interface Payslip {
//   id: number;
//   employeeId: number;
//   month: number;
//   year: number;
//   basicSalary: number;
//   hra: number;
//   conveyance: number;
//   medical: number | null;
//   otherAllowance: number | null;
//   pf: number;
//   esi: number | null;
//   professionalTax: number;
//   lop: number;
//   netSalary: number;
//   generatedDate: string;
//   status: string;
// }

  // export interface SalaryStructure {
  //   role : string ;
  //   hra :number;
  //   conveyance :number;
  //   medical : number;
  //   otherAllowance : number;
  //   pfPercent : number;
  //   professionalTax  : number;
  //   esiPercent : number ;

  // }

  // export interface EmployeeSalary {
  //   id : number;
  //   employeeId : number;
  //   basicSalary : number;
  //   effectiveFrom : string;
  // }

  // export interface EmployeeSalaryRequest {
  //    employeeId : number
  //    basicSalary : number;
  //    effectiveFrom :string;
  // }



  // ======================
  //    CFO data types
  // ======================


  export interface Payslip {
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medical: number;
  otherAllowance: number;
  bonus: number;
  incentive: number;
  stipend: number;
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  lopDays : number;
  lop: number;
  grossSalary: number;
  netSalary: number;
  variablePay : number;
}

export interface PayslipCreateRequest {
  employeeId: number;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medical: number;
  otherAllowance: number;
  bonus: number;
  incentive: number;
  stipend: number;
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  lop: number;
  lopDays : number;
  variablePay : number;
}

export interface PayslipUpdateRequest extends PayslipCreateRequest {}