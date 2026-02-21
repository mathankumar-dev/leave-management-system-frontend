
import api from "../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse } from "../types";

export const loginUser = async (credentials : LoginCredentials) : Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login',credentials);
  return response.data;
}

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data.profile;
};

