import api from "../../../../api/axiosInstance";
import type { NotificationResponse, PageResponse } from "./types";

export const notificationService = {
    getNotifications: async (employeeId: number, page = 0, size = 10): Promise<PageResponse<NotificationResponse>> => {
    const response = await api.get(`/notifications/user/${employeeId}`, {
      params: { page, size }
    });
    return response.data;
  },

    getUnreadNotificationsCount: async (employeeId: number): Promise<number> => {
    const response = await api.get(`/notifications/user/${employeeId}/unread-count`);
    return response.data;
  },


  markAsRead : async (notificationId: number): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);    
  },

  markAllAsRead : async (userId: number): Promise<void> => {
    await api.post(`/notifications/user/${userId}/mark-all-read`);    
  },


  


}