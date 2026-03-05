import api from '../../../api/axiosInstance';
import Cookies from "js-cookie";

import type {
  LeaveRecord,
  Employee,
  LeaveApplication,
  LeaveDecisionRequest,
  TeamCalendarResponse,
  TeamMemberBalance,
  CompOffRequest

} from '../types';



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
      params: {
        year: currentYear
      }
    });

    return response.data;
  },


  submitLeaveRequest: async (leaveData: LeaveApplication) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },

  updateLeave: async (id: number, data: any) => {
    const res = await api.put(
      `/leaves/${id}`,
      null,
      {
        params: {
          employeeId: data.employeeId,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
          halfDayType: data.halfDayType
        }
      }
    );

    return res.data;
  },

  cancelLeave: async (id: number, employeeId: number): Promise<any> => {
    try {
      const res = await api.patch(
        `/leaves/${id}/cancel`,
        null,
        {
          params: { employeeId }
        }
      );

      return res.data;
    } catch (error) {
      console.error(`Error cancelling leave ${id}:`, error);
      throw error;
    }
  },


  // =============================
  // Pending Approvals
  // =============================

  getPendingApprovals: async (managerId: number) => {
    const response = await api.get(`/leave-approvals/pending/${managerId}`);
    return response.data.content;
  },


  getPendingCompOffs: async (managerId: number) => {
    const response = await api.get(`/compoff/pending/${managerId}/approvals`);
    return response.data.content;
  },



  // =============================
  // Approve / Reject
  // =============================

  updateDecision: async (
    decisionRequest: LeaveDecisionRequest
  ): Promise<void> => {
    const response = await api.patch(
      "/leave-approvals/decision",
      decisionRequest
    );
  },



  approveCompOff: async (
    compOffId: number
  ): Promise<void> => {

    const response = await api.patch(
      `/compoff/approve/${compOffId}`,

    );
  },
  rejectCompOff: async (compOffId: number, reason: string): Promise<void> => {
    await api.patch(
      `/compoff/reject/${compOffId}`,
      null,
      {
        params: { reason }
      }
    );
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
    const id = employeeId;
    if (!id) {
      console.error("Employee ID is missing! Cannot fetch dashboard.");
      return [];
    }

    try {
      const response = await api.get(`/dashboard/employee/${id}`);
      return [response.data];
    } catch (error: any) {
      console.error("Failed to fetch dashboard:", error.message || error);
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


  deleteLeaveType: async (id: number) => {

    await api.delete(`/settings/leave-types/${id}`);

    return true;

  },

  submitCompOffRequest: async (payload: CompOffRequest) => {
    const response = await api.post('/compoff/request', payload);
    return response.data;
  },
};

