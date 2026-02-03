
// import { ENV } from "../../../config/environment";
// import type { LoginCredentials, AuthResponse, RegisterCredentials } from "../types";

// export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
//   const response = await fetch(`${ENV.API_BASE_URL}${ENV.ENDPOINTS.LOGIN}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(credentials),
//   });
//   if (!response.ok) throw new Error("Login failed");
//   return response.json();
// };

// export const registerUser = async (data: RegisterCredentials): Promise<any> => {
//   const response = await fetch(`${ENV.API_BASE_URL}${ENV.ENDPOINTS.REGISTER}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) throw new Error("Registration failed");
//   return response.json();
// };


import api from "../../../api/axiosInstance";
import type { LoginCredentials, AuthResponse, RegisterCredentials } from "../types";

// Simulated delay for testing
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  /** * MOCK BLOCK: Remove this once your API is live 
   **/
  await sleep(1000);
  if (credentials.email === "manager@company.com") {
    return {
      user: { id: "1", name: "Manager User", email: credentials.email, role: "Manager",department:"IT" },
      token: "mock-token-123"
    };
  }

   if (credentials.email === "admin@company.com") {
    return {
      user: { id: "1", name: "Admin User", email: credentials.email, role: "HR Admin",department:"IT" },
      token: "mock-token-123"
    };
  }
  /** END MOCK BLOCK **/

  // Real code (Uncomment when API is ready):
  // const response = await api.post<AuthResponse>('/auth/login', credentials);
  // return response.data;
  
  // For now, return a default employee for any other email
  return {
    user: { id: "2", name: "Employee User", email: credentials.email, role: "Employee",department:"IT" },
    token: "mock-token-456"
  };
};

export const registerUser = async (data: RegisterCredentials): Promise<any> => {
  await sleep(1000);
  
  // Real code (Uncomment when API is ready):
  // const response = await api.post('/auth/register', data);
  // return response.data;

  return { message: "Registration successful" };
};