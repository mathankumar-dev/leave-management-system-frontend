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

    downloadAttendanceExcel: async (
        empId: string,
        params: {
            fromDate?: string; // Optional
            toDate?: string;   // Optional
        }
    ): Promise<void> => {
        const response = await api.get(`/v1/attendance/download/excel/${empId}`, {
            params: {// Mapping frontend empId to backend employeeId param
                ...params
            },
            responseType: 'blob', // CRITICAL: Tells axios to treat response as binary
        });

        // Create a URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Set suggested filename
        const dateStr = params.fromDate || new Date().toISOString().split('T')[0];
        link.setAttribute('download', `Attendance_${empId}_${dateStr}.xlsx`);

        // Append to body, click to trigger download, then clean up
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
}