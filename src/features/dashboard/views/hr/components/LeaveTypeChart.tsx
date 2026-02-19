import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock } from 'lucide-react';
import { leaveTypeDistribution } from "../data/mockData";

// Colors matching your uploaded screenshot
const COLORS = ['#8b5cf6', '#ef4444', '#3b82f6', '#10b981', '#64748b'];

export function LeaveTypeChart() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-800">
          <Clock className="h-4 w-4 text-blue-600" />
          Leave Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leaveTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                // stroke="none"
              >
                {leaveTypeDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '13px', fontWeight: 500, color: '#64748b', paddingTop: '5px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}