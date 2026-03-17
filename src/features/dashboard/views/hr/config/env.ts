export interface env {
  API_BASE_URL: string;
  ENDPOINTS: {
    LOGIN: string;
    REGISTER: string;
  };
}

export const ENV: env= {
  // API_BASE_URL:
  //   import.meta.env.VITE_API_BASE_URL || "https://your-actual-api.com/api/v1", 
  API_BASE_URL : "https://jgpq493j-8080.inc1.devtunnels.ms/api/",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
};