import React, { useState } from "react";
import { FaUserShield, FaLock, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types";

import logoSVG from "../../../assets/logo.svg";

// import Loader from "../../../components/ui/Loader";
import FailureModal from "../../../components/ui/FailureModal";
import SuccessModal from "../../../components/ui/SuccessModal";

import { authService } from "../services/AuthService";
import Loader from "../../../components/ui/SuccessModal";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setShowError(false);

    try {
      const credentials: LoginCredentials = { email, password };

      const response = await authService.loginUser(credentials);

      setIsLoading(false);
      setShowSuccess(true);

      // short animation delay before redirect
      setTimeout(async () => {
        await login(response);
      }, 900);

    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      setShowError(true);
    }
  };

  return (
    <div
      className="
      flex flex-col items-center justify-center
      bg-white rounded-lg drop-shadow-lg
      w-full max-w-[560px] min-h-[600px]
      p-8
    "
    >

      {/* LOADER */}
      {isLoading && <Loader />}

      {/* ERROR MODAL */}
      {showError && (
        <FailureModal
          title="Login Failed"
          message="Invalid credentials. Please try again."
          onClose={() => setShowError(false)}
        />
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <SuccessModal
          
          message="Preparing your dashboard..."
        />
      )}

      {/* LOGO */}
      <img
        src={logoSVG}
        alt="Company logo"
        className="w-20 h-20 mb-4"
      />

      <form
        onSubmit={handleLogin}
        className="space-y-6 w-full"
      >

        {/* HEADER */}
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
              placeholder="name@wenexttech.com"
              className="
              w-full pl-12 pr-4 py-3.5
              bg-white border border-neutral-300
              rounded-xl outline-none
              focus:ring-4 focus:ring-primary-50
              focus:border-primary-500
              text-sm
              shadow-sm
            "
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
              className="
              w-full pl-12 pr-4 py-3.5
              bg-white border border-neutral-300
              rounded-xl outline-none
              focus:ring-4 focus:ring-primary-50
              focus:border-primary-500
              text-sm
              shadow-sm
            "
            />
          </div>

          <Link
            to="/forgot-password"
            className="
            text-[11px] font-bold
            text-primary-600
            hover:underline
            flex justify-end
          "
          >
            Forgot Password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="
          w-full py-4 px-6 rounded-xl
          font-bold text-sm tracking-wide
          flex items-center justify-center gap-3
          bg-primary-500 text-white
          hover:bg-primary-600
          hover:shadow-lg hover:shadow-primary-500/20
          active:scale-[0.98]
          transition-all duration-200
          disabled:opacity-70 disabled:cursor-not-allowed
          group
        "
        >
          Sign In

          <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        {/* FOOTER */}
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