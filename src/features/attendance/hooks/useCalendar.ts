import { attendanceService } from "@/features/attendance/services/attendanceService";
import type { TeamCalendarResponse } from "@/features/attendance/types";
import { useCallback, useState } from "react";

export const useCalendar = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [teamCalendar, setTeamCalendar] = useState<TeamCalendarResponse>({});
    const [employeeCalendar, setEmployeeCalendar] = useState<TeamCalendarResponse>({});

    const fetchTeamSchedule = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const data = await attendanceService.getTeamCalendar(id);
            setTeamCalendar(data);
            return data;
        } catch (error) {
            console.error("Failed to fetch team calendar", error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEmployeeCalendar = useCallback(async (employeeId: number) => {
        try {
            setLoading(true);

            const data = await attendanceService.getEmployeeCalendar(employeeId);

            setEmployeeCalendar(data);

        } catch (err: any) {
            setError(err.message || "Failed to fetch calendar");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error, setError,
        fetchEmployeeCalendar,
        employeeCalendar,
        fetchTeamSchedule,
        teamCalendar,
        
    }

}