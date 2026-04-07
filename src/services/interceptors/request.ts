import type { InternalAxiosRequestConfig } from "axios";
import { getToken } from "../auth/authStorage";

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  

  const token = getToken();
console.log("TOKEN =", token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};