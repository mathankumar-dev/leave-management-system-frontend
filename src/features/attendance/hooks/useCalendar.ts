import { attendanceService } from "@/features/attendance/services/attendanceService";
import type { TeamCalendarResponse } from "@/features/attendance/types";
import api from "@/services/apiClient";
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

  const [attendanceCalendar, setAttendanceCalendar] =
    useState<AttendanceMap>({});

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
  const fetchAttendanceCalendar = useCallback(
  async (employeeId: string, year: number, month: number) => {

    try {

      setLoading(true);

      const res = await api.get(
        `/attendance/employee/${employeeId}`,
        {
          params: {
            year,
            month: month + 1 // JS month is 0-based
          }
        }
      );

      const map: AttendanceMap = {};

      res.data?.forEach((item: any) => {

        map[item.date] = {

          date: item.date,

          checkIn: item.checkIn,

          checkOut: item.checkOut,

          workingHours: item.workingHours

        };

      });

      setAttendanceCalendar(map);

    } catch (err) {

      console.error("attendance calendar error", err);

      setError("Failed to fetch attendance calendar");

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
    attendanceCalendar,

    fetchTeamSchedule,
    fetchEmployeeCalendar,
    fetchAttendanceCalendar,
  };
};