// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { TrendingUp } from 'lucide-react';
// import type { MonthlyTrendItem } from '../types';

// interface MonthlyTrendChartProps {
//   data: MonthlyTrendItem[];
// }

// export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
//   if (data.length === 0) {
//     return (
//       <Card className="border-none shadow-none">
//         <CardContent className="flex items-center justify-center h-[250px] text-slate-400 text-sm">
//           No trend data available
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="border-none shadow-none bg-transparent">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
//           <TrendingUp className="h-4 w-4 text-blue-600" />
//           Monthly Leave Trend
//         </CardTitle>
//       </CardHeader>

//       <CardContent>
//         <div className="h-[250px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={data}
//               margin={{ left: -10, right: 10, top: 5, bottom: 0 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <XAxis
//                 dataKey="month"
//                 tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <YAxis
//                 tick={{ fontSize: 11, fill: '#64748b' }}
//                 axisLine={false}
//                 tickLine={false}
//               />
//               <Tooltip
//                 contentStyle={{
//                   borderRadius: '8px',
//                   border: '1px solid #e2e8f0',
//                   boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
//                 }}
//               />
//               <Legend
//                 verticalAlign="bottom"
//                 iconType="circle"
//                 iconSize={10}
//                 wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '8px' }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="approved"
//                 stroke="#10b981"
//                 strokeWidth={2}
//                 dot={{ r: 3 }}
//                 activeDot={{ r: 5 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="pending"
//                 stroke="#f59e0b"
//                 strokeWidth={2}
//                 dot={{ r: 3 }}
//                 activeDot={{ r: 5 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="rejected"
//                 stroke="#ef4444"
//                 strokeWidth={2}
//                 dot={{ r: 3 }}
//                 activeDot={{ r: 5 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }












// // import { Activity } from 'lucide-react';
// // import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from 'recharts';
// // // Import the actual data
// // import { monthlyTrendData } from '../data/mockData'; 

// // interface MonthlyTrendProps {
// //   data: {
// //     month: string;
// //     applied: number;
// //     approved: number;
// //     rejected: number;
// //   }[];
// // }
// // export function MonthlyTrendChart({ data }: MonthlyTrendProps) {
// //   return (
// //     <Card className="bg-white border-slate-200 shadow-sm">
// //       <CardHeader className="pb-3">
// //         <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
// //           <Activity className="h-4 w-4 text-blue-600" />
// //           Monthly Leave Trend
// //         </CardTitle>
// //       </CardHeader>
// //       <CardContent> 
// //         {/* Changed h-62.5 to h-[250px] for standard Tailwind compatibility */}
// //         <div className="h-62.5 w-full">
// //           <ResponsiveContainer width="100%" height="100%">
// //             <LineChart 
// //               data={monthlyTrendData} 
// //               margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
// //             >
// //               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// //               <XAxis 
// //                 dataKey="month" 
// //                 tick={{ fontSize: 11, fill: '#64748b' }} 
// //                 axisLine={false}
// //                 tickLine={false}
// //               />
// //               <YAxis 
// //                 tick={{ fontSize: 11, fill: '#64748b' }} 
// //                 axisLine={false}
// //                 tickLine={false}
// //               />
// //               <Tooltip 
// //                 contentStyle={{ 
// //                   backgroundColor: '#fff',
// //                   borderRadius: '8px', 
// //                   border: '1px solid #e2e8f0', 
// //                   boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
// //                 }} 
// //               />
// //               <Legend 
// //                 verticalAlign="top" 
// //                 align="right"
// //                 iconSize={8}
// //                 iconType="circle"
// //                 wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }}
// //               />
// //               <Line 
// //                 type="monotone" 
// //                 dataKey="applied" 
// //                 name="Applied"
// //                 stroke="#2563eb" 
// //                 strokeWidth={3} 
// //                 dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
// //                 activeDot={{ r: 6 }}
// //               />
// //               <Line 
// //                 type="monotone" 
// //                 dataKey="approved" 
// //                 name="Approved"
// //                 stroke="#10B981" 
// //                 strokeWidth={3} 
// //                 dot={false}
// //               />
// //               <Line 
// //                 type="monotone" 
// //                 dataKey="rejected" 
// //                 name="Rejected"
// //                 stroke="#EF4444" 
// //                 strokeWidth={2} 
// //                 strokeDasharray="4 4"
// //                 dot={false}
// //               />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }