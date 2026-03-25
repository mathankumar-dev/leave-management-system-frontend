import React, { createContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { authService } from "@/features/auth/api/authApi";
import { setToken as saveTokenToCookie, logout as globalLogout } from "@/services/auth/authStorage";

import type { AuthResponse } from "./authTypes";
import type { User } from "@/features/employee/types";

export interface AuthContextType {
  user: User | null;
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
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    globalLogout(); // Clears cookies and redirects
    setUser(null);
  }, []);

  /* ---------------- INIT AUTH ---------------- */
  useEffect(() => {
    const initAuth = async () => {
      const savedId = Cookies.get("lms_user_id");

      // We check for savedId. Even if the token is expired/missing, 
      // the interceptor will try to refresh it during the profile call.
      if (savedId) {
        try {
          const profile = await authService.getEmployeeProfile(Number(savedId));
          setUser(profile);
        } catch (error) {
          console.error("Session restoration failed:", error);
          // If profile fetch fails AND refresh fails, interceptor calls logout.
          // We just ensure state is clean here.
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async (data: AuthResponse) => {
    try {
      // 1. Save the access token (Interceptor will use this)
      saveTokenToCookie(data.token);

      // 2. Save the User ID for profile fetching
      Cookies.set("lms_user_id", data.id.toString(), { 
        secure: true, 
        sameSite: 'Lax',
        expires: 7 // Keep ID for 7 days
      });

      // 3. Fetch profile
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