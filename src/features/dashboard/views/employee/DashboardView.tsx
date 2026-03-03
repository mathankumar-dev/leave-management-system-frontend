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
import { FaChartLine, FaPlus } from "react-icons/fa";

import StatCard from "../../components/StatCard";
import LeaveDetailsDrawer from "../../components/LeaveDetailsDrawer";
import { useDashboard } from "../../hooks/useDashboard";
import MyFloatingActionButton from "../../../../components/ui/MyFloatingActionButton";
import { useAuth } from "../../../auth/hooks/useAuth";


export type DashboardScope = "SELF" | "TEAM" | "ALL";

interface DashboardViewProps {
  scope?: DashboardScope;
  onNavigate?: (tab: string) => void;
}

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

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { fetchDashboard, setError } = useDashboard();
  const { user } = useAuth();
  const employeeId = user?.id;

  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // 🔥 This fixes Recharts width(-1) issue
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
  }, []);

  const loadDashboardData = useCallback(async () => {
    if (!employeeId) return;

    try {
      setFetching(true);
      const data = await fetchDashboard(employeeId);

      if (data) {
        setStats([
          {
            title: "Yearly Balance",
            used: data.yearlyUsed || 0,
            total: data.yearlyAllocated || 0,
            color: "blue",
          },
          {
            title: "Monthly Balance",
            used: data.monthlyUsed || 0,
            total: data.monthlyAllocated || 0,
            color: "green",
          },
          {
            title: "Approved",
            used: data.approvedCount || 0,
            total: data.approvedCount || 0,
            color: "purple",
          },
          {
            title: "Pending",
            used: data.pendingCount || 0,
            total: data.pendingCount || 0,
            color: "orange",
          },
        ]);

        if (data.utilization) {
          setChartData(data.utilization);
        }
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

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full"
        />
        <p className="text-slate-400 font-bold animate-pulse text-xs">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const handleAdd = () => {
    onNavigate?.("Apply Leave");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 max-w-7xl mx-auto"
    >
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
      </div>

      {/* CHART */}
      <div className="bg-white border rounded-md p-5 shadow-sm">
        <div className="flex justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-400">
            Monthly Utilization
          </h4>
          <FaChartLine className="text-slate-300" />
        </div>

        <div className="w-full h-[250px] min-w-0">
          {chartReady && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />

                <Bar dataKey="Casual">
                  <LabelList dataKey="Casual" position="top" />
                </Bar>

                <Bar dataKey="Sick">
                  <LabelList dataKey="Sick" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* DRAWER */}
      <LeaveDetailsDrawer
        open={!!selectedCard}
        title={selectedCard}
        onClose={() => setSelectedCard(null)}
      />

      {/* FLOAT BUTTON */}
      <MyFloatingActionButton
        icon={<FaPlus />}
        onClick={handleAdd}
        title="New Leave Request"
        tooltipLabel="Apply Leave"
      />
    </motion.div>
  );
};

export default DashboardView;