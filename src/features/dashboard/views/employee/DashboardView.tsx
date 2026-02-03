import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Tooltip as ChartTooltip 
} from "recharts";
import { 
  FaClock, FaCheckCircle, FaTimesCircle, FaInfoCircle, 
  FaCalendarAlt, FaBolt, FaArrowRight, FaChartLine
} from "react-icons/fa";

import { useDashboard } from "../../hooks/useDashboard";
import type { DashboardStats, ChartData } from "../../types";

const DashboardView: React.FC = () => {
  const { fetchStats, setError } = useDashboard();
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [fetching, setFetching] = useState(true);

  // Mocking status data per Spec 6.1
  const [myRequests] = useState([
    { id: 101, type: 'Annual', range: 'Oct 12 - Oct 15', status: 'Approved', comment: 'Approved. Enjoy your vacation!' },
    { id: 102, type: 'Sick', range: 'Sep 05 - Sep 05', status: 'Rejected', comment: 'Please attach medical certificate.' },
    { id: 103, type: 'Casual', range: 'Dec 20 - Dec 22', status: 'Pending', comment: '' },
  ]);

  const loadDashboardData = useCallback(async (isMounted: boolean) => {
    try {
      setFetching(true);
      const data = await fetchStats(); 
      if (isMounted && data) {
        setStats(data.summaryStats || []);
        setChartData(data.historyData || []);
      }
    } catch (error: any) {
      if (isMounted) setError(error.message || "Failed to load");
    } finally {
      if (isMounted) setFetching(false);
    }
  }, [fetchStats, setError]);

  useEffect(() => {
    let isMounted = true;
    loadDashboardData(isMounted);
    return () => { isMounted = false; };
  }, [loadDashboardData]);

  if (fetching) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">LOADING PROFILE...</div>;

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto text-slate-900">
      
      {/* 1. PROFESSIONAL HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Employee Dashboard</h2>
          <p className="text-sm text-slate-500">Overview of your leave balances and application status.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm">
          <FaBolt /> New Leave Request
        </button>
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
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <StatCard 
              key={index} 
              title={stat.title}
              used={stat.used}
              total={stat.total}
              color={stat.color}
            />
          ))
        ) : (
          <div className="col-span-full p-8 text-center border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400">
            No statistics available.
          </div>
        ))}
        {/* Comp-Off Stat Card */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-md p-4 shadow-sm">
           <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Comp-Off Balance</p>
           <h3 className="text-2xl font-bold text-emerald-700 mt-2">02 Days</h3>
           <p className="text-[10px] font-medium text-emerald-500 mt-1 italic">Expires in 45 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3. MY REQUEST STATUS (PRIORITY #1 - Spec 6.1) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">My Leave Status</h3>
          </div>

          <div className="space-y-3">
            {myRequests.map((req) => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-md p-4 hover:border-indigo-400 transition-all shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status === 'Approved' ? <FaCheckCircle /> : req.status === 'Rejected' ? <FaTimesCircle /> : <FaClock />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-800">{req.type} Leave</p>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 font-medium">#{req.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{req.range}</p>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      req.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
                    {req.status === 'Pending' && (
                      <button className="text-[10px] font-bold text-rose-500 hover:underline">Cancel Request</button>
                    )}
                  </div>
                </div>

                {/* Manager Comments Section (Spec 5.2 / 8.1) */}
                {req.comment && (
                  <div className="mt-3 ml-14 p-3 bg-slate-50 rounded border border-dashed border-slate-200">
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      <span className="font-bold not-italic text-slate-400 mr-2 uppercase text-[9px]">Manager Note:</span>
                      "{req.comment}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. SIDEBAR ANALYTICS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Utilization Chart */}
          <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Leave Utilization</h4>
              <FaChartLine className="text-slate-300" />
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" hide />
                  <Bar dataKey="Casual" fill="#6366f1" radius={[2, 2, 0, 0]} barSize={10} />
                  <Bar dataKey="Sick" fill="#f43f5e" radius={[2, 2, 0, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-4 justify-center">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"/> <span className="text-[10px] font-bold text-slate-500">CASUAL</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"/> <span className="text-[10px] font-bold text-slate-500">SICK</span></div>
            </div>
          </div>

          {/* Policy Info Card */}
          <div className="bg-slate-900 rounded-md p-5 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className="text-indigo-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Policy Reminder</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Annual leave balance resets in <span className="text-white font-bold">142 days</span>. 
                Ensure you utilize your <span className="text-indigo-300">Earned Leaves</span> before the year-end cutoff.
              </p>
              <button className="mt-4 text-[10px] font-bold text-white flex items-center gap-2 hover:gap-3 transition-all">
                VIEW FULL POLICY <FaArrowRight size={10} />
              </button>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;