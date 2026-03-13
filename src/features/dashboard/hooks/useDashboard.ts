import { useState, useCallback, useMemo } from "react";
import { dashboardService } from "../services/dashboardService";
import type { UpdateLeavePayload } from "../services/dashboardService";
import { departmentLeaveData, managerTrackingData } from "../views/hr/data/mockData";

import type {
  LeaveRecord,
  Employee,
  LeaveApplication,
  LeaveDecisionRequest,
  TeamCalendarResponse,
  TeamMemberBalance,
  CompOffRequest,
} from "../types";

// ─── Helper: safely extract an error message from an unknown catch value ─────
// This replaces every `catch (err: any) { err.message }` pattern.
const errMsg = (err: unknown, fallback: string): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    const cast = err as Record<string, unknown>;
    if (typeof cast["message"] === "string") return cast["message"];
    // Handle Axios-style { response: { data: { message } } }
    const data = (cast["response"] as Record<string, unknown> | undefined)?.["data"] as Record<string, unknown> | undefined;
    if (typeof data?.["message"] === "string") return data["message"];
  }
  return fallback;
};

const service = dashboardService;

export const useDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError]     = useState<string | null>(null);
  const [teamCalendar, setTeamCalendar]             = useState<TeamCalendarResponse>({});
  const [weeklyLeaveSummary, setWeeklyLeaveSummary] = useState<LeaveRecord[]>([]);
  const [teamOnLeave, setTeamOnLeave]               = useState<TeamMemberBalance[]>([]);

  /* ================= APPROVALS ================= */

  // const fetchApprovals = useCallback(async (): Promise<ApprovalRequest[]> => {
  //   setLoading(true);
  //   try {
  //     return await service.getPendingApprovals();
  //   } catch (err) {
  //     setError(errMsg(err, "Failed to fetch approvals"));
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const processApproval = async (
    decisionRequest: LeaveDecisionRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await service.updateDecision(decisionRequest);
      return true;
    } catch (err) {
      console.error("Full Error Object:", err);
      setError(errMsg(err, "Action failed"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMPLOYEES ================= */

  const fetchEmployees = async (): Promise<Employee[]> => {
    setLoading(true);
    try {
      return await dashboardService.getEmployeeDashboard();
    } catch (err) {
      setError(errMsg(err, "Failed to fetch employees"));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = useCallback(async (employeeId: number) => {
    setLoading(true);
    try {
      return await service.getEmpDashboard(employeeId);
    } catch (err) {
      const axiosErr = err as Record<string, unknown>;
      console.error(
        "API ERROR DETAILS:",
        (axiosErr?.["response"] as Record<string, unknown> | undefined)?.["data"] ?? errMsg(err, "")
      );
      setError(errMsg(err, "Failed to fetch dashboard"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= LEAVES ================= */

  const fetchMyLeaves = useCallback(async (employeeId: number): Promise<LeaveRecord[]> => {
    setLoading(true);
    try {
      return await service.getMyLeaveHistory(employeeId);
    } catch (err) {
      setError(errMsg(err, "Failed to fetch leave history"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeeklyLeaveSummary = useCallback(async (managerId: number): Promise<LeaveRecord[]> => {
    setLoading(true);
    try {
      const data = await service.getWeeklyLeaveSummary(managerId);
      setWeeklyLeaveSummary(data);
      return data;
    } catch (err) {
      setError(errMsg(err, "Failed to fetch weekly summary"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeamOnLeave = useCallback(async (managerId: number): Promise<TeamMemberBalance[]> => {
    setLoading(true);
    try {
      const data = await service.getTeamOnLeave(managerId);
      setTeamOnLeave(data);
      return data;
    } catch (err) {
      setError(errMsg(err, "Failed to fetch team on leave"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= NOTIFICATIONS ================= */

  /* ================= CALENDAR (FIXED) ================= */

  /* ================= LEAVE ACTIONS ================= */

  const applyLeave = useCallback(async (formData: LeaveApplication) => {
    setLoading(true);
    setError(null);
    try {
      return await service.submitLeaveRequest(formData);
    } catch (err) {
      setError(errMsg(err, "Submission failed"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // const fetchLeaveTypes = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     return await service.getLeaveTypes();
  //   } catch (err) {
  //     setError(errMsg(err, "Failed to fetch leave types"));
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const addLeaveType = async (data: LeaveConfig) => {
  //   setLoading(true);
  //   try {
  //     return await service.createLeaveType(data);
  //   } catch (err) {
  //     setError(errMsg(err, "Failed to create leave type"));
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const removeLeaveType = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await service.deleteLeaveType(id);
      return true;
    } catch (err) {
      setError(errMsg(err, "Failed to delete"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ================= TEAM ================= */

  const fetchTeamSchedule = useCallback(async (managerId: number) => {
    setLoading(true);
    try {
      const data = await dashboardService.getTeamCalendar(managerId);
      setTeamCalendar(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch team calendar", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchManagerDashboard = useCallback(async (id: number) => {
    setLoading(true);
    try {
      return await service.getManagerDashboard(id);
    } catch (err) {
      setError(errMsg(err, "Failed to fetch manager data"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const [filters, setFilters] = useState({
    month: 'all',
    year: '2026',
    department: 'all',
    leaveType: 'all',
    manager: 'all',
  });

  const cancelLeave = useCallback(async (id: number, employeeId: number): Promise<boolean> => {
    setLoading(true);
    try {
      await service.cancelLeave(id, employeeId);
      return true;
    } catch (err) {
      setError(errMsg(err, "Cancel failed"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Strongly typed — data shape matches UpdateLeavePayload (employeeId, startDate, endDate, reason, halfDayType?)
  const editLeave = useCallback(async (id: number, data: UpdateLeavePayload): Promise<boolean> => {
    setLoading(true);
    try {
      await service.updateLeave(id, data);
      return true;
    } catch (err) {
      setError(errMsg(err, "Update failed"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTeamMembers = useCallback(async (managerId: number): Promise<Employee[]> => {
    setLoading(true);
    try {
      return await service.getTeamLeaveStats(managerId);
    } catch (err) {
      const message = errMsg(err, "Failed to fetch team members");
      setError(message);
      console.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const stats = useMemo(() => ({
    topDepartment: departmentLeaveData.reduce((max, d) => (d.leaves > max.leaves ? d : max), departmentLeaveData[0]),
    topApprover:   managerTrackingData.reduce((max, m) => (m.approved > max.approved ? m : max), managerTrackingData[0]),
    topPending:    managerTrackingData.reduce((max, m) => (m.pending > max.pending ? m : max), managerTrackingData[0]),
  }), []);

  // Strongly typed — payload must match CompOffRequest { employeeId, entries }
  const bankCompOff = useCallback(async (payload: CompOffRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await service.submitCompOffRequest(payload);
    } catch (err) {
      setError(errMsg(err, "Comp-Off banking failed"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= EXPORT ================= */

  return {
    loading,
    error,
    setError,
    fetchDashboard,
    fetchManagerDashboard,
    // fetchApprovals,
    processApproval,
    fetchEmployees,
    fetchMyLeaves,
    bankCompOff,
    applyLeave,
    getTeamMembers,
    removeLeaveType,
    cancelLeave,
    editLeave,
    fetchTeamSchedule,
    teamCalendar,
    fetchWeeklyLeaveSummary,
    weeklyLeaveSummary,
    fetchTeamOnLeave,
    teamOnLeave,
    filters, updateFilter, stats,
  };
};