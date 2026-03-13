import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaPlus } from "react-icons/fa";

import StatCard from "../../components/StatCard";
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
  halfDayCount: number;
}

interface StatItem {
  title: string;
  used: number;
  total?: number;
  color: string;
  breakdown?: LeaveTypeBreakdown[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
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
          color: "red",
        },
        {
          title: "Casual Leave",
          used: casualLeave?.usedDays ?? 0,
          total: casualLeave?.allocatedDays ?? 0,
          color: "green",
        },
        {
          title: "Yearly Balance",
          used: data.yearlyUsed || 0,
          total: data.yearlyAllocated || 0,
          color: "indigo",
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
          color: "amber",
        },
        {
          title: "Comp Off Balance",
          used: data.compoffBalance || 0,
          total: data.compoffBalance || 0,
          color: "slate",
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

  const sickRemaining = (stats[0]?.total ?? 0) - (stats[0]?.used ?? 0);
  const casualRemaining = (stats[1]?.total ?? 0) - (stats[1]?.used ?? 0);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 py-6 space-y-10 min-h-screen bg-gradient-to-b from-slate-50 to-white"
    >

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Welcome back, {user?.name}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Here's your leave summary for 2026
          </p>
        </div>

        <button
          onClick={() => onNavigate?.("Apply Leave")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          <FaPlus />
          Apply Leave
        </button>
      </div>

      {/* HIGHLIGHT PANEL */}

      <div className="grid md:grid-cols-3 gap-6">

        <HighlightCard
          title="Sick Leaves Remaining"
          value={sickRemaining}
          color="bg-red-500"
        />

        <HighlightCard
          title="Casual Leaves Remaining"
          value={casualRemaining}
          color="bg-green-500"
        />

        <HighlightCard
          title="Approved Leaves"
          value={stats[6]?.used}
          color="bg-indigo-600"
        />

      </div>

      {/* LEAVE BALANCE */}

      <Section title="Leave Balance">

        {stats.slice(0, 4).map((stat) => (
          <ProgressStat key={stat.title} stat={stat} setSelectedCard={setSelectedCard} />
        ))}

      </Section>

      {/* ADJUSTMENTS */}

      <Section title="Adjustments">

        {stats.slice(4, 6).map((stat) => (
          <ProgressStat key={stat.title} stat={stat} setSelectedCard={setSelectedCard} />
        ))}

      </Section>

      {/* REQUEST STATUS */}

      <Section title="Leave Requests">

        {stats.slice(6, 9).map((stat) => (
          <StatWrapper key={stat.title} stat={stat} setSelectedCard={setSelectedCard} />
        ))}

      </Section>

      {/* ANALYTICS */}

      <Section title="Analytics">

        {stats.slice(9).map((stat) => (
          <StatWrapper key={stat.title} stat={stat} setSelectedCard={setSelectedCard} />
        ))}

      </Section>

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



/* COMPONENTS */

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
      {title}
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </div>
);



const HighlightCard = ({ title, value, color }: any) => (
  <div className={`${color} text-white rounded-xl p-6 shadow`}>
    <p className="text-sm opacity-80">{title}</p>
    <h2 className="text-3xl font-bold mt-1">{value}</h2>
  </div>
);



const ProgressStat = ({ stat, setSelectedCard }: any) => {

  const percent = stat.total
    ? Math.min((stat.used / stat.total) * 100, 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={() => setSelectedCard(stat)}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg cursor-pointer"
    >

      <div className="flex justify-between text-sm text-slate-500 mb-2">
        <span>{stat.title}</span>
        <span className="font-semibold">
          {stat.used}/{stat.total}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          style={{ width: `${percent}%` }}
          className={`h-2 rounded-full bg-${stat.color}-500`}
        />
      </div>

    </motion.div>
  );
};



const StatWrapper = ({ stat, setSelectedCard }: any) => (
  <motion.div
    whileHover={{ y: -6 }}
    onClick={() => setSelectedCard(stat)}
    className="cursor-pointer bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg"
  >
    <StatCard
      title={stat.title}
      used={stat.used}
      total={stat.total ?? 0}
      color={stat.color}
      period="2026"
    />
  </motion.div>
);