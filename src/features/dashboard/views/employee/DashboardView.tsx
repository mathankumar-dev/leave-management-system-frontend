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
  pendingCount?: number;
}

interface StatItem {
  title: string;
  used: number;
  total?: number;
  pendingCount?: number;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { fetchDashboard, setError } = useDashboard();
  const { user } = useAuth();
  const employeeId = user?.id;

  const [stats, setStats] = useState<StatItem[]>([]);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
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
        b.leaveType?.toUpperCase().includes("ANNUAL")
      );

      const newStats: StatItem[] = [
        {
          title: "Sick Leave",
          used: sickLeave?.usedDays ?? 0,
          total: sickLeave?.allocatedDays ?? 0,
          pendingCount: sickLeave?.pendingCount ?? 0,
        },
        {
          title: "Annual Leave",
          used: annualLeave?.usedDays ?? 0,
          total: annualLeave?.allocatedDays ?? 0,
          pendingCount: annualLeave?.pendingCount ?? 0,
        },
        {
          title: "Yearly Balance",
          used: data.yearlyUsed || 0,
          total: data.yearlyAllocated || 0,
        },
        {
          title: "Monthly Balance",
          used: data.monthlyUsed || 0,
          total: data.monthlyAllocated || 0,
        },
        {
          title: "Carry Forward",
          used:
            (data.carryForwardTotal || 0) -
            (data.carryForwardRemaining || 0),
          total: data.carryForwardTotal || 0,
        },
        {
          title: "Comp Off Balance",
          used: data.compoffBalance || 0,
          total: data.compoffBalance || 0,
          pendingCount: 0,
        },
      ];

      setStats(newStats);
      setApproved(data.approvedCount || 0);
      setRejected(data.rejectedCount || 0);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setFetching(false);
    }
  }, [employeeId, fetchDashboard, setError]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (fetching) return <CustomLoader label="Loading dashboard..." />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Welcome back, {user?.name}
          </h2>
          
        </div>

        <button
          onClick={() => onNavigate?.("Apply Leave")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FaPlus /> Apply Leave
        </button>
      </div>

      {/* STATUS CARDS */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-green-50 to-white border p-5 rounded-xl shadow-sm"
        >
          <p className="text-sm text-gray-500">Approved Leaves</p>
          <h3 className="text-3xl font-bold text-green-600">
            {approved}
          </h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-gradient-to-br from-red-50 to-white border p-5 rounded-xl shadow-sm"
        >
          <p className="text-sm text-gray-500">Rejected Leaves</p>
          <h3 className="text-3xl font-bold text-red-600">
            {rejected}
          </h3>
        </motion.div>
      </div>

      <div className="bg-white border rounded-2xl shadow-md overflow-hidden">
  <table className="w-full text-sm">
    
    {/* HEADER */}
    <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs uppercase tracking-wider">
      <tr>
        <th className="px-6 py-4 text-left">Category</th>
        <th className="px-6 py-4 text-center">Allocated</th>
        <th className="px-6 py-4 text-center">Used</th>
        <th className="px-6 py-4 text-center">Pending</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody className="divide-y divide-gray-200">
      {stats.map((stat, index) => {
        const percent = stat.total
          ? Math.min((stat.used / stat.total) * 100, 100)
          : 0;

        return (
          <tr
            key={index}
            onClick={() => setSelectedCard(stat)}
            className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            {/* CATEGORY */}
            <td className="px-6 py-4 font-medium text-gray-800">
              {stat.title}
            </td>

            {/* ALLOCATED */}
            <td className="px-6 py-4 text-center text-gray-600">
              {stat.total ?? "-"}
            </td>

            {/* USED */}
            <td className="px-6 py-4 text-center">
              <span className="font-semibold text-indigo-600">
                {stat.used}
              </span>

              

              
            </td>

            {/* PENDING */}
            <td className="px-6 py-4 text-center">
              {stat.pendingCount !== undefined ? (
                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-medium">
                  {stat.pendingCount}
                </span>
              ) : (
                "-"
              )}
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
    </div>
  );
};

export default DashboardView;