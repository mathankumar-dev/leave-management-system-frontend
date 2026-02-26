import { AxiosError } from 'axios';
import api from '../../../../../api/axiosInstance';
import type { DashboardResponse } from '../types';

const handleError = (err: unknown, context: string): never => {
  if (err instanceof AxiosError) {
    throw new Error(
      `${context}: ${err.response?.status ?? 'Network Error'} ${err.response?.statusText ?? ''}`.trim()
    );
  }
  throw new Error(`${context}: Unexpected error`);
};

export const hrDashboardService = {
  getDashboardData: async (signal?: AbortSignal): Promise<DashboardResponse> => {
    try {
      const response = await api.get<DashboardResponse>('/dashboard/hr', { signal });
      return response.data;
    } catch (err) {
      throw handleError(err, 'getDashboardData');
    }
  },
};












// import api from '../../../../../api/axiosInstance';
// import type { DashboardResponse } from '../types';

// export const hrDashboardService = {

//   // ✅ Get Full HR Dashboard Data
//   getDashboardData: async (): Promise<DashboardResponse> => {
//     const response = await api.get<DashboardResponse>('/dashboard/hr');
//     console.log(response.status);
//     console.log(response.data);
//     return response.data;
//   },

//   // ✅ Get Only Summary (if backend provides separate endpoint)
//   getSummary: async () => {
//     const response = await api.get('/dashboard/hr/summary');
//     return response.data;
//   },

//   // ✅ Get Department Distribution
//   getDepartmentStats: async () => {
//     const response = await api.get('/dashboard/hr/departments');
//     return response.data;
//   },

//   // ✅ Get Manager Approval Stats
//   getManagerApprovalStats: async () => {
//     const response = await api.get('/dashboard/hr/manager-approvals');
//     return response.data;
//   },

//   // ✅ Get Onboarding Pending List
//   getOnboardingPending: async () => {
//     const response = await api.get('/dashboard/hr/onboarding');
//     return response.data;
//   },

// };