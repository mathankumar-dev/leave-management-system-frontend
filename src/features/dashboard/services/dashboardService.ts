import api from '../../../api/axiosInstance';
import Cookies from "js-cookie";

import type {
  LeaveRecord,
  Employee,
  LeaveApplication,
  LeaveDecisionRequest,
  TeamCalendarResponse,
  TeamMemberBalance,
  CompOffRequest,
  HalfDayLeaveType,
} from '../types';

// ─── Strongly-typed payload for updateLeave ───────────────────────────────────
// Replaces the previous `data: any` parameter.
export interface UpdateLeavePayload {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  halfDayType?: HalfDayLeaveType | null;
}

export const dashboardService = {

  getTeamCalendar: async (managerId: number): Promise<TeamCalendarResponse> => {
    const response = await api.get<TeamCalendarResponse>(
      `/dashboard/manager/team-calendar/${managerId}`
    );
    return response.data;
  },

  getEmpDashboard: async (employeeId: number) => {
    const response = await api.get(`/dashboard/employee/${employeeId}`);
    return response.data;
  },

  getManagerDashboard: async (managerId: number) => {
    const response = await api.get(`/dashboard/manager/summary/${managerId}`);
    return response.data;
  },

  getTeamLeaveStats: async (managerId: number): Promise<Employee[]> => {
    const currentYear = new Date().getFullYear();
    const response = await api.get(`/dashboard/manager/team-balances/${managerId}`, {
      params: { year: currentYear },
    });
    return response.data;
  },

  submitLeaveRequest: async (leaveData: LeaveApplication) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },

  // Backend expects params as query-string (PUT with null body)
  updateLeave: async (id: number, data: UpdateLeavePayload): Promise<LeaveRecord> => {
    const res = await api.put(
      `/leaves/${id}`,
      null,
      {
        params: {
          employeeId:  data.employeeId,
          startDate:   data.startDate,
          endDate:     data.endDate,
          reason:      data.reason,
          halfDayType: data.halfDayType,
        },
      }
    );
    return res.data;
  },

  cancelLeave: async (id: number, employeeId: number): Promise<void> => {
    try {
      await api.patch(`/leaves/${id}/cancel`, null, { params: { employeeId } });
    } catch (error) {
      console.error(`Error cancelling leave ${id}:`, error);
      throw error;
    }
  },

  // =============================
  // Pending Approvals
  // =============================

  getPendingApprovals: async (managerId: number): Promise<LeaveRecord[]> => {
    const response = await api.get(`/leave-approvals/pending/${managerId}`);
    return response.data.content;
  },

  getPendingCompOffs: async (managerId: number): Promise<LeaveRecord[]> => {
    const response = await api.get(`/compoff/pending/${managerId}/approvals`);
    return response.data.content;
  },

  // =============================
  // Approve / Reject
  // =============================

  updateDecision: async (decisionRequest: LeaveDecisionRequest): Promise<void> => {
    await api.patch("/leave-approvals/decision", decisionRequest);
  },

  approveCompOff: async (compOffId: number): Promise<void> => {
    await api.patch(`/compoff/approve/${compOffId}`);
  },

  rejectCompOff: async (compOffId: number, reason: string): Promise<void> => {
    await api.patch(`/compoff/reject/${compOffId}`, null, { params: { reason } });
  },

  // =============================
  // Leave History
  // =============================

  getMyLeaveHistory: async (employeeId: number): Promise<LeaveRecord[]> => {
    const response = await api.get(`/leaves/employee/${employeeId}`);
    return response.data;
  },

  getWeeklyLeaveSummary: async (managerId: number): Promise<LeaveRecord[]> => {
    const response = await api.get(`/manager/${managerId}/team-leaves/week`);
    return response.data;
  },

  getTeamOnLeave: async (managerId: number): Promise<TeamMemberBalance[]> => {
    const response = await api.get(`/dashboard/manager/team-on-leave/${managerId}`);
    return response.data;
  },

  getEmployeeDashboard: async (employeeId?: number): Promise<Employee[]> => {
    if (!employeeId) {
      console.error("Employee ID is missing! Cannot fetch dashboard.");
      return [];
    }
    try {
      const response = await api.get(`/dashboard/employee/${employeeId}`);
      return [response.data];
    } catch (error) {
      console.error("Failed to fetch dashboard:", error instanceof Error ? error.message : error);
      return [];
    }
  },

  getLeaveSummary: async () => {
    const id = Cookies.get("employee_id");
    if (!id) {
      console.error("Employee ID is missing! Cannot fetch leave summary.");
      return null;
    }
    const response = await api.get(`/dashboard/employee/${id}`);
    return response.data;
  },

  deleteLeaveType: async (id: number): Promise<boolean> => {
    await api.delete(`/leave-config/${id}`);
    return true;
  },

  // admin
  getDashboard: async (adminId: number, signal?: AbortSignal) => {
    const res = await api.get(`/dashboard/admin/${adminId}`, { signal });
    return res.data;
  },

  submitCompOffRequest: async (payload: CompOffRequest) => {
    const response = await api.post('/compoff/request', payload);
    return response.data;
  },
};