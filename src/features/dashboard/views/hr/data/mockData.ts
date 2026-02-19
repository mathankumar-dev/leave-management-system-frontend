import type { ReactNode } from "react";

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];

export const departmentLeaveData = [
  { department: 'Engineering', leaves: 18, employees: 45 },
  { department: 'Product', leaves: 9, employees: 22 },
  { department: 'Design', leaves: 5, employees: 15 },
  { department: 'Marketing', leaves: 11, employees: 28 },
  { department: 'Sales', leaves: 7, employees: 32 },
  { department: 'HR', leaves: 3, employees: 14 },
];

export const leaveTypeDistribution = [
  { name: 'Casual', value: 28, color: '#8B5CF6' },
  { name: 'Sick', value: 15, color: '#EF4444' },
  { name: 'Earned', value: 22, color: '#3B82F6' },
  { name: 'Comp Off', value: 8, color: '#10B981' },
  { name: 'Loss of Pay', value: 4, color: '#6B7280' },
];

export const managerTrackingData = [
  { name: 'Sarah Wilson', department: 'Engineering', approved: 24, pending: 3, rejected: 2, avgApprovalHrs: 4.2 },
  { name: 'John Peters', department: 'Marketing', approved: 18, pending: 5, rejected: 4, avgApprovalHrs: 8.1 },
  { name: 'Lisa Chen', department: 'Product', approved: 15, pending: 1, rejected: 1, avgApprovalHrs: 2.5 },
  { name: 'Mike Brown', department: 'Sales', approved: 20, pending: 4, rejected: 3, avgApprovalHrs: 6.3 },
  { name: 'Anna Davis', department: 'Design', approved: 10, pending: 2, rejected: 0, avgApprovalHrs: 3.8 },
];

// ---------------- LOW LEAVE BALANCE ----------------

export interface LowBalanceEmployee {
  leaveType: ReactNode;
  remaining: number;
  id: number;
  name: string;
  department: string;
  remainingLeaves: number;
}

export const lowBalanceEmployees: LowBalanceEmployee[] = [
  {
    id: 1,
    name: "Arun Kumar",
    department: "IT",
    remainingLeaves: 1,
    leaveType: undefined,
    remaining: 0
  },
  {
    id: 2,
    name: "Priya Sharma",
    department: "HR",
    remainingLeaves: 2,
    leaveType: undefined,
    remaining: 0
  },
  {
    id: 3,
    name: "Vikram Singh",
    department: "Finance",
    remainingLeaves: 0,
    leaveType: undefined,
    remaining: 0
  },
];


// ---------------- FREQUENT LEAVE PATTERNS ----------------

export interface FrequentLeavePattern {
  frequency: ReactNode;
  flag: string;
  id: number;
  name: string;
  department: string;
  leaveCountLast3Months: number;
}

export const frequentLeavePatterns: FrequentLeavePattern[] = [
  {
    id: 1,
    name: "Rohit Mehta",
    department: "IT",
    leaveCountLast3Months: 8,
    frequency: undefined,
    flag: ""
  },
  {
    id: 2,
    name: "Sneha Reddy",
    department: "Operations",
    leaveCountLast3Months: 6,
    frequency: undefined,
    flag: ""
  },
];


// ---------------- REJECTED LEAVE SUMMARY ----------------

export interface RejectedLeaveSummary {
  manager: ReactNode;
  reason: ReactNode;
  type: ReactNode;
  employee: ReactNode;
  leaveType: string;
  count: number;
}

export const rejectedLeaveSummary: RejectedLeaveSummary[] = [
  {
    leaveType: "Casual Leave",
    count: 3,
    manager: undefined,
    reason: undefined,
    type: undefined,
    employee: undefined
  },
  {
    leaveType: "Sick Leave",
    count: 2,
    manager: undefined,
    reason: undefined,
    type: undefined,
    employee: undefined
  },
  {
    leaveType: "Earned Leave",
    count: 1,
    manager: undefined,
    reason: undefined,
    type: undefined,
    employee: undefined
  },
];

// export const monthlyTrendData = [
//   { month: "Jan", leaves: 10 },
//   { month: "Feb", leaves: 20 },
//   { month: "Mar", leaves: 30 },
//   { month: "Apr", leaves: 15 },
// ];

// 1. Department-wise Leaves Data (from your screenshot)
export const departmentData = [
  { name: 'Engineering', leaves: 18 },
  { name: 'Product', leaves: 9 },
  { name: 'Design', leaves: 5 },
  { name: 'Marketing', leaves: 11 },
  { name: 'Sales', leaves: 10 },
  { name: 'HR', leaves: 4 },
];

// 2. Leave Type Distribution (from your screenshot)
export const leaveTypeData = [
  { name: 'Casual', value: 36, color: '#8b5cf6' }, 
  { name: 'Sick', value: 19, color: '#ef4444' },   
  { name: 'Earned', value: 29, color: '#3b82f6' }, 
  { name: 'Comp Off', value: 10, color: '#10b981' }, 
  { name: 'Loss of Pay', value: 6, color: '#64748b' }, 
];

// 3. Monthly Trend Data (replicated from your trend chart)
export const monthlyTrendData = [
  { month: 'Jan', applied: 20, approved: 15, rejected: 2 },
  { month: 'Feb', applied: 35, approved: 28, rejected: 5 },
  { month: 'Mar', applied: 25, approved: 20, rejected: 3 },
  // ... and so on for the year
];


// ... and the rest of your mock objects (lowBalanceEmployees, patterns, etc.)




// import type { DepartmentData, ManagerTracking } from "../types";

// export const MONTHS = ["All", "Jan", "Feb", "Mar", "Apr"];
// export const YEARS = ["2025", "2026"];
// export const DEPARTMENTS = ["All", "HR", "IT", "Finance"];

// export const departmentLeaveData: DepartmentData[] = [
//   { name: "HR", leaves: 20 },
//   { name: "IT", leaves: 45 },
//   { name: "Finance", leaves: 15 },
// ];

// export const leaveTypeDistribution = [
//   { name: "Casual", value: 40 },
//   { name: "Sick", value: 30 },
//   { name: "Earned", value: 30 },
// ];

// export const managerTrackingData: ManagerTracking[] = [
//   { name: "John", approved: 30, pending: 5, rejected: 2 },
//   { name: "Sarah", approved: 20, pending: 10, rejected: 4 },
// ];
