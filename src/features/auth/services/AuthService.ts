import api from "../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse, User } from "../types";

export const authService = {

  loginUser: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },


getEmployeeProfile: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/employees/profile?employeeId=${id}`);
    return response.data;
  },



changePassword: async (newPassword: string): Promise<void> => {

  await api.put('/auth/change-password', {
    newPassword,
  });
  
},

  forgotPassword : async(email : string) : Promise<void> => {
    console.log("going to call forgot password");
    console.log(email);
    
   const response = await api.post(`/password-reset/request?email=${email}`);
   console.log(response);
   
    console.log("after forgotpass");
    
  }
};