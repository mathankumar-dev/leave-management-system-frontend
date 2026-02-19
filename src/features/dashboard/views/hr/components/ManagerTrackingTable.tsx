import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { managerTrackingData } from '../data/mockData';

interface Props {
  topApprover: any;
  topPending: any;
}

export function ManagerTrackingTable({ topApprover, topPending }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">Manager Tracking</CardTitle>
          <CardDescription>
            Top approver: <span className="font-semibold text-foreground">{topApprover.name}</span> · 
            Most pending: <span className="font-semibold text-foreground">{topPending.name}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">Manager</th>
                <th className="text-left py-2 font-medium">Department</th>
                <th className="text-center py-2 font-medium">Approved</th>
                <th className="text-center py-2 font-medium">Pending</th>
                <th className="text-center py-2 font-medium">Rejected</th>
                <th className="text-center py-2 font-medium">Avg. Time (hrs)</th>
              </tr>
            </thead>
            <tbody>
              {managerTrackingData.map((m) => (
                <tr key={m.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-medium">{m.name}</td>
                  <td className="py-3 text-muted-foreground">{m.department}</td>
                  <td className="py-3 text-center">
                    <Badge variant="secondary" className="bg-success/10 text-success">{m.approved}</Badge>
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={m.pending > 3 ? 'destructive' : 'secondary'}>{m.pending}</Badge>
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant="outline">{m.rejected}</Badge>
                  </td>
                  <td className="py-3 text-center">
                    <span className={m.avgApprovalHrs > 6 ? 'text-warning font-medium' : 'text-muted-foreground'}>
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
