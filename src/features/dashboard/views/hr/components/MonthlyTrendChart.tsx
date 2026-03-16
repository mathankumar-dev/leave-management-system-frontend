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
// Import the actual data
import { monthlyTrendData } from '../data/mockData'; 

interface MonthlyTrendProps {
  data: {
    month: string;
    applied: number;
    approved: number;
    rejected: number;
  }[];
}
export function MonthlyTrendChart() {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
          <Activity className="h-4 w-4 text-blue-600" />
          Monthly Leave Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Changed h-62.5 to h-[250px] for standard Tailwind compatibility */}
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={monthlyTrendData} 
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                }} 
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }}
              />
              <Line 
                type="monotone" 
                dataKey="applied" 
                name="Applied"
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                name="Approved"
                stroke="#10B981" 
                strokeWidth={3} 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="rejected" 
                name="Rejected"
                stroke="#EF4444" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}