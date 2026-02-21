// export interface DepartmentData {
//   name: string;
//   leaves: number;
// }

// export interface ManagerTracking {
//   name: string;
//   approved: number;
//   pending: number;
//   rejected: number;
// }


export interface ManagerData {
  name: string;
  department: string;
  approved: number;
  pending: number;
  rejected: number;
  avgApprovalHrs: number;
}

export interface LeaveInsight {
  manager: string;
  employee: string;
  type: string;
  date: string;
}