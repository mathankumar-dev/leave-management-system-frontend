export interface EnvironmentConfig {
  API_BASE_URL: string;
  ENDPOINTS: {
    LOGIN: string;
    REGISTER: string;
  };
}

export const ENV: EnvironmentConfig = {
  // API_BASE_URL:
  //   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", 
  API_BASE_URL : "http://localhost:5000",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
};
