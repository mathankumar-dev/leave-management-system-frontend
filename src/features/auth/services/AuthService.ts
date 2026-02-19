// import api from "../../../api/axiosInstance";
// import type { AuthResponse, LoginCredentials } from "../types";

// export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {

//   const response = await api.post('/auth/login', {

//     username: credentials.email,   // ✅ backend expects username
//     password: credentials.password

//   });

//   const data = response.data;

//   // return in your frontend format

//   return {

//     token: data.token,

//     user: {

//       id: data.userId,

//       name: credentials.email,

//       email: credentials.email,

//       role: data.role,

//       department: ""

//     }

//   };

// };


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
  const response = await api.get("/auth/profile");
  return response.data.profile;
};
