import api from '../../../api/axiosInstance';
import type { LeaveRecord, Employee, ApprovalRequest } from '../types';

export const dashboardService = {
  getLeaveSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  submitLeaveRequest: async (leaveData: any) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },

  getPendingApprovals: async () => {
    const response = await api.get<ApprovalRequest[]>('/leaves/approvals/pending');
    return response.data;
  },

  // FIXED: Added this missing method to solve your TS error
  updateApprovalStatus: async (id: number, status: 'Approved' | 'Rejected') => {
    const response = await api.put(`/leaves/approvals/${id}`, { status });
    return response.data;
  },

  getMyLeaveHistory: async () => {
    const response = await api.get<LeaveRecord[]>('/leaves/my-history');
    return response.data;
  },

  // getAllEmployees: async () => {
  //   const response = await api.get<Employee[]>('/admin/employees');
  //   return response.data;
  // }
  getAllEmployees: async () => {
  const response = await api.get<any[]>('/admin/employees');
  return response.data.map(emp => ({
    id: emp.id,
    name: emp.name,
    email: emp.email,
    dept: emp.department || emp.dept, // Handles both naming conventions
    role: emp.role,
    status: emp.status.toUpperCase(), // Standardizes to "ACTIVE"
    initial: emp.name.charAt(0),
    color: emp.role === 'Manager' ? 'bg-indigo-600' : 'bg-slate-500'
  }));
},
getHRStats: async () => {
    const response = await api.get('/reports/stats');
    return response.data; 
  },

  getDeptDistribution: async () => {
    const response = await api.get('/reports/departments');
    return response.data; 
  },

  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await api.get('/admin/audit-logs');
    return response.data;
  },

  getCalendarLeaves: async (year: number, month: number) => {
  const response = await api.get(`/leaves/calendar?year=${year}&month=${month}`);
  // Expected response: Record<number, { name: string, type: string, color: string }[]>
  return response.data;
},
getLeaveTypes: async () => {
    const response = await api.get('/settings/leave-types');
    return response.data;
  },

  createLeaveType: async (data: any) => {
    const response = await api.post('/settings/leave-types', data);
    return response.data;
  },

  updateLeaveType: async (id: number, data: any) => {
    const response = await api.put(`/settings/leave-types/${id}`, data);
    return response.data;
  },

  deleteLeaveType: async (id: number) => {
    await api.delete(`/settings/leave-types/${id}`);
    return true;
  },
};