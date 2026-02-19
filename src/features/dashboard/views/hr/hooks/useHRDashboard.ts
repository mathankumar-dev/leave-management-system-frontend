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
import { departmentLeaveData, managerTrackingData } from '../data/mockData';

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

  const stats = useMemo(() => ({
    topDepartment: departmentLeaveData.reduce((max, d) => (d.leaves > max.leaves ? d : max), departmentLeaveData[0]),
    topApprover: managerTrackingData.reduce((max, m) => (m.approved > max.approved ? m : max), managerTrackingData[0]),
    topPending: managerTrackingData.reduce((max, m) => (m.pending > max.pending ? m : max), managerTrackingData[0]),
  }), []);

  return { filters, updateFilter, stats };
}
