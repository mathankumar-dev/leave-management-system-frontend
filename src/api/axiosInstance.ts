// import axios from 'axios';
// import { ENV } from '../config/environment';

// const api = axios.create({
//   baseURL: ENV.API_BASE_URL,
// });

// // Automatically attach the token from localStorage to every request
// // api.interceptors.request.use((config) => {
// //   const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
// //   if (user?.token) {
// //     config.headers.Authorization = `Bearer ${user.token}`;
// //   }
// //   return config;
// // });

// // Inside your api.ts (axios instance)
// api.interceptors.request.use((config) => {
//   // Use the same key used in AuthProvider
//   const token = localStorage.getItem('lms_token'); 
  
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;




import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/environment';

/**
 * 
 * Create an Axios instance with base configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attach the Bearer token to every outgoing request.
 * We use 'lms_token' to match the key used in AuthContext.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('lms_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Intercepts responses to handle global errors like 401 (Unauthorized).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401, the token is likely expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request - Logging out...");
      
      // Clear local storage to sync with AuthContext state
      localStorage.removeItem('lms_token');
      localStorage.removeItem('lms_user');
      
      // Optional: Redirect to login page
      // window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default api;