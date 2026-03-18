import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes, FaUser, FaBriefcase,
  FaArrowLeft, FaCheckCircle,
} from "react-icons/fa";
import MyDatePicker from "../../../components/ui/datepicker/MyDatePicker";
import Loader from "../../../components/ui/Loader"; // ✅ your loader
import type { CreateUserRequest } from "../types";
import type { UserRole } from "../../auth/types";
import { toast } from "sonner";


interface Props {
  open: boolean;
  onClose: () => void;
  addUser: (data: CreateUserRequest) => Promise<void>;
}

const AddEmployeePopup: React.FC<Props> = ({ open, onClose, addUser }) => {
  const [step, setStep] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "EMPLOYEE" as UserRole,
    managerId: "",
    joiningDate: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Validation
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canProceed = () => {
    if (step === 1) {
      return (
        formData.fullName.trim().length >= 3 &&
        isEmailValid(formData.email)
      );
    }

    if (step === 2) {
      return formData.joiningDate !== "";
    }

    return true;
  };

  // ✅ Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const payload: CreateUserRequest = {
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        managerId: formData.managerId
          ? Number(formData.managerId)
          : null,
        joiningDate: formData.joiningDate
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

  // ✅ Loader finish handler
  const handleLoaderFinished = () => {
    if (status === "success") {
      handleClose();
    }
    setStatus("idle");
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      fullName: "",
      email: "",
      role: "EMPLOYEE",
      managerId: "",
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
          <div
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div className="relative z-10 w-full max-w-2xl bg-slate-50 rounded-xl shadow-2xl overflow-hidden flex flex-col">

            {/* Header */}
            <div className="px-10 py-6 bg-white border-b flex justify-between items-center">
              <div>
                <div className="flex gap-2 mb-2">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={`h-1 w-8 ${step >= s ? "bg-indigo-600" : "bg-slate-200"
                        }`}
                    />
                  ))}
                </div>
                <h2 className="text-xl font-bold">Add Employee</h2>
              </div>

              <button onClick={handleClose}>
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[300px]">
              <AnimatePresence mode="wait">

                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <SectionHeader icon={<FaUser />} title="Basic Info" />

                    <FormInput
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />

                    <FormInput
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />

                    {/* Role */}
                    <div>
                      <label className="text-xs font-bold">Role *</label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded mt-1"
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="TEAM_LEADER">Team Leader</option>
                        <option value="HR">HR</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <SectionHeader icon={<FaBriefcase />} title="Work Info" />

                    <FormInput
                      label="Manager ID"
                      name="managerId"
                      value={formData.managerId}
                      onChange={handleInputChange}
                    />

                    <MyDatePicker
                      label="Joining Date"
                      required
                      selected={
                        formData.joiningDate
                          ? new Date(formData.joiningDate)
                          : null
                      }
                      onChange={(date: Date | null) =>
                        setFormData({
                          ...formData,
                          joiningDate: date ? date.toISOString() : ""
                        })
                      }
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white border-t flex justify-between">

              {step > 1 ? (
                <button onClick={() => setStep(step - 1)}>
                  <FaArrowLeft /> Back
                </button>
              ) : <div />}

              {step < 2 ? (
                <button
                  disabled={!canProceed()}
                  onClick={() => setStep(2)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  {isSubmitting ? "Submitting..." : <>Submit <FaCheckCircle /></>}
                </button>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 🔥 LOADER (GLOBAL OVERLAY) */}
      {(isSubmitting || status !== "idle") && (
        <Loader
          message={
            status === "error"
              ? "Failed..."
              : status === "success"
                ? "Done!"
                : "Creating Employee..."
          }
          isFinished={status === "success" || status === "error"}
          onFinished={handleLoaderFinished}
        />
      )}

    </AnimatePresence>
  );
};

/* Components */

const SectionHeader = ({ icon, title }: any) => (
  <div className="flex items-center gap-2 font-bold">
    {icon} {title}
  </div>
);

const FormInput = ({ label, required, ...props }: any) => (
  <div>
    <label className="text-xs font-bold">
      {label} {required && "*"}
    </label>
    <input {...props} className="w-full border px-3 py-2 rounded mt-1" />
  </div>
);

export default AddEmployeePopup;