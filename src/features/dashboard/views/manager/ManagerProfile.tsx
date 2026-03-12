import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  HiOutlineUser, HiOutlineBriefcase, HiOutlineIdentification, 
  HiOutlineMapPin, HiOutlineUsers, HiOutlinePencilSquare,
  HiOutlineCheckBadge, HiOutlineShieldCheck
} from "react-icons/hi2";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { ProfileData } from "../../types";

const ManagerProfile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({} as ProfileData);

  useEffect(() => {
    if (user) {
      // EXACT MAPPING: Match backend JSON fields to ProfileData interface
      const mappedData: ProfileData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        personalDetailsComplete: user.personalDetailsComplete!,
        personalDetailsLocked: user.personalDetailsLocked!,
        
        designation: user.designation!,
        joiningDate: user.joiningDate,
        managerId: user.managerId,
        managerName: user.managerName,
        teamLeaderId: user.teamLeaderId!,
        teamLeaderName: user.teamLeaderName!,
        biometricStatus: user.biometricStatus,
        vpnStatus: user.vpnStatus,

        contactNumber: user.contactNumber!,
        personalEmail: user.personalEmail!,
        gender: user.gender!,
        bloodGroup: user.bloodGroup!,
        dateOfBirth: user.dateOfBirth!,
        aadharNumber: user.aadharNumber!,
        emergencyContactNumber: user.emergencyContactNumber!,

        presentAddress: user.presentAddress!,
        permanentAddress: user.permanentAddress!,

        fatherName: user.fatherName!,
        motherName: user.motherName!,

        skillSet: Array.isArray(user.skillSet) ? user.skillSet : [],

      };
      setProfile(mappedData);
    }
  }, [user]);

  const maskAadhar = (val: string) => {
    return val ? `XXXX-XXXX-${val.slice(-4)}` : "—";
  };

  if (isLoading || !profile.id) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounde-sm p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-100">
              {profile.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 uppercase">{profile.name}</h1>
                {profile.personalDetailsLocked && (
                  <HiOutlineShieldCheck className="text-emerald-500 w-6 h-6" title="Verified Profile" />
                )}
              </div>
              <p className="text-indigo-600 font-bold text-sm tracking-tight">{profile.designation}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">ID: {profile.id}</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">{profile.role}</span>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
            <HiOutlinePencilSquare className="w-4 h-4" /> Edit Profile
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Employment Card */}
            <div className="bg-white rounde-sm p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <HiOutlineBriefcase className="w-5 h-5" />
                <h2 className="text-xs font-black uppercase tracking-widest">Employment Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <InfoBlock label="Reporting Manager" value={profile.managerName} />
                <InfoBlock label="Joining Date" value={profile.joiningDate} />
                <InfoBlock label="Biometric Status" value={profile.biometricStatus} highlight={profile.biometricStatus === 'PENDING'} />
                <InfoBlock label="VPN Access" value={profile.vpnStatus} highlight={profile.vpnStatus === 'PENDING'} />
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skillSet.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 italic">
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="bg-white rounde-sm p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <HiOutlineMapPin className="w-5 h-5" />
                <h2 className="text-xs font-black uppercase tracking-widest">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoBlock label="Primary Email" value={profile.email} />
                <InfoBlock label="Personal Email" value={profile.personalEmail} />
                <InfoBlock label="Phone Number" value={profile.contactNumber} />
                <InfoBlock label="Emergency Contact" value={profile.emergencyContactNumber} />
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <InfoBlock label="Present Address" value={profile.presentAddress} />
                  <InfoBlock label="Permanent Address" value={profile.permanentAddress} />
                </div>
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-white rounde-sm p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <HiOutlineIdentification className="w-5 h-5" />
                <h2 className="text-xs font-black uppercase tracking-widest">Personal Identity</h2>
              </div>
              <div className="space-y-5">
                <InfoBlock label="Aadhar Card" value={maskAadhar(profile.aadharNumber)} />
                <div className="grid grid-cols-2 gap-4">
                  <InfoBlock label="Gender" value={profile.gender} />
                  <InfoBlock label="Blood Group" value={profile.bloodGroup?.replace('_', ' ')} />
                </div>
                <InfoBlock label="Date of Birth" value={profile.dateOfBirth} />
              </div>
            </div>

            {/* Family Card */}
            <div className="bg-white rounde-sm p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <HiOutlineUsers className="w-5 h-5" />
                <h2 className="text-xs font-black uppercase tracking-widest">Family Details</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Father's Name</p>
                  <p className="text-sm font-bold text-slate-800">{profile.fatherName || "—"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Mother's Name</p>
                  <p className="text-sm font-bold text-slate-800">{profile.motherName || "—"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for clean rendering
const InfoBlock = ({ label, value, highlight = false }: { label: string, value: any, highlight?: boolean }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-semibold ${highlight ? 'text-amber-600' : 'text-slate-700'}`}>
      {value || "—"}
    </p>
  </div>
);

export default ManagerProfile;