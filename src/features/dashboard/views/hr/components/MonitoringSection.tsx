import { AlertTriangle, TrendingUp, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { lowBalanceEmployees, frequentLeavePatterns, rejectedLeaveSummary } from '../data/mockData';

export function MonitoringSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Low Balance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Low Leave Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lowBalanceEmployees.map((e, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border">
              <div>
                <p className="text-sm font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.department} · {e.leaveType}</p>
              </div>
              <Badge variant={e.remaining === 0 ? 'destructive' : 'secondary'}>{e.remaining} left</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Patterns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-info" /> Frequent Leave Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {frequentLeavePatterns.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg border">
              <div className={`h-2 w-2 rounded-full mt-1.5 ${
                p.flag === 'alert' ? 'bg-destructive' : p.flag === 'warning' ? 'bg-warning' : 'bg-info'
              }`} />
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.department}</p>
                <p className="text-xs mt-1 italic">"{p.frequency}"</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rejected Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" /> Rejected Leave Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rejectedLeaveSummary.map((r, i) => (
            <div key={i} className="p-2.5 rounded-lg border space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{r.employee}</p>
                <Badge variant="outline" className="text-xs">{r.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Reason: {r.reason}</p>
              <p className="text-xs text-muted-foreground">By: {r.manager}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}




// export function MonitoringSection() {
//   return (
//     <div className="p-4 bg-white shadow rounded">
//       Monitoring Alerts Section
//     </div>
//   );
// }
