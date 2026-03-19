import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaBriefcase,
  FaIdCard,
  FaUsers
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi2";

import { useAuth } from "../../../auth/hooks/useAuth";
import type { ProfileData } from "../../types";

const ManagerProfile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({} as ProfileData);

  useEffect(() => {
    if (user) {
      const mappedData: ProfileData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        personalDetailsComplete: user.personalDetailsComplete!,
        personalDetailsLocked: user.personalDetailsLocked!,
        designation: user.designation!,
        joiningDate: user.joiningDate,
        managerId: user.managerId,
        managerName: user.managerName,
        teamLeaderId: user.teamLeaderId!,
        teamLeaderName: user.teamLeaderName!,
        biometricStatus: user.biometricStatus,
        vpnStatus: user.vpnStatus,
        contactNumber: user.contactNumber!,
        personalEmail: user.personalEmail!,
        gender: user.gender!,
        bloodGroup: user.bloodGroup!,
        dateOfBirth: user.dateOfBirth!,
        aadharNumber: user.aadharNumber!,
        emergencyContactNumber: user.emergencyContactNumber!,
        presentAddress: user.presentAddress!,
        permanentAddress: user.permanentAddress!,
        fatherName: user.fatherName!,
        motherName: user.motherName!,
        skillSet: Array.isArray(user.skillSet) ? user.skillSet : [],
      };
      setProfile(mappedData);
    }
  }, [user]);

  const maskAadhar = (val: string) => {
    return val ? `XXXX-XXXX-${val.slice(-4)}` : "—";
  };

  if (isLoading || !profile.id) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PROFILE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-sm shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-sm bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-100">
            {profile.name?.charAt(0)}
          </div>

          {/* Main Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl font-bold text-slate-800 uppercase">
                {profile.name}
              </h2>
              {profile.personalDetailsLocked && (
                <HiOutlineShieldCheck className="text-emerald-500 w-6 h-6" title="Verified Profile" />
              )}
            </div>

            <p className="text-indigo-600 font-medium text-sm mt-1">
              {profile.designation || "Manager"}
            </p>

            <div className="flex flex-col justify-center md:justify-start gap-2 mt-1">
              <span className="text-xs text-slate-400">Employee ID: {profile.id}</span>
              <span className="text-xs text-gray-500">Role: {profile.role}</span>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-sm text-slate-600">
              <Contact icon={<FaEnvelope />} value={profile.email} />
              <Contact icon={<FaPhone />} value={profile.contactNumber} />
              <Contact icon={<FaMapMarkerAlt />} value={profile.presentAddress} />
              <Contact icon={<FaShieldAlt />} value={`Reporting to: ${profile.managerName || "Direct"}`} />
            </div>
          </div>
        </motion.div>

        {/* GRID SECTIONS */}
        <div className="grid lg:grid-cols-2 gap-6">

          <Section title="Personal Information" icon={<FaUserTie />}>
            <Field label="Full Name" value={profile.name} />
            <Field label="Gender" value={profile.gender} />
            <Field label="Date Of Birth" value={profile.dateOfBirth} />
            <Field label="Blood Group" value={profile.bloodGroup?.replace('_', ' ')} />
            <Field label="Personal Email" value={profile.personalEmail} />
            <Field label="Emergency Contact" value={profile.emergencyContactNumber} />
            <Field label="Father's Name" value={profile.fatherName} />
            <Field label="Mother's Name" value={profile.motherName} />
          </Section>

          <Section title="Work Information" icon={<FaBriefcase />}>
            <Field label="Designation" value={profile.designation} />
            <Field label="Joining Date" value={profile.joiningDate} />
            <Field label="Reporting Manager" value={profile.managerName} />
            {(profile.role != "MANAGER") && (profile.role != "TEAM_LEADER") && <Field label="Team Leader" value={profile.teamLeaderName} />}

            <Field label="Biometric Status" value={profile.biometricStatus} highlight={profile.biometricStatus === 'PENDING'} />
            <Field label="VPN Access" value={profile.vpnStatus} highlight={profile.vpnStatus === 'PENDING'} />
          </Section>

          <Section title="Identity & Address" icon={<FaIdCard />}>
            <div className="col-span-2">
              <Field label="Aadhar Card" value={maskAadhar(profile.aadharNumber)} />
            </div>
            <div className="col-span-2 space-y-4">
              <Field label="Present Address" value={profile.presentAddress} />
              <Field label="Permanent Address" value={profile.permanentAddress} />
            </div>
          </Section>

          {/* Skills Section */}
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
              <FaUsers className="text-indigo-500" />
              Core Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skillSet?.length ? (
                profile.skillSet.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-indigo-100"
                  >
                    #{skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">No skills listed</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Reusable Sub-components ---

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6">
    <h3 className="text-sm font-semibold text-slate-700 mb-5 flex items-center gap-2">
      <span className="text-indigo-500">{icon}</span>
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, highlight = false }: { label: string; value: any; highlight?: boolean }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
      {label}
    </span>
    <span className={`text-sm font-semibold ${highlight ? 'text-amber-600' : 'text-slate-700'}`}>
      {value || "—"}
    </span>
  </div>
);

const Contact = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-slate-400">{icon}</span>
    <span className="truncate max-w-[150px] md:max-w-none">{value || "—"}</span>
  </div>
);

export default ManagerProfile;