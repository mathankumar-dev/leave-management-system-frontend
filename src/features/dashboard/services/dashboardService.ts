import api from '../../../api/axiosInstance';
import Cookies from "js-cookie";
import { AxiosError } from 'axios';
import type { DashboardResponse, LowBalanceEmployee } from '../views/types';

import type {
  LeaveRecord,
  Employee,
  LeaveApplication,
  LeaveDecisionRequest,
  TeamCalendarResponse,
  TeamMemberBalance,
  CompOffRequest,
  LeaveBalanceResponse,
  // ProfileResponse
  ProfileData,
  ODResponse,
  TeamMember,
  EmployeeEntity,
  PaginatedResponse,
  EmployeeFilters,
  CreateUserRequest


} from '../types';

const handleError = (err: unknown, context: string): never => {
  if (err instanceof AxiosError) {
    throw new Error(
      `${context}: ${err.response?.status ?? 'Network Error'} ${err.response?.statusText ?? ''}`.trim()
    );
  }
  throw new Error(`${context}: Unexpected error`);
};



export const dashboardService = {

  getEmployeeCalendar: async (employeeId: number): Promise<TeamCalendarResponse> => {
    const response = await api.get(`/dashboard/employee/calendar/${employeeId}`);
    return response.data;
  },
  getTeamCalendar: async (id: number): Promise<TeamCalendarResponse> => {
    const response = await api.get<TeamCalendarResponse>(
      `/dashboard/team-calendar/${id}`
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


  getTeamLeaderDashboard: async (teamLeaderId: number) => {

    const response = await api.get(`/dashboard/teamleader/${teamLeaderId}`);

    return response.data;

  },
  getAdminDashboard: async (adminId: number) => {

    const response = await api.get(`/dashboard/admin/${adminId}`);

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


  // submitLeaveRequest: async (leaveData: LeaveApplication) => {
  //   const response = await api.post('/leaves/apply', leaveData);
  //   return response.data;
  // },

  submitLeaveRequest: async (data: FormData) => {
    const isMultipart = data instanceof FormData;
    for (const [key, value] of data.entries()) {
    }

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


  // =============================
  // Pending Approvals
  // =============================

  getPendingApprovals: async (managerId: number) => {
    const response = await api.get(`/leave-approvals/pending/manager/${managerId}`);
    return response.data.content;
  },

  getPendingApprovalsForTeamLeader: async (teamLeaderId: number) => {
    const response = await api.get(`/leave-approvals/pending/team-leader/${teamLeaderId}`);
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



  // =============================
  // Approve / Reject
  // =============================

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
    const response = await api.get(`/dashboard/team-on-leave/${managerId}`);
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

  // admin

  getDashboard: async (adminId: number, signal?: AbortSignal) => {
    const res = await api.get(`/dashboard/admin/${adminId}`, { signal });
    return res.data;
  },

  submitCompOffRequest: async (payload: CompOffRequest) => {
    const response = await api.post('/compoff/request', payload);
    return response.data;
  },


  //============================
  //       HR dashboard 
  //============================

   // GET /dashboard/hr — main dashboard data
  getDashboardData: async (signal?: AbortSignal): Promise<DashboardResponse> => {
    try {
      const response = await api.get<DashboardResponse>('/dashboard/hr', { signal });
      return response.data;
    } catch (err) {
      throw handleError(err, 'getDashboardData');
    }
  },

  // GET /dashboard/hr/low-balance — employee leave balance
  getLowBalanceEmployees: async (signal?: AbortSignal): Promise<LowBalanceEmployee[]> => {
    try {
      const response = await api.get<LowBalanceEmployee[]>('/dashboard/hr/low-balance?year=2026', { signal });
      return response.data;
    } catch (err) {
      throw handleError(err, 'getLowBalanceEmployees');
    }
  },


  //   getProfile: async (employeeId: number): Promise<ProfileData> => {
  //   const response = await api.get(`/employees//profile/${employeeId}`);
  //   return response.data;
  // },

  completeProfile: async (data: any) => {
    const response = await api.post("/employees/profile/complete", data);
    return response.data;
  },



  getMyPayslip: async (year: number, month: number) => {
    return api.get(`/payslip/my/${year}/${month}`);
  },

  getHistory: async (year: number) => {
    const res = await api.get(`/summary/${year}`);
    return res.data;
  },

  downloadPayslip: async (year: number, month: number) => {
    const res = await api.get(`payslip/download/${year}/${month}`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payslip-${month}-${year}.pdf`);
    document.body.appendChild(link);
    link.click();
  },




  getLeaveBalances: async (employeeId: number, year: number = 2026): Promise<LeaveBalanceResponse> => {
    const res = await api.get(`leaves-balance/${employeeId}`, {
      params: { year }
    });
    return res.data;
  },


  getTeamMembers: async (id: number): Promise<TeamMember[]> => {
    const res = await api.get(`/dashboard/team-members/${id}`);
    return res.data;
  },

  getAllEmployees: async (filters: EmployeeFilters): Promise<PaginatedResponse<EmployeeEntity>> => {
    const res = await api.get('/employees/all', {
      params: filters
    });
    return res.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<string> => {
    try {
      const response = await api.post('/admin/users/add', userData);

      return response.data;
    } catch (error: any) {
      throw error.response?.data || "Failed to create user";
    }
  },

  deleteUser: async (employeeId: number): Promise<string> => {
    try {
      const res = await api.delete(`/employees/${employeeId}`);
      return res.data.message || "Employee deleted successfully";
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to delete user";
    }
  },

};

