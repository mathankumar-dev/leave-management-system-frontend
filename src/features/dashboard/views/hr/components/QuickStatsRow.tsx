// import { Zap, Clock, PieChart } from "lucide-react";
// import { Card, CardContent } from "../ui/card";

// interface QuickStatsRowProps {
//   summaryStats: {
//     compOffUsed?: number;
//     halfDayLeaves?: number;
//     avgUtilization?: number | string;
//   };
// }

// export function QuickStatsRow({ summaryStats }: QuickStatsRowProps) {
//   const stats = [
//     {
//       label: "Comp Off Used This Month",
//       value: summaryStats.compOffUsed ?? 0,
//       icon: Zap,
//       color: "text-purple-600",
//       bgColor: "bg-purple-50",
//       trend: "+2 from last month",
//     },
//     {
//       label: "Half-Day Leaves This Month",
//       value: summaryStats.halfDayLeaves ?? 0,
//       icon: Clock,
//       color: "text-orange-600",
//       bgColor: "bg-orange-50",
//       trend: "-5% vs average",
//     },
//     {
//       label: "Avg Leave Utilization",
//       value: summaryStats.avgUtilization ?? "0%",
//       icon: PieChart,
//       color: "text-blue-600",
//       bgColor: "bg-blue-50",
//       trend: "Optimal range",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {stats.map((stat, index) => (
//         <Card key={index} className="border border-slate-100 shadow-sm bg-white overflow-hidden">
//           <CardContent className="p-5">
//             <div className="flex items-start justify-between">
//               <div className="space-y-2">
//                 <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//                   {stat.label}
//                 </p>
//                 <h3 className="text-3xl font-extrabold text-slate-900">
//                   {stat.value}
//                 </h3>
//                 <p className="text-[10px] font-medium text-slate-400">
//                   {stat.trend}
//                 </p>
//               </div>
//               <div className={`p-3 rounded-2xl ${stat.bgColor} shadow-inner`}>
//                 <stat.icon className={`h-6 w-6 ${stat.color}`} />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }