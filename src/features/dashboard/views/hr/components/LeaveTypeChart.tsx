import { PieChart, Pie, Tooltip } from "recharts";
import { leaveTypeDistribution } from "../data/mockData";

export function LeaveTypeChart() {
  return (
    <PieChart width={300} height={200}>
      <Pie data={leaveTypeDistribution} dataKey="value" nameKey="name" />
      <Tooltip />
    </PieChart>
  );
}
