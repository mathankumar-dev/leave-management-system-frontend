import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { ProfileData } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader } from "@/shared/components";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineOfficeBuilding } from "react-icons/hi";
import { HiOutlineShieldCheck, HiOutlineIdentification, HiOutlineCreditCard } from "react-icons/hi2";

const EmployeeProfile: React.FC = () => {
  const { user } = useAuth();
  const { profile: backendProfile, loading, fetchEmployeeProfile } = useEmployee();
  const [profile, setProfile] = useState<ProfileData | null>(null);

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

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      
      {/* HEADER: IDENTITY CARD STYLE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white p-10 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-20 -mt-20 blur-3xl" />

        {/* Brand Avatar Box */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-32 h-32 rounded-full bg-brand text-white flex items-center justify-center text-4xl font-black shadow-2xl shadow-brand/30 shrink-0 relative z-10"
        >
          {profile.name?.charAt(0)}
        </motion.div>

        {/* Main Identity Info */}
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">{profile.name}</h2>
            <StatusBadge status={profile.verificationStatus} />
          </div>

          <p className="text-brand font-black uppercase tracking-[0.2em] text-xs mb-6">
            {profile.designation || "Executive Associate"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactItem icon={<FaEnvelope />} label="Email" value={profile.email} />
            <ContactItem icon={<FaPhone />} label="Phone" value={profile.contactNumber} />
            <ContactItem icon={<HiOutlineLocationMarker />} label="Work Base" value={profile.presentAddress?.split(',')[0]} />
            <ContactItem icon={<HiOutlineShieldCheck />} label="Manager" value={profile.reportingName} />
          </div>
        </div>
      </motion.div>

      {/* INFORMATION GRID */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        <Section icon={<HiOutlineIdentification />} title="Personal Profile">
          <Field label="Full Legal Name" value={profile.name} />
          <Field label="Gender Identity" value={profile.gender} />
          <Field label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
          <Field label="Blood Group" value={profile.bloodGroup} />
          <Field label="Personal Email" value={profile.personalEmail} />
          <Field label="Family Reference" value={`${profile.fatherName} (F)`} />
        </Section>

        <Section icon={<HiOutlineOfficeBuilding />} title="Employment Details">
          <Field label="Primary Designation" value={profile.designation} />
          <Field label="Joining Date" value={formatDate(profile.joiningDate)} />
          <Field label="Employment Type" value={profile.employeeType} />
          <div className="col-span-2 pt-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Verified Skillset</p>
             <div className="flex flex-wrap gap-2">
                {profile.skillSet?.map((s, i) => (
                  <span key={i} className="bg-brand/10 text-brand text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-tighter">
                    {s}
                  </span>
                ))}
             </div>
          </div>
        </Section>

        <Section icon={<HiOutlineLocationMarker />} title="Address Registry">
          <Field label="Present Residence" value={profile.presentAddress} isFullWidth />
          <Field label="Permanent Registry" value={profile.permanentAddress} isFullWidth />
        </Section>

        <Section icon={<HiOutlineCreditCard />} title="Financial">
          <Field label="Bank Name" value={profile.bankName} />
          <Field label="Account Number" value={profile.accountNumber ? `****${profile.accountNumber.slice(-4)}` : "-"} />
          <Field label="PF Number" value={profile.pfNumber} />
          <Field label="UAN Identity" value={profile.unaNumber} />
        </Section>

        {/* VERIFICATION WARNING IF REJECTED */}
        <AnimatePresence>
          {profile.verificationStatus === "REJECTED" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-rose-50/50 backdrop-blur-md border border-rose-100 rounded-[2.5rem] p-8 flex gap-6 items-center"
            >
              <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-rose-200">
                <HiOutlineShieldCheck size={32} />
              </div>
              <div>
                <p className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-1">HR Review Required</p>
                <p className="text-lg font-bold text-rose-900 leading-tight">"{profile.hrRemarks}"</p>
                <p className="text-sm text-rose-600/70 mt-1 font-medium">Please update your records and resubmit for verification.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* REUSABLE SUB-COMPONENTS STYLED TO MATCH */

const Section = ({ title, icon, children }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 p-8 transition-all duration-500 border border-white/50"
  >
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">{children}</div>
  </motion.div>
);

const Field = ({ label, value, isFullWidth }: any) => (
  <div className={`flex flex-col gap-1.5 ${isFullWidth ? "col-span-2" : ""}`}>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </span>
    <div className="bg-white/50 p-3 rounded-2xl text-sm font-bold text-slate-700 min-h-11 flex items-center px-4">
      {value || <span className="text-slate-300 font-medium italic">Not Specified</span>}
    </div>
  </div>
);

const ContactItem = ({ icon, label, value }: any) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">{label}</span>
    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
      <span className="text-brand/60">{icon}</span>
      <span className="truncate">{value || "-"}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const config: any = {
    VERIFIED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100 animate-pulse",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    UNKNOWN: "bg-slate-50 text-slate-400 border-slate-100"
  };

  const style = config[status || "UNKNOWN"];

  return (
    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${style}`}>
      {status || "UNKNOWN"}
    </span>
  );
};

export default EmployeeProfile;