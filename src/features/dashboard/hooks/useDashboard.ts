import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { ApprovalRequest, LeaveRecord, Employee, Notification, AuditLog } from '../types';

export const useDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = useCallback(async (): Promise<ApprovalRequest[]> => {
    setLoading(true);
    try {
      return await dashboardService.getPendingApprovals();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch approvals');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const processApproval = async (id: number, status: 'Approved' | 'Rejected'): Promise<boolean> => {
    setLoading(true);
    try {
      await dashboardService.updateApprovalStatus(id, status);
      return true;
    } catch (err: any) {
      setError(err.message || 'Action failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async (): Promise<Employee[]> => {
    setLoading(true);
    try {
      return await dashboardService.getAllEmployees();
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLeaves = async (): Promise<LeaveRecord[]> => {
    setLoading(true);
    try {
      return await dashboardService.getMyLeaveHistory();
    } catch (err: any) {
      setError(err.message || "Failed to fetch leave history");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ANALYTICS & UTILITY METHODS

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      return await dashboardService.getHRStats();
    } catch (err: any) {
      setError(err.message || "Failed to fetch HR analytics");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeptDistribution = useCallback(async () => {
    setLoading(true);
    try {
      return await dashboardService.getDeptDistribution();
    } catch (err: any) {
      setError(err.message || "Failed to fetch department distribution");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async (): Promise<Notification[]> => {
    setLoading(true);
    try {
      return await dashboardService.getNotifications();
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
      return await dashboardService.getAuditLogs();
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCalendar = useCallback(async (year: number, month: number) => {
  setLoading(true);
  try {
    return await dashboardService.getCalendarLeaves(year, month);
  } catch (err: any) {
    setError(err.message || "Failed to load calendar data");
    return {};
  } finally {
    setLoading(false);
  }
}, []);

const applyLeave = async (formData: any) => {
  setLoading(true);
  setError(null); // Clear previous errors
  try {
    const result = await dashboardService.submitLeaveRequest(formData);
    return result; // Return the response so the component can handle success
  } catch (err: any) {
    setError(err.message || "Failed to submit leave request");
    return null;
  } finally {
    setLoading(false);
  }
};

const fetchLeaveTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getLeaveTypes();
      return data;
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
      const result = await dashboardService.createLeaveType(data);
      return result;
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
      await dashboardService.deleteLeaveType(id);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamSchedule = useCallback(async (year: number, month: number) => {
  setLoading(true);
  try {
    // Fetches both the leave days and the current team member statuses
    const [calendar, members] = await Promise.all([
      dashboardService.getCalendarLeaves(year, month),
      dashboardService.getAllEmployees() 
    ]);
    return { calendar, members };
  } catch (err: any) {
    setError(err.message || "Failed to sync team schedule");
    return null;
  } finally {
    setLoading(false);
  }
}, []);

  return {
    loading,
    error,
    fetchApprovals,
    fetchEmployees,
    processApproval,
    fetchMyLeaves,
    fetchStats,
    fetchDeptDistribution,
    fetchNotifications,
    fetchAuditLogs,
    fetchCalendar,
    setError,
    applyLeave,
    fetchLeaveTypes,
    addLeaveType,
    removeLeaveType,
    fetchTeamSchedule,
    

  };
};