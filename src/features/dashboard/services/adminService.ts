import api from '../../../api/axiosInstance';
import type { TeamCalendarResponse } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AdminEmployee {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  managerName: string;
  managerId?: number;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: string;
  phone?: string;
  employeeId?: string;
}

export interface AdminManager {
  id: number;
  name: string;
  email: string;
  department: string;
  designation: string;
  teamSize: number;
  status: 'ACTIVE' | 'INACTIVE';
  joiningDate: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  headId?: number;
  headName?: string;
  employeeCount: number;
  createdAt?: string;
}

export interface Team {
  id: number;
  name: string;
  managerId: number;
  managerName: string;
  department: string;
  memberCount: number;
  members?: AdminEmployee[];
}

export interface LeaveConfig {
  id: number;
  leaveType: string;
  displayName: string;
  annualAllocation: number;
  carryForwardAllowed: boolean;
  maxCarryForward: number;
  maxConsecutiveDays: number;
  requiresApproval: boolean;
  applicableGender?: string;
}

export interface OnboardingRequest {
  id: number;
  employeeName: string;
  employeeId: number;
  requestType: 'BIOMETRIC' | 'VPN' | 'SYSTEM_ACCESS';
  requestedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
}

export interface Payslip {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  netSalary: number;
  fileUrl?: string;
  uploadedAt: string;
}

export interface AdminStats {
  totalEmployees: number;
  employeesOnLeaveToday: number;
  pendingLeaveRequests: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  pendingBiometricRequests: number;
  pendingVpnRequests: number;
  newEmployeesThisMonth: number;
}

export interface RecentActivity {
  id: number;
  type: 'EMPLOYEE_ADDED' | 'LEAVE_APPROVED' | 'PAYSLIP_UPLOADED' | 'VPN_APPROVED' | 'BIOMETRIC_PENDING';
  description: string;
  timestamp: string;
  actor?: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const adminService = {

  // Dashboard
  getAdminStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  getRecentActivities: async (): Promise<RecentActivity[]> => {
    const res = await api.get('/admin/recent-activities');
    return res.data;
  },

  // Employees
  getAllEmployees: async (): Promise<AdminEmployee[]> => {
    const res = await api.get('/employees');
    return res.data;
  },

  getEmployee: async (id: number): Promise<AdminEmployee> => {
    const res = await api.get(`/employees/${id}`);
    return res.data;
  },

  createEmployee: async (data: Partial<AdminEmployee>): Promise<AdminEmployee> => {
    const res = await api.post('/employees', data);
    return res.data;
  },

  updateEmployee: async (id: number, data: Partial<AdminEmployee>): Promise<AdminEmployee> => {
    const res = await api.put(`/employees/${id}`, data);
    return res.data;
  },

  deactivateEmployee: async (id: number): Promise<void> => {
    await api.patch(`/employees/${id}/deactivate`);
  },

  activateEmployee: async (id: number): Promise<void> => {
    await api.patch(`/employees/${id}/activate`);
  },

  resetPassword: async (id: number): Promise<void> => {
    await api.post(`/employees/${id}/reset-password`);
  },

  assignManager: async (employeeId: number, managerId: number): Promise<void> => {
    await api.patch(`/employees/${employeeId}/assign-manager`, { managerId });
  },

  // Managers
  getAllManagers: async (): Promise<AdminManager[]> => {
    const res = await api.get('/managers');
    return res.data;
  },

  createManager: async (data: Partial<AdminManager>): Promise<AdminManager> => {
    const res = await api.post('/managers', data);
    return res.data;
  },

  updateManager: async (id: number, data: Partial<AdminManager>): Promise<AdminManager> => {
    const res = await api.put(`/managers/${id}`, data);
    return res.data;
  },

  // Departments
  getAllDepartments: async (): Promise<Department[]> => {
    const res = await api.get('/departments');
    return res.data;
  },

  createDepartment: async (data: Partial<Department>): Promise<Department> => {
    const res = await api.post('/departments', data);
    return res.data;
  },

  updateDepartment: async (id: number, data: Partial<Department>): Promise<Department> => {
    const res = await api.put(`/departments/${id}`, data);
    return res.data;
  },

  deleteDepartment: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },

  // Teams
  getAllTeams: async (): Promise<Team[]> => {
    const res = await api.get('/teams');
    return res.data;
  },

  createTeam: async (data: Partial<Team>): Promise<Team> => {
    const res = await api.post('/teams', data);
    return res.data;
  },

  updateTeam: async (id: number, data: Partial<Team>): Promise<Team> => {
    const res = await api.put(`/teams/${id}`, data);
    return res.data;
  },

  // Leave Config
  getLeaveConfigs: async (): Promise<LeaveConfig[]> => {
    const res = await api.get('/leave-config');
    return res.data;
  },

  updateLeaveConfig: async (id: number, data: Partial<LeaveConfig>): Promise<LeaveConfig> => {
    const res = await api.put(`/leave-config/${id}`, data);
    return res.data;
  },

  createLeaveConfig: async (data: Partial<LeaveConfig>): Promise<LeaveConfig> => {
    const res = await api.post('/leave-config', data);
    return res.data;
  },

  deleteLeaveConfig: async (id: number): Promise<void> => {
    await api.delete(`/leave-config/${id}`);
  },

  // Leave Monitoring
  getActiveLeaves: async () => {
    const res = await api.get('/leaves/active');
    return res.data;
  },

  getAllLeaves: async (params?: { status?: string; month?: number; year?: number }) => {
    const res = await api.get('/leaves', { params });
    return res.data;
  },

  // Onboarding
  getOnboardingRequests: async (): Promise<OnboardingRequest[]> => {
    const res = await api.get('/onboarding');
    return res.data;
  },

  approveOnboarding: async (id: number): Promise<void> => {
    await api.patch(`/onboarding/${id}/approve`);
  },

  rejectOnboarding: async (id: number, remarks?: string): Promise<void> => {
    await api.patch(`/onboarding/${id}/reject`, { remarks });
  },

  // Payslips
  getPayslips: async (params?: { employeeId?: number; year?: number }): Promise<Payslip[]> => {
    const res = await api.get('/payslips', { params });
    return res.data;
  },

  uploadPayslip: async (formData: FormData): Promise<Payslip> => {
    const res = await api.post('/payslips/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateSalary: async (employeeId: number, data: Partial<Payslip>): Promise<void> => {
    await api.put(`/payslips/${employeeId}/salary`, data);
  },

  // Reports
  getLeaveReport: async (params: { startDate?: string; endDate?: string; department?: string }) => {
    const res = await api.get('/reports/leaves', { params });
    return res.data;
  },

  getEmployeeReport: async (params: { department?: string; status?: string }) => {
    const res = await api.get('/reports/employees', { params });
    return res.data;
  },

  getDepartmentReport: async () => {
    const res = await api.get('/reports/departments');
    return res.data;
  },
   getTeamCalendar: async (managerId: number): Promise<TeamCalendarResponse> => {
    const response = await api.get<TeamCalendarResponse>(
      `/dashboard/manager/team-calendar/${managerId}`
    );
    return response.data;
  },
};