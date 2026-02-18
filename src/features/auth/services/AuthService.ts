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
  /** * MOCK BLOCK: Remove this once your API is live 
   **/
  // await sleep(1000);
  
  // if (credentials.email === "manager@wenxttech.com") {
  //   return {
  //     user: { id: "1", name: "Manager User", email: credentials.email, role: "Manager",department:"IT" },
  //     token: "mock-token-123"
  //   };
  // }
  //  else if (credentials.email === "admin@wenxttech.com") {
  //   return {
  //     user: { id: "2", name: "Admin User", email: credentials.email, role: "Admin",department:"IT" },
  //     token: "mock-token-123"
  //   };
  // }
  //    else if (credentials.email === "hr@wenxttech.com") {
  //   return {
  //     user: { id: "3", name: "HR User", email: credentials.email, role: "HR",department:"IT" },
  //     token: "mock-token-123"
  //   };
  // }
  // return {
  //   user: { id: "2", name: "Employee User", email: credentials.email, role: "Employee",department:"IT" },
  //   token: "mock-token-456"
  // };
  /** END MOCK BLOCK **/

  const response = await api.post<AuthResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
  
  // For now, return a default employee for any other email
};
