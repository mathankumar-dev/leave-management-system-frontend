// // import { useMemo } from "react";
// // import { departmentLeaveData, managerTrackingData } from "../data/mockData";

// // export function useHRDashboard() {
// //   const topDepartment = useMemo(() => {
// //     return departmentLeaveData.reduce((max, d) =>
// //       d.leaves > max.leaves ? d : max
// //     );
// //   }, []);

// //   const topApprover = useMemo(() => {
// //     return managerTrackingData.reduce((max, m) =>
// //       m.approved > max.approved ? m : max
// //     );
// //   }, []);

// //   return {
// //     topDepartment,
// //     topApprover,
// //   };
// // }


import { useState, useMemo } from 'react';
import { 
  departmentLeaveData, 
  managerTrackingData, 
  monthlyTrendData, 
  leaveTypeDistribution 
} from '../data/mockData';

export function useHRDashboard() {
  const [filters, setFilters] = useState({
    month: 'all',
    year: '2026',
    department: 'all',
    leaveType: 'all',
    manager: 'all',
  });

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 1. Filtered Data for charts
  const filteredDeptData = useMemo(() => {
    if (filters.department === 'all') return departmentLeaveData;
    return departmentLeaveData.filter(d => d.department === filters.department);
  }, [filters.department]);

  // 2. Stats calculated from filtered data
  const stats = useMemo(() => ({
    topDepartment: filteredDeptData.reduce((max, d) => (d.leaves > max.leaves ? d : max), filteredDeptData[0] || departmentLeaveData[0]),
    topApprover: managerTrackingData.reduce((max, m) => (m.approved > max.approved ? m : max), managerTrackingData[0]),
    topPending: managerTrackingData.reduce((max, m) => (m.pending > max.pending ? m : max), managerTrackingData[0]),
  }), [filteredDeptData]); // Re-calculate when filter changes

  return { 
    filters, 
    updateFilter, 
    stats,
    chartData: {
      trend: monthlyTrendData,
      departments: filteredDeptData,
      types: leaveTypeDistribution
    }
  };
}