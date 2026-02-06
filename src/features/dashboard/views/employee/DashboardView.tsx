import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBolt,
  FaChartLine,
} from "react-icons/fa";

// UI Components
import StatCard from "../../../../components/ui/StatCard";
import RecentLeavePopup from "../../components/popup";
import LeaveDetailsDrawer from "../../components/LeaveDetailsDrawer";

// Hooks & Mock Data
import { useDashboard } from "../../hooks/useDashboard";
import {
  MOCK_CHART_DATA,
  MOCK_DASHBOARD_STATS,
  MOCK_LEAVE_HISTORY,
} from "../../../../mockData";

/* ================= TYPES ================= */

export type DashboardScope = "SELF" | "TEAM" | "ALL";

interface DashboardViewProps {
  scope?: DashboardScope;
}

/* ================= ANIMATIONS ================= */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ================= COMPONENT ================= */

const DashboardView: React.FC<DashboardViewProps> = ({
  scope = "SELF",
}) => {
  const { fetchStats, setError } = useDashboard();

  const [stats, setStats] = useState(MOCK_DASHBOARD_STATS);
  const [fetching, setFetching] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  /* ---------- FETCH DATA ---------- */
  const loadDashboardData = useCallback(async () => {
    try {
      setFetching(true);
      const data = await fetchStats(scope);

      setStats(data?.summaryStats || MOCK_DASHBOARD_STATS);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setFetching(false);
    }
  }, [fetchStats, scope, setError]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /* ---------- LOADER ---------- */
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full"
        />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-4 max-w-7xl mx-auto text-slate-900"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {scope === "ALL" ? "Organization Dashboard" : "Employee Dashboard"}
          </h2>
          <p className="text-sm text-slate-500">
            Leave overview and utilization summary.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm">
          <FaBolt /> New Leave Request
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            onClick={() => setSelectedCard(stat.title)}
          >
            <StatCard
              title={stat.title}
              used={stat.used}
              total={stat.total}
              color={stat.color}
              period="ANNUAL CYCLE 2026"
            />
          </motion.div>
        ))}

        {/* COMP-OFF */}
        <motion.div
          variants={itemVariants}
          className="bg-emerald-50 border border-emerald-100 rounded-md p-5 shadow-sm"
        >
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            Comp-Off Balance
          </p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-2">
            02 Days
          </h3>
          <p className="text-[10px] text-emerald-500 mt-1 italic">
            Expires in 45 days
          </p>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEAVE LIST */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Leave Status
          </h3>

          {[
            {
              id: 101,
              type: "Annual",
              range: "Oct 12 - Oct 15",
              status: "Approved",
            },
            {
              id: 102,
              type: "Sick",
              range: "Sep 05",
              status: "Rejected",
            },
          ].map((req) => (
            <div
              key={req.id}
              className="bg-white border rounded-md p-4 flex justify-between items-center shadow-sm"
            >
              <div className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center ${
                    req.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {req.status === "Approved" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaTimesCircle />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm">{req.type} Leave</p>
                  <p className="text-xs text-slate-500">{req.range}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                  req.status === "Approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {req.status}
              </span>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="lg:col-span-4">
          <div className="bg-white border rounded-md p-5 shadow-sm">
            <div className="flex justify-between mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Monthly Utilization
              </h4>
              <FaChartLine className="text-slate-300" />
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <Bar dataKey="Casual" fill="#6366f1" barSize={12}>
                    <LabelList dataKey="Casual" position="top" fontSize={8} />
                  </Bar>
                  <Bar dataKey="Sick" fill="#f43f5e" barSize={12}>
                    <LabelList dataKey="Sick" position="top" fontSize={8} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <LeaveDetailsDrawer
        open={!!selectedCard}
        title={selectedCard}
        onClose={() => setSelectedCard(null)}
      />

      <RecentLeavePopup latestLeave={MOCK_LEAVE_HISTORY[0]} />

      <MyFloatingActionButton 
        onClick={handleFABClick} 
        label="Quick Action" 
      />
    </motion.div>
  );
};

export default DashboardView;
