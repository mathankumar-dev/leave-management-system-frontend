import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "../types";
import { authService } from "../services/AuthService";
import api from "../../../api/axiosInstance";

interface AuthContextType {
  user: User | null;
  login: (data: { id: number; role: string; forcePasswordChange: boolean }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  personalDetailsComplete: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Logout ───────────────────────────────────────────────────
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
      const profile = await authService.getMyProfile();
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
        // forcePasswordChange → mustChangePassword alias
        mustChangePassword: user?.mustChangePassword ?? user?.forcePasswordChange ?? false,
        // verificationStatus === "VERIFIED" → personalDetailsComplete
        personalDetailsComplete: user?.personalDetailsComplete === true || user?.verificationStatus === "VERIFIED",
        setUser,
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