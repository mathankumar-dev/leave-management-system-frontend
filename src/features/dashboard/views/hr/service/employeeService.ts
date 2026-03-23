import { AxiosError } from 'axios';
import api from '../../../../../services/apiClient';

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

  // GET /employees/all?page=0&size=10
  getAllEmployees: async (
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

  // GET /employees/search?query=john
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

};