import { useCallback, useEffect, useState } from 'react';
import { hrDashboardService } from '../service/hrDashboardService';
import type { DashboardResponse } from '../types';

export interface DepartmentStat {
  department: string;
  members:    number;
}

interface HRDashboardState {
  data:            DashboardResponse | null;
  departmentStats: DepartmentStat[];
  loading:         boolean;
  error:           string | null;
}

export function useHRDashboard() {
  const [state, setState] = useState<HRDashboardState>({
    data:            null,
    departmentStats: [],
    loading:         true,
    error:           null,
  });

  const loadDashboard = useCallback(async (signal?: AbortSignal) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await hrDashboardService.getDashboardData(signal);

      const departmentStats: DepartmentStat[] = data.teamStructure.map((team) => ({
        department: team.managerName,
        members:    team.teamMemberCount,
      }));

      setState({ data, departmentStats, loading: false, error: null });
    } catch (err) {
      if (err instanceof Error && err.name === 'CanceledError') return;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load dashboard',
      }));
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal);
    return () => controller.abort();
  }, [loadDashboard]);

  return {
    ...state,
    reload: () => loadDashboard(),
  };
}