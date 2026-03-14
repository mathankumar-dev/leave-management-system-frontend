import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

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
      setProfile(backendProfile);
    }
  }, [backendProfile]);

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CustomLoader label="Loading Profile..." />
      </div>
    );
  }

  const Field = ({ label, value }: any) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-700">{value || "-"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* PROFILE HEADER */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-6"
        >

          {/* AVATAR */}

          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            {profile.name?.charAt(0)}
          </div>

          {/* BASIC INFO */}

          <div className="flex-1">

            <h2 className="text-xl font-semibold text-slate-800">
              {profile.name}
            </h2>

            <p className="text-indigo-600 text-sm">
              {profile.designation || "Employee"}
            </p>

            <p className="text-xs text-slate-400">
              Employee ID: {profile.id}
            </p>

            {/* CONTACT */}

            <div className="flex flex-wrap gap-6 mt-3 text-sm text-slate-600">

              <div className="flex items-center gap-2">
                <FaEnvelope className="text-slate-400" />
                {profile.email}
              </div>

              <div className="flex items-center gap-2">
                <FaPhone className="text-slate-400" />
                {profile.contactNumber}
              </div>

              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-slate-400" />
                {profile.presentAddress || "No Address"}
              </div>

              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-slate-400" />
                Manager: {profile.managerName || "Not Assigned"}
              </div>

            </div>

          </div>

        </motion.div>


        {/* PERSONAL INFO */}

        <Section title="Personal Information">

          <Field label="Full Name" value={profile.name} />
          <Field label="Gender" value={profile.gender} />
          <Field label="Date Of Birth" value={profile.dateOfBirth} />
          <Field label="Blood Group" value={profile.bloodGroup} />
          <Field label="Personal Email" value={profile.personalEmail} />
          <Field label="Phone Number" value={profile.contactNumber} />
          <Field label="Father Name" value={profile.fatherName} />
          <Field label="Mother Name" value={profile.motherName} />

        </Section>


        {/* ADDRESS */}

        <Section title="Address">

          <Field label="Present Address" value={profile.presentAddress} />
          <Field label="Permanent Address" value={profile.permanentAddress} />

        </Section>


        {/* WORK DETAILS */}

        <Section title="Work Information">

          <Field label="Employee ID" value={profile.id} />
          <Field label="Designation" value={profile.designation} />
          <Field label="Manager" value={profile.managerName} />
          <Field label="Team Leader" value={profile.teamLeaderName} />
          <Field label="Joining Date" value={profile.joiningDate} />

        </Section>


        {/* SKILLS */}

        <div className="bg-white border rounded-xl p-6">

          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Skills
          </h3>

          <div className="flex flex-wrap gap-2">

            {profile.skillSet?.length ? (
              profile.skillSet.map((s, i) => (
                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">
                No skills added
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default EmployeeProfile;



const Section = ({ title, children }: any) => (

  <div className="bg-white border rounded-xl p-6">

    <h3 className="text-sm font-semibold text-slate-700 mb-5">
      {title}
    </h3>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {children}
    </div>

  </div>
);