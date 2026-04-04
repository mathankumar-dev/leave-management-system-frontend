import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { ProfileData } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader } from "@/shared/components";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaPrint, FaEdit, FaTrash } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { HiOutlineShieldCheck, HiOutlineIdentification, HiOutlineCreditCard } from "react-icons/hi2";

// ─── No logic changes — UI only ──────────────────────────────────

const EmployeeProfile: React.FC = () => {
  const { user } = useAuth();
  const { profile: backendProfile, loading, fetchEmployeeProfile } = useEmployee();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (user?.id) fetchEmployeeProfile(user.id);
  }, [fetchEmployeeProfile, user?.id]);

  useEffect(() => {
    if (backendProfile) setProfile({ ...backendProfile });
  }, [backendProfile]);

  if (loading || !profile) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <CustomLoader label="Securing Profile Data..." />
      </div>
    );
  }

  const formatDate = (date?: string | Date) =>
    date ? new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "-";

  const TABS = [
    { id: "details", label: "Details" },
    { id: "personal", label: "Personal" },
    { id: "address", label: "Address" },
    { id: "financial", label: "Financial" },
    { id: "employment", label: "Employment" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-0">

      {/* ── TOP HEADER CARD ── */}
      <div className="bg-white rounded-t-2xl border border-slate-200 shadow-sm px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-start gap-5">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-2xl font-black text-rose-500 shrink-0 border-2 border-rose-200">
            {profile.name?.charAt(0)}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
              <div className="flex items-center gap-2">
                <FaPhone className="text-slate-400 text-sm" />
                <FaEnvelope className="text-slate-400 text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <HiOutlineOfficeBuilding className="text-slate-400" />
                {profile.designation || "Executive Associate"}
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineLocationMarker className="text-slate-400" />
                {formatDate(profile.joiningDate)}
              </span>
              <StatusBadge status={profile.verificationStatus} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 shrink-0 w-full md:w-auto">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <FaTrash className="text-xs text-slate-400" /> Delete
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <FaPrint className="text-xs text-slate-400" /> Print
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
              <FaEdit className="text-xs" /> Edit
            </button>
          </div>
        </div>

        {/* Last updated */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
          <HiOutlineShieldCheck className="text-slate-300" />
          Verification Status: <span className="font-semibold text-slate-500">{profile.verificationStatus || "PENDING"}</span>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white border-x border-slate-200 border-b">
        <div className="flex overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/30"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="bg-slate-50 border-x border-b border-slate-200 rounded-b-2xl shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="p-6"
          >

            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                {/* Left — Contact Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Phone Number" value={profile.contactNumber} />
                    <FormField label="Email" value={profile.email} />
                    <FormField label="Personal Email" value={profile.personalEmail} />
                    <FormField label="Emergency Contact" value={profile.emergencyContactNumber} />
                    <FormField label="Gender" value={profile.gender} />
                    <FormField label="Blood Group" value={profile.bloodGroup} />
                  </div>
                </div>

                {/* Right — Employment Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Employment Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <FormField label="Designation" value={profile.designation} />
                    <FormField label="Role" value={(profile as any).role} />
                    <FormField label="Manager" value={profile.reportingName} />
                    <FormField label="Joining Date" value={formatDate(profile.joiningDate)} />
                    <FormField label="Employment Type" value={(profile as any).employeeType} />
                    <FormField label="Biometric Status" value={(profile as any).biometricStatus} />
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skillSet?.map((s: string, i: number) => (
                        <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PERSONAL TAB */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HiOutlineIdentification /> Personal Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <FormField label="Full Legal Name" value={profile.name} />
                  <FormField label="Gender Identity" value={profile.gender} />
                  <FormField label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
                  <FormField label="Blood Group" value={profile.bloodGroup} />
                  <FormField label="Aadhar Number" value={profile.aadharNumber ? `****${profile.aadharNumber.slice(-4)}` : "-"} />
                  <FormField label="Marital Status" value={(profile as any).maritalStatus} />
                  <FormField label="Father's Name" value={profile.fatherName} />
                  <FormField label="Mother's Name" value={profile.motherName} />
                  <FormField label="Emergency Contact" value={profile.emergencyContactNumber} />
                </div>
              </div>
            )}

            {/* ADDRESS TAB */}
            {activeTab === "address" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HiOutlineLocationMarker /> Address Registry
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Present Residence</p>
                    <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-700 min-h-[80px]">
                      {profile.presentAddress || <span className="text-slate-300 italic">Not Specified</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Registry</p>
                    <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-700 min-h-[80px]">
                      {profile.permanentAddress || <span className="text-slate-300 italic">Not Specified</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FINANCIAL TAB */}
            {activeTab === "financial" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HiOutlineCreditCard /> Financial Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <FormField label="Bank Name" value={profile.bankName} />
                  <FormField label="Account Number" value={profile.accountNumber ? `****${profile.accountNumber.slice(-4)}` : "-"} />
                  <FormField label="PF Number" value={profile.pfNumber} />
                  <FormField label="UAN Number" value={profile.unaNumber} />
                </div>
              </div>
            )}

            {/* EMPLOYMENT TAB */}
            {activeTab === "employment" && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <HiOutlineOfficeBuilding /> Employment Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <FormField label="Designation" value={profile.designation} />
                  <FormField label="Joining Date" value={formatDate(profile.joiningDate)} />
                  <FormField label="Employment Type" value={(profile as any).employeeType} />
                  <FormField label="Manager" value={profile.reportingName} />
                  <FormField label="Biometric Status" value={(profile as any).biometricStatus} />
                  <FormField label="VPN Status" value={(profile as any).vpnStatus} />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skillset</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skillSet?.map((s: string, i: number) => (
                      <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wide">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VERIFICATION WARNING */}
            <AnimatePresence>
              {profile.verificationStatus === "REJECTED" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-5 flex gap-4 items-start"
                >
                  <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0">
                    <HiOutlineShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">HR Review Required</p>
                    <p className="text-sm font-semibold text-rose-800">"{profile.hrRemarks}"</p>
                    <p className="text-xs text-rose-500 mt-1">Please update your records and resubmit for verification.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── Reusable Sub-Components (logic unchanged) ─────────────────── */

const FormField = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 min-h-9 flex items-center">
      {value || <span className="text-slate-300 italic text-xs">Not Specified</span>}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const config: Record<string, string> = {
    VERIFIED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-200",
    UNKNOWN: "bg-slate-50 text-slate-400 border-slate-200",
  };
  const style = config[status || "UNKNOWN"] || config.UNKNOWN;
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${style}`}>
      {status || "UNKNOWN"}
    </span>
  );
};

// ─── Old sub-components kept for compatibility (unused in new UI) ─
// const Section = ({ title, icon, children }: any) => (
//   <div className="bg-white rounded-xl border border-slate-200 p-6">
//     <div className="flex items-center gap-2 mb-4">
//       {React.cloneElement(icon, { size: 18, className: "text-slate-400" })}
//       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
//     </div>
//     <div className="grid grid-cols-2 gap-4">{children}</div>
//   </div>
// );

// const Field = ({ label, value, isFullWidth }: any) => (
//   <div className={`flex flex-col gap-1.5 ${isFullWidth ? "col-span-2" : ""}`}>
//     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
//     <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700">
//       {value || <span className="text-slate-300 italic text-xs">Not Specified</span>}
//     </div>
//   </div>
// );

// const ContactItem = ({ icon, label, value }: any) => (
//   <div className="flex flex-col gap-1">
//     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
//     <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
//       <span className="text-slate-400">{icon}</span>
//       <span className="truncate">{value || "-"}</span>
//     </div>
//   </div>
// );

export default EmployeeProfile;