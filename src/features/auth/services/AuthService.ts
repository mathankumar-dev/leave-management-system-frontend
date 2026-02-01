
import { ENV } from "../../../config/environment";
import type { LoginCredentials, AuthResponse, RegisterCredentials } from "../types";

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${ENV.API_BASE_URL}${ENV.ENDPOINTS.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
};

export const registerUser = async (data: RegisterCredentials): Promise<any> => {
  const response = await fetch(`${ENV.API_BASE_URL}${ENV.ENDPOINTS.REGISTER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
};