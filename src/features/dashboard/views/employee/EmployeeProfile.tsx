import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa"

import { useAuth } from "../../../auth/hooks/useAuth"
// import { useEmployeeProfile } from "../../hooks/useEmployeeProfile"
import CustomLoader from "../../../../components/ui/CustomLoader"

import type { ProfileData } from "../../types"
import { useEmployeeProfile } from "./UseEmployeeProfile"

const EmployeeProfile: React.FC = () => {

  const { user } = useAuth()

  const { profile: backendProfile, loading } = useEmployeeProfile(user?.id)

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (backendProfile) {
      setProfile(backendProfile)
      setOriginalProfile(backendProfile)
    }
  }, [backendProfile])

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CustomLoader label="Loading Profile..." />
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setProfile(prev => ({
      ...prev!,
      [name]: value
    }))
  }

  const Field = ({ label, name, value }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>

      {isEditing ? (
        <input
          name={name}
          value={value || ""}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      ) : (
        <span className="text-sm text-gray-700">{value || "-"}</span>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

        {/* PROFILE CARD */}

        <div className="lg:col-span-4">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow border p-6 text-center"
          >

            <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl mx-auto">
              {profile.name?.charAt(0)}
            </div>

            <h2 className="text-xl font-bold mt-4">{profile.name}</h2>

            <p className="text-indigo-600 text-sm">
              {profile.designation || "Employee"}
            </p>

            <p className="text-xs text-gray-400">{profile.role}</p>

            <div className="mt-4 text-xs text-gray-500 space-y-2">

              <div className="flex gap-2 items-center">
                <FaMapMarkerAlt />
                {profile.presentAddress || "No address"}
              </div>

              <div className="flex gap-2 items-center">
                <FaShieldAlt />
                Manager: {profile.managerName || "Not Assigned"}
              </div>

            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>

          </motion.div>

        </div>


        {/* DETAILS SECTION */}

        <div className="lg:col-span-8 space-y-6">

          {/* PERSONAL */}

          <Section title="Personal Information">

            <Field label="Full Name" name="name" value={profile.name} />
            <Field label="Email" name="email" value={profile.email} />
            <Field label="Personal Email" name="personalEmail" value={profile.personalEmail} />
            <Field label="Phone" name="contactNumber" value={profile.contactNumber} />
            <Field label="Gender" name="gender" value={profile.gender} />
            <Field label="Date Of Birth" name="dateOfBirth" value={profile.dateOfBirth} />
            <Field label="Blood Group" name="bloodGroup" value={profile.bloodGroup} />

          </Section>

          {/* ADDRESS */}

          <Section title="Address">

            <Field label="Present Address" name="presentAddress" value={profile.presentAddress} />
            <Field label="Permanent Address" name="permanentAddress" value={profile.permanentAddress} />

          </Section>

          {/* FAMILY */}

          <Section title="Family">

            <Field label="Father Name" name="fatherName" value={profile.fatherName} />
            <Field label="Mother Name" name="motherName" value={profile.motherName} />
            <Field label="Emergency Contact" name="emergencyContactNumber" value={profile.emergencyContactNumber} />

          </Section>

          {/* WORK */}

          <Section title="Work Details">

            <Field label="Employee ID" name="id" value={profile.id} />
            <Field label="Designation" name="designation" value={profile.designation} />
            <Field label="Manager" name="managerName" value={profile.managerName} />
            <Field label="Team Leader" name="teamLeaderName" value={profile.teamLeaderName} />
            <Field label="Joining Date" name="joiningDate" value={profile.joiningDate} />

          </Section>

          {/* SKILLS */}

          <Section title="Skills">

            <div className="flex flex-wrap gap-2">

              {profile.skillSet?.length
                ? profile.skillSet.map((s, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))
                : "No skills added"}

            </div>

          </Section>

        </div>

      </div>

    </div>
  )
}

export default EmployeeProfile


const Section = ({ title, children }: any) => (

  <div className="bg-white border rounded-xl p-6">

    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>

    <div className="grid grid-cols-2 gap-4">
      {children}
    </div>

  </div>
)