import api from "../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse } from "../types";

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {

  console.log(credentials);
  
  const response = await api.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  console.log(response.status);
  console.log(response.data);
  
  
  return response.data;
  
};


export const getProfile = async () => {

  try {

    const response = await api.get("/auth/profile");

    return response.data.profile;

  } catch {

    // MOCK profile fallback
    return {
      id: "4",
      name: "Employee User",
      email: "employee@wenxttech.com",
      role: "Employee",
      department: "IT"
    };

  }
};

