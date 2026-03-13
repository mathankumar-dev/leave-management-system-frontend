import { useState, useCallback, useMemo } from "react";
import { dashboardService } from "../services/dashboardService";
import { departmentLeaveData, managerTrackingData } from "../views/hr/data/mockData";

import type {
  LeaveRecord,
  Employee,
  Notification,
  AuditLog,
  LeaveApplication,
  LeaveDecisionRequest,
  TeamCalendarResponse,
  TeamMemberBalance,
  ManagerDashBoardResponse,
  LeaveBalanceResponse,
} from "../types";



const service = dashboardService;

export const useDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [teamCalendar, setTeamCalendar] = useState<TeamCalendarResponse>({});
  const [weeklyLeaveSummary, setWeeklyLeaveSummary] = useState<LeaveRecord[]>([]);
  const [teamOnLeave, setTeamOnLeave] = useState<TeamMemberBalance[]>([]);

  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceResponse | null>(null);

//   const [leaveBalance, setLeaveBalance] = useState({
//   CASUAL: 0,
//   SICK: 0,
//   EARNED_LEAVES: 0
// });

  /* ================= APPROVALS ================= */

  // const fetchApprovals = useCallback(async (): Promise<ApprovalRequest[]> => {
  //   setLoading(true);
  //   try {
  //     return await service.getPendingApprovals();
  //   } catch (err: any) {
  //     setError(err.message || "Failed to fetch approvals");
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
    } catch (err: any) {
      console.error("Full Error Object:", err);
      setError(err.message || "Action failed");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const fetchLeaveBalance = useCallback(async (employeeId: number, year: number = 2026) => {
    setLoading(true);
    setError(null);
    try {
        const data = await service.getLeaveBalances(employeeId, year);
        setLeaveBalance(data);
        return data;
    } catch (err: any) {
        setError(err.message || "Failed to fetch leave balance");
        return null;
    } finally {
        setLoading(false);
    }
}, []);

const hasExceededLimits = useMemo(() => {
    return leaveBalance?.exceededMonthlyLimit || (leaveBalance?.totalRemaining ?? 0) <= 0;
}, [leaveBalance]);

  /* ================= EMPLOYEES ================= */

  const fetchEmployees = async (): Promise<Employee[]> => {
    setLoading(true);
    try {
      return await dashboardService.getEmployeeDashboard();
    } catch (err: any) {
      setError(err.message || "Failed to fetch employees");
      return [];
    } finally {
      setLoading(false);
    }
  };


const fetchDashboard = useCallback(async (employeeId: number) => {
  setLoading(true);
  try {
    const response = await service.getEmpDashboard(employeeId);
    console.log("FULL RESPONSE", response); // Use this directly
    return response; // Not response.data
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


  const fetchWeeklyLeaveSummary = useCallback(async (managerId: number): Promise<LeaveRecord[]> => {
    setLoading(true);
    try {
      const data = await service.getWeeklyLeaveSummary(managerId);
      setWeeklyLeaveSummary(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave history");
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
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave history");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);


  /* ================= NOTIFICATIONS ================= */





  /* ================= CALENDAR (FIXED) ================= */



  /* ================= LEAVE ACTIONS ================= */
const applyLeave = useCallback(async (data: FormData ) => {
  setLoading(true);
  setError(null);
  try {
    const result = await service.submitLeaveRequest(data);
    return result;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || "Submission failed";
    setError(errorMessage);
    return null;
  } finally {
    setLoading(false);
  }
}, []);

  // const fetchLeaveTypes = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     return await service.getLeaveTypes();
  //   } catch (err: any) {
  //     setError(err.message || "Failed to fetch leave types");
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const addLeaveType = async (data: any) => {
  //   setLoading(true);
  //   try {
  //     return await service.createLeaveType(data);
  //   } catch (err: any) {
  //     setError(err.message || "Failed to create leave type");
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const fetchManagerDashboard = useCallback(
    async (id: number): Promise<ManagerDashBoardResponse | null> => {
      setLoading(true);
      try {
        const response = await service.getManagerDashboard(id);
        return response;
      } catch (err: any) {
        setError(err.message || "Failed to fetch manager data");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const fetchTeamLeaderDashboard = useCallback(
    async (id: number): Promise<ManagerDashBoardResponse | null> => {
      setLoading(true);
      try {
        const response = await service.getTeamLeaderDashboard(id);
        return response;
      } catch (err: any) {
        setError(err.message || "Failed to fetch team leader data");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );


  const [filters, setFilters] = useState({
    month: 'all',
    year: '2026',
    department: 'all',
    leaveType: 'all',
    manager: 'all',
  });

  const cancelLeave = useCallback(async (id: number, employeeId: number) => {
    setLoading(true);
    try {
      await service.cancelLeave(id, employeeId);
      return true;
    } catch (err: any) {
      setError(err.message || "Cancel failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const editLeave = useCallback(async (id: number, data: any) => {
    setLoading(true);
    try {
      await service.updateLeave(id, data);
      return true;
    } catch (err: any) {
      setError(err.message || "Update failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);


  const getTeamMembers = useCallback(async (managerId: number): Promise<Employee[]> => {
    setLoading(true);
    try {
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



  const bankCompOff = useCallback(async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.submitCompOffRequest(payload);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Comp-Off banking failed";
      setError(errorMessage);
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
    fetchTeamLeaderDashboard,
    // fetchApprovals,
    processApproval,
    fetchEmployees,
    fetchMyLeaves,
    bankCompOff,

    applyLeave,
    getTeamMembers,
    fetchLeaveBalance, 
    leaveBalance,

    removeLeaveType,
    cancelLeave,
    editLeave,
    fetchTeamSchedule,
    teamCalendar,
    fetchWeeklyLeaveSummary,
    weeklyLeaveSummary,
    fetchTeamOnLeave,
    teamOnLeave,
    filters, updateFilter, stats
  };
};
