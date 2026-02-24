import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaUsers, FaChartLine, FaEnvelopeOpenText } from "react-icons/fa";

// Components & Types
import BaseProfile from "../../layout/BaseProfile";
import { MOCK_PROFILE } from "../../../../mockData";
import type { ProfileData } from "../../types";
import { getProfile } from "../../../auth/services/AuthService";



const ManagerProfile: React.FC = () => {
  // Initializing with Manager specific data
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile({ ...profile, photo: reader.result as string });
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
                <img
                  src={profile.photo || "https://i.pravatar.cc/150?u=jane"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 mx-auto shadow-md"
                  alt="Manager Profile"
                />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm font-semibold text-amber-600 mb-4">{profile.role}</p>
            </div>



            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <FaUsers className="text-slate-400 shrink-0" />
                <span className="text-xs font-medium">Department: {profile.department}</span>
              </div>

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