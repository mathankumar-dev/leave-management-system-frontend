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
      // Backend → accessToken + refreshToken cookies clear pannudu
    } catch {
      // fail aana also redirect
    } finally {
      setUser(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }, []);

  // ─── Page Refresh — Session Restore ──────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      try {
        // lms_user_id regular cookie-la iruku
        const userIdCookie = document.cookie
          .split(';')
          .find(c => c.trim().startsWith('lms_user_id='));

        if (!userIdCookie) {
          setIsLoading(false);
          return;
        }

        const userId = Number(userIdCookie.split('=')[1]);
        if (!userId || isNaN(userId)) {
          setIsLoading(false);
          return;
        }

        // accessToken HTTP-only cookie → withCredentials auto send
        const profile = await authService.getEmployeeProfile(userId);
        setUser(profile);

      } catch {
        // Token expired → interceptor refresh try pannudu
        // Refresh fail → /login redirect aagum
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ─── Login ───────────────────────────────────────────────────
  const login = useCallback(async (data: { id: number; role: string; forcePasswordChange: boolean }) => {
    try {
      // accessToken → backend HTTP-only cookie-la set pannudu (auto)
      // lms_user_id → LoginForm-la set pannuvom (or here)
      document.cookie = `lms_user_id=${data.id}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      const profile = await authService.getEmployeeProfile(data.id);
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
        personalDetailsComplete: user?.personalDetailsComplete ?? false,
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