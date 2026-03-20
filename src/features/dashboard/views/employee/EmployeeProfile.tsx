import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUserTie
} from "react-icons/fa";

import { useAuth } from "../../../auth/hooks/useAuth";
import { useEmployeeProfile } from "./UseEmployeeProfile";
import CustomLoader from "../../../../components/ui/CustomLoader";

import type { ProfileData } from "../../types";

const EmployeeProfile: React.FC = () => {
  const { user } = useAuth();
  const { profile: backendProfile, loading } = useEmployeeProfile(user?.id);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (backendProfile) {
      setProfile({
        ...backendProfile,
        // Normalize name
        name:
          backendProfile.fullName ||
          `${backendProfile.fullName ?? ""} ${backendProfile.lastName ?? ""} ${backendProfile.surName ?? ""}`.trim(),
        // Normalize skillSet
        // skillSet: Array.isArray(backendProfile.skillSet)
        //   ? backendProfile.skillSet
        //   : typeof backendProfile.skillSet === "string"
        //   ? backendProfile.skillSet.split(",").map(s => s.trim())
        //   : []
      });
    }
  }, [backendProfile]);

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CustomLoader label="Loading Profile..." />
      </div>
    );
  }

  const formatDate = (date?: string | Date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  const Field = ({ label, value }: any) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-700">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PROFILE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col md:flex-row gap-6"
        >
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            {profile.name?.charAt(0)}
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-indigo-600 text-sm">
              {profile.designation || "Employee"}
            </p>
            <p className="text-xs text-slate-400">
              Employee ID: {profile.id}
            </p>

            

            <div className="flex flex-wrap gap-6 mt-4 text-sm">
              <Contact icon={<FaEnvelope />} value={profile.email} />
              <Contact icon={<FaPhone />} value={profile.contactNumber} />
              <Contact icon={<FaMapMarkerAlt />} value={profile.presentAddress} />
              <Contact
                icon={<FaShieldAlt />}
                value={`Manager: ${profile.managerName || "Not Assigned"}`}
              />
            </div>
          </div>
        </motion.div>

        {/* GRID SECTIONS */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* PERSONAL INFO */}
          <Section title="Personal Information">
            <Field label="Full Name" value={profile.name} />
            <Field label="Gender" value={profile.gender} />
            <Field label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
            <Field label="Blood Group" value={profile.bloodGroup} />
            <Field label="Personal Email" value={profile.personalEmail} />
            <Field label="Phone Number" value={profile.contactNumber} />
            <Field label="Father Name" value={profile.fatherName} />
            <Field label="Mother Name" value={profile.motherName} />
          </Section>

          {/* WORK INFO */}
          <Section title="Work Information">
            <Field label="Designation" value={profile.designation} />
            <Field label="Joining Date" value={formatDate(profile.joiningDate)} />
            <Field label="Manager" value={profile.managerName} />
            <Field label="Team Leader" value={profile.teamLeaderName} />
            <Field label="Employee Type" value={profile.employeeType} />
          </Section>

          {/* ADDRESS */}
          <Section title="Address">
            <Field label="Present Address" value={profile.presentAddress} />
            <Field label="Permanent Address" value={profile.permanentAddress} />
          </Section>

          {/* VERIFICATION */}
          <Section title="Verification">
            <Field label="Status" value={profile.verificationStatus} />
            {profile.verificationStatus === "REJECTED" && (
              <Field label="HR Remarks" value={profile.hrRemarks} />
            )}
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            <Field label="Bank Name" value={profile.bankName} />
            <Field label="Account Number" value={profile.accountNumber} />
          </Section>

          {/* PF / UAN (Experienced only) */}
        
            <Section title="PF / UAN">
              <Field label="PF Number" value={profile.pfNumber} />
              <Field label="UAN Number" value={profile.unaNumber} />
            </Section>
          

          {/* SKILLS */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-sm font-semibold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skillSet && profile.skillSet.length > 0 ? (
                profile.skillSet.map((s, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400">No skills added</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;

/* REUSABLE COMPONENTS */
const Section = ({ title, children }: any) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
      <FaUserTie className="text-indigo-500" />
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-6">{children}</div>
  </div>
);

const Contact = ({ icon, value }: any) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-slate-400">{icon}</span>
    {value || "-"}
  </div>
);