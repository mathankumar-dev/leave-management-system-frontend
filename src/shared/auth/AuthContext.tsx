import { authService } from "@/features/auth/api/authApi";
import React, { createContext, useCallback, useEffect, useState } from "react";

import type { User } from "@/features/employee/types";
import type { AuthResponse } from "./authTypes";
import api from "@/services/apiClient";

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

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // fail aana also redirect
    } finally {
      setUser(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }, []);

  // ─── Page Refresh — Session Restore ───────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      try {
        const profile = await authService.getMyProfile();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ─── Login ────────────────────────────────────────────────────
  const login = useCallback(async (data: { id: number; role: string; forcePasswordChange: boolean }) => {
    try {
      const profile = await authService.getProfileByID(data.id);
      setUser(profile);
    } catch (e) {
      console.error("Profile fetch failed:", e);
      throw e;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        mustChangePassword: user?.mustChangePassword ?? false,
        personalDetailsComplete: user?.personalDetailsComplete === true || user?.verificationStatus === "VERIFIED",
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};