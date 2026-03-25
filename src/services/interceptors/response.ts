
import { toast } from "sonner";
import { setToken, logout } from "@/services/auth/authStorage";
import { ENV } from "@/config/environment";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

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

export const responseInterceptor = async (error: AxiosError) => {
  const status = error.response?.status;
  const message = (error.response?.data as any)?.message || "Something went wrong";
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; silent?: number[] };

  if (
    status === 401 &&
    !originalRequest._retry &&
    !originalRequest.url?.includes("/auth/refresh") &&
    !originalRequest.url?.includes("/auth/login")
  ) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
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
      const response = await refreshApi.post("/auth/refresh");
      const newToken = response.data.token;

      setToken(newToken);
      processQueue(null, newToken);

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
    if (!originalRequest.silent) {
      toast.error("Network Error", {
        description: "Please check your internet connection.",
      });
    }
  } else {
    const shouldBeSilent = originalRequest.silent?.includes(status!);

    if (!shouldBeSilent) {
      switch (status) {
        case 400:
          toast.warning("Invalid Request", { description: message });
          break;
        case 403:
          toast.error("Access Denied", { description: "You don't have permission." });
          break;
        case 404:
          toast.info("Not Found", { description: "Resource doesn't exist." });
          break;
        case 500:
          toast.error("Server Error", { description: "Please try again later." });
          break;
        default:
          toast.error("Error", { description: message });
      }
    }
  }

  return Promise.reject(error);
};