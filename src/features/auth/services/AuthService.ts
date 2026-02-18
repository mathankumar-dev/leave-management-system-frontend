import api from "../../../api/axiosInstance";
import type { AuthResponse, LoginCredentials } from "../types";

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {

  const response = await api.post('/auth/login', {

    username: credentials.email,   // ✅ backend expects username
    password: credentials.password

  });

  const data = response.data;

  // return in your frontend format

  return {

    token: data.token,

    user: {

      id: data.userId,

      name: credentials.email,

      email: credentials.email,

      role: data.role,

      department: ""

    }

  };

};
