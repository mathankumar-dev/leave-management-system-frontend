import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/environment';
import { toast } from "sonner";

declare module 'axios' {
  interface AxiosRequestConfig {
    silent?: number[];
    _retry?: boolean;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true, // ← accessToken + refreshToken HTTP-only cookie auto send
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Refresh queue ────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: { resolve: () => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

const handleLogout = () => {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// ─── Request interceptor ──────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";
    const originalRequest = error.config;

    // ─── 401 / 403 → Silent refresh ───────────────────────────
    // Backend token expire → 403 return pannudu (ideally 401 aaganum)
    // Temporary-a 403-um handle pannrom
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);
        toast.error("Session Expired", { description: "Please log in again." });
        handleLogout();
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // ─── Global Error Handling ────────────────────────────────
    if (!error.response) {
      if (!error.config?.silent) {
        toast.error("Network Error", {
          description: "Please check your internet connection or try again later.",
        });
      }
    } else {
      switch (status) {
        case 400:
          if (!error.config?.silent?.includes(400))
            toast.warning("Invalid Request", { description: message });
          break;
        case 401:
          break; // Already handled above
        case 403:
          // Refresh try பண்ணிட்டு still 403 வந்தா (_retry true) — show toast
          if (originalRequest._retry && !error.config?.silent?.includes(403))
            toast.error("Access Denied", { description: "You don't have permission for this." });
          break;
        case 404:
          if (!error.config?.silent?.includes(404))
            toast.info("Not Found", { description: "The resource you're looking for doesn't exist." });
          break;
        case 500:
          if (!error.config?.silent?.includes(500))
            toast.error("Server Error", { description: "Our team has been notified. Please try later." });
          break;
        default:
          if (!error.config?.silent?.includes(status))
            toast.error("Error", { description: message });
      }
    }

    return Promise.reject(error);
  }
);

export default api;