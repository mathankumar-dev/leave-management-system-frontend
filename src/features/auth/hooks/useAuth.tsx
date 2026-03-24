import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import type { AuthResponse, User } from "../types";
import { authService } from "../services/AuthService";
import api from "../../../api/axiosInstance";

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
  mustChangePassword: boolean;
  personalDetailsComplete: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // fail aana also clear pannuvom
    } finally {
      Cookies.remove("lms_token");
      Cookies.remove("lms_user_id");
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }, []);

  // ─── Init Auth (page refresh) ─────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get("lms_token");
      const savedId = Cookies.get("lms_user_id");

      if (savedToken && savedId) {
        try {
          const decoded = jwtDecode<JwtPayload>(savedToken);
          const isExpired = decoded.exp * 1000 < Date.now();

          // Expired or not → set header → interceptor handles refresh
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

          if (!isExpired) {
            setToken(savedToken);
          }

          const profile = await authService.getEmployeeProfile(Number(savedId));
          setUser(profile);

        } catch (error) {
          console.error("Auth initialization failed:", error);
          Cookies.remove("lms_token");
          Cookies.remove("lms_user_id");
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setToken(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // ─── Login ────────────────────────────────────────────────────
  const login = async (data: AuthResponse) => {
    try {
      const decoded = jwtDecode<JwtPayload>(data.token);
      const expiryDate = new Date(decoded.exp * 1000);

      // Cookie-la store pannuvom
      Cookies.set("lms_token", data.token, {
        expires: expiryDate,
        secure: true,
        sameSite: 'strict',
      });
      Cookies.set("lms_user_id", data.id.toString(), {
        expires: expiryDate,
      });

      // Axios header set pannuvom
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
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
        setUser
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