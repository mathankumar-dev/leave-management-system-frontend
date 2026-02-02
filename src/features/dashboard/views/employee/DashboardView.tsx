import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import StatCard from "../../../../components/ui/StatCard.tsx";
import LeaveDetailsDrawer from "./LeaveDetailsDrawer.tsx";
import RecentLeavePopup from "../../components/pop_up/popup.tsx";


import { useDashboard } from "../../hooks/useDashboard.ts";
import type { DashboardStats, ChartData, LeaveRecord } from "../../types/index.ts";

import {
  MOCK_DASHBOARD_STATS,
  MOCK_CHART_DATA,
  
  MOCK_LEAVE_HISTORY
} from "../../mockData/index.tsx";


import { getLastThreeMonthsData } from "../../../../utils/ChartDetails.ts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const DashboardView: React.FC = () => {
  const { fetchStats, setError } = useDashboard();

  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // NEW: state for the recent leave popup
  const [latestLeave, setLatestLeave] = useState<LeaveRecord | null>(null);

  // Load dashboard stats
  const loadDashboardData = useCallback(async () => {
    try {
      setFetching(true);
      const data = await fetchStats();

      if (data) {
        setStats(data.summaryStats || MOCK_DASHBOARD_STATS);
      } else {
        setStats(MOCK_DASHBOARD_STATS);
      }

      // Set the most recent leave for popup
      if (MOCK_LEAVE_HISTORY.length) {
        setLatestLeave(MOCK_LEAVE_HISTORY[MOCK_LEAVE_HISTORY.length - 1]);
      }

    } catch (error: any) {
      setError(error.message || "Failed to load dashboard data");
      setStats(MOCK_DASHBOARD_STATS);
    } finally {
      setFetching(false);
    }
  }, [fetchStats, setError]);

  // Initial load
  useEffect(() => {
    loadDashboardData();

    // Set chart to last 3 months
    const lastThreeMonths = getLastThreeMonthsData(MOCK_CHART_DATA);
    setChartData(lastThreeMonths);
  }, [loadDashboardData]);

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              used={stat.used}
              total={stat.total}
              color={stat.color}
              onClick={() => setSelectedCard(stat.title)}
            />
          ))}
        </div>

        {/* LEAVE CHART */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Leave Utilization (Days)
            </h3>

            <div className="flex gap-4 text-[10px] font-bold uppercase text-slate-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                Casual Leave
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                Sick Leave
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                  label={{ value: "Days", angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 10 }}
                />

                {/* Casual Leave */}
                <Bar dataKey="Casual" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={14}>
                  <LabelList dataKey="Casual" position="top" fill="#4338ca" fontSize={10} fontWeight={700} />
                </Bar>

                {/* Sick Leave */}
                <Bar dataKey="Sick" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={14}>
                  <LabelList dataKey="Sick" position="top" fill="#be123c" fontSize={10} fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* LEAVE DETAILS DRAWER */}
      <LeaveDetailsDrawer
        open={!!selectedCard}
        title={selectedCard}
        onClose={() => setSelectedCard(null)}
      />

      {/* RECENT LEAVE POPUP */}
      <RecentLeavePopup latestLeave={latestLeave} />
    </>
  );
};

export default DashboardView;
