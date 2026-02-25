import { useHRDashboard } from '../hooks/useHRDashboard';
import { DashboardFilters } from '../components/DashboardFilters';
import { SummarySection } from '../components/SummarySection';
// import { LeaveInsights } from '../components/LeaveInsights';
import { DepartmentChart } from '../components/DepartmentChart';
import { LeaveTypeChart } from '../components/LeaveTypeChart';
import { MonthlyTrendChart } from '../components/MonthlyTrendChart';
import { ManagerTrackingTable } from '../components/ManagerTrackingTable';
import { MonitoringSection } from '../components/MonitoringSection';
import { QuickStatsRow } from '../components/QuickStatsRow';
import { ExportActions } from '../components/ExportActions';


export function HRDashboard() {
  const { filters, updateFilter, stats } = useHRDashboard();

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back, Priya</h1>
        <p className="text-sm text-slate-500">HR analytics and workforce insights</p>
      </div>

      <DashboardFilters filters={filters} updateFilter={updateFilter} />
      
      <SummarySection />
      
      {/* 3-Column Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <DepartmentChart topDepartment={stats.topDepartment} />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <LeaveTypeChart />
        </div>
        <MonthlyTrendChart />
      </div>

      {/* Table Section */}
      <div className="grid grid-cols-1 gap-6">
          <ManagerTrackingTable 
            topApprover={stats.topApprover} 
            topPending={stats.topPending} 
          />
      </div>

      <MonitoringSection />
      
      <div className="pt-4 border-t border-slate-200">
        <QuickStatsRow />
      </div>
      
      <ExportActions />
    </div>
  );
}






















// import { useState } from "react";
// import { DashboardFilters } from "../components/DashboardFilters";
// import { SummarySection } from "../components/SummarySection";
// import { ChartsSection } from "../components/ChartsSection";
// import { ManagerTrackingTable } from "../components/ManagerTrackingTable";
// import { MonitoringSection } from "../components/MonitoringSection";
// import { QuickStatsRow } from "../components/QuickStatsRow";
// import { ExportActions } from "../components/ExportActions";
// import { useDashboard } from "../../../hooks/useDashboard";
// // import { useDashboard } from "../dashboard/hooks/useDashboard";

// export default function HRDashboard() {
//   const [filterMonth, setFilterMonth] = useState("All");

//   const { topDepartment, topApprover } = useDashboard();

//   return (
//     <div className="space-y-6 p-6">
//       <DashboardFilters
//         filterMonth={filterMonth}
//         setFilterMonth={setFilterMonth}
//       />

//       <SummarySection />
//       <ChartsSection />
//       <ManagerTrackingTable />
//       <MonitoringSection />
//       <QuickStatsRow />
//       <ExportActions />

//       <div className="p-4 bg-gray-100 rounded">
//         Top Department: {topDepartment.name}
//         <br />
//         Top Approver: {topApprover.name}
//       </div>
//     </div>
//   );
// }
