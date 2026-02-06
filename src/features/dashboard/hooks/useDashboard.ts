import { useState, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";
import { dashboardMockService } from "../services/dashboardMockService";
import type {
  ApprovalRequest,
  LeaveRecord,
  Employee,
  Notification,
  AuditLog,
} from "../types";
import type { CalendarScope } from "../views/employee/CalendarView";
// import type { CalendarScope } from "../types/scope";

// toggle this to false when the API is ready
const USE_MOCK = true;
const service = USE_MOCK ? dashboardMockService : dashboardService;

export const useDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= APPROVALS ================= */

  const fetchApprovals = useCallback(async (): Promise<ApprovalRequest[]> => {
    setLoading(true);
    try {
      return await service.getPendingApprovals();
    } catch (err: any) {
      setError(err.message || "Failed to fetch approvals");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const processApproval = async (
    id: number,
    status: "Approved" | "Rejected",
    comment?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await service.updateApprovalStatus(id, status, comment);
      return true;
    } catch (err: any) {
      setError(err.message || "Action failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMPLOYEES ================= */

  const fetchEmployees = async (): Promise<Employee[]> => {
    setLoading(true);
    try {
      return await service.getAllEmployees();
    } catch (err: any) {
      setError(err.message || "Failed to fetch employees");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = useCallback(
  async (scope: "SELF" | "TEAM" | "ALL" = "SELF") => {
    setLoading(true);
    try {
      return await service.getHRStats(scope);
    } catch (err: any) {
      setError(err.message || "Failed to fetch HR analytics");
      return null;
    } finally {
      setLoading(false);
    }
  },
  []
);


  /* ================= LEAVES ================= */

  const fetchMyLeaves = async (): Promise<LeaveRecord[]> => {
    setLoading(true);
    try {
      return await service.getMyLeaveHistory();
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave history");
      return [];
    } finally {
      setLoading(false);
    }
  };

  /* ================= HR STATS ================= */

  

  const fetchDeptDistribution = useCallback(async () => {
    setLoading(true);
    try {
      return await service.getDeptDistribution();
    } catch (err: any) {
      setError(err.message || "Failed to fetch department distribution");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= NOTIFICATIONS ================= */

  const fetchNotifications = useCallback(async (): Promise<Notification[]> => {
    setLoading(true);
    try {
      return await service.getNotifications();
    } catch (err: any) {
      setError(err.message || "Failed to fetch notifications");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async (): Promise<AuditLog[]> => {
    setLoading(true);
    try {
      return await service.getAuditLogs();
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= CALENDAR (FIXED) ================= */

  const fetchCalendar = useCallback(
    async (
      year: number,
      month: number,
      scope: CalendarScope = "SELF"
    ) => {
      setLoading(true);
      try {
        return await service.getCalendarLeaves(year, month, scope);
      } catch (err: any) {
        setError(err.message || "Failed to load calendar data");
        return {};
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ================= LEAVE ACTIONS ================= */

  const applyLeave = async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      return await service.submitLeaveRequest(formData);
    } catch (err: any) {
      setError(err.message || "Failed to submit leave request");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypes = useCallback(async () => {
    setLoading(true);
    try {
      return await service.getLeaveTypes();
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave types");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addLeaveType = async (data: any) => {
    setLoading(true);
    try {
      return await service.createLeaveType(data);
    } catch (err: any) {
      setError(err.message || "Failed to create leave type");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeLeaveType = async (id: number) => {
    setLoading(true);
    try {
      await service.deleteLeaveType(id);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ================= TEAM ================= */

  const fetchTeamSchedule = useCallback(
    async (
      year: number,
      month: number,
      scope: CalendarScope = "TEAM"
    ) => {
      setLoading(true);
      try {
        const [calendar, members] = await Promise.all([
          service.getCalendarLeaves(year, month, scope),
          service.getAllEmployees(),
        ]);
        return { calendar, members };
      } catch (err: any) {
        setError(err.message || "Failed to sync team schedule");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ================= EXPORT ================= */

  return {
    loading,
    error,
    setError,
    fetchApprovals,
    processApproval,
    fetchEmployees,
    fetchMyLeaves,
    fetchStats,
    fetchDeptDistribution,
    fetchNotifications,
    fetchAuditLogs,
    fetchCalendar,
    applyLeave,
    fetchLeaveTypes,
    addLeaveType,
    removeLeaveType,
    fetchTeamSchedule,
  };
};
