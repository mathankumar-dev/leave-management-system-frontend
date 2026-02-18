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
  FaChartLine,
  FaCheckCircle,
  FaChevronRight,
  FaClock,
  FaPlus,
  FaRegCalendarAlt,
  FaTimesCircle,
} from "react-icons/fa";

// UI Components
import StatCard from "../../components/StatCard";
import RecentLeavePopup from "../../components/popup";
import LeaveDetailsDrawer from "../../components/LeaveDetailsDrawer";

// Hooks & Mock Data
import { useDashboard } from "../../hooks/useDashboard";
import {
  MOCK_CHART_DATA,
  MOCK_DASHBOARD_STATS,
  MOCK_LEAVE_HISTORY,
} from "../../../../mockData";
import MyFloatingActionButton from "../../../../components/ui/MyFloatingActionButton";
import ActivityCard from "../../../../components/ui/ActivityCard";

/* ================= TYPES ================= */

export type DashboardScope = "SELF" | "TEAM" | "ALL";

interface DashboardViewProps {
  scope?: DashboardScope;
  onNavigate?: (tab: string) => void;
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


const statusConfig: Record<string, { type: "success" | "warning" | "danger"; icon: React.ReactNode }> = {
  Approved: { type: "success", icon: <FaCheckCircle /> },
  Pending: { type: "warning", icon: <FaClock /> }, // You'll need to import FaClock
  Rejected: { type: "danger", icon: <FaTimesCircle /> },
};
/* ================= COMPONENT ================= */

const DashboardView: React.FC<DashboardViewProps> = ({
  scope = "SELF",
  onNavigate,
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

  // function to redirect to apply leaves page
  const handleAdd = () => {
    if (onNavigate) {
      onNavigate("Apply Leave");
    }
  };

  const handleViewAll=() => {
        if (onNavigate) {
      onNavigate("My Leaves");
    }
  }

  /* ---------- UI ---------- */
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6  max-w-7xl mx-auto text-slate-900"
    >

      {[
  {
    id: 101,
    type: "Annual Leave",
    range: "Oct 12 - Oct 15",
    status: "Approved", // Matches your type
    comment: "Enjoy your vacation!",
    days: 4
  },
  {
    id: 102,
    type: "Sick Leave",
    range: "Sep 05",
    status: "Rejected", // Matches your type
    comment: "Urgent client deadline.",
    days: 1
  }
].map((req) => {
  // Get the configuration based on the status string
  const config = statusConfig[req.status];

  function handleSelectLeave(id: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <ActivityCard
      key={req.id}
      title={req.type}
      subtitle={req.range}
      label={`${req.days} ${req.days > 1 ? "Days" : "Day"}`}
      statusText={req.status}
      statusType={config.type} // "success", "warning", or "danger"
      icon={config.icon} // Automatically uses the right icon
      description={req.comment}
      onClick={() => handleSelectLeave(req.id)}
    />
  );
})}

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


      <LeaveDetailsDrawer
        open={!!selectedCard}
        title={selectedCard}
        onClose={() => setSelectedCard(null)}
      />

      <RecentLeavePopup latestLeave={MOCK_LEAVE_HISTORY[0]} />

      <MyFloatingActionButton
      icon = {<FaPlus />}
        onClick={handleAdd}
        title="New Leave Request"
        tooltipLabel="Apply for leave"
      />
    </motion.div>
  );
};

export default DashboardView;
