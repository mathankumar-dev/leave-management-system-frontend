import { useState, useCallback, useMemo } from "react";
import { dashboardService } from "../services/dashboardService";
import { departmentLeaveData, managerTrackingData } from "../views/hr/data/mockData";

import type {
  LeaveRecord,
  Employee,
  LeaveDecisionRequest,
  TeamCalendarResponse,
  TeamMemberBalance,
  ManagerDashBoardResponse,
  LeaveBalanceResponse,
  TeamMember,
  AdminDashBoardResponse,
  EmployeeEntity,
  EmployeeFilters,
  PaginatedResponse,
  CreateUserRequest,
  ODResponse,
  PendingOnboardingResponse,
  BiometricVpnStatus,
  FlashNewsRequest,
} from "../types";
import { toast } from "sonner";
import api from "../../../api/axiosInstance";



const service = dashboardService;

export const useDashboard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyLeaveSummary, setWeeklyLeaveSummary] = useState<LeaveRecord[]>([]);
  const [teamOnLeave, setTeamOnLeave] = useState<TeamMemberBalance[]>([]);

  const [teamCalendar, setTeamCalendar] = useState<TeamCalendarResponse>({});
  const [employeeCalendar, setEmployeeCalendar] = useState<TeamCalendarResponse>({});

  const [payslip, setPayslip] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

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
      const data = await dashboardService.getLeaveBalances(employeeId, year);
      setLeaveBalance(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave balance");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchPayslip = async (year: number, month: number) => {
    try {
      setLoading(true);
      const res = await dashboardService.getMyPayslip(year, month);
      setPayslip(res.data);

    } catch (e) {
      setPayslip(null);
      setError("Payslip not found");
    } finally {
      setLoading(false);
    }
  };

  

  const downloadHistory = async (year: number, month: number) => {
    await dashboardService.downloadPayslip(year, month);
  };





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

    const fetchMyOD = useCallback(async (employeeId: number): Promise<ODResponse[]> => {
    setLoading(true);
    try {
      return await service.getMyODHistory(employeeId);
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
  const applyLeave = useCallback(async (data: FormData) => {
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

  const fetchTeamSchedule = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await dashboardService.getTeamCalendar(id);
      setTeamCalendar(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch team calendar", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeCalendar = useCallback(async (employeeId: number) => {
    try {
      setLoading(true);

      const data = await dashboardService.getEmployeeCalendar(employeeId);

      setEmployeeCalendar(data);

    } catch (err: any) {
      setError(err.message || "Failed to fetch calendar");
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
  const fetchAdminDashboard = useCallback(
    async (id: number): Promise<AdminDashBoardResponse | null> => {
      setLoading(true);
      try {
        const response = await service.getAdminDashboard(id);
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
  const fetchAllEmployees = useCallback(
    async (
      filters: EmployeeFilters
    ): Promise<PaginatedResponse<EmployeeEntity> | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await service.getAllEmployees(filters);
        return response;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to fetch employee directory";

        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [service]
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


  const fetchTeamMembers = useCallback(async (id: number): Promise<TeamMember[]> => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getTeamMembers(id);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Comp-Off banking failed";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOnboardingRequests = useCallback(async (): Promise<PendingOnboardingResponse[]> => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getOnboardingRequests();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || " Onboarding request fetching failed";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOnboardingDecision = useCallback(async (
  employeeId: number, 
  type: 'BIO' | 'VPN', 
  decision: BiometricVpnStatus
) => {
  setLoading(true);
  setError(null);
  try {

    console.log(employeeId , type , decision);
    
    if (type === 'BIO') {
      await service.approveOnboardingBioRequests(employeeId, decision);
    } else {
      await service.approveOnboardingVpnRequests(employeeId, decision);
    }
    
    // Refresh the list after a successful decision
    const updatedData = await service.getOnboardingRequests();
    return updatedData;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || `Failed to update ${type} status`;
    setError(errorMessage);
    return null;
  } finally {
    setLoading(false);
  }
}, []);

  const addUser = async (data: CreateUserRequest): Promise<void> => {
    try {
      const message = await dashboardService.createUser(data);
      toast.success(message);
    } catch (err: any) {
      toast.error(err.toString());
      throw err;
    }
  };

  const deleteUser = async (employeeId : number): Promise<void> => {
    try {
      const message = await dashboardService.deleteUser(employeeId);
      toast.success(message);
    } catch (err: any) {
      toast.error(err.toString());
      throw err;
    }
  };

const createFlashNewsController = async (data: FlashNewsRequest) => {
  setLoading(true);
  try {
    const responseData = await dashboardService.createFlashNews(data);
    
    toast.success("Flash news created successfully!"); 
    
    return true; 
    
  } catch (err: any) {
    setError(err.message || "Failed to create flash news");
    return false;
  } finally {
    setLoading(false);
  }
};


  /* ================= EXPORT ================= */




  return {
    loading,
    error,
    setError,
    fetchDashboard,
    fetchManagerDashboard,
    fetchTeamLeaderDashboard,
    fetchAdminDashboard,
    fetchTeamMembers,
    // fetchApprovals,
    processApproval,
    fetchEmployees,
    fetchMyLeaves,
    bankCompOff,
    fetchAllEmployees,
    addUser,
    deleteUser,

    fetchEmployeeCalendar,
    employeeCalendar,
    fetchOnboardingRequests,

    payslip,
    history,
    downloadHistory,
    handleOnboardingDecision,
    
    fetchPayslip,
    // fetchHistory,
   

    applyLeave,
    getTeamMembers,

    leaveBalance,
    fetchLeaveBalance,
    fetchHistory,
    fetchMyOD,

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
    createFlashNewsController,
  };
};


