import type { DashboardResponse } from '@/features/dashboard/types';
import type { Employee } from '@/features/employee/types';
import type { LowBalanceEmployee } from '@/features/leave/types';
import { handleError } from '@/shared/services/apiError';
import api from '../../../services/apiClient';

export const dashboardService = {

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

  getManagerTeamStats: async (managerId: number): Promise<Employee[]> => {
    const currentYear = new Date().getFullYear();

    const response = await api.get(`/dashboard/manager/team-balances/${managerId}`, {
      params: {
        year: currentYear
      }
    });

    return response.data;
  },



  // getEmployeeDashboard: async (employeeId: number): Promise<Employee> => {
  //   const id = employeeId;
  //   if (!id) {
  //     console.error("Employee ID is missing! Cannot fetch dashboard.");
  //     return null;
  //   }
  //   try {
  //     const response = await api.get(`/dashboard/employee/${id}`);
  //     return [response.data];
  //   } catch (error: any) {
  //     console.error("Failed to fetch dashboard:", error.message || error);
  //     return [];
  //   }
  // },

  getEmpDashboard: async (employeeId: number) => {

    const response = await api.get(`/dashboard/employee/${employeeId}`);

    return response.data;

  },

  getHrDashboard: async (signal?: AbortSignal): Promise<DashboardResponse> => {
    try {
      const response = await api.get<DashboardResponse>('/dashboard/hr', { signal });
      return response.data;
    } catch (err) {
      throw handleError(err, 'getDashboardData');
    }
  },
  getHRLowBalance: async (signal?: AbortSignal): Promise<LowBalanceEmployee[]> => {
    try {
      const response = await api.get<LowBalanceEmployee[]>('/dashboard/hr/low-balance?year=2026', { signal });
      return response.data;
    } catch (err) {
      throw handleError(err, 'getLowBalanceEmployees');
    }
  },

};

