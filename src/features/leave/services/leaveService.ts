import type { TeamMemberBalance } from "@/features/attendance/types";
import type { CompOffRequest, LeaveBalanceResponse, LeaveDecisionRequest, LeaveRecord, ODResponse, PendingLeaveApplicationApiResponse } from "@/features/leave/types";
import api from "@/services/apiClient";

export const leaveService = {
  submitLeaveRequest: async (data: FormData) => {
    const isMultipart = data instanceof FormData;
    const response = await api.post('/leaves/apply', data, {
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    });
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


  getMyLeaveHistory: async (employeeId: number): Promise<LeaveRecord[]> => {
    const response = await api.get(`/leaves/employee/${employeeId}`);
    return response.data;
  },

  getMyODHistory: async (employeeId: number): Promise<ODResponse[]> => {
    const response = await api.get(`/od/my/${employeeId}`);
    return response.data;
  },

  getPendingApprovals: async (managerId: number): Promise<PendingLeaveApplicationApiResponse[]> => {
    const response = await api.get(`/leave-approvals/pending/manager/${managerId}`);
    return response.data.content;
  },

  getPendingApprovalsForTeamLeader: async (teamLeaderId: number): Promise<PendingLeaveApplicationApiResponse[]> => {
    const response = await api.get(`/leave-approvals/pending/team-leader/${teamLeaderId}`);
    console.log("getPendingApprovalsForTeamLeader");

    console.log(response.data.content);

    return response.data.content;
  },

  getPendingCompOffs: async (managerId: number) => {
    const response = await api.get(`/compoff/pending/${managerId}/approvals`);
    return response.data.content;
  },

  getPendingODApprovalsForTeamLeader: async (teamLeaderId: number): Promise<ODResponse[]> => {

    const response = await api.get(`/od/pending/teamleader/${teamLeaderId}`);

    return response.data;
  },
  getPendingODApprovals: async (managerId: number): Promise<ODResponse[]> => {
    const response = await api.get(`/od/pending/manager/${managerId}`);
    return response.data;
  },

  updateDecision: async (
    decisionRequest: LeaveDecisionRequest
  ): Promise<void> => {
    await api.patch(
      "/leave-approvals/decision",
      decisionRequest
    );
  },



  approveCompOff: async (
    compOffId: number
  ): Promise<void> => {

    await api.patch(
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
  getLeaveBalances: async (employeeId: number, year: number = 2026): Promise<LeaveBalanceResponse> => {
    const res = await api.get(`leaves-balance/${employeeId}`, {
      params: { year }
    });
    return res.data;
  },
  submitCompOffRequest: async (payload: CompOffRequest) => {
    const response = await api.post('/compoff/request', payload);
    return response.data;
  },
  getWeeklyLeaveSummary: async (managerId: number): Promise<LeaveRecord[]> => {
    const response = await api.get(`/manager/${managerId}/team-leaves/week`);
    return response.data;
  },

  getTeamOnLeave: async (managerId: number): Promise<TeamMemberBalance[]> => {
    const response = await api.get(`/dashboard/team-on-leave/${managerId}`);
    return response.data;
  },
}