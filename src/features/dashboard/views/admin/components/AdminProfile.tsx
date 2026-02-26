import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaMapMarkerAlt,
  FaCrown,
  FaCamera,
} from "react-icons/fa";

import BaseProfile from "../../../layout/BaseProfile";
import type { ProfileData } from "../../../types";
import { MOCK_PROFILE } from "../../../../../mockData";
// import { authService } from "../../../auth/services/AuthService";

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    ...MOCK_PROFILE,
    role: "ADMIN",
  });

  const [originalProfile, setOriginalProfile] =
    useState<ProfileData>(profile);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 BACKEND FETCH PROFILE (Uncomment when backend ready)
  /*
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const backendProfile = await authService.getAdminProfile();
        setProfile(backendProfile);
        setOriginalProfile(backendProfile);
      } catch (error) {
        console.error("Failed to load admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  */

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

  const handleSave = async () => {
    try {
      setLoading(true);

      // 🔥 BACKEND SAVE API (Uncomment when ready)
      /*
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("workLocation", profile.workLocation);

      if (profile.photo && profile.photo.startsWith("data:image")) {
        const blob = await fetch(profile.photo).then(res => res.blob());
        formData.append("photo", blob, "profile.jpg");
      }

      await authService.updateAdminProfile(formData);
      */

      setIsEditing(false);
      setOriginalProfile(profile);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  if (loading) return <div>Loading Admin profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT PANEL */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-md border border-slate-200 p-8 text-center"
          >
            {/* Profile Image */}
            <div className="relative inline-block mb-5">
              <img
                src={profile.photo || "https://via.placeholder.com/150"}
                className="w-36 h-36 rounded-full object-cover border-4 border-indigo-100 shadow-lg mx-auto"
                alt="Admin Profile"
              />

              {/* Online Status */}
              <div className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 border-4 border-white rounded-full" />

              {/* Upload Button (Only in Edit Mode) */}
              {isEditing && (
                <label className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
                  <FaCamera size={12} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-slate-900">
              {profile.name}
            </h2>

            {/* Role Badge */}
            <div className="mt-2 inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white text-xs px-4 py-1 rounded-full font-semibold">
              <FaCrown size={10} />
              ADMINISTRATOR
            </div>

            <p className="text-sm text-slate-500 mt-2">
              {profile.department}
            </p>

            {/* Tags */}
            <div className="flex justify-center gap-2 mt-6">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold uppercase">
                {profile.employmentType}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold uppercase">
                {profile.employeeId}
              </span>
            </div>

            {/* Info */}
            <div className="border-t mt-8 pt-6 space-y-3 text-left text-sm">
              <div className="flex items-center gap-3 text-slate-600">
                <FaMapMarkerAlt className="text-slate-400 text-xs" />
                {profile.workLocation}
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <FaShieldAlt className="text-slate-400 text-xs" />
                Reports to: {profile.managerName || "Board"}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-md border border-slate-200 overflow-hidden"
          >
            <div className="p-10">
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

export default AdminProfile;