import type { TeamCalendarResponse } from "@/features/attendance/types";
import api from "@/services/apiClient";

export const attendanceService = {
    getEmployeeCalendar: async (employeeId: string): Promise<TeamCalendarResponse> => {
        const response = await api.get(`/dashboard/employee/calendar/${employeeId}`);
        return response.data;
    },
    getTeamCalendar: async (id: string): Promise<TeamCalendarResponse> => {
        const response = await api.get<TeamCalendarResponse>(
            `/dashboard/team-calendar/${id}`
        );
        
        return response.data;
    },
}