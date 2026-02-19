import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { departmentLeaveData } from '../data/mockData';

export function DepartmentChart({ topDepartment }: any) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Department-wise Leaves
        </CardTitle>
        <CardDescription>
          Highest: <span className="font-semibold text-foreground">{topDepartment.department}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={departmentLeaveData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="department" width={85} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="leaves" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}




// import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
// import { departmentLeaveData } from "../data/mockData";

// export function DepartmentChart() {
//   return (
//     <BarChart width={300} height={200} data={departmentLeaveData}>
//       <XAxis dataKey="name" />
//       <YAxis />
//       <Tooltip />
//       <Bar dataKey="leaves" fill="#8884d8" />
//     </BarChart>
//   );
// }
