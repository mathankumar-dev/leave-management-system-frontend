import api from "../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse, User } from "../types";

export const authService = {

  loginUser: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },


getEmployeeProfile: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/employees/profile/${id}`);
    return response.data;
  }
};