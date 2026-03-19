// import React from "react";
// import { DepartmentChart } from "./DepartmentChart";
// import { LeaveTypeChart } from "./LeaveTypeChart";
// import { MonthlyTrendChart } from "./MonthlyTrendChart";

// interface ChartsSectionProps {
//   teamStructure: any[];       // You can replace with proper type later
//   monthlyTrendData: any[];    // Replace with proper type later
// }

// export const ChartsSection: React.FC<ChartsSectionProps> = ({
//   teamStructure,
//   monthlyTrendData,
// }) => {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
//       {/* Department Chart */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//         <DepartmentChart teamStructure={teamStructure ?? []} />
//       </div>

//       {/* Leave Type Chart */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//         <LeaveTypeChart />
//       </div>

//       {/* Monthly Trend Chart */}
//       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
//         <MonthlyTrendChart data={monthlyTrendData ?? []} />
//       </div>

//     </div>
//   );
// };













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
