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

interface StatItem {
  title: string;
  used: number;
  total?: number ;
  color: string;
  breakdown?: LeaveTypeBreakdown[]; // <-- ADD HERE
}

interface LeaveTypeBreakdown {
  leaveType: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  halfDayCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
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

      const monthlyBalance = data.monthlyUsed > 0 ? data.monthlyUsed : 0;

      if (data) {
       const newStats: StatItem[] = [
  {
    title: "Yearly Balance",
    used: data.yearlyUsed || 0,
    total: data.yearlyAllocated || 0,
    color: "indigo",
     breakdown: data.leaveTypeBreakdown || [],
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

  // NEW STAT
  // {
  //   title: "Carry Forward Remaining",
  //   used: data.carryForwardRemaining || 0,
  //   total: data.carryForwardTotal || 0,
  //   color: "cyan",
  // },

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

      }
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

  const handleAdd = (stat: StatItem) => {
  console.log("Request leave for:", stat.title);
  onNavigate?.("Apply Leave");
};

const handleFABClick = () => {
  onNavigate?.("Apply Leave");
};

  if (fetching) {
    return (
        <CustomLoader label="Loading dashboard ..." />
    );
  }
  

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 py-6 space-y-10"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-700">
            Leave Dashboard
          </h2>
          
        </div>

        <FaChartLine className="text-slate-300 text-lg" />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            onClick={() => setSelectedCard(stat)}
            className="cursor-pointer"
          >
                <StatCard
      title={stat.title}
      used={stat.used}
      total={stat.total ?? 0}
      color={stat.color}
      period="ANNUAL CYCLE 2026"
    />
          </motion.div>
        ))}
      </div>


     <LeaveDetailsDrawer
        open={!!selectedCard}
        stat={selectedCard}
        onClose={() => setSelectedCard(null)}
        onClick={handleAdd} />
    
      {/* FLOAT BUTTON */}
      <MyFloatingActionButton
  icon={<FaPlus />}
  onClick={handleFABClick}
  title="New Leave Request"
  tooltipLabel="Apply Leave"
/>
    </motion.div>
  );
};

export default DashboardView;