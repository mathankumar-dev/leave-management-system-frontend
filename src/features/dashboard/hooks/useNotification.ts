import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification/notificationService';
import type { NotificationResponse } from '../services/notification/types';

export const useNotifications = (employeeId: number) => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 });

  const fetchNotifications = useCallback(async (page = 0) => {
    if (!employeeId) return;
    try {
      setIsLoading(true);
      const [pageData, count] = await Promise.all([
        notificationService.getNotifications(employeeId, page),
        notificationService.getUnreadNotificationsCount(employeeId)
      ]);

      setNotifications(pageData.content);
      setUnreadCount(count);
      setPageInfo({
        totalElements: pageData.totalElements,
        totalPages: pageData.totalPages
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Re-fetch to sync all counts and lists
      await fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!employeeId) return;
    try {
      await notificationService.markAllAsRead(employeeId);
      // Re-fetch everything
      await fetchNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    pageInfo,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};