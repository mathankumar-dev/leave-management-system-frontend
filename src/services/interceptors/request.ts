
import type { InternalAxiosRequestConfig } from "axios";

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.withCredentials = true;

  return config;
};