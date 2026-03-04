import Cookies from "js-cookie";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/environment';
import { toast } from "sonner"; // Import the toast function

const api: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for cleaning up auth state
const handleLogout = () => {
  Cookies.remove("lms_token");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("lms_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    // Global Error Handling Logic
    if (!error.response) {
      // Network Error (No Internet / Server Down)
      toast.error("Network Error", {
        description: "Please check your internet connection or try again later.",
      });
    } else {
      switch (status) {
        case 400:
          toast.warning("Invalid Request", { description: message });
          break;
        case 401:
          toast.error("Session Expired", { description: "Please log in again." });
          handleLogout();
          break;
        case 403:
          toast.error("Access Denied", { description: "You don't have permission for this." });
          break;
        case 404:
          toast.info("Not Found", { description: "The resource you're looking for doesn't exist." });
          break;
        case 500:
          toast.error("Server Error", { description: "Our team has been notified. Please try later." });
          break;
        default:
          toast.error("Error", { description: message });
      }
    }

    return Promise.reject(error);
  }
);

export default api;

