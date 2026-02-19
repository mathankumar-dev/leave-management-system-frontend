import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function MonthlyTrendChart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Monthly Leave Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={[{MonthlyTrendChart}]}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }} 
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="applied" 
                name="Applied"
                stroke="hsl(var(--primary))" 
                strokeWidth={2.5} 
                dot={{ r: 0 }}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                name="Approved"
                stroke="#10B981" 
                strokeWidth={2.5} 
                dot={{ r: 0 }}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="rejected" 
                name="Rejected"
                stroke="#EF4444" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={{ r: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}





















// import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
// import { monthlyTrendData } from "../data/mockData";

// export function MonthlyTrendChart() {
//   return (
//     <LineChart width={300} height={200} data={monthlyTrendData}>
//       <XAxis dataKey="month" />
//       <YAxis />
//       <Tooltip />
//       <Line type="monotone" dataKey="leaves" stroke="#82ca9d" />
//     </LineChart>
//   );
// }
