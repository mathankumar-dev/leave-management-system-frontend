import { useEffect, useState } from "react";
import { fetchAccessTypes } from "../services/accessApi";

export type AccessType = {
  type: string;
  label: string;
  enabled: boolean;
  rolesAllowed: string[];
};

export const useAccessTypes = () => {
  const [accessTypes, setAccessTypes] = useState<AccessType[]>([]);
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
      setError("Failed to load access types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccessTypes();
  }, []);

  return {
    accessTypes,
    loading,
    error,
    refetch: getAccessTypes,
  };
};