import api from "../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse } from "../types";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {

  try {

    // 🔹 Try calling real API first
    const response = await api.post("/auth/login", {
      username: credentials.email,
      password: credentials.password
    });

    const data = response.data;

    // ✅ If API success → return API data
    return {
      token: data.token,
      user: {
        id: data.userId,
        name: data.name ?? credentials.email,
        email: credentials.email,
        role: data.role,
        department: data.department ?? "IT"
      }
    };

  } catch (error) {

    console.log("API failed, using MOCK login");

    // 🔹 MOCK LOGIN fallback

    if (
      credentials.email === "manager@wenxttech.com" &&
      credentials.password === "123"
    ) {
      return {
        token: "mock-token-manager",
        user: {
          id: "1",
          name: "Manager User",
          email: credentials.email,
          role: "Manager",
          department: "IT"
        }
      };
    }

    if (
      credentials.email === "admin@wenxttech.com" &&
      credentials.password === "123"
    ) {
      return {
        token: "mock-token-admin",
        user: {
          id: "2",
          name: "Admin User",
          email: credentials.email,
          role: "Admin",
          department: "IT"
        }
      };
    }

    if (
      credentials.email === "hr@wenxttech.com" &&
      credentials.password === "123"
    ) {
      return {
        token: "mock-token-hr",
        user: {
          id: "3",
          name: "HR User",
          email: credentials.email,
          role: "HR",
          department: "IT"
        }
      };
    }

    // Default Employee
    return {
      token: "mock-token-employee",
      user: {
        id: "4",
        name: "Employee User",
        email: credentials.email,
        role: "Employee",
        department: "IT"
      }
    };
  }
};


// Profile API
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
