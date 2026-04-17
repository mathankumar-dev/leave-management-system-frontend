import type { AttendanceRecord, TeamAttendancePage, TeamCalendarResponse } from "@/features/attendance/types";
import api from "@/services/apiClient";

export const attendanceService = {
    getEmployeeCalendar: async (employeeId: string): Promise<TeamCalendarResponse> => {
        const response = await api.get(`/v1/dashboard/employee/calendar/${employeeId}`);
        // console.log("employee calender" + response);
        return response.data;
    },
    getTeamCalendar: async (id: string): Promise<TeamCalendarResponse> => {
        const response = await api.get<TeamCalendarResponse>(
            `/v1/dashboard/team-calendar/${id}`
        );
        // console.log("team calanedr " + response);

        return response.data;
    },

    getAttendance: async (
        employeeId: string,
        year?: number,
        month?: number
    ): Promise<AttendanceRecord[]> => {
        const res = await api.get(`/v1/attendance/employee/${employeeId}`, {
            params: {
                year,
                month: month !== undefined ? month + 1 : undefined
            }
        });
        return res.data;
    },
    getTeamAttendanceReport: async (
        reportingId: string,
        params: {
            fromDate?: string;
            toDate?: string;
            status?: string;
            page?: number;
            size?: number;
        }
    ): Promise<TeamAttendancePage> => {
        const response = await api.get(`/v1/attendance/team/${reportingId}`, {
            params: {
                ...params,
                // Ensure any default values or formatting happens here if needed
            }
        });
        return response.data;
    },
    getEmployeeAttendanceByRange: async (
        empId: string,
        params: {
            fromDate?: string;
            toDate?: string;
            page?: number;
            size?: number;
        }
    ): Promise<{ content: AttendanceRecord[], totalPages: number, totalElements: number }> => {
        const response = await api.get(`/v1/attendance/${empId}`, {
            params
        });
        
        return response.data;
    },
}