import { authService } from "@/features/auth/api/authApi";
import React, { createContext, useCallback, useEffect, useState } from "react";

import type { User } from "@/features/employee/types";
import api from "@/services/apiClient";
import Cookies from "js-cookie";
import type { AuthResponse } from "./authTypes";
import { logout, setToken } from "@/services/auth/authStorage";

export interface AuthContextType {
  user: User | null;
  login: (data: AuthResponse) => Promise<void>;
  contextLogout: () => void;
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


const contextLogout = useCallback(async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    console.error("Logout request failed", e);
  } finally {
    setUser(null);
    logout(); 
  }
}, []);


  useEffect(() => {
    const initAuth = async () => {
      const id = Cookies.get("lms_user_id");

      // 1. Add this guard clause
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getEmployeeProfile(id);
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (data: { id: string; role: string; forcePasswordChange: boolean }) => {
    try {
      // setToken(data.id);
      const profile = await authService.getEmployeeProfile(data.id);
      setToken(data.id);
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
        contextLogout,
        isAuthenticated: !!user,
        isLoading,
        mustChangePassword: user?.mustChangePassword ?? false,
        personalDetailsComplete: user?.personalDetailsComplete === true,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};