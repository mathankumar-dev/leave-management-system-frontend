import { DepartmentChart } from "./DepartmentChart";
import { LeaveTypeChart } from "./LeaveTypeChart";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { useHRDashboard } from "../hooks/useHRDashboard";

export function ChartsSection() {
  const { stats, chartData } = useHRDashboard();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Pass the string name for the header */}
        <DepartmentChart topDepartment={stats.topDepartment.department} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <LeaveTypeChart />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Now chartData.trend will be recognized */}
        <MonthlyTrendChart/>
      </div>
    </div>
  );
}













// import { DepartmentChart } from "./DepartmentChart";
// import { LeaveTypeChart } from "./LeaveTypeChart";
// import { MonthlyTrendChart } from "./MonthlyTrendChart";

// export function ChartsSection() {
//   return (
//     <div className="grid grid-cols-3 gap-4">
//       <DepartmentChart />
//       <LeaveTypeChart />
//       <MonthlyTrendChart />
//     </div>
//   );
// }
