import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaUsers, FaChartLine, FaEnvelopeOpenText } from "react-icons/fa";

// Components & Types
import BaseProfile from "../../layout/BaseProfile";
import { MOCK_PROFILE } from "../../../../mockData";
import type { ProfileData } from "../../types";
import { useAuth } from "../../../auth/hooks/useAuth";



const ManagerProfile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Initialize state
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

  // SINGLE Sync Effect: Runs once when user data arrives or changes
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

  // Loading Guard: Very important to prevent 'null' errors in the UI
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Handle changes...
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile(prev => ({ ...prev, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] ">

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Side: Leadership Summary */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="text-center">
              <div className="relative inline-block mb-4">
                {/* <img
                  src={profile.photo || "https://i.pravatar.cc/150?u=jane"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 mx-auto shadow-md"
                  alt="Manager Profile"
                /> */}
                <div className="w-10 h-10 rounded-lg bg-primary-500
            flex items-center justify-center text-white font-bold text-sm
            shadow-lg shadow-primary-500/20">
                  {profile.name?.charAt(0) || "U"}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm font-semibold text-amber-600 mb-4">{profile.role}</p>
              <p className="text-sm font-semibold text-amber-600 mb-4">ID: {profile.id}</p>
            </div>

          </motion.div>
        </div>

        {/* Right Side: Profile Form */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >

            <div className="p-6">
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

export default ManagerProfile;