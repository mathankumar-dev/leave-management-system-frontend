import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthResponse } from "../types";

interface AuthContextType {

  user: AuthResponse["user"] | null;

  token: string | null;

  login: (data: AuthResponse) => void;

  logout: () => void;

  isAuthenticated: boolean;

  isLoading: boolean;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<AuthResponse["user"] | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);


  // Restore session on refresh
  useEffect(() => {

    const savedUser = localStorage.getItem("lms_user");

    const savedToken = localStorage.getItem("lms_token");

    if (savedUser && savedToken) {

      try {

        setUser(JSON.parse(savedUser));

        setToken(savedToken);

      } catch (error) {

        console.error("Failed to parse user data", error);

        localStorage.clear();

      }

    }

    setIsLoading(false);

  }, []);


  // Login function
  const login = (data: AuthResponse) => {

    localStorage.setItem("lms_token", data.token);

    localStorage.setItem("lms_user", JSON.stringify(data.user));

    setUser(data.user);

    setToken(data.token);

  };


  // Logout function
  const logout = () => {

    localStorage.clear();

    setUser(null);

    setToken(null);

  };


  return (

    <AuthContext.Provider value={{

      user,

      token,

      login,

      logout,

      isAuthenticated: !!user,

      isLoading

    }}>

      {children}

    </AuthContext.Provider>

  );

};


// Custom hook
export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error("useAuth must be used within AuthProvider");

  }

  return context;

};
