import { AlertTriangle, TrendingUp, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { lowBalanceEmployees, frequentLeavePatterns, rejectedLeaveSummary } from '../data/mockData';

export function MonitoringSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Low Balance - Warning Focus */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-3 px-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> 
            Low Leave Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          {lowBalanceEmployees.map((e, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-700">{e.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">{e.department} · {e.leaveType}</p>
              </div>
              <Badge 
                className={`font-bold border-none shadow-none ${
                  e.remaining === 0 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                {e.remaining} left
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Patterns - Analysis Focus */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-3 px-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <TrendingUp className="h-4 w-4 text-blue-500" /> 
            Frequent Leave Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          {frequentLeavePatterns.map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors">
              <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                p.flag === 'alert' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 
                p.flag === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />
              <div>
                <p className="text-sm font-semibold text-slate-700">{p.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">{p.department}</p>
                <p className="text-[11px] mt-1.5 text-slate-600 italic bg-white/50 py-0.5 px-2 rounded-md border border-slate-100 w-fit">
                  "{p.frequency}"
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rejected Summary - Governance Focus */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-3 px-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <XCircle className="h-4 w-4 text-rose-500" /> 
            Rejected Leave Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          {rejectedLeaveSummary.map((r, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">{r.employee}</p>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-200">
                  {r.type}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                <span className="text-slate-400 font-medium">Reason:</span> {r.reason}
              </p>
              <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-slate-100/50">
                <div className="h-4 w-4 rounded-full bg-slate-200" /> {/* Placeholder for mini-avatar */}
                <p className="text-[10px] text-slate-400 font-medium">By: {r.manager}</p>
              </div>
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
