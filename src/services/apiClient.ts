import axios from "axios";
import { ENV } from "../config/environment";
import { requestInterceptor } from "@/services/interceptors/request";
import { responseInterceptor } from "@/services/interceptors/response";

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach interceptors
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(
  (res) => res,
  responseInterceptor
);

export default api;