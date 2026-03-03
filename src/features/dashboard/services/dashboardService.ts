import { useCallback } from 'react';
import api from '../../../api/axiosInstance';

import type {

  LeaveRecord,

  Employee,

  ApprovalRequest,

  Notification,

  AuditLog,
  LeaveApplication,
  LeaveDecision,
  LeaveDecisionRequest,
  TeamCalendarResponse,
  TeamMemberBalance

} from '../types';
import { getEmployeeId } from '../../auth/pages/services/AuthService';



export const dashboardService = {

getTeamCalendar: async (managerId: number): Promise<TeamCalendarResponse> => {
    const response = await api.get<TeamCalendarResponse>(
      `/dashboard/manager/team-calendar/${managerId}`
    );
    return response.data;
  },




 
  getEmpDashboard: async (employeeId: number) => {

    const response = await api.get(`/dashboard/employee/${employeeId}`);
    // console.log(response.data);
    return response.data;

  },
  getManagerDashboard: async (managerId: number) => {

    const response = await api.get(`/dashboard/manager/summary/${managerId}`);
    // console.log(response.data);
    return response.data;

  },

  getTeamLeaveStats: async (managerId: number): Promise<Employee[]> => {
    // Note: Assuming your endpoint follows this pattern based on your summary URL
    const response = await api.get(`/dashboard/manager/team-balances/${managerId}?year=2026`);

    // If your backend returns the array directly:
    return response.data;
  },

  // =============================
  // Apply Leave
  // =============================



  // dashboardService.ts
  submitLeaveRequest: async (leaveData: LeaveApplication) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
  },


  // =============================
  // Pending Approvals
  // =============================

  getPendingApprovals: async (managerId: number) => {
    const response = await api.get(`/leave-approvals/pending/${managerId}`);   
    return response.data.content;
  },


  // =============================
  // Approve / Reject
  // =============================

  updateDecision: async (
    decisionRequest: LeaveDecisionRequest
  ) : Promise<void> => {
    console.log("came here");
    
    const response = await api.patch(
      "/leave-approvals/decision",
      decisionRequest
    );
  },




  // =============================
  // Leave History
  // =============================

  getMyLeaveHistory: async (employeeId: number): Promise<LeaveRecord[]> => {
    const response = await api.get(`/leaves/employee/${employeeId}`);
    return response.data;
  },


  getWeeklyLeaveSummary : async (managerId : number) : Promise<LeaveRecord[]> => {
    const response = await api.get(`/manager/${managerId}/team-leaves/week`);
    return response.data;
  },
    getTeamOnLeave : async (managerId : number) : Promise<TeamMemberBalance[]> => {
    const response = await api.get(`/dashboard/manager/team-on-leave/${managerId}`);
    console.log(response.data);
    return response.data;
  },


  // =============================
  // Employees
  // =============================

  // getAllEmployees: async (): Promise<Employee[]> => {

  //   const response = await api.get('/admin/employees');


  //   return response.data.map((emp: any): Employee => ({

  //     id: emp.id,

  //     name: emp.name,

  //     email: emp.email,

  //     dept: emp.department ?? emp.dept,

  //     role: emp.role,

  //     status: emp.status,

  //     designation: emp.designation ?? "",


  //     initial: emp.name

  //       .split(" ")

  //       .map((n: string) => n[0])

  //       .join(""),


  //     color:

  //       emp.role === "MANAGER"

  //         ? "bg-indigo-600"

  //         : emp.role === "HR"

  //         ? "bg-rose-600"

  //         : "bg-slate-500",

  //   }));

  // },





  // =============================
  // Notifications
  // =============================

  getNotifications: async (): Promise<Notification[]> => {

    const response = await api.get('/notifications');

    return response.data;

  },


  // =============================
  // Audit Logs
  // =============================

  getAuditLogs: async (): Promise<AuditLog[]> => {

    const response = await api.get('/admin/audit-logs');

    return response.data;

  },


  // =============================
  // Calendar
  // =============================

  getCalendarLeaves: async (year: any, month: any, scope: any) => {

const response = await api.get(
`/leaves/calendar?year=${year}&month=${month}&scope=${scope}`
);

return response.data;

},


  // =============================
  // Leave Types
  // =============================

  getLeaveTypes: async () => {

    const response = await api.get('/settings/leave-types');

    return response.data;

  },


  createLeaveType: async (data: any) => {

    const response = await api.post('/settings/leave-types', data);

    return response.data;

  },


  updateLeaveType: async (id: number, data: any) => {

    const response = await api.put(

      `/settings/leave-types/${id}`,

      data

    );

    return response.data;

  },
  

 getEmployeeDashboard: async (employeeId?: number): Promise<Employee[]> => {
  // Use parameter if passed, otherwise fallback to cookie
  const id = employeeId ?? getEmployeeId();

  if (!id) {
    console.error("Employee ID is missing! Cannot fetch dashboard.");
    return [];
  }

  try {
    const response = await api.get(`/dashboard/employee/${id}`);
    console.log("Dashboard data:", response.data);
    return [response.data];
  } catch (error: any) {
    console.error("Failed to fetch dashboard:", error.message || error);
    return [];
  }
},

  getLeaveSummary: async () => {
    const id = Cookies.get("employee_id");
    
    if (!id) {
      console.error("Employee ID is missing! Cannot fetch leave summary.");
      return null;
    }

    const response = await api.get(`/dashboard/employee/${id}`);
    return response.data;
  },


  deleteLeaveType: async (id: number) => {

    await api.delete(`/settings/leave-types/${id}`);

    return true;

  },

 
};
 
