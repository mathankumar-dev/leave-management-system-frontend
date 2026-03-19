import api from "../../../../api/axiosInstance";
import type { MeetingRequest, ODRequest } from "../../types";


export const requestService = {
  createODRequest: async (request: ODRequest, employeeId: number) => {

    const response = await api.post('/od/request', request, {
      params: { employeeId }
    });
    return response.data;
  },

  createMeetingRequest: async (request: MeetingRequest, employeeId: number, attendeeIds?: number[]) => {
    const response = await api.post(`/meetings/create/${employeeId}`, request, {
      params: {
        attendeeIds: attendeeIds?.join(',')
      }
    });
    return response.data;
  },

  approveOD: async (odId: number, approverId: number): Promise<void> => {
    
    
    const res = await api.put(`/od/approve/${odId}`, {}, {
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