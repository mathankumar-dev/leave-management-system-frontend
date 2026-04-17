import { useState } from "react";;
import api from "@/services/apiClient";

export const useAccessRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAccessRequest = async (
        payload: { accessType: string; reason: string },
        employeeId: string
    ) => {
        try {
            await api.post("/access-request", {
                ...payload,
                employeeId,
            });
        } catch (err: any) {
            const message =
                err?.response?.data?.message || "Failed to create request";
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        createAccessRequest,
        loading,
        error,
        setError,
    };
};