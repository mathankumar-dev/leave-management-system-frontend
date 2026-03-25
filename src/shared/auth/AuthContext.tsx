import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { authService } from "@/features/auth/api/authApi";

import type { AuthResponse } from "./authTypes";
import type { User } from "@/features/employee/types";
import axios from "axios";

interface JwtPayload {
  exp: number;
}

refreshToken: async (refreshToken: string) => {

  const res = await axios.post("/api/auth/refresh", {

    refreshToken

  });

  return res.data;

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

  let Token = Cookies.get("lms_token");

  const refreshToken = Cookies.get("lms_refresh_token");

  const savedId = Cookies.get("lms_user_id");

  if (!savedId) {

    setIsLoading(false);

    return;

  }

  try {

    if (Token) {

      const decoded = jwtDecode<JwtPayload>(Token);

      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired && refreshToken) {

        const refreshResponse =
          await authService.refreshToken(refreshToken);

        Token = refreshResponse.accessToken; // ✅ update variable

        const newDecoded = jwtDecode<JwtPayload>(Token);

        Cookies.set("lms_token", Token, {

          expires: new Date(newDecoded.exp * 1000),

          secure: true

        });

        Cookies.set("lms_refresh_token",
          refreshResponse.refreshToken,
          {
            expires: 7,
            secure: true
          }
        );

      }

    }

    if (Token) {

      setToken(Token);

      const profile =
        await authService.getEmployeeProfile(Number(savedId));

      setUser(profile);

    }

  } catch (error) {

    console.error("Token refresh failed:", error);

    logout();

  }

  setIsLoading(false);

 };

 initAuth();

}, [logout]);

  
 const login = async (data: AuthResponse) => {

  try {

    if (!data.accessToken || !data.refreshToken) {
      throw new Error("Tokens missing from backend response");
    }

    const decoded = jwtDecode<JwtPayload>(data.accessToken);

    const accessExpiry = new Date(decoded.exp * 1000);

    // store access token
    Cookies.set("lms_token", data.accessToken, {
      expires: accessExpiry,
      secure: true,
    });

    // store refresh token
    Cookies.set("lms_refresh_token", data.refreshToken, {
      expires: 7,
      secure: true,
    });

    Cookies.set("lms_user_id", data.id.toString(), {
      expires: accessExpiry,
    });

    setToken(data.accessToken);

    const profile = await authService.getEmployeeProfile(data.id);

    setUser(profile);

  } catch (error) {

    console.error("Login failed:", error);

    throw error;

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