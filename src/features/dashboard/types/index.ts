// ==============================
// Leave Record
// ==============================

export interface LeaveRecord {

  id: number;

  type: string;

  range: string;

  days: number;

  status: 'Approved' | 'Pending' | 'Rejected';

  applied: string;

  approvedBy: string;

}


// ==============================
// Employee
// ==============================

export interface Employee {

  id: number;

  name: string;

  email: string;

  dept: string;

  status: "ACTIVE" | "ON LEAVE";

  role: "EMPLOYEE" | "MANAGER" | "HR";

  designation: string;

  initial: string;

  color: string;

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
  // Identity & Basic Info
  name?: string;
  role: string;

  email: string;

  phone: string;

  employeeId: string;

  photo: string;

  department: string;

  designation: string;

  joiningDate: string;

  workLocation: string;

  managerName: string;

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
