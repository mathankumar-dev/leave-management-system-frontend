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
  pendingCount? : number ;
}

interface StatItem {
  title: string;
  used: number;
  total?: number;
  color: string;
  pendingCount? : number;
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

      const annualLeave = breakdown.find((b) =>
        b.leaveType?.toUpperCase().includes("ANNUAL_LEAVE")
      );

      const newStats: StatItem[] = [
        {
          title: "Sick Leave",
          used: sickLeave?.usedDays ?? 0,
          total: sickLeave?.allocatedDays ?? 0,
          color: "cyan",
          pendingCount : sickLeave?.pendingCount ?? 0,
        },
        {
          title: "Annual Leave",
          used: annualLeave?.usedDays ?? 0,
          total: annualLeave?.allocatedDays ?? 0,
          color: "cyan",
          pendingCount : annualLeave?.pendingCount ?? 0,
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
          pendingCount : 0,
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

      {/* TABLE */}
      <div className="w-full bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Leave Category</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Allocated</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Used</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Balance</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Pending Requests</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stats.map((stat, index) => {
              const remaining = (stat.total ?? 0) - (stat.used ?? 0);

              // Conditional styling for the "Monthly" or special rows if you want to highlight them
              const isMonthly = stat.title.toLowerCase().includes("monthly");

              return (
                <tr
                  key={index}
                  onClick={() => setSelectedCard(stat)}
                  className={`group cursor-pointer transition-colors ${isMonthly ? 'bg-indigo-50/30 hover:bg-indigo-50/50' : 'hover:bg-slate-50/50'
                    }`}
                >
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold uppercase tracking-tight ${isMonthly ? 'text-indigo-600' : 'text-slate-900'
                      }`}>
                      {stat.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-slate-400">
                      {stat.total ?? stat.used} Days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-700">
                      {stat.used} Days
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 rounded-md text-xs font-black ${remaining > 0
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-slate-100 text-slate-500'
                      }`}>
                      {remaining} Left
                    </span>
                  </td>
                                    <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-700">
                      {stat.pendingCount} 
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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