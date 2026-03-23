import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUserTie
} from "react-icons/fa";
import { useEmployeeProfile } from "@/features/employee/pages/UseEmployeeProfile";
import type { ProfileData } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader } from "@/shared/components";


const EmployeeProfile: React.FC = () => {
  const { user } = useAuth();
  const { profile: backendProfile, loading } = useEmployeeProfile(user?.id);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (backendProfile) {
      setProfile({
        ...backendProfile,
        name:
          backendProfile.fullName ||
          `${backendProfile.fullName ?? ""} ${backendProfile.lastName ?? ""} ${backendProfile.surName ?? ""}`.trim(),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border p-8 flex flex-col md:flex-row gap-6 hover:shadow-xl transition"
        >
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md"
          >
            {profile.name?.charAt(0)}
          </motion.div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-2xl font-bold">{profile.name}</h2>

              {/* STATUS BADGE */}
              <StatusBadge status={profile.verificationStatus} />
            </div>

            <p className="text-indigo-600 text-sm mt-1">
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

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

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

          <Section title="Work Information">
            <Field label="Designation" value={profile.designation} />
            <Field label="Joining Date" value={formatDate(profile.joiningDate)} />
            <Field label="Manager" value={profile.managerName} />
            <Field label="Team Leader" value={profile.teamLeaderName} />
            <Field label="Employee Type" value={profile.employeeType} />
          </Section>

          <Section title="Address">
            <Field label="Present Address" value={profile.presentAddress} />
            <Field label="Permanent Address" value={profile.permanentAddress} />
          </Section>

          {/* VERIFICATION */}
          <Section title="Verification">
            <Field label="Status" value={profile.verificationStatus} />

            {profile.verificationStatus === "REJECTED" && profile.hrRemarks && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start"
              >
                <span className="text-red-500 text-lg">⚠️</span>

                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase">
                    HR Remarks
                  </p>
                  <p className="text-sm text-red-700 font-medium mt-1">
                    {profile.hrRemarks}
                  </p>
                </div>
              </motion.div>
            )}
          </Section>

          <Section title="Bank Details">
            <Field label="Bank Name" value={profile.bankName} />
            <Field label="Account Number" value={profile.accountNumber} />
          </Section>

          <Section title="PF / UAN">
            <Field label="PF Number" value={profile.pfNumber} />
            <Field label="UAN Number" value={profile.unaNumber} />
          </Section>

          {/* SKILLS */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-sm font-semibold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skillSet?.length > 0 ? (
                profile.skillSet.map((s, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {s}
                  </motion.span>
                ))
              ) : (
                <span className="text-sm text-slate-400">No skills added</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;

/* STATUS BADGE */
const StatusBadge = ({ status }: { status?: string }) => {
  let color = "bg-gray-200 text-gray-700";

  if (status === "VERIFIED")
    color = "bg-green-100 text-green-700";
  else if (status === "PENDING")
    color = "bg-yellow-100 text-yellow-700 animate-pulse";
  else if (status === "REJECTED")
    color = "bg-red-100 text-red-700";

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
    >
      {status || "UNKNOWN"}
    </motion.span>
  );
};

/* REUSABLE COMPONENTS */
const Section = ({ title, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    className="bg-white rounded-xl shadow-sm border p-6 transition"
  >
    <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
      <FaUserTie className="text-indigo-500" />
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-6">{children}</div>
  </motion.div>
);

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

const Contact = ({ icon, value }: any) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <span className="text-slate-400">{icon}</span>
    {value || "-"}
  </div>
);