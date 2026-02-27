// hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notification/notificationService';
import type { NotificationResponse } from '../services/notification/types';

export const useNotifications = (employeeId: number) => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0 });

  const fetchNotifications = useCallback(async (page = 0) => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(employeeId, page);
      
      setNotifications(data.content);
      setPageInfo({
        totalElements: data.totalElements,
        totalPages: data.totalPages
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      fetchNotifications();
    }
  }, [employeeId, fetchNotifications]);

  return { notifications, isLoading, error, pageInfo, refetch: fetchNotifications };
};