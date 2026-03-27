
import { ENV } from "@/config/environment";
import api from "@/services/apiClient";
import { logout } from "@/services/auth/authStorage";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const refreshApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

export const responseInterceptor = async (error: AxiosError) => {
  const status = error.response?.status;
  console.log(status);

  const message = (error.response?.data as any)?.message || "Something went wrong";
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; silent?: number[] };

  if (
    status === 401 &&
    !originalRequest._retry &&
    Cookies.get("lms_user_id")
  ) {
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log("going to call refresh");
      await refreshApi.post("/auth/refresh");

      console.log("after call refresh");
      processQueue(null);

      originalRequest.withCredentials = true;

      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError);
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