import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";

// Components & Types
import BaseProfile from "../../layout/BaseProfile";
import type { ProfileData } from "../../types";
import { useAuth } from "../../../auth/hooks/useAuth";
import CustomLoader from "../../../../components/ui/CustomLoader";

const EmployeeProfile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileData>(() => ({
    ...user,
    phone: null,
    employeeId: null,
    photo: null,
    department: user?.department || null,
    designation: null,
    joiningDate: user?.joiningDate || null,
    workLocation: null,
    managerName: null,
    employmentType: 'Full-time',
    dob: null,
    gender: null,
    nationality: null,
    address: null,
    skills: [],
  } as unknown as ProfileData));

  const [originalProfile, setOriginalProfile] = useState<ProfileData>(profile);

  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: "",
        photo: "",
        department: user.department ?? "",
        designation: "",
        joiningDate: user.joiningDate,
        workLocation: "",
        managerName: "",
        managerId: user.managerId ?? undefined,
        employmentType: "Full-time",
        dob: "",
        gender: "",
        nationality: "",
        address: "",
        skills: [],
      });
    }
  }, [user]);

  // Loading Guard
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CustomLoader label="Loading Profile" />
      </div>
    );
  }

  // ================================
  // Handlers
  // ================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT SIDE: Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center"
          >
            <div className="relative inline-block mb-4">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 mx-auto shadow-md"
                  alt="User"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-md border-4 border-indigo-50">
                  {profile.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm font-semibold text-indigo-600 mb-1">{profile.designation || 'Employee'}</p>
            <p className="text-xs text-slate-400 mb-4">{profile.department}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold uppercase">
                {profile.employmentType}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">
                ID: {profile.id || 'N/A'}
              </span>
            </div>

            <div className="border-t border-slate-50 pt-6 text-left space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <FaMapMarkerAlt className="text-slate-400 text-xs shrink-0" />
                <span className="text-xs">{profile.workLocation || 'Remote'}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <FaShieldAlt className="text-slate-400 text-xs shrink-0" />
                <span className="text-xs">Reports to: {profile.managerId || 'Direct Manager'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Form Content */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="p-8">
              <BaseProfile
                profile={profile}
                isEditing={isEditing}
                canEdit={true}
                canEditDepartment={false}
                canEditEmployeeId={false}
                onChange={handleChange}
                onPhotoChange={handlePhotoChange}
                onStartEdit={() => {
                  setOriginalProfile(profile);
                  setIsEditing(true);
                }}
                onSave={() => setIsEditing(false)}
                onCancel={() => {
                  setProfile(originalProfile);
                  setIsEditing(false);
                }}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;