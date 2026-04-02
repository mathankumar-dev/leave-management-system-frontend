import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes, FaUser, FaBriefcase,
  FaArrowLeft, FaCheckCircle, FaBuilding,
} from "react-icons/fa";
import { toast } from "sonner";
import MyDatePicker from "../../../shared/components/datepicker/MyDatePicker";
import Loader from "../../../shared/components/Loader";
import type { CreateUserRequest } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
  addUser: (data: CreateUserRequest) => Promise<void>;
}

const AddEmployeePopup: React.FC<Props> = ({ open, onClose, addUser }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {user} = useAuth();

  const [formData, setFormData] = useState({
    empId: "",
    fullName: "",
    email: "",
    roleId: 1, // Default to a numeric Role ID
    employeeExperience: "FRESHER",
    reportingId: "", // Backend: reportingId
    teamId: "",
    departmentId: "",
    branchId: "",
    joiningDate: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canProceed = () => {
    if (step === 1) {
      return (
        formData.empId.trim().length >= 3 &&
        formData.fullName.trim().length >= 3 &&
        isEmailValid(formData.email)
      );
    }
    if (step === 2) {
      return (
        formData.joiningDate !== "" &&
        formData.departmentId !== "" &&
        formData.branchId !== ""
      );
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const payload: CreateUserRequest = {
        empId: formData.empId,
        name: formData.fullName,
        email: formData.email,
        roleId: Number(formData.roleId),
        reportingId: formData.reportingId || null,
        teamId: formData.teamId ? Number(formData.teamId) : null,
        departmentId: Number(formData.departmentId),
        branchId: Number(formData.branchId),
        joiningDate: formData.joiningDate.split('T')[0], // Extract YYYY-MM-DD
        employeeExperience: formData.employeeExperience
      };

      await addUser(payload);
      setStatus("success");
    } catch (err: any) {
      toast.error(err.toString());
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoaderFinished = () => {
    if (status === "success") handleClose();
    setStatus("idle");
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      empId: "",
      fullName: "",
      email: "",
      roleId: 1,
      employeeExperience: "FRESHER",
      reportingId: "",
      teamId: "",
      departmentId: "",
      branchId: "",
      joiningDate: ""
    });
    setStatus("idle");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

          <motion.div className="relative z-10 w-full max-w-2xl bg-slate-50 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="px-10 py-6 bg-white border-b flex justify-between items-center">
              <div>
                <div className="flex gap-2 mb-2">
                  {[1, 2].map((s) => (
                    <div key={s} className={`h-1 w-8 ${step >= s ? "bg-indigo-600" : "bg-slate-200"}`} />
                  ))}
                </div>
                <h2 className="text-xl font-bold">Add New Employee</h2>
              </div>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
                    <SectionHeader icon={<FaUser />} title="Identity & Contact" />
                    
                    <FormInput label="Employee ID (Custom ID)" name="empId" placeholder="e.g. WENXT001" value={formData.empId} onChange={handleInputChange} required />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                      <FormInput label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600">Role ID *</label>
                        <input type="number" name="roleId" value={formData.roleId} onChange={handleInputChange} className="w-full border px-3 py-2 rounded mt-1 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600">Experience Level</label>
                        <select name="employeeExperience" value={formData.employeeExperience} onChange={handleInputChange} className="w-full border px-3 py-2 rounded mt-1 bg-white">
                          <option value="FRESHER">Fresher</option>
                          <option value="EXPERIENCED">Experienced</option>
                          <option value="INTERN">Intern</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="space-y-4">
                    <SectionHeader icon={<FaBuilding />} title="Organization Details" />

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput label="Department ID" name="departmentId" type="number" value={formData.departmentId} onChange={handleInputChange} required />
                      <FormInput label="Branch ID" name="branchId" type="number" value={formData.branchId} onChange={handleInputChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput label="Reporting To (Manager ID)" name="reportingId" value={formData.reportingId} onChange={handleInputChange} />
                      <FormInput label="Team ID" name="teamId" type="number" value={formData.teamId} onChange={handleInputChange} />
                    </div>

                    <MyDatePicker
                      label="Joining Date"
                      required
                      selected={formData.joiningDate ? new Date(formData.joiningDate) : null}
                      onChange={(date: Date | null) => setFormData({ ...formData, joiningDate: date ? date.toISOString() : "" })}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white border-t flex justify-between">
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-600 font-bold">
                  <FaArrowLeft /> Back
                </button>
              ) : <div />}

              {step < 2 ? (
                <button
                  disabled={!canProceed()}
                  onClick={() => setStep(2)}
                  className={`px-6 py-2 rounded font-bold transition-all ${canProceed() ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : <>Create Employee <FaCheckCircle /></>}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* LOADER */}
      {(isSubmitting || status !== "idle") && (
        <Loader
          message={status === "error" ? "Failed to Create" : status === "success" ? "Success!" : "Syncing with Server..."}
          isFinished={status === "success" || status === "error"}
          onFinished={handleLoaderFinished}
        />
      )}
    </AnimatePresence>
  );
};

/* Internal Helper Components */
const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-wider text-sm mb-4">
    <span className="text-indigo-500">{icon}</span> {title}
  </div>
);

const FormInput = ({ label, required, ...props }: any) => (
  <div className="flex-1">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      {...props}
      onWheel={(e) => (e.target as HTMLInputElement).blur()}
      className="w-full border-b-2 border-slate-200 px-1 py-2 mt-1 focus:border-indigo-500 outline-none transition-all text-sm bg-transparent"
    />
  </div>
);

export default AddEmployeePopup;