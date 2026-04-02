import type { CreateUserRequest, EmployeeEntity, EmployeeFilters, PaginatedResponse, ProfileData, TeamMember } from '@/features/employee/types';
import { AxiosError } from 'axios';
import api from '../../../services/apiClient';

export interface Employee {
  id: string;
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
  // ─── Optional fields ────────────────────────────────────────
  designation?: string | null;
  employeeId?: string;
  employeeName?: string | null;
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


  getNameByID: async (employeeId: string) => {
    const res = await api.get(`/employees/name/${employeeId}`);
    return res.data;
  },

  // ─── HR: paginated list ───────────────────────────────────────
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
      throw handleError(err, 'getAllEmployeesHR');
    }
  },

  // ─── Unified getAllEmployees — supports both (page, size) and filters object ──
  getAllEmployees: async (
    pageOrFilters: number | EmployeeFilters = 0,
    size = 10,
  ): Promise<PaginatedResponse<EmployeeEntity>> => { // <--- Changed this
    try {
      const params = typeof pageOrFilters === 'number'
        ? { page: pageOrFilters, size }
        : pageOrFilters;

      const response = await api.get<PaginatedResponse<EmployeeEntity>>('/employees/all', {
        params
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

  getTeamMembers: async (id: string): Promise<TeamMember[]> => {
    const res = await api.get(`/dashboard/team-members/${id}`);
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

  deleteUser: async (employeeId: string): Promise<string> => {
    try {
      const res = await api.delete(`/employees/${employeeId}`);
      return res.data.message || "Employee deleted successfully";
    } catch (error: any) {
      throw error.response?.data?.message || "Failed to delete user";
    }
  },

  getProfile: async (employeeId: string): Promise<ProfileData> => {
    const response = await api.get(`/employees/profile/${employeeId}`);
    return response.data;
  },
};