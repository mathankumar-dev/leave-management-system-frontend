import React, { useEffect, useState } from "react";
import { 
  FaCalendarAlt, FaArrowUp, FaArrowDown, 
  FaDownload, FaUsers, FaClock, FaChartLine 
} from "react-icons/fa";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { useDashboard } from "../../hooks/useDashboard"; // Assuming this is your hook path

interface ReportStats {
  totalLeaves: string;
  activeEmployees: string;
  pendingApprovals: string;
  avgDuration: string;
  trends: { label: string; change: string; up: boolean }[];
}

const HRReportsView: React.FC = () => {
  const { fetchStats, fetchDeptDistribution, loading } = useDashboard();
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [deptData, setDeptData] = useState<any[]>([]);

  useEffect(() => {
    // Parallel fetching from your API
    Promise.all([fetchStats(), fetchDeptDistribution()]).then(([sData, dData]) => {
      setStats(sData);
      setDeptData(dData);
    });
  }, [fetchStats, fetchDeptDistribution]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Helper to map icons to stats
  const statIcons = [<FaCalendarAlt />, <FaUsers />, <FaClock />, <FaChartLine />];
  const statColors = ["text-blue-600 bg-blue-50", "text-indigo-600 bg-indigo-50", "text-amber-600 bg-amber-50", "text-emerald-600 bg-emerald-50"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">HR Analytics</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Live data from the Management Portal.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
          <FaDownload /> Export Dataset
        </button>
      </div>

      {/* STAT CARDS - Data driven from API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && [
          { label: "Total Leaves", val: stats.totalLeaves },
          { label: "Active Staff", val: stats.activeEmployees },
          { label: "Pending", val: stats.pendingApprovals },
          { label: "Avg Trip", val: stats.avgDuration }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`${statColors[i]} p-3 rounded-2xl text-lg`}>{statIcons[i]}</div>
              <span className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full ${stats.trends[i].up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {stats.trends[i].up ? <FaArrowUp /> : <FaArrowDown />} {stats.trends[i].change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{item.val}</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[400px]">
          <h3 className="font-black text-slate-900 text-xl tracking-tight mb-6 uppercase">Department Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData.length > 0 ? deptData : []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: '900' }}
                />
                <Bar dataKey="leaves" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART - API DATA FALLBACK TO CSS COLORS */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col">
          <h3 className="font-black text-xl tracking-tight mb-4 uppercase">Leave Types</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData} // Using department data or a specific 'types' endpoint
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="leaves"
                  stroke="none"
                >
                  {deptData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#f43f5e', '#fbbf24', '#10b981'][index % 4]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black">{stats?.totalLeaves || '0'}</span>
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRReportsView;