import { useState, useCallback, useMemo } from "react";
import { dashboardService } from "../services/dashboardService";
import { departmentLeaveData, managerTrackingData } from "../views/hr/data/mockData";

import type {
  ApprovalRequest,
  LeaveRecord,
  Employee,
  Notification,
  AuditLog,
  LeaveApplication,
  LeaveDecision,
  LeaveDecisionRequest,
} from "../types";
import type { CalendarScope } from "../views/employee/CalendarView";
import { dashboardMockService } from "../services/dashboardMockService";
// import type { CalendarScope } from "../types/scope";

// toggle this to false when the API is ready
const USE_MOCK = false;
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
  decisionRequest: LeaveDecisionRequest
): Promise<boolean> => {
  setLoading(true);
  setError(null); 
  try {
    await service.updateDecision(decisionRequest);
    return true;
  } catch (err: any) {
    console.error("Full Error Object:", err);
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
    return await dashboardService.getEmployeeDashboard(); // now always returns Employee[]
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

  const fetchDashboard = useCallback(async (employeeId: number) => {
    setLoading(true);
    try {
      const response = await service.getEmpDashboard(employeeId);
      console.log("API Response Success:", response); // Look for this in console
      return response;
    } catch (err: any) {
      console.error("API ERROR DETAILS:", err.response?.data || err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = useCallback(async (employeeId: number) => {
    setLoading(true);
    try {
      const response = await service.getEmpDashboard(employeeId);
      console.log("API Response Success:", response); // Look for this in console
      return response;
    } catch (err: any) {
      console.error("API ERROR DETAILS:", err.response?.data || err.message);
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave history");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= Admin STATS ================= */



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

  const applyLeave = useCallback(async (formData: LeaveApplication) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.submitLeaveRequest(formData);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Submission failed";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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
          service.getCalendarLeaves(year, month,scope),
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

  // Add this to your useDashboard.ts
  const fetchManagerDashboard = useCallback(async (id: number) => {
    setLoading(true);
    try {
      // Calling the service with the dynamic ID
      const response = await service.getManagerDashboard(id);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to fetch manager data");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ================= HR ===========================
  // const topDepartment = useMemo(() => {
  //   return departmentLeaveData.reduce((max, d) =>
  //     d.leaves > max.leaves ? d : max
  //   );
  // }, []);

  // const topApprover = useMemo(() => {
  //   return managerTrackingData.reduce((max, m) =>
  //     m.approved > max.approved ? m : max
  //   );
  // }, []);

  const [filters, setFilters] = useState({
    month: 'all',
    year: '2026',
    department: 'all',
    leaveType: 'all',
    manager: 'all',
  });


  const getTeamMembers = useCallback(async (managerId: number): Promise<Employee[]> => {
    setLoading(true);
    try {
      // Replace 'service' with your actual API service name
      const response = await service.getTeamLeaveStats(managerId);
      return response;
    } catch (err: any) {
      const message = err.message || "Failed to fetch team members";
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
    topApprover: managerTrackingData.reduce((max, m) => (m.approved > max.approved ? m : max), managerTrackingData[0]),
    topPending: managerTrackingData.reduce((max, m) => (m.pending > max.pending ? m : max), managerTrackingData[0]),
  }), []);

  /* ================= EXPORT ================= */




  return {
    loading,
    error,
    setError,
    fetchDashboard,
    fetchManagerDashboard,
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
    getTeamMembers,
    fetchLeaveTypes,
    addLeaveType,
    removeLeaveType,
    fetchTeamSchedule,

    // topDepartment,
    
    // topApprover,
    filters, updateFilter, stats
  };
};
