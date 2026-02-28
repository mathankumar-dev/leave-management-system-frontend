export interface EnvironmentConfig {
  API_BASE_URL: string;
  ENDPOINTS: {
    LOGIN: string;
  };
}

export const ENV: EnvironmentConfig = {
  // API_BASE_URL:
  //   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", 
  API_BASE_URL : "http://localhost:8080/api",   
  // API_BASE_URL: "https://jgpq493j-8080.inc1.devtunnels.ms/api",
  ENDPOINTS: {
    LOGIN: "/auth/login",
  },
};
