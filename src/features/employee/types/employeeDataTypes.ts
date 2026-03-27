import type { LeaveBreakDown } from "@/features/leave/types";

export interface EmployeeData {
  employeeId: number;
  employeeName: string;
  currentYear: number;
  lastUpdated: string; // Added from your data
  
  // Yearly Totals
  yearlyAllocated: number;
  yearlyUsed: number;
  yearlyBalance: number;

  // Monthly Breakdown (Specific Categories)
  monthlyAnnualAllocated: number; // Updated
  monthlyAnnualUsed: number;      // Updated
  monthlyAnnualBalance: number;   // Updated
  monthlySickAllocated: number;   // Updated
  monthlySickUsed: number;       // Updated
  monthlySickBalance: number;    // Updated
  monthlyTotalBalance: number;   // Added

  // Carry Forward Logic
  carryForwardTotal: number;
  carryForwardUsed: number;
  carryForwardRemaining: number;

  // Additional Balances & Stats
  compoffBalance: number;
  lossOfPayPercentage: number;
  approvedCount: number;
  rejectedCount: number;
  pendingCount: number;

  // Nested Data
  breakdown: LeaveBreakDown[];
}