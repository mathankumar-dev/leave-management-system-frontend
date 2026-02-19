import { DepartmentChart } from "./DepartmentChart";
import { LeaveTypeChart } from "./LeaveTypeChart";
import { MonthlyTrendChart } from "./MonthlyTrendChart";

export function ChartsSection() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <DepartmentChart />
      <LeaveTypeChart />
      <MonthlyTrendChart />
    </div>
  );
}
