import React from "react";

export interface ProfileData {
  name: string;
  role?: string;
  email: string;
  phone: string;
  employeeId?: string;
  department?: string;
  dob: string;
  gender: string;
  address: string;
  photo: string;
}

interface BaseProfileProps {
  profile: ProfileData;
  isEditing: boolean;
  canEdit: boolean;
  canEditDepartment?: boolean; // HR only
  canEditEmployeeId?: boolean; // Employee only
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const BaseProfile: React.FC<BaseProfileProps> = ({
  profile,
  isEditing,
  canEdit,
  canEditDepartment,
  canEditEmployeeId,
  onChange,
  onPhotoChange,
  onStartEdit,
  onSave,
  onCancel,
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <img
            src={profile.photo || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-slate-200"
          />

          {isEditing && canEdit && (
            <label className="absolute inset-0 bg-black/50 text-white text-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onPhotoChange}
              />
            </label>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {profile.name}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {profile.role}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(["name", "email", "phone"] as const).map((field) => (
          <div key={field}>
            <label className="text-sm font-semibold text-slate-600 capitalize">
              {field}
            </label>
            <input
              name={field}
              value={profile[field]}
              onChange={onChange}
              disabled={!isEditing || !canEdit}
              className="w-full mt-1 px-4 py-2 border rounded-xl bg-slate-50 disabled:bg-slate-100"
            />
          </div>
        ))}

        {/* Gender */}
        <div>
          <label className="text-sm font-semibold text-slate-600">
            Gender
          </label>
          <select
            name="gender"
            value={profile.gender}
            onChange={onChange}
            disabled={!isEditing || !canEdit}
            className="w-full mt-1 px-4 py-2 border rounded-xl bg-slate-50 disabled:bg-slate-100"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="text-sm font-semibold text-slate-600">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={onChange}
            disabled={!isEditing || !canEdit}
            className="w-full mt-1 px-4 py-2 border rounded-xl bg-slate-50 disabled:bg-slate-100"
          />
        </div>

        {/* Employee ID */}
        {profile.employeeId !== undefined && (
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Employee ID
            </label>
            <input
              name="employeeId"
              value={profile.employeeId}
              onChange={onChange}
              disabled={!canEditEmployeeId}
              className={`w-full mt-1 px-4 py-2 border rounded-xl ${
                canEditEmployeeId ? "bg-slate-50" : "bg-slate-100"
              }`}
            />
          </div>
        )}

        {/* Department */}
        {profile.department !== undefined && (
          <div>
            <label className="text-sm font-semibold text-slate-600">
              Department
            </label>
            <input
              name="department"
              value={profile.department}
              onChange={onChange}
              disabled={!canEditDepartment}
              className={`w-full mt-1 px-4 py-2 border rounded-xl ${
                canEditDepartment ? "bg-slate-50" : "bg-slate-100"
              }`}
            />
          </div>
        )}

        {/* Address */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-600">
            Address
          </label>
          <input
            name="address"
            value={profile.address}
            onChange={onChange}
            disabled={!isEditing || !canEdit}
            className="w-full mt-1 px-4 py-2 border rounded-xl bg-slate-50 disabled:bg-slate-100"
          />
        </div>
      </div>

      {/* Action Buttons */}
      {canEdit && (
        <div className="flex gap-4 mt-8">
          {!isEditing ? (
            <button
              onClick={onStartEdit}
              className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-semibold"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={onSave}
                className="px-8 py-2 bg-emerald-600 text-white rounded-xl font-semibold"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="px-8 py-2 bg-slate-200 rounded-xl font-semibold"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BaseProfile;
