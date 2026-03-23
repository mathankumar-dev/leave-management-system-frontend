import React, { useState } from "react";
import { FaUserShield, FaLock, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useAuth } from "../../../shared/auth/useAuth";
import type { LoginCredentials } from "../types";
import logoSVG from "../../../assets/logo.svg";

import Loader from "../../../shared/components/Loader";
import { authService } from "../api/authApi";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Simplified UI states for the loader
  const [loaderState, setLoaderState] = useState({
    active: false,
    finished: false,
  });

  const [loginResponse, setLoginResponse] = useState<any>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoaderState({ active: true, finished: false });

    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authService.loginUser(credentials);

      setLoginResponse(response);

      setLoaderState({ active: true, finished: true });

    } catch (error) {
      console.error("Login failed:", error);
      setLoaderState({ active: false, finished: false });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg drop-shadow-lg w-full max-w-140 min-h-150 p-8">

      {loaderState.active && (
        <Loader
          message="Authenticating..."
          isFinished={loaderState.finished}
          onFinished={() => login(loginResponse)}
        />
      )}
      {/* LOGO */}
      <img src={logoSVG} alt="Company logo" className="w-20 h-20 mb-4" />

      <form onSubmit={handleLogin} className="space-y-6 w-full">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl font-bold">Account Login</h1>
          <p className="text-sm text-center text-neutral-600">
            Enter your registered email and password to proceed
          </p>
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-700 ml-1">
            Company Email
          </label>
          <div className="relative group">
            <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@wenxttech.com"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-700 ml-1">
            Password
          </label>
          <div className="relative group">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 text-sm shadow-sm"
            />
          </div>
          <Link to="/forgot-password" intrinsic-size="11" className="text-[11px] font-bold text-primary-600 hover:underline flex justify-end">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loaderState.active}
          className="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {loaderState.active ? "Verifying..." : "Sign In"}
          <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <footer className="mt-6 text-center border-t border-neutral-100 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            Authorized Access Only
          </p>
        </footer>
      </form>
    </div>
  );
};

export default LoginForm;