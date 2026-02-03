import React, { useState } from "react";
import BaseProfile from "../../layout/BaseProfile";
import type { ProfileData } from "../../layout/BaseProfile";

const EmployeeProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "John Employee",
    email: "john@company.com",
    phone: "9876543210",
    employeeId: "EMP001", // Employee ID field
    dob: "1990-01-01",
    gender: "Male",
    address: "123 Main St",
    photo: "",
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

  const handleStartEdit = () => {
    setOriginalProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => setIsEditing(false);

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <BaseProfile
      profile={profile}
      isEditing={isEditing}
      canEdit={true} // Employee can edit
      canEditDepartment={false} // Employee cannot edit department
      onChange={handleChange}
      onPhotoChange={handlePhotoChange}
      onStartEdit={handleStartEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default EmployeeProfile;
