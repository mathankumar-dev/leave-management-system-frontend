import React from 'react';
import type { 
  Employee, 
  ApprovalRequest, 
  LeaveRecord, 
  Notification, 
  AuditLog,
  DashboardStats,
  ChartData,
  ProfileData
} from "../features/dashboard/types";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle, 
  FaUserShield 
} from "react-icons/fa";

export const MOCK_TEAM_MEMBERS: Employee[] = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma@company.com",
    dept: "Design",
    status: "ON LEAVE",
    role: "EMPLOYEE",
    designation: "UI Designer",
    initial: "EW",
    color: "bg-rose-500",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@company.com",
    dept: "Engineering",
    status: "ACTIVE",
    role: "EMPLOYEE",
    designation: "Frontend Developer",
    initial: "SJ",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "mike@company.com",
    dept: "Engineering",
    status: "ACTIVE",
    role: "EMPLOYEE",
    designation: "Backend Developer",
    initial: "MC",
    color: "bg-emerald-500",
  },
  {
    id: 4,
    name: "Alex Rivera",
    email: "alex@company.com",
    dept: "Operations",
    status: "ACTIVE",
    role: "MANAGER",
    designation: "Project Manager",
    initial: "AR",
    color: "bg-indigo-500",
  },
];


export const MOCK_PENDING_REQUESTS: ApprovalRequest[] = [
  {
    id: 101, initial: "MC", employee: "Michael Chen", dept: "Engineering", type: "WFH", range: "Feb 05 - Feb 06", days: 2, appliedOn: "2026-01-30", avatarColor: "bg-indigo-500",
    balance: 0,
    reason: 'okay'
  },
  {
    id: 102, initial: "AR", employee: "Alex Rivera", dept: "Operations", type: "Annual Leave", range: "Feb 10 - Feb 15", days: 5, appliedOn: "2026-01-28", avatarColor: "bg-emerald-500",
    balance: 0,
    reason: 'no idea'
  },
];

export const MOCK_LEAVE_HISTORY: LeaveRecord[] = [
  { id: 1, type: "Annual", range: "Jan 10 - Jan 12", days: 3, status: "Approved", applied: "2026-01-01", approvedBy: "Alex Manager" },
  { id: 2, type: "Sick", range: "Jan 25 - Jan 25", days: 1, status: "Rejected", applied: "2026-01-24", approvedBy: "Alex Manager" },
];

// DATA FOR DASHBOARD STAT CARDS
export const MOCK_DASHBOARD_STATS: DashboardStats[] = [
  { 
    title: "Annual Leave", 
    used: 8, 
    total: 20, 
    color: "#6366f1", // Indigo 500
    icon: "plane" 
  },
  { 
    title: "Sick Leave", 
    used: 2, 
    total: 10, 
    color: "#f43f5e", // Rose 500
    icon: "medical" 
  },
  { 
    title: "Casual Leave", 
    used: 3, 
    total: 7, 
    color: "#f59e0b", // Amber 500
    icon: "clock" 
  },

];

// DATA FOR DASHBOARD CHART
export const MOCK_CHART_DATA: ChartData[] = [
  { month: "Sep", Casual: 1, Sick: 2, Earned: 0 },
  { month: "Oct", Casual: 4, Sick: 1, Earned: 2 },
  { month: "Nov", Casual: 2, Sick: 0, Earned: 1 },
  { month: "Dec", Casual: 5, Sick: 3, Earned: 4 },
  { month: "Jan", Casual: 2, Sick: 1, Earned: 1 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'success', title: "Leave Approved", desc: "Your annual leave for next week has been approved.", time: "2 hours ago", unread: true, category: 'Personal' },
  { id: 2, type: 'info', title: "System Maintenance", desc: "The portal will be down for 30 mins at midnight.", time: "5 hours ago", unread: false, category: 'System' }
];

export const MOCK_CALENDAR_LEAVES: Record<number, any[]> = {
  2: [{ name: "Sarah Johnson", type: "Annual Leave", color: "bg-emerald-500" }],
  5: [{ name: "Michael Chen", type: "WFH", color: "bg-indigo-500" }, { name: "Emma Wilson", type: "Sick Leave", color: "bg-rose-500" }],
  12: [{ name: "Alex Rivera", type: "Casual Leave", color: "bg-amber-500" }],
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { action: "Login", target: "System Access", actor: "Admin User", role: "System Admin", time: "09:00 AM", timestamp: "2026-02-01T09:00:00Z", status: "success", details: "Successful login", icon: <FaUserShield className="text-indigo-500" /> },
  { action: "Leave Approved", target: "Sarah Johnson", actor: "Alex Manager", role: "Manager", time: "10:15 AM", timestamp: "2026-02-01T10:15:00Z", status: "success", details: "Approved Annual Leave", icon: <FaCheckCircle className="text-emerald-500" /> },
];

export const MOCK_LEAVE_TYPES = [
  { id: 1, name: "Annual Leave", total: 20, used: 5, color: "bg-emerald-500" },
  { id: 2, name: "Sick Leave", total: 10, used: 2, color: "bg-rose-500" },
];



export const MOCK_PROFILE: ProfileData = {
  // Identity
  name: "Johnathan Wick",
  role: "Lead Software Architect",
  email: "j.wick@continental.com",
  phone: "+1 (555) 042-9901",
  employeeId: "EMP-2026-0402",
  photo: "https://placehold.co/600x400/000000/FFFFFF/png",

  // Work Information
  department: "Product Engineering",
  designation: "Lead Architect",
  joiningDate: "2023-03-15",
  workLocation: "New York Hub (Hybrid)",
  managerName: "Winston Scott",
  employmentType: 'Full-time',

  // Personal Details
  dob: "1990-09-12",
  gender: "Male",
  bloodGroup: "A-",
  nationality: "American",
  address: "420 Park Avenue, Suite 10, New York, NY 10022",

  // Social & Professional
  linkedin: "linkedin.com/in/johnwick",
  github: "github.com/johnwick-dev",
  skills: ["React", "TypeScript", "Node.js", "Kubernetes", "AWS"]
};