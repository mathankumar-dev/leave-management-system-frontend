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
          color: "cyan",
        },
        {
          title: "Casual Leave",
          used: casualLeave?.usedDays ?? 0,
          total: casualLeave?.allocatedDays ?? 0,
          color: "cyan",
        },
        {
          title: "Yearly Balance",
          used: data.yearlyUsed || 0,
          total: data.yearlyAllocated || 0,
          color: "cyan",
        },
        {
          title: "Monthly Balance",
          used: data.monthlyUsed || 0,
          total: data.monthlyAllocated || 0,
          color: "cyan",
        },
        {
          title: "Carry Forward",
          used:
            (data.carryForwardTotal || 0) -
            (data.carryForwardRemaining || 0),
          total: data.carryForwardTotal || 0,
          color: "cyan",
        },
        {
          title: "Comp Off Balance",
          used: data.compoffBalance || 0,
          total: data.compoffBalance || 0,
          color: "cyan",
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
          <p className="text-sm text-slate-500">Leave summary for 2026</p>
        </div>

        <button
          onClick={() => onNavigate?.("Apply Leave")}
          className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <FaPlus /> Apply Leave
        </button>
      </div>

      {/* MODERN TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 p-4 space-y-4">
        {/* HEADER */}
        <div className="grid grid-cols-5 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50 rounded-xl">
          <div>Type</div>
          <div className="text-center">Total</div>
          <div className="text-center">Used</div>
          <div className="text-center">Remaining</div>
        
        </div>

        {/* ROWS */}
        {stats.map((stat) => {
          const remaining = (stat.total ?? 0) - (stat.used ?? 0);
          const percent = stat.total
            ? Math.min((stat.used / stat.total) * 100, 100)
            : 0;

          const colorMap: any = {
            emerald: "bg-gradient-to-r from-emerald-400 to-green-500",
            amber: "bg-gradient-to-r from-yellow-400 to-amber-500",
            rose: "bg-gradient-to-r from-rose-400 to-red-500",
            cyan: "bg-gradient-to-r from-cyan-400 to-sky-500",
          };

          return (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              className="grid grid-cols-5 gap-10 items-center bg-white hover:bg-slate-50 px-4 py-3 rounded-xl transition-shadow shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => setSelectedCard(stat)}
            >
              {/* TITLE */}
              <div className="font-medium text-slate-700">{stat.title}</div>

              {/* TOTAL */}
              <div className="text-center text-slate-600">{stat.total ?? stat.used}</div>

              {/* USED */}
              <div className="text-center text-orange-500 font-medium">{stat.used}</div>

              {/* REMAINING */}
              <div className="text-center text-emerald-600 font-medium">{remaining}</div>

              
              
            </motion.div>
          );
        })}
      </div>

      {/* DRAWER */}
      <LeaveDetailsDrawer
        open={!!selectedCard}
        stat={selectedCard}
        onClose={() => setSelectedCard(null)}
        onClick={() => onNavigate?.("Apply Leave")}
      />

      {/* FAB */}
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