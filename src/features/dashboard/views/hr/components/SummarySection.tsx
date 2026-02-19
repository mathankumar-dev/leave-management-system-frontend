import { 
  Users, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  CalendarClock 
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export function SummarySection() {
  const summaryData = [
    { title: "Total Employees", value: 156, subtitle: "Across 6 departments", icon: Users, variant: "primary" },
    { title: "Total Managers", value: 12, subtitle: "Active managers", icon: UserCheck, variant: "info" },
    { title: "Leave Applications", value: 47, subtitle: "This month", icon: FileText, variant: "default" },
    { title: "Approved Leaves", value: 38, subtitle: "This month", icon: CheckCircle2, variant: "success" },
    { title: "Rejected Leaves", value: 5, subtitle: "This month", icon: XCircle, variant: "warning" },
    { title: "On Leave Today", value: 14, subtitle: "9% of workforce", icon: CalendarClock, variant: "warning" },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {summaryData.map((stat, idx) => (
        <StatsCard 
          key={idx}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          icon={stat.icon}
          variant={stat.variant as any}
        />
      ))}
    </section>
  );
}















// export function SummarySection() {
//   return (
//     <div className="grid grid-cols-3 gap-4">
//       <div className="p-4 bg-white shadow rounded">Total Leaves: 120</div>
//       <div className="p-4 bg-white shadow rounded">Pending: 15</div>
//       <div className="p-4 bg-white shadow rounded">Rejected: 6</div>
//     </div>
//   );
// }
