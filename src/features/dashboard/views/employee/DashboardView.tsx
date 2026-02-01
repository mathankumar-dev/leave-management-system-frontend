import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dashboardService } from "../services/dashboardService";
import { useDashboard } from "../hooks/useDashboard";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Tooltip as ChartTooltip 
} from "recharts";
import type { DashboardStats, ChartData } from "../types";
import StatCard from "../../../components/ui/StatCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const DashboardView: React.FC = () => {
  // Destructure setError correctly from your hook
  const { setError } = useDashboard();
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setFetching(true);
        const data = await dashboardService.getLeaveSummary();
        if (isMounted) {
          setStats(data.summaryStats || []);
          setChartData(data.historyData || []);
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error.message || "Failed to load dashboard data");
        }
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [setError]);

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full"
        />
        <p className="mt-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Assembling Dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title}
            used={stat.used}
            total={stat.total}
            color={stat.color}
          />
        ))}
      </div>

      {/* 2. ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Leave Utilization</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase text-slate-400">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"/> Casual</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"/> Sick</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            {/* FIXED: Removed backslashes from width and height strings */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                />
                <YAxis hide />
                <ChartTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="Casual" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="Sick" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. QUICK INFO BOX */}
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-between overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Policy Note</p>
            <h4 className="text-xl font-bold mt-2">Next Leave Reset</h4>
            <p className="text-slate-400 text-xs mt-4 leading-relaxed">
              Your annual leave balance will reset in <span className="text-white font-bold">142 days</span>. 
              Unused "Earned Leaves" (up to 10 days) will carry over automatically.
            </p>
          </div>
          <div className="mt-8 relative z-10">
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              View Detailed Policy
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;