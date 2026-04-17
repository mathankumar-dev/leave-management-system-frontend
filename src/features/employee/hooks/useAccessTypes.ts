import { useEffect, useState } from "react";
import { fetchAccessTypes } from "../services/accessApi";

export type AccessType = {
  type: "VPN" | "BIOMETRIC" | "NETWORK" | "SHARED_FOLDER"; // ✅ strict typing
  label: string;
  enabled: boolean;
  rolesAllowed: string[];
};

export const useAccessTypes = (userRole?: string) => {
  const [accessTypes, setAccessTypes] = useState<AccessType[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<AccessType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAccessTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchAccessTypes();
      setAccessTypes(data);
    } catch (err) {
      console.error(err);

      // ✅ fallback (VERY IMPORTANT)
      setAccessTypes([
        {
          type: "VPN",
          label: "VPN Access (Remote Work)",
          enabled: true,
          rolesAllowed: ["MANAGER", "ADMIN"],
        },
      ]);

      setError("Using fallback access types");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch on load
  useEffect(() => {
    getAccessTypes();
  }, []);

  // 🔹 Filter based on role
  useEffect(() => {
    const filtered = accessTypes
      .filter((opt) => opt.enabled)
      .filter((opt) => {
        if (opt.rolesAllowed.includes("ALL")) return true;
        return opt.rolesAllowed.includes(userRole || "");
      });

    setFilteredTypes(filtered);
  }, [accessTypes, userRole]);

  return {
    accessTypes,
    filteredTypes, // ✅ use this in UI directly
    loading,
    error,
    refetch: getAccessTypes,
  };
};