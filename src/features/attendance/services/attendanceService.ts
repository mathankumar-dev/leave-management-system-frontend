import type { TeamCalendarResponse } from "@/features/attendance/types";
import api from "@/services/apiClient";

export const attendanceService = {
    getEmployeeCalendar: async (employeeId: string): Promise<TeamCalendarResponse> => {
        const response = await api.get(`/dashboard/employee/calendar/${employeeId}`);
        console.log("employee calender" + response);
        return response.data;
    },
    getTeamCalendar: async (id: string): Promise<TeamCalendarResponse> => {
        const response = await api.get<TeamCalendarResponse>(
            `/dashboard/team-calendar/${id}`
        );
        console.log("team calanedr " + response);
        
        return response.data;
    },
}