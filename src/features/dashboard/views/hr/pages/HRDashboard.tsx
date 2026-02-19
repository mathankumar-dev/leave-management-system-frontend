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
    <div className="space-y-6 animate-fade-in">
      <DashboardFilters  filters = {filters} updateFilter={updateFilter} />
      
      <SummarySection />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <LeaveInsights /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DepartmentChart topDepartment={stats.topDepartment} />
        <LeaveTypeChart />
        <MonthlyTrendChart />
      </div>

      <ManagerTrackingTable 
        topApprover={stats.topApprover} 
        topPending={stats.topPending} 
      />

      <MonitoringSection />
      
      <QuickStatsRow />
      
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
