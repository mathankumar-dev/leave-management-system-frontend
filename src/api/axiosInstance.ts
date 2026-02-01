import axios from 'axios';
import { ENV } from '../config/environment';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
});

// Automatically attach the token from localStorage to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;