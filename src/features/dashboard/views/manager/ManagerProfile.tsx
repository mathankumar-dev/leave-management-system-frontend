import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaUsers, FaChartLine, FaEnvelopeOpenText } from "react-icons/fa";

// Components & Types
import BaseProfile from "../../layout/BaseProfile";
import { MOCK_PROFILE } from "../../../../mockData";
import type { ProfileData } from "../../types";




const ManagerProfile: React.FC = () => {
  // Initializing with Manager specific data
  const [profile, setProfile] = useState<ProfileData>({
    ...MOCK_PROFILE,
    name: "Jane Manager",
    role: "Operations Director",
    email: "jane.m@company.com",
    department: "Operations",
    designation: "Senior Manager",
    managerName: "Robert Baratheon (VP)",
  });

  const [originalProfile, setOriginalProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-2">
      {/* Header with Role Badge */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Management Profile</h1>
          <p className="text-sm text-slate-500">Administrative view and personal settings.</p>
        </div>
        <span className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <FaUserShield /> Manager Access
        </span>
      </div>

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
            
            {/* Managerial Stats Row */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 my-6">
                <div className="text-center border-r border-slate-50">
                    <p className="text-lg font-bold text-slate-800">12</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Direct Reports</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">94%</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Team Pulse</p>
                </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <FaUsers className="text-slate-400 shrink-0" />
                <span className="text-xs font-medium">Department: {profile.department}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <FaChartLine className="text-slate-400 shrink-0" />
                <span className="text-xs font-medium">Budget Approval Enabled</span>
              </div>
            </div>
          </motion.div>

          {/* Manager Action Box */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Team Governance</h4>
              <p className="text-sm font-light text-slate-300 mb-4">Review pending leave requests and appraisal documents.</p>
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                <FaEnvelopeOpenText /> Go to Admin Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Profile Form */}
        <div className="lg:col-span-8">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="flex border-b border-slate-100 px-8 bg-slate-50/20">
              <button className="py-4 border-b-2 border-amber-500 text-xs font-black uppercase tracking-widest text-amber-600 mr-8">
                Manager Details
              </button>
              <button className="py-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Team Settings
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