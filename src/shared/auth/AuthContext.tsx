import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { authService } from "@/features/auth/api/authApi";

import type { AuthResponse } from "./authTypes";
import type { User } from "@/features/employee/types";

interface JwtPayload {
  exp: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  personalDetailsComplete: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    Cookies.remove("lms_token");
    Cookies.remove("lms_user_id");
    setUser(null);
    setToken(null);
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

      Cookies.set("lms_token", data.token, {
        expires: expiryDate,
        secure: true,
      });

      Cookies.set("lms_user_id", data.id.toString(), {
        expires: expiryDate,
      });

      setToken(data.token);

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
        mustChangePassword: user?.mustChangePassword ?? false,
        personalDetailsComplete: user?.personalDetailsComplete ?? false,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};