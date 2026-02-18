import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

// Components & Types
import BaseProfile from "../../layout/BaseProfile";
import type { ProfileData } from "../../types";
import { MOCK_PROFILE } from "../../../../mockData";
import { useAuth } from "../../../auth/hooks/useAuth";
import { getProfile } from "../../../auth/services/AuthService";

const EmployeeProfile: React.FC = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>(MOCK_PROFILE);
  const [originalProfile, setOriginalProfile] =
    useState<ProfileData>(MOCK_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);


  /**
   * When user loads from backend (via /me),
   * merge it into profile state.
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const backendProfile = await getProfile();

        const updatedProfile: ProfileData = {
          ...MOCK_PROFILE,
          ...backendProfile,
        };

        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);



  // ================================
  // Handlers
  // ================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        photo: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = () => {
    setOriginalProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    // TODO: call API to save profile
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  if (loading) return <div>Loading profile...</div>;
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center"
          >
            <div className="relative inline-block mb-4">
              <img
                src={profile.photo || "https://via.placeholder.com/150"}
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 mx-auto shadow-md"
                alt="User Profile"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {profile.name}
            </h2>
            <p className="text-sm font-semibold text-indigo-600 mb-1">
              {profile.designation}
            </p>
            <p className="text-xs text-slate-400 mb-4">
              {profile.department}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold uppercase">
                {profile.employmentType}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase">
                {profile.employeeId}
              </span>
            </div>

            <div className="border-t border-slate-50 pt-6 text-left space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <FaMapMarkerAlt className="text-slate-400 text-xs shrink-0" />
                <span className="text-xs">
                  {profile.workLocation}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <FaShieldAlt className="text-slate-400 text-xs shrink-0" />
                <span className="text-xs">
                  Reports to: {profile.managerName}
                </span>
              </div>

              
            </div>
          </motion.div>


        </div>

        {/* RIGHT SIDE */}
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
                onStartEdit={handleStartEdit}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfile;
