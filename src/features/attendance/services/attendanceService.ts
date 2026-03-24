import type { TeamCalendarResponse } from "@/features/attendance/types";
import api from "@/services/apiClient";

export const attendanceService = {
    getEmployeeCalendar: async (employeeId: number): Promise<TeamCalendarResponse> => {
        const response = await api.get(`/dashboard/employee/calendar/${employeeId}`);
        return response.data;
    },
    getTeamCalendar: async (id: number): Promise<TeamCalendarResponse> => {
        const response = await api.get<TeamCalendarResponse>(
            `/dashboard/team-calendar/${id}`
        );
        return response.data;
    },
}