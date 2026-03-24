import type { FlashNews, FlashNewsRequest, NotificationResponse, PageResponse } from "@/features/notification/types";
import api from "@/services/apiClient";


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


  markAsRead: async (notificationId: number): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await api.post(`/notifications/user/${userId}/mark-all-read`);
  },

  createFlashNews: async (data: FlashNewsRequest) => {
    try {
      const message = await api.post("/flash-news/create", data);
      return message.data;
    }
    catch (error: any) {
      throw error.response?.data?.message || "Failed to post the news"
    }
  },


  getFlashNews: async (): Promise<FlashNews[]> => {
    const response = await api.get('/flash-news');
    return response.data;
  },



}