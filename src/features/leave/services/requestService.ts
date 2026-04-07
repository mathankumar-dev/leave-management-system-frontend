import type { AccessRequest, ManagerAccessDecision, MeetingRequest, ODRequest } from "@/features/leave/types";
import api from "@/services/apiClient";


export const requestService = {
  createODRequest: async (request: ODRequest, employeeId: string) => {

    const response = await api.post('/od/request', request, {
      params: { employeeId }
    });
    return response.data;
  },

  createMeetingRequest: async (request: MeetingRequest, employeeId: string, attendeeIds?: number[]) => {
    const response = await api.post(`/meetings/create/${employeeId}`, request, {
      params: {
        attendeeIds: attendeeIds?.join(',')
      }
    });
    return response.data;
  },
  createAccessRequest: async (request: AccessRequest, employeeId: string) => {
    const response = await api.post(`/access-requests/apply/${employeeId}`, request,);
    return response.data;
  },

  approveAccessManager: async (requestId: number, decision: ManagerAccessDecision) => {
    await api.patch(`/access-requests/${requestId}/manager-decision`, decision,);
  },




  approveOD: async (odId: number, approverId: number): Promise<void> => {


    await api.put(`/od/approve/${odId}`, {}, {
      params: { approverId }
    });
  },
  rejectOD: async (odId: number, approverId: number, reason: string): Promise<void> => {
    await api.put(`/od/reject/${odId}`, {}, {
      params: { approverId, reason }
    });
  },
  approveMeeting: async (meetingId: number, managerId: number): Promise<void> => {
    await api.patch(`/meetings/approve/manager/${meetingId}/${managerId}`,);
  },


  rejectMeeting: async (meetingId: number, reviewerId: number): Promise<void> => {
    await api.patch(`/meetings/${meetingId}/reject`, {}, {
      params: { reviewerId }
    });
  },

};