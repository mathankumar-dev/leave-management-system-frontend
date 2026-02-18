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
  status: "ACTIVE" | "ON LEAVE";
  role: "EMPLOYEE" | "MANAGER" | "HR";
  designation: string;   // 👈 job title
  initial: string;
  color: string;
}



// export interface ApprovalRequest {
//   id: number;
//   initial: string;
//   employee: string;
//   dept: string;
//   type: string;
//   range: string;
//   days: number;
//   avatarColor?: string;
//   appliedOn: string;
// }


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
  // --- ADD THESE ---
  balance: number; // Mandatory: To show "Days Left" in UI
  reason: string;  // Mandatory: To show "Reason" snippet in table
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




export interface ProfileData {
  // Identity & Basic Info
  name: string;
  role: string;
  email: string;
  phone: string;
  employeeId: string;
  photo: string;
  
  // Work Information
  department: string;
  designation: string;
  joiningDate: string;
  workLocation: string;
  managerName: string;
  employmentType: 'Full-time' | 'Contract' | 'Intern';
  
  // Personal Details
  dob: string;
  gender: string;
  bloodGroup?: string;
  nationality: string;
  address: string;
  
  // Social & Professional
  linkedin?: string;
  github?: string;
  skills: string[];
}