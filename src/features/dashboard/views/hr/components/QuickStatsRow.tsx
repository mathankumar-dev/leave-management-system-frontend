export function QuickStatsRow() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-blue-100 rounded">Avg Approval Time: 2 Days</div>
      <div className="p-4 bg-green-100 rounded">High Risk Employees: 3</div>
      <div className="p-4 bg-yellow-100 rounded">Peak Month: March</div>
    </div>
  );
}
