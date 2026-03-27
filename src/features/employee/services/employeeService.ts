import { AxiosError } from 'axios';
import api from '../../../services/apiClient';
import type { CreateUserRequest, EmployeeEntity, EmployeeFilters, PaginatedResponse, ProfileData, TeamMember } from '@/features/employee/types';

export interface Employee {
  designation: string;
  employeeId(employeeId: any, year: number, month: number): unknown;
  employeeName: any;
  id: number;
  name: string;
  email: string;
  role: string;
  managerId: number | null;
  active: boolean;
  joiningDate: string;
  biometricStatus: string;
  vpnStatus: string;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePageResponse {
  content: Employee[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

const handleError = (err: unknown, context: string): never => {
  if (err instanceof AxiosError) {
    throw new Error(
      `${context}: ${err.response?.status ?? 'Network Error'} ${err.response?.statusText ?? ''}`.trim()
    );
  }
  throw new Error(`${context}: Unexpected error`);
};

export const employeeService = {

  getAllEmployeesHR: async (
    page = 0,
    size = 10,
    signal?: AbortSignal
  ): Promise<EmployeePageResponse> => {
    try {
      const response = await api.get<EmployeePageResponse>('/employees/all', {
        params: { page, size },
        signal,
      });
      return response.data;
    } catch (err) {
      throw handleError(err, 'getAllEmployees');
    }
  },

  searchEmployees: async (
    query: string,
    signal?: AbortSignal
  ): Promise<Employee[]> => {
    try {
      const response = await api.get<Employee[]>('/employees/search', {
        params: { query },
        signal,
      });
      return response.data;
    } catch (err) {
      throw handleError(err, 'searchEmployees');
    }
  },

  getTeamMembers: async (id: number): Promise<TeamMember[]> => {
    const res = await api.get(`/dashboard/team-members/${id}`);
    return res.data;
  },

  // ─── Unified getAllEmployees
  getAllEmployees: async (
    pageOrFilters: number | EmployeeFilters = 0,
    size = 10,
    signal?: AbortSignal
  ): Promise<EmployeePageResponse> => {
    try {
      const params = typeof pageOrFilters === 'number'
        ? { page: pageOrFilters, size }  // getAllEmployees(0, 10) — old usage
        : pageOrFilters;                  // getAllEmployees({ page, size, ... }) — filter usage

      const response = await api.get<EmployeePageResponse>('/employees/all', {
        params,
        signal,
      });
      return response.data;
    } catch (err) {
      throw handleError(err, 'getAllEmployees');
    }
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

  getProfile: async (employeeId: number): Promise<ProfileData> => {
    const response = await api.get(`/employees/profile/${employeeId}`);
    return response.data;
  },
};