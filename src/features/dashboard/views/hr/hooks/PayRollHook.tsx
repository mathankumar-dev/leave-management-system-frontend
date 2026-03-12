import { useState } from "react";
import axios from "axios";

export const usePayroll = () => {
  const [loading, setLoading] = useState(false);

  const fetchPayroll = async (employeeId: number) => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/payroll/${employeeId}`);
      return response.data;   // ✅ return data
    } catch (error) {
      console.error("Payroll fetch failed:", error);
      return null;            // ✅ return null on error
    } finally {
      setLoading(false);
    }
  };

  return { fetchPayroll, loading };
};