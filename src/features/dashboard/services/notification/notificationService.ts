import api from "../../../../api/axiosInstance";
import type { NotificationResponse, PageResponse } from "./types";

export const notificationService = {
    getNotifications: async (employeeId: number, page = 0, size = 10): Promise<PageResponse<NotificationResponse>> => {
    const response = await api.get(`/notifications/user/${employeeId}`, {
      params: { page, size }
    });
    return response.data;
  },
}