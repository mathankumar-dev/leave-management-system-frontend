import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";

import LeaveDetailsDrawer from "../../components/LeaveDetailsDrawer";
import { useDashboard } from "../../hooks/useDashboard";
import MyFloatingActionButton from "../../../../components/ui/MyFloatingActionButton";
import { useAuth } from "../../../auth/hooks/useAuth";
import CustomLoader from "../../../../components/ui/CustomLoader";

export type DashboardScope = "SELF" | "TEAM" | "ALL";

interface DashboardViewProps {
  scope?: DashboardScope;
  onNavigate?: (tab: string) => void;
}

interface LeaveTypeBreakdown {
  leaveType: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
}

interface StatItem {
  title: string;
  used: number;
  total?: number;
  color: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { fetchDashboard, setError } = useDashboard();
  const { user } = useAuth();
  const employeeId = user?.id;

  const [stats, setStats] = useState<StatItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedCard, setSelectedCard] = useState<StatItem | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!employeeId) return;

    try {
      setFetching(true);

      const data = await fetchDashboard(employeeId);
      const breakdown: LeaveTypeBreakdown[] = data.breakdown || [];

      const sickLeave = breakdown.find((b) =>
        b.leaveType?.toUpperCase().includes("SICK")
      );

      const casualLeave = breakdown.find((b) =>
        b.leaveType?.toUpperCase().includes("CASUAL")
      );

      const newStats: StatItem[] = [
        {
          title: "Sick Leave",
          used: sickLeave?.usedDays ?? 0,
          total: sickLeave?.allocatedDays ?? 0,
          color: "emerald",
        },
        {
          title: "Casual Leave",
          used: casualLeave?.usedDays ?? 0,
          total: casualLeave?.allocatedDays ?? 0,
          color: "emerald",
        },
        {
          title: "Yearly Balance",
          used: data.yearlyUsed || 0,
          total: data.yearlyAllocated || 0,
          color: "emerald",
        },
        {
          title: "Monthly Balance",
          used: data.monthlyUsed || 0,
          total: data.monthlyAllocated || 0,
          color: "emerald",
        },
        {
          title: "Carry Forward",
          used:
            (data.carryForwardTotal || 0) -
            (data.carryForwardRemaining || 0),
          total: data.carryForwardTotal || 0,
          color: "emerald",
        },
        {
          title: "Comp Off Balance",
          used: data.compoffBalance || 0,
          total: data.compoffBalance || 0,
          color: "emerald",
        },
        {
          title: "Approved Leaves",
          used: data.approvedCount || 0,
          total: data.approvedCount || 0,
          color: "emerald",
        },
        {
          title: "Pending Leaves",
          used: data.pendingCount || 0,
          total: data.pendingCount || 0,
          color: "amber",
        },
        {
          title: "Rejected Leaves",
          used: data.rejectedCount || 0,
          total: data.rejectedCount || 0,
          color: "rose",
        },
        {
          title: "Loss Of Pay %",
          used: data.lossOfPayPercentage || 0,
          color: "rose",
        },
      ];

      setStats(newStats);
    } catch (err: any) {
      console.error("Dashboard API Error:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setFetching(false);
    }
  }, [employeeId, fetchDashboard, setError]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (fetching) {
    return <CustomLoader label="Loading dashboard..." />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 py-6 space-y-6 bg-gradient-to-b from-slate-50 to-white min-h-screen"
    >

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Welcome back, {user?.name}
          </h2>

          <p className="text-sm text-slate-500">
            Leave summary for 2026
          </p>
        </div>

        <button
          onClick={() => onNavigate?.("Apply Leave")}
          className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <FaPlus /> Apply Leave
        </button>

      </div>

      {/* DASHBOARD GRID */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        {stats.map((stat) => (
          <SummaryCard
            key={stat.title}
            stat={stat}
            setSelectedCard={setSelectedCard}
          />
        ))}

      </div>

      <LeaveDetailsDrawer
        open={!!selectedCard}
        stat={selectedCard}
        onClose={() => setSelectedCard(null)}
        onClick={() => onNavigate?.("Apply Leave")}
      />

      {user?.role !== "EMPLOYEE" && (
        <MyFloatingActionButton
          icon={<FaPlus />}
          onClick={() => onNavigate?.("Apply Leave")}
          title="New Leave Request"
          tooltipLabel="Apply Leave"
        />
      )}

    </motion.div>
  );
};

export default DashboardView;



/* PROFESSIONAL CARD */

const SummaryCard = ({ stat, setSelectedCard }: any) => {

  const remaining = (stat.total ?? 0) - (stat.used ?? 0);

  const percent = stat.total
    ? Math.min((stat.used / stat.total) * 100, 100)
    : 0;

  /* color map for each card */

  const colorMap: any = {
    "Sick Leave": {
      bar: "from-cyan-500 to-sky-500",
      title: "text-cyan-600",
      progress: "from-cyan-400 to-sky-500"
    },
    "Casual Leave": {
     bar: "from-cyan-500 to-sky-500",
      title: "text-cyan-600",
      progress: "from-cyan-400 to-sky-500"
    },
    "Yearly Balance": {
      bar: "from-cyan-500 to-sky-500",
      title: "text-cyan-600",
      progress: "from-cyan-400 to-sky-500"
    },
    "Monthly Balance": {
      bar: "from-cyan-500 to-sky-500",
      title: "text-cyan-600",
      progress: "from-cyan-400 to-sky-500"
    },
    "Carry Forward": {
      bar: "from-cyan-500 to-sky-500",
      title: "text-cyan-600",
      progress: "from-cyan-400 to-sky-500"
    },
    "Comp Off Balance": {
      bar: "from-cyan-500 to-sky-500",
      title: "text-cyan-600",
      progress: "from-cyan-400 to-sky-500"
    },
    "Approved Leaves": {
      bar: "from-emerald-500 to-green-500",
      title: "text-emerald-600",
      progress: "from-emerald-400 to-green-500"
    },
    "Pending Leaves": {
      bar: "from-yellow-400 to-amber-500",
      title: "text-yellow-600",
      progress: "from-yellow-400 to-amber-500"
    },
    "Rejected Leaves": {
      bar: "from-rose-500 to-red-500",
      title: "text-rose-600",
      progress: "from-rose-400 to-red-500"
    },
    "Loss Of Pay %": {
      bar: "from-red-600 to-rose-600",
      title: "text-red-600",
      progress: "from-red-500 to-rose-500"
    }
  };

  const theme = colorMap[stat.title] || {
    bar: "from-indigo-500 to-blue-500",
    title: "text-indigo-600",
    progress: "from-indigo-400 to-blue-500"
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      onClick={() => setSelectedCard(stat)}
      className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-xl cursor-pointer overflow-hidden"
    >

      {/* TOP COLOR BAR */}

      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.bar}`}
      />

      {/* TITLE */}

      <h3
        className={`text-sm font-semibold mb-4 tracking-wide ${theme.title}`}
      >
        {stat.title}
      </h3>

      {/* NUMBERS */}

      <div className="grid grid-cols-3 text-center mb-4">

        <div>
          <p className="text-xs text-slate-400 uppercase">Total</p>
          <p className="text-lg font-semibold text-slate-700">
            {stat.total ?? stat.used}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 uppercase">Used</p>
          <p className="text-lg font-semibold text-orange-500">
            {stat.used}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 uppercase">Remaining</p>
          <p className="text-lg font-semibold text-emerald-600">
            {remaining}
          </p>
        </div>

      </div>

      {/* PROGRESS BAR */}

      {stat.total && (
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8 }}
            className={`h-2 rounded-full bg-gradient-to-r ${theme.progress}`}
          />

        </div>
      )}

      {/* HOVER GLOW */}

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-gradient-to-br from-white via-transparent to-slate-50 pointer-events-none" />

    </motion.div>
  );
};