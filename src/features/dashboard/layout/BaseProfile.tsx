import React from "react";
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaBuilding, 
  FaMapMarkerAlt, FaLinkedin, FaGithub, FaBriefcase, FaUserTie 
} from "react-icons/fa";
import type { ProfileData } from "../types";

// export interface ProfileData {
//   name: string;
//   role: string;
//   email: string;
//   phone: string;
//   employeeId: string;
//   photo: string;
//   department: string;
//   designation: string;
//   joiningDate: string;
//   workLocation: string;
//   managerName: string;
//   employmentType: 'Full-time' | 'Contract' | 'Intern';
//   dob: string;
//   gender: string;
//   bloodGroup?: string;
//   nationality: string;
//   address: string;
//   linkedin?: string;
//   github?: string;
//   skills: string[];
// }

export interface BaseProfileProps {
  profile: ProfileData;
  isEditing: boolean;
  canEdit: boolean;
  canEditDepartment?: boolean;
  canEditEmployeeId?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const BaseProfile: React.FC<BaseProfileProps> = ({
  profile,
  isEditing,
  canEdit,
  onChange,
  onStartEdit,
  onSave,
  onCancel,
}) => {
  
  const inputClass = (disabled: boolean) => `w-full mt-1 pl-10 pr-4 py-2 border border-slate-200 rounded-xl transition-all outline-none text-sm ${
    disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
  }`;

  const labelClass = "text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wide";

  return (
    <div className="w-full space-y-10">
      
      {/* SECTION 1: PERSONAL DETAILS (Editable) */}
      <div>
        <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <FaUser className="text-sm" /> Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className={labelClass}>Full Name</label>
            <div className="relative mt-1">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="name" value={profile.name} onChange={onChange} disabled={!isEditing} className={inputClass(!isEditing)} />
            </div>
          </div>

          <div className="relative">
            <label className={labelClass}>Contact Number</label>
            <div className="relative mt-1">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="phone" value={profile.phone} onChange={onChange} disabled={!isEditing} className={inputClass(!isEditing)} />
            </div>
          </div>

          <div className="md:col-span-2 relative">
            <label className={labelClass}>Residential Address</label>
            <div className="relative mt-1">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="address" value={profile.address} onChange={onChange} disabled={!isEditing} className={inputClass(!isEditing)} />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: WORK INFORMATION (Mostly Read-Only) */}
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <FaBriefcase className="text-sm" /> Employment Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Employee ID</label>
            <p className="mt-1 font-bold text-slate-700 text-sm">{profile.employeeId}</p>
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <p className="mt-1 font-bold text-slate-700 text-sm">{profile.department}</p>
          </div>
          <div>
            <label className={labelClass}>Manager</label>
            <p className="mt-1 font-bold text-slate-700 text-sm">{profile.managerName}</p>
          </div>
          <div>
            <label className={labelClass}>Work Location</label>
            <p className="mt-1 font-bold text-slate-700 text-sm">{profile.workLocation}</p>
          </div>
          <div>
            <label className={labelClass}>Joining Date</label>
            <p className="mt-1 font-bold text-slate-700 text-sm">{profile.joiningDate}</p>
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase">
              {profile.employmentType}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: SOCIAL & SKILLS */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
          <FaLinkedin className="text-sm" /> Social Presence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className={labelClass}>LinkedIn URL</label>
            <div className="relative mt-1">
              <FaLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="linkedin" value={profile.linkedin || ""} onChange={onChange} disabled={!isEditing} className={inputClass(!isEditing)} placeholder="linkedin.com/in/username" />
            </div>
          </div>
          <div className="relative">
            <label className={labelClass}>GitHub Profile</label>
            <div className="relative mt-1">
              <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name="github" value={profile.github || ""} onChange={onChange} disabled={!isEditing} className={inputClass(!isEditing)} placeholder="github.com/username" />
            </div>
          </div>
        </div>

        {/* Skills Display */}
        <div className="mt-6">
          <label className={labelClass}>Core Skills</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      {canEdit && (
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          {!isEditing ? (
            <button onClick={onStartEdit} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={onCancel} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={onSave} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                Save Changes
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BaseProfile;