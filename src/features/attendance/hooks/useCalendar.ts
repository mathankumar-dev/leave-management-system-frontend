import { attendanceService } from "@/features/attendance/services/attendanceService";
import type { AttendanceRecord, TeamCalendarResponse } from "@/features/attendance/types";
import { useCallback, useState } from "react";

type AttendanceMap = Record<
  string,
  {
    date: string;
    checkIn?: string;
    checkOut?: string;
    workingHours?: number;
  }
>;

export const useCalendar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teamCalendar, setTeamCalendar] =
    useState<TeamCalendarResponse>({});

  const [employeeCalendar, setEmployeeCalendar] =
    useState<TeamCalendarResponse>({});

const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  /*
  ========================
  TEAM LEAVE CALENDAR
  ========================
  */
  const fetchTeamSchedule = useCallback(
    async (employeeId: string) => {
      try {
        setLoading(true);

        const data =
          await attendanceService.getTeamCalendar(employeeId);

        setTeamCalendar(data || {});

        return data;
      } catch (err) {
        console.error("team calendar error", err);
        setError("Failed to fetch team calendar");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
  ========================
  MY LEAVE CALENDAR
  ========================
  */
  const fetchEmployeeCalendar = useCallback(
    async (employeeId: string) => {
      try {
        setLoading(true);

        const data =
          await attendanceService.getEmployeeCalendar(employeeId);

        setEmployeeCalendar(data || {});
      } catch (err: any) {
        console.error("employee calendar error", err);
        setError(err.message || "Failed to fetch employee calendar");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
  ========================
  ATTENDANCE CALENDAR
  ========================
  */
  // In your component

  const fetchAttendanceCalendar = useCallback(
  async (employeeId: string, year: number, month: number) => {
    try {
      setLoading(true);
      setError(null);

      const data: AttendanceRecord[] = await attendanceService.getAttendance(employeeId, year, month);

      // Transform Array -> Object { "2026-04-11": Record }
      const attendanceMap = data.reduce((acc, record) => {
        acc[record.date] = record;
        return acc;
      }, {} as Record<string, AttendanceRecord>);
      
      setAttendance(attendanceMap);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  },
  []
);

  /*
  ========================
  EXPORT API
  ========================
  */
  return {
    loading,
    error,

    teamCalendar,
    employeeCalendar,
    attendance,
    fetchTeamSchedule,
    fetchEmployeeCalendar,
    fetchAttendanceCalendar,
  };
};