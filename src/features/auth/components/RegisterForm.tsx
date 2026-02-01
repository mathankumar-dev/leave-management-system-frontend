import React, { useState } from "react";
import { FaUser, FaEnvelope, FaIdCard, FaBriefcase, FaArrowRight } from "react-icons/fa";
import { registerUser } from "../services/AuthService";
import type { RegisterCredentials } from "../types"; 
 // Import the type

interface RegisterFormProps {
  onToggle: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterCredentials>({
    employeeName: "",
    emailId: "",
    department: "",
    designation: "",
    managerId: "MGR-001", // Default/Mock for now
    joiningDate: new Date().toISOString().split('T')[0] // Default to today
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(formData);
      alert("Registration Successful! Please Sign In.");
      onToggle(); // Slide back to Login page
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register employee.");
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

      {/* Employee Name */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            required
            value={formData.employeeName}
            onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none font-bold shadow-sm"
            placeholder="John Doe"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email ID</label>
        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="email" 
            required
            value={formData.emailId}
            onChange={(e) => setFormData({...formData, emailId: e.target.value})}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none font-bold shadow-sm"
            placeholder="john@company.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Department</label> 
          <div className="relative">
            <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              required
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none font-bold shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Designation</label> 
          <div className="relative">
            <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              required
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none font-bold shadow-sm"
            />
          </div>
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
          <>Register <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;