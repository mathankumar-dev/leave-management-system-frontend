import { useCallback } from 'react';
import api from '../../../api/axiosInstance';

import type {

  LeaveRecord,

  Employee,

  ApprovalRequest,

  Notification,

  AuditLog

} from '../types';



export const dashboardService = {


  // =============================
  // Dashboard Summary
  // =============================

  getLeaveSummary: async () => {

    const response = await api.get('/dashboard/summary');

    return response.data;

  },
    getEmpDashboard: async (employeeId : number) => {

    const response = await api.get(`/dashboard/employee/${employeeId}`);
      // console.log(response.data);
    return response.data;

  },
    getManagerDashboard: async (managerId : number) => {

    const response = await api.get(`/dashboard/manager/summary/${managerId}`);
      // console.log(response.data);
    return response.data;

  },

  getTeamLeaveStats: async (managerId: number): Promise<Employee[]> => {
    // Note: Assuming your endpoint follows this pattern based on your summary URL
    const response = await api.get(`/dashboard/manager/team-balances/${managerId}?year=2026`);
    
    // If your backend returns the array directly:
    return response.data;},

  // =============================
  // Apply Leave
  // =============================


//   submitLeaveRequest: async (leaveData: LeaveApplication | FormData) => {
//     console.log("leave data in service");
//     console.log(leaveData);
    
//     console.log("going to call /leaves/apply");
    
//     const response = await api.post('/leaves/apply', leaveData);

// console.log("successfully called /leaves/apply");
//     console.log(response);
    
//     return response.data;
//   },

submitLeaveRequest: async (leaveData: FormData | LeaveApplication) => {
      console.log("leave data in service");
    console.log(leaveData);
    
    console.log("going to call /leaves/apply");
    
    const response = await api.post('/leaves/apply', leaveData);

console.log("successfully called /leaves/apply");
    console.log(response);
    
    return response.data;
  },


  // =============================
  // Pending Approvals
  // =============================

  getPendingApprovals: async (): Promise<ApprovalRequest[]> => {

    const response = await api.get('/leaves/approvals/pending');

    return response.data;

  },


  // =============================
  // Approve / Reject
  // =============================

  updateApprovalStatus: async (

    id: number,

    status: 'Approved' | 'Rejected',

    comment?: string

  ) => {

    const response = await api.put(

      `/leaves/approvals/${id}`,

      {

        status,

        comment

      }

    );

    return response.data;

  },


  // =============================
  // Leave History
  // =============================

  getMyLeaveHistory: async (employeeId : number): Promise<LeaveRecord[]> => {

    const response = await api.get(`leaves/employee/${employeeId}`);

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

  getCalendarLeaves: async (

    year: number,

    month: number

  ) => {

    const response = await api.get(

      `/leaves/calendar?year=${year}&month=${month}`

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


  deleteLeaveType: async (id: number) => {

    await api.delete(`/settings/leave-types/${id}`);

    return true;

  },


};
