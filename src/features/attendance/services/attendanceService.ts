import type { AttendanceRecord, TeamCalendarResponse } from "@/features/attendance/types";
import api from "@/services/apiClient";

export const attendanceService = {
    getEmployeeCalendar: async (employeeId: string): Promise<TeamCalendarResponse> => {
        const response = await api.get(`/dashboard/employee/calendar/${employeeId}`);
        // console.log("employee calender" + response);
        return response.data;
    },
    getTeamCalendar: async (id: string): Promise<TeamCalendarResponse> => {
        const response = await api.get<TeamCalendarResponse>(
            `/dashboard/team-calendar/${id}`
        );
        // console.log("team calanedr " + response);

        return response.data;
    },

    getAttendance : async (
        employeeId: string,
        year?: number,
        month?: number
    ): Promise<AttendanceRecord[]> => {
        const res = await api.get(`/attendance/employee/${employeeId}`, {
            params: {
                year,
                month: month !== undefined ? month + 1 : undefined
            }
        });
        return res.data;
    }
}