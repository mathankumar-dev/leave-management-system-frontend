import { 
  MOCK_PENDING_REQUESTS, 
  MOCK_LEAVE_HISTORY, 
  MOCK_TEAM_MEMBERS, 
  MOCK_LEAVE_TYPES, 
  MOCK_NOTIFICATIONS, 
  MOCK_CALENDAR_LEAVES, 
  MOCK_AUDIT_LOGS,
  MOCK_DASHBOARD_STATS,
  MOCK_CHART_DATA
} from "../../../mockData"; 

import type { 
  ApprovalRequest, 
  LeaveRecord, 
  Employee, 
  Notification, 
  AuditLog 
} from "../types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardMockService = {
  /**
   * 1. LEAVE SUMMARY & STATS
   * Used by fetchStats() in your hook
   */
  getHRStats: async () => {
    await sleep(400);
    return { 
      totalEmployees: 100, 
      onLeaveToday: 5, 
      avgLeaveDuration: 3.2,
      pendingRequests: 12,
      summaryStats: MOCK_DASHBOARD_STATS, 
      historyData: MOCK_CHART_DATA 
    };
  },

  getLeaveSummary: async () => {
    await sleep(800);
    return {
      totalLeaves: 24,
      usedLeaves: 5,
      pendingApprovals: 3,
      upcomingHolidays: 2,
      summaryStats: MOCK_DASHBOARD_STATS,
      historyData: MOCK_CHART_DATA
    };
  },

  /**
   * 2. APPROVALS (Manager View)
   */
  getPendingApprovals: async (): Promise<ApprovalRequest[]> => {
    await sleep(600);
    return MOCK_PENDING_REQUESTS;
  },

  updateApprovalStatus: async (id: number, status: 'Approved' | 'Rejected') => {
    await sleep(500);
    console.log(`Mock: Request ${id} has been ${status}`);
    return { success: true, id, status };
  },

  /**
   * 3. EMPLOYEE & TEAM DATA
   */
  getAllEmployees: async (): Promise<Employee[]> => {
    await sleep(500);
    return MOCK_TEAM_MEMBERS;
  },

  getDeptDistribution: async () => {
    await sleep(400);
    return [
      { dept: "Engineering", count: 45 },
      { dept: "Design", count: 15 },
      { dept: "HR", count: 5 },
      { dept: "Operations", count: 20 }
    ];
  },

  /**
   * 4. LEAVE HISTORY & REQUESTS (User View)
   */
  getMyLeaveHistory: async (): Promise<LeaveRecord[]> => {
    await sleep(700);
    return MOCK_LEAVE_HISTORY;
  },

  submitLeaveRequest: async (leaveData: any) => {
    await sleep(1000);
    console.log("Mock Submit Data:", leaveData);
    return { success: true, message: "Request submitted successfully" };
  },

  /**
   * 5. CALENDAR & SCHEDULE
   */
  getCalendarLeaves: async (year: number, month: number) => {
    await sleep(600);
    return MOCK_CALENDAR_LEAVES;
  },

  /**
   * 6. SYSTEM (Notifications & Audit)
   */
  getNotifications: async (): Promise<Notification[]> => {
    await sleep(300);
    return MOCK_NOTIFICATIONS;
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    await sleep(300);
    return MOCK_AUDIT_LOGS;
  },

  /**
   * 7. SETTINGS (Leave Types)
   */
  getLeaveTypes: async () => {
    await sleep(400);
    return MOCK_LEAVE_TYPES;
  },

  createLeaveType: async (data: any) => {
    await sleep(500);
    return { id: Math.floor(Math.random() * 1000), ...data };
  },

  updateLeaveType: async (id: number, data: any) => {
    await sleep(500);
    return { id, ...data };
  },

  deleteLeaveType: async (id: number) => {
    await sleep(300);
    return true;
  },
};