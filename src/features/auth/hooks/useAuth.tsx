import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import type { AuthResponse, User } from "../types";// Import your API service here
import { authService } from "../services/AuthService";

interface JwtPayload {
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  forceChangePassword: boolean | null;
  setForceChangePassword: React.Dispatch<React.SetStateAction<boolean | null>>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [forceChangePassword, setForceChangePassword] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    Cookies.remove("lms_token");
    Cookies.remove("lms_user_id");

    setUser(null);
    setToken(null);
    setForceChangePassword(null);
  }, []);

  /* ---------------- INIT AUTH ---------------- */
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get("lms_token");
      const savedId = Cookies.get("lms_user_id");

      if (savedToken && savedId) {
        try {
          const decoded = jwtDecode<JwtPayload>(savedToken);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (isExpired) {
            logout();
          } else {
            setToken(savedToken);

            const profile = await authService.getEmployeeProfile(Number(savedId));
            setUser(profile);

            // 👇 IMPORTANT: backend should return this in profile
            // setForceChangePassword(profile.forcePasswordChange ?? false);
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [logout]);

  /* ---------------- LOGIN ---------------- */
  const login = async (data: AuthResponse) => {
    try {
      const decoded = jwtDecode<JwtPayload>(data.token);
      const expiryDate = new Date(decoded.exp * 1000);

      Cookies.set("lms_token", data.token, { expires: expiryDate, secure: true });
      Cookies.set("lms_user_id", JSON.stringify(data.id), { expires: expiryDate });

      setToken(data.token);

      // 👇 set directly from backend login response
      setForceChangePassword(data.forcePasswordChange ?? false);

      const profile = await authService.getEmployeeProfile(data.id);
      setUser(profile);

    } catch (e) {
      console.error("Login failed:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        forceChangePassword,
        setForceChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};