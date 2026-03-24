import axios from "axios";
import { toast } from "sonner";
import { setToken, logout } from "@/services/auth/authStorage";
import { ENV } from "@/config/environment";

const refreshApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

export const responseInterceptor = async (error: any) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message || "Something went wrong";

  const originalRequest = error.config;

  // 🔥 REFRESH TOKEN LOGIC
  if (
    status === 401 &&
    !originalRequest._retry &&
    !originalRequest.url?.includes("/auth/refresh") &&
    !originalRequest.url?.includes("/auth/login")
  ) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshApi.post("/auth/refresh");

      const newToken = data.token;

      setToken(newToken);

      processQueue(null, newToken);

      // retry original request
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axios(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError, null);

      toast.error("Session Expired", {
        description: "Please log in again.",
      });

      logout();
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }

  if (!error.response) {
    if (!error.config?.silent) {
      toast.error("Network Error", {
        description:
          "Please check your internet connection or try again later.",
      });
    }
  } else {
    switch (status) {
      case 400:
        if (!error.config?.silent?.includes(400))
          toast.warning("Invalid Request", { description: message });
        break;

      case 403:
        if (!error.config?.silent?.includes(403))
          toast.error("Access Denied", {
            description: "You don't have permission for this.",
          });
        break;

      case 404:
        if (!error.config?.silent?.includes(404))
          toast.info("Not Found", {
            description: "Resource doesn't exist.",
          });
        break;

      case 500:
        if (!error.config?.silent?.includes(500))
          toast.error("Server Error", {
            description: "Try again later.",
          });
        break;

      default:
        if (!error.config?.silent?.includes(status))
          toast.error("Error", { description: message });
    }
  }

  return Promise.reject(error);
};