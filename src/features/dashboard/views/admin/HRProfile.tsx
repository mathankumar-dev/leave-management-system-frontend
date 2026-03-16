import React, { useState } from "react";
import BaseProfile from "../../layout/BaseProfile";

import { MOCK_PROFILE } from "../../../../mockData";
import type { ProfileData } from "../../types";

const HRProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    ...MOCK_PROFILE,
    name: "Alice HR",
    role: "HR",
    email: "alice@company.com",
    phone: "9876543212",
    department: "HR",
    dob: "1982-03-20",
    gender: "Female",
    address: "HR Lane",
    photo: "",
  });

  const [original, setOriginal] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: any) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handlePhotoChange = (e: any) => {
    const reader = new FileReader();
    reader.onload = () => setProfile({ ...profile, photo: reader.result as string });
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <BaseProfile
      profile={profile}
      isEditing={isEditing}
      canEdit
      canEditDepartment
      canEditEmployeeId={false}
      onChange={handleChange}
      onPhotoChange={handlePhotoChange}
      onStartEdit={() => {
        setOriginal(profile);
        setIsEditing(true);
      }}
      onSave={() => setIsEditing(false)}
      onCancel={() => {
        setProfile(original);
        setIsEditing(false);
      }}
    />
  );
};

export default HRProfile;
