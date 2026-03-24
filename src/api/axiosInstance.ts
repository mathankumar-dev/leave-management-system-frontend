import Cookies from "js-cookie";
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
  withCredentials: true, // ← refreshToken HTTP-only cookie auto send
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Refresh queue ────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

const handleLogout = () => {
  Cookies.remove("lms_token");
  Cookies.remove("lms_user_id");
  delete api.defaults.headers.common['Authorization'];
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// ─── Request interceptor ──────────────────────────────────────────
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

// ─── Response interceptor ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";
    const originalRequest = error.config;

    // ─── 401 → Silent refresh ─────────────────────────────────
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Browser auto sends HTTP-only refreshToken cookie
        const { data } = await api.post('/auth/refresh');
        const newToken = data.token;

        // New token → cookie update
        Cookies.set("lms_token", newToken, {
          secure: true,
          sameSite: 'strict',
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
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
          // Already handled above
          break;
        case 403:
          if (!error.config?.silent?.includes(403))
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

// ─── App load → restore token from cookie ────────────────────────
const token = Cookies.get("lms_token");
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;