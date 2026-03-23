import type { LeaveBreakDown } from "@/features/leave/types";

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