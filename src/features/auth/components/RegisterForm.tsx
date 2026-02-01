import React, { useState } from "react";
import { FaUser, FaEnvelope, FaIdCard, FaBriefcase, FaArrowRight } from "react-icons/fa";
import { registerUser } from "../services/AuthService";
import type { RegisterCredentials } from "../types";

interface RegisterFormProps {
  onToggle: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Using the RegisterCredentials interface for state
  const [formData, setFormData] = useState<RegisterCredentials>({
    employeeName: "",
    emailId: "",
    department: "",
    designation: "",
    managerId: "MGR-001", // Default/Mock for initial setup
    joiningDate: new Date().toISOString().split('T')[0] // Formats as YYYY-MM-DD
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(formData);
      alert("Registration Successful! Please Sign In.");
      onToggle(); // Returns user to Login view
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register employee. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <header className="mb-8">
        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h3>
        <p className="text-slate-500 text-sm font-medium">Register your employee profile.</p>
      </header>

      {/* Full Name Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
        <div className="relative group">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            required
            value={formData.employeeName}
            onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-50 focus:border-indigo-600 outline-none font-bold shadow-sm transition-all"
            placeholder="User name"
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email ID</label>
        <div className="relative group">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="email" 
            required
            value={formData.emailId}
            onChange={(e) => setFormData({...formData, emailId: e.target.value})}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-50 focus:border-indigo-600 outline-none font-bold shadow-sm transition-all"
            placeholder="user@company.com"
          />
        </div>
      </div>

      {/* Department and Designation Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Department</label> 
          <div className="relative group">
            <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              required
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold shadow-sm transition-all"
              placeholder="e.g. IT"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Designation</label> 
          <div className="relative group">
            <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              required
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-600 font-bold shadow-sm transition-all"
              placeholder="e.g. Developer"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-slate-900 text-white py-5 mt-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70 group"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>Register Employee <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;