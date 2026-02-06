import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes, FaLinkedin, FaGithub, FaUser, FaBriefcase,
  FaShareAlt, FaArrowLeft, FaCheckCircle,
} from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddEmployeePopup: React.FC<Props> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [linkedin, setLinkedin] = useState(false);
  const [github, setGithub] = useState(false);

  // 1. Centralized Form State
  const [formData, setFormData] = useState({
    fullName: "", email: "", contact: "", address: "",
    empId: "", designation: "", department: "Product Engineering",
    manager: "", location: "", joiningDate: "", skills: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Restriction Helpers
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => phone.replace(/\D/g, "").length >= 10;

  const canProceed = () => {
    if (step === 1) {
      return (
        formData.fullName.trim().length >= 3 &&
        isEmailValid(formData.email) &&
        isPhoneValid(formData.contact) &&
        formData.address.trim() !== ""
      );
    }
    if (step === 2) {
      return (
        formData.empId.trim() !== "" &&
        formData.designation.trim() !== "" &&
        formData.manager.trim() !== "" &&
        formData.joiningDate !== ""
      );
    }
    return true; // Step 3 is optional
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      fullName: "", email: "", contact: "", address: "",
      empId: "", designation: "", department: "Product Engineering",
      manager: "", location: "", joiningDate: "", skills: ""
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div onClick={handleClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

          <motion.div
            initial={{ y: 50, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 50, scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-2xl bg-slate-50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header with Step Indicators */}
            <div className="px-10 py-8 bg-white border-b border-slate-200 flex justify-between items-center">
              <div>
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${step >= s ? "bg-indigo-600" : "bg-slate-200"}`} />
                  ))}
                </div>
                <h2 className="text-2xl font-black text-slate-800">Add New Employee</h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-10 min-h-[420px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                    <SectionHeader icon={<FaUser />} title="Personal Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g. John Doe" required />
                      <FormInput label="Email Address" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@company.com" required />
                      <FormInput label="Contact Number" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="10+ digits required" required />
                      <FormInput label="Residential Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Street, City, Country" className="md:col-span-2" required />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                    <SectionHeader icon={<FaBriefcase />} title="Employment Info" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormInput label="Employee ID" name="empId" value={formData.empId} onChange={handleInputChange} placeholder="e.g. EMP-101" required />
                      <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} placeholder="e.g. Lead Designer" required />
                      <FormInput label="Reporting Manager" name="manager" value={formData.manager} onChange={handleInputChange} placeholder="Manager Name" required />
                      <FormInput label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleInputChange} required />
                      <FormInput label="Core Skills" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="React, Figma, Node..." className="md:col-span-2" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                    <SectionHeader icon={<FaShareAlt />} title="Social Presence" optional />
                    <div className="space-y-4">
                      <SocialToggle active={linkedin} onClick={() => setLinkedin(!linkedin)} icon={<FaLinkedin className="text-blue-600" />} label="LinkedIn" placeholder="https://linkedin.com/in/user" />
                      <SocialToggle active={github} onClick={() => setGithub(!github)} icon={<FaGithub />} label="GitHub" placeholder="https://github.com/user" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-10 py-6 bg-white border-t border-slate-200 flex justify-between items-center">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  <FaArrowLeft /> Back
                </button>
              ) : <div />}

              <div className="flex gap-3">
                <button onClick={handleClose} className="px-4 py-2 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                {step < 3 ? (
                  <button
                    onClick={() => canProceed() && setStep(step + 1)}
                    disabled={!canProceed()}
                    className={`px-10 py-2.5 rounded-xl font-bold transition-all ${
                      canProceed() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                ) : (
                  <button onClick={handleClose} className="px-10 py-2.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-2 shadow-lg">
                    Submit <FaCheckCircle />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* --- Sub Components --- */

const SectionHeader = ({ icon, title, optional }: any) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">{icon}</div>
    <h4 className="text-sm font-bold uppercase tracking-widest">{title} {optional && <span className="text-[10px] text-slate-400 lowercase font-medium italic">(optional)</span>}</h4>
  </div>
);

const FormInput = ({ label, required, className = "", ...props }: any) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input 
      {...props} 
      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300" 
    />
  </div>
);

const SocialToggle = ({ active, onClick, icon, label, placeholder }: any) => (
  <div className="space-y-3">
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${active ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100 border-transparent"}`}>
      {icon} <span className="text-sm font-bold">{active ? `Remove ${label}` : `Add ${label}`}</span>
    </button>
    <AnimatePresence>
      {active && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
          <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-500" placeholder={placeholder} />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default AddEmployeePopup;