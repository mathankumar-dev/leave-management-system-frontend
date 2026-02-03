import React, { useState } from "react";
import BaseProfile, { type ProfileData } from "../../layout/BaseProfile";

const ManagerProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "Jane Manager",
    email: "jane@company.com",
    phone: "9876543211",
    department: "Operations",
    dob: "1985-06-15",
    gender: "Female",
    address: "456 Manager St",
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

  return (
    <BaseProfile
      profile={profile}
      isEditing={isEditing}
      canEdit={true} // Manager can edit their profile now
      canEditDepartment={false} // Cannot edit department
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
  );
};

export default ManagerProfile;
