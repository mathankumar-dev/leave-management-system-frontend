import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaUserCircle, FaBuilding, FaShieldAlt, 
  FaMapMarkerAlt, FaLink, FaGithub, FaLinkedin 
} from "react-icons/fa";

// Components & Types
import BaseProfile from "../../layout/BaseProfile";
import type { ProfileData } from "../../types";
import { MOCK_PROFILE } from "../../../../mockData";
 // Ensure path is correct

const EmployeeProfile: React.FC = () => {
  // Initialize with your new detailed MOCK_PROFILE
  const [profile, setProfile] = useState<ProfileData>(MOCK_PROFILE);
  const [originalProfile, setOriginalProfile] = useState<ProfileData>(MOCK_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  // Logic Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile((prev) => ({ ...prev, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleStartEdit = () => {
    setOriginalProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Logic for API call would go here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* 1. Page Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500">View and manage your professional identity.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Left Side: Summary Card */}
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
               <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" title="Active Account"></div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm font-semibold text-indigo-600 mb-1">{profile.designation}</p>
            <p className="text-xs text-slate-400 mb-4">{profile.department}</p>
            
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
                <span className="text-xs">{profile.workLocation}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <FaShieldAlt className="text-slate-400 text-xs shrink-0" />
                <span className="text-xs">Reports to: {profile.managerName}</span>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                {profile.linkedin && (
                  <a href={`https://${profile.linkedin}`} target="_blank" className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <FaLinkedin size={18} />
                  </a>
                )}
                {profile.github && (
                  <a href={`https://${profile.github}`} target="_blank" className="text-slate-400 hover:text-slate-900 transition-colors">
                    <FaGithub size={18} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Shortcuts */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative shadow-lg">
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Internal Support</p>
              <p className="text-sm mb-4 font-light leading-relaxed">Need to update your payroll or tax information?</p>
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all">
                Open Support Ticket
              </button>
            </div>
            <FaUserCircle className="absolute -bottom-6 -right-6 text-white/5 text-9xl" />
          </div>
        </div>

        {/* 3. Right Side: The Main Form Sections */}
        <div className="lg:col-span-8">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Nav Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/30 px-8">
              <button className="py-4 border-b-2 border-indigo-600 text-xs font-black uppercase tracking-widest text-indigo-600 mr-8">
                Details
              </button>
              <button className="py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                Security
              </button>
            </div>

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