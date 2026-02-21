export interface EnvironmentConfig {
  API_BASE_URL: string;
  ENDPOINTS: {
    LOGIN: string;
  };
}

export const ENV: EnvironmentConfig = {
  // API_BASE_URL:
  //   import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", 
  API_BASE_URL : "http://localhost:5000/",
    // API_BASE_URL : "https://fqkvs6nm-8080.inc1.devtunnels.ms/",

  ENDPOINTS: {
    LOGIN: "/auth/login",
    
  },
};
