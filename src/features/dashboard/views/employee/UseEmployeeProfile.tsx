import { useEffect, useState } from "react";
import axios from "axios";
import type { ProfileData } from "../../types";
import api from "../../../../api/axiosInstance";

export const useEmployeeProfile = (employeeId?: number) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/employees/profile/${employeeId}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [employeeId]);

  return { profile, loading };
};