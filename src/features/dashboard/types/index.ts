export interface LeaveRecord {
  id: number;
  type: string;
  range: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  applied: string;
  approvedBy: string;
  
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  dept: string;
  status: 'ACTIVE' | 'ON LEAVE';
  role: string;
  initial: string;
  color: string;
}

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
}

export interface DashboardStats {
  title: string;
  used: number;
  total: number;
  color: string;
  icon: string; // or React.ReactNode if passing icons from service
}

export interface ChartData {
  month: string;
  Casual: number;
  Sick: number;
  Earned: number;
}


export interface Notification {
  id: number;
  type: 'success' | 'info' | 'error' | 'default';
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  category: 'Personal' | 'Team' | 'System' | 'All';
}

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

