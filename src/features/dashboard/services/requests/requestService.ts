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

  approveOD: async (odId: number): Promise<void> => {
    await api.patch(`/od/approve/${odId}`,);
  },
  rejectOD: async (odId: number): Promise<void> => {
    await api.patch(`/od/reject/${odId}`,);
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