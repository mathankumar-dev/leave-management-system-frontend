import React, { useState } from "react";
import { FaUserShield, FaLock, FaArrowRight } from "react-icons/fa";
import { loginUser } from "../services/AuthService";
import { useAuth } from "../hooks/useAuth"; //
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
      
      /** * login(response) will:
       * 1. Save the token to localStorage
       * 2. Save the user object to localStorage
       * 3. Update the global state so Sidebar/Topbar re-render
       */
      login(response); 
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <header className="mb-10">
        <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Sign In</h3>
        <p className="text-slate-500 font-medium text-sm">Welcome back to your portal.</p>
      </header>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
          Company Email
        </label>
        <div className="relative group">
          <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold text-slate-700 shadow-sm"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
          <button type="button" className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700">
            Forgot?
          </button>
        </div>
        <div className="relative group">
          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold text-slate-700 shadow-sm"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 group"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Sign In <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
        )}
      </button>
    </form>
  );
};

export default LoginForm;