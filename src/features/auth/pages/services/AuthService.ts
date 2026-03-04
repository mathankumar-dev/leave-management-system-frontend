import api from "../../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse } from "../../types";
import Cookies from "js-cookie";

// ✅ Login function
export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    console.log("FULL RESPONSE:", response);
    console.log("RESPONSE DATA:", response.data);

    const data: AuthResponse = response.data;

    return {
      id: data.id,
      token: data.token,
      role: data.role,
      forcePasswordChange: data.forcePasswordChange,
    };
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

// ✅ Profile
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data.profile;
  } catch {
    return {
      id: "4",
      name: "Employee User",
      email: "employee@wenxttech.com",
      role: "Employee",
      department: "IT",
    };
  }
};
