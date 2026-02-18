import React, { useState } from "react";
import { FaUserShield, FaLock, FaArrowRight } from "react-icons/fa";
import { loginUser } from "../services/AuthService";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types";



const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("employee@company.com");
  const [password, setPassword] = useState<string>("password123");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = { email, password };
      const response = await loginUser(credentials);
      login(response);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-xl border-2 border-white shadow-sm">    <form onSubmit={handleLogin} className="space-y-6">
        <img src="../../../src" alt="logo image" className="w-20 h-20" />
        <div className="flex flex-col gap-2.5 items-center">

        <h1 className="text-3xl font-bold">Account Login</h1>
        <p className="text-center">Enter your Registered Email and <br />
            Password to Proceed.</p>
        </div>


      {/* Email Field */}
      <div className="space-y-2">
        {/* LABELS: Shifted to neutral-700 (Darker) for high legibility */}
        <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-700 ml-1">
          Company Email
        </label>
        <div className="relative group">
          <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            /* FONT SIZE: text-sm (14px) is the professional standard for input data */
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm"
            placeholder="name@company.com"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-700">Password</label>
          <button type="button" className="text-[11px] font-bold text-primary-600 hover:text-primary-700 hover:underline">
            Forgot?
          </button>
        </div>
        <div className="relative group">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-300 rounded-xl outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all text-sm text-neutral-900 shadow-sm"
            required
          />
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="
          w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide
          flex items-center justify-center gap-3 transition-all duration-200
          bg-primary-500 text-white
          hover:bg-primary-600 
          hover:shadow-lg hover:shadow-primary-500/20
          active:scale-[0.98] 
          disabled:opacity-70 disabled:cursor-not-allowed
          group
        "
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Sign In
            <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>

      <footer className="mt-8 text-center border-t border-neutral-100 pt-6">
        {/* FOOTER: Darkened text to neutral-500 to pass contrast accessibility tests */}
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
          Authorized Access Only
        </p>
      </footer>
    </form>
    </div>
  );
};

export default LoginForm;