// import React, { createContext, useContext, useState, useEffect } from "react";
// import {jwtDecode} from "jwt-decode";
// import type { AuthResponse } from "../types";

// interface JwtPayload {
//   exp: number;
// }

// interface AuthContextType {
//   user: AuthResponse["user"] | null;
//   token: string | null;
//   login: (data: AuthResponse) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<AuthResponse["user"] | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("lms_token");
//     localStorage.removeItem("lms_user");
//     setUser(null);
//     setToken(null);
//   };

//   // Restore session on refresh
//   useEffect(() => {
//     const savedUser = localStorage.getItem("lms_user");
//     const savedToken = localStorage.getItem("lms_token");

//     if (savedUser && savedToken) {
//       try {
//         const decoded = jwtDecode<JwtPayload>(savedToken);
//         const isExpired = decoded.exp * 1000 < Date.now();

//         if (isExpired) {
//           logout();
//         } else {
//           setUser(JSON.parse(savedUser));
//           setToken(savedToken);

//           // Auto logout timer
//           const expiryTime = decoded.exp * 1000 - Date.now();
//           setTimeout(logout, expiryTime);
//         }
//       } catch (error) {
//         console.error("Invalid token", error);
//         logout();
//       }
//     }

//     setIsLoading(false);
//   }, []);

//   // Login function
//   const login = (data: AuthResponse) => {
//     localStorage.setItem("lms_token", data.token);
//     localStorage.setItem("lms_user", JSON.stringify(data.user));

//     setUser(data.user);
//     setToken(data.token);

//     const decoded = jwtDecode<JwtPayload>(data.token);
//     const expiryTime = decoded.exp * 1000 - Date.now();

//     setTimeout(logout, expiryTime);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         logout,
//         isAuthenticated: !!user,
//         isLoading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import type { AuthResponse } from "../types";

interface JwtPayload {
  exp: number;
}

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
  const [role, setRole] = useState<string | null>(null);


  const logout = () => {
    Cookies.remove("lms_token");
    Cookies.remove("lms_user");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const savedUser = Cookies.get("lms_user");
    const savedToken = Cookies.get("lms_token");

    if (savedUser && savedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(savedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          logout();
        } else {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);

          const expiryTime = decoded.exp * 1000 - Date.now();
          setTimeout(logout, expiryTime);
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  const login = (data: AuthResponse) => {
    const decoded = jwtDecode<JwtPayload>(data.token);
    const expiryTime = decoded.exp * 1000 - Date.now();
    const expiryDate = new Date(decoded.exp * 1000);

    Cookies.set("lms_token", data.token, { expires: expiryDate });
    Cookies.set("lms_user", JSON.stringify(data.user), { expires: expiryDate });
    Cookies.set("lms_user_role", data.role, { expires: expiryDate });
    console.log(data.user);
    setUser(data.user);
    setToken(data.token);

    setTimeout(logout, expiryTime);
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


// import React, { createContext, useContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import type { AuthResponse } from "../types";
// import { getProfile } from "../services/AuthService";


// interface AuthContextType {
//   user: AuthResponse["user"] | null;
//   token: string | null;
//   login: (data: AuthResponse) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<AuthResponse["user"] | null>(null);
//   const [token, setToken] = useState<string | null>(null);
  
//   const [isLoading, setIsLoading] = useState(true);

//   /**
//    * LOGOUT
//    */
//   const logout = () => {
//     Cookies.remove("lms_token");
//     setUser(null);
//     setToken(null);
//   };

//   /**
//    * LOGIN
//    */
//   const login = async (data: AuthResponse) => {
//     // Save token in cookie (15 minutes)
//     Cookies.set("lms_token", data.token, { expires: 1 / 96 }); 
//     // 1/96 day ≈ 15 minutes

//     setToken(data.token);

//     // Fetch fresh profile from backend
//     const profile = await getProfile();
//     setUser(profile);
//   };

//   /**
//    * RESTORE SESSION ON REFRESH
//    */
//   useEffect(() => {
//     const savedToken = Cookies.get("lms_token");

//     if (!savedToken) {
//       setIsLoading(false);
//       return;
//     }

//     setToken(savedToken);

//     getProfile()
//       .then((profile) => {
//         setUser(profile);
//       })
//       .catch(() => {
//         logout();
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         login,
//         logout,
//         isAuthenticated: !!user,
//         isLoading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };
