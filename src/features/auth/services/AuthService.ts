import api from "../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse, User, PersonalDetailsRequest } from "../types";

export const authService = {

  loginUser: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },


  getEmployeeProfile: async (id: number): Promise<User> => {
    
    const response = await api.get<User>(`/employees/profile/${id}`);
    return response.data;
  },
updatePersonalDetails: async (id: number, data: PersonalDetailsRequest): Promise<any> => {

    const response = await api.post(`/employees/personal-details/${id}`, data);
    return response.data;
},


  changePassword: async (newPassword: string): Promise<void> => {
    await api.put('/auth/change-password', {
      newPassword,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/password-reset/request', null, {
      params: { email }
    });
  }
};