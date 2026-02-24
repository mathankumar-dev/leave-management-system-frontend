import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { managerTrackingData } from '../data/mockData';

interface Props {
  topApprover: any;
  topPending: any;
}

export function ManagerTrackingTable({ topApprover, topPending }: Props) {
  const approverName = topApprover?.name || "N/A";
  const pendingName = topPending?.name || "N/A";

  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-slate-800">Manager Tracking</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Top approver: <span className="font-bold text-emerald-600">{approverName}</span> · 
            Most pending: <span className="font-bold text-rose-600">{pendingName}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {/* Cleaned up header typography */}
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                <th className="text-left py-3 px-2">Manager</th>
                <th className="text-left py-3 px-2">Department</th>
                <th className="text-center py-3 px-2">Approved</th>
                <th className="text-center py-3 px-2">Pending</th>
                <th className="text-center py-3 px-2">Rejected</th>
                <th className="text-right py-3 px-2">Avg. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {managerTrackingData.map((m) => (
                <tr key={m.name} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-2 font-semibold text-slate-700">{m.name}</td>
                  <td className="py-4 px-2 text-slate-500 font-medium">{m.department}</td>
                  <td className="py-4 px-2 text-center">
                    {/* Replaced 'success' with 'emerald' for better Tailwind support */}
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 shadow-none hover:bg-emerald-100 font-bold px-3">
                      {m.approved}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <Badge 
                      variant={m.pending > 3 ? 'destructive' : 'secondary'}
                      className={m.pending > 3 ? "font-bold" : "bg-slate-100 text-slate-600 border-slate-200 font-bold px-3"}
                    >
                      {m.pending}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <Badge variant="outline" className="text-slate-400 border-slate-200 font-medium px-3">
                      {m.rejected}
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className={`text-xs font-bold ${m.avgApprovalHrs > 6 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {m.avgApprovalHrs}h
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}















// import { managerTrackingData } from "../data/mockData";

// export function ManagerTrackingTable() {
//   return (
//     <table className="w-full border">
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Approved</th>
//           <th>Pending</th>
//           <th>Rejected</th>
//         </tr>
//       </thead>
//       <tbody>
//         {managerTrackingData.map((m) => (
//           <tr key={m.name}>
//             <td>{m.name}</td>
//             <td>{m.approved}</td>
//             <td>{m.pending}</td>
//             <td>{m.rejected}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
