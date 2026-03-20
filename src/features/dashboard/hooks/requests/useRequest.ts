import { useState, useCallback } from "react";
import type { AccessRequest, LeaveType, MeetingRequest, ODRequest } from "../../types";
import { requestService } from "../../services/requests/requestService";

export const useRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOD = useCallback(async (request: ODRequest, employeeId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await requestService.createODRequest(request, employeeId);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred";
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);
    const createMeeting = useCallback(async (request: MeetingRequest, employeeId: number, attendeeIds?: number[]) => {
        setLoading(true);
        setError(null);
        try {
            const data = await requestService.createMeetingRequest(request, employeeId, attendeeIds);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to schedule meeting";
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);
        const createAccessRequest = useCallback(async (request : AccessRequest, employeeId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await requestService.createAccessRequest(request,employeeId);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to schedule meeting";
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);
    return {
        createOD,
        createMeeting,
        loading,
        error,
        setError,
        createAccessRequest
    };
};