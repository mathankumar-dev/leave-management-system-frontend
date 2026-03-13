import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaChartBar,
  FaArrowRight,
  FaLayerGroup,
  FaBriefcase,
  FaExclamationTriangle,
  FaWallet,
} from "react-icons/fa";
import { dashboardService } from "../../services/dashboardService";
import { useAuth } from "../../../auth/hooks/useAuth";
import CustomLoader from "../../../../components/ui/CustomLoader";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
interface LeaveTypeUsage {
  leaveType: string;
  totalAllocated: number;
  totalUsed: number;
  totalBalance: number;
}

interface AdminDashboardData {
  totalEmployees: number;
  totalManagers: number;
  totalPendingLeaves: number;
  totalApprovedLeaves: number;
  totalRejectedLeaves: number;
  totalCarryForwardBalance: number;
  totalCompOffBalance: number;
  leaveTypeUsage: LeaveTypeUsage[];
}

interface QuickAction {
  label: string;
  tab: string;
  icon: React.ReactNode;
}

/* ────────────────────────────────────────────────
   Admin Stat Card
──────────────────────────────────────────────── */
interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  onClick?: () => void;
  accent?: string;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  icon,
  colorClass = "text-slate-900",
  onClick,
  accent,
}) => (
  <div
    onClick={onClick}
    className={`bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-900 transition-all group cursor-pointer relative overflow-hidden active:scale-[0.98] ${
      accent ? `border-l-4 ${accent}` : ""
    }`}
  >
    <div className="relative z-10">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">
        {label}
      </p>
      <p
        className={`text-2xl font-black ${colorClass} tracking-tight italic transition-transform group-hover:-translate-y-0.5`}
      >
        {value ?? 0}
      </p>
    </div>
    <div className="text-slate-200 group-hover:text-slate-300 transition-all duration-300 text-3xl absolute right-4 opacity-40 group-hover:opacity-100 group-hover:scale-110">
      {icon}
    </div>
  </div>
);

/* ────────────────────────────────────────────────
   Leave Type Row
──────────────────────────────────────────────── */
interface LeaveTypeRowProps {
  leaveType: string;
  totalAllocated: number;
  totalUsed: number;
  totalBalance: number;
}

const LeaveTypeRow: React.FC<LeaveTypeRowProps> = ({
  leaveType,
  totalAllocated,
  totalUsed,
  totalBalance,
}) => {
  const usagePercent =
    totalAllocated > 0 ? Math.round((totalUsed / totalAllocated) * 100) : 0;

  const typeColors: Record<string, string> = {
    SICK: "bg-rose-500",
    CASUAL: "bg-indigo-500",
    EARNED_LEAVES: "bg-emerald-500",
    COMP_OFF: "bg-amber-500",
  };

  const barColor = typeColors[leaveType] ?? "bg-slate-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col md:flex-row md:items-center gap-3 p-4 border border-slate-100 hover:border-slate-300 transition-all group bg-white"
    >
      <div className="min-w-[140px]">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">
          {leaveType?.replace(/_/g, " ") ?? "—"}
        </span>
      </div>

      <div className="flex-1">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-700`}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        <p className="text-[9px] text-slate-400 mt-1 font-bold">{usagePercent}% used</p>
      </div>

      <div className="flex gap-6 text-right">
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400">Allocated</p>
          <p className="text-sm font-black italic text-slate-700">{totalAllocated}</p>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400">Used</p>
          <p className="text-sm font-black italic text-rose-600">{totalUsed}</p>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase text-slate-400">Balance</p>
          <p className="text-sm font-black italic text-emerald-600">{totalBalance}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ────────────────────────────────────────────────
   Main Component
──────────────────────────────────────────────── */
interface AdminDashboardViewProps {
  onNavigate?: (tab: string) => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const leaveTableRef = useRef<HTMLDivElement>(null);

  const loadAdminDashboard = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data: AdminDashboardData = await dashboardService.getDashboard(
        Number(user.id)
      );
      setAdminData(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load admin dashboard";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading) loadAdminDashboard();
  }, [authLoading, loadAdminDashboard]);

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <CustomLoader label="Loading Admin Portal" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
        <FaExclamationTriangle className="text-rose-400 text-4xl" />
        <p className="text-[11px] font-black uppercase tracking-widest text-rose-500">
          {error}
        </p>
        <button
          onClick={loadAdminDashboard}
          className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-indigo-600 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const leaveTypes: LeaveTypeUsage[] = adminData?.leaveTypeUsage ?? [];

  const quickActions: QuickAction[] = [
    { label: "Manage Employees", tab: "All Employees", icon: <FaUsers /> },
    { label: "Leave Configuration", tab: "Leave Config", icon: <FaBriefcase /> },
    { label: "Audit Logs", tab: "Audit Log", icon: <FaChartBar /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2 max-w-7xl mx-auto pb-20"
    >
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-1 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">
            ADMIN CONTROL
          </h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">
            System Overview · {user?.name}
          </p>
        </div>
        <button
          onClick={() => onNavigate?.("All Employees")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
        >
          <FaUsers /> All Employees
        </button>
      </div>

      {/* ── ORG OVERVIEW ── */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <FaLayerGroup className="text-indigo-600" size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Organisation Overview
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Employees"
            value={adminData?.totalEmployees ?? 0}
            icon={<FaUsers />}
            accent="border-l-indigo-500"
            onClick={() => onNavigate?.("All Employees")}
          />
          <AdminStatCard
            label="Total Managers"
            value={adminData?.totalManagers ?? 0}
            icon={<FaUserTie />}
            accent="border-l-violet-500"
          />
          <AdminStatCard
            label="Pending Leaves"
            value={adminData?.totalPendingLeaves ?? 0}
            icon={<FaClock />}
            colorClass="text-amber-600"
            accent="border-l-amber-400"
          />
          <AdminStatCard
            label="Approved Leaves"
            value={adminData?.totalApprovedLeaves ?? 0}
            icon={<FaCheckCircle />}
            colorClass="text-emerald-600"
            accent="border-l-emerald-400"
          />
        </div>
      </section>

      {/* ── LEAVE SUMMARY ── */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <FaBriefcase className="text-indigo-600" size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Leave Summary
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminStatCard
            label="Rejected Leaves"
            value={adminData?.totalRejectedLeaves ?? 0}
            icon={<FaTimesCircle />}
            colorClass="text-rose-600"
            accent="border-l-rose-400"
          />
          <AdminStatCard
            label="Carry Forward Balance"
            value={adminData?.totalCarryForwardBalance ?? 0}
            icon={<FaCalendarAlt />}
            colorClass="text-slate-900"
            accent="border-l-slate-400"
          />
          <AdminStatCard
            label="Comp Off Balance"
            value={adminData?.totalCompOffBalance ?? 0}
            icon={<FaWallet />}
            colorClass="text-violet-600"
            accent="border-l-violet-400"
          />
        </div>
      </section>

      {/* ── LEAVE TYPE BREAKDOWN ── */}
      <section className="space-y-4 pt-4" ref={leaveTableRef}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <FaChartBar className="text-indigo-600" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Leave Type Breakdown
            </h3>
          </div>
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">
            {leaveTypes.length} types
          </span>
        </div>

        <div className="hidden md:flex gap-3 px-4 py-2 bg-slate-50 border border-slate-100">
          <div className="min-w-[140px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Leave Type
            </span>
          </div>
          <div className="flex-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Usage
            </span>
          </div>
          <div className="flex gap-6 text-right">
            <div className="w-[70px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Allocated
              </span>
            </div>
            <div className="w-[50px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Used
              </span>
            </div>
            <div className="w-[60px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Balance
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <AnimatePresence>
            {leaveTypes.length > 0 ? (
              leaveTypes.map((leave: LeaveTypeUsage, idx: number) => (
                <LeaveTypeRow
                  key={idx}
                  leaveType={leave.leaveType}
                  totalAllocated={leave.totalAllocated}
                  totalUsed={leave.totalUsed}
                  totalBalance={leave.totalBalance}
                />
              ))
            ) : (
              <div className="py-12 border border-dashed border-slate-200 flex flex-col items-center">
                <FaChartBar size={24} className="text-slate-200 mb-2" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                  No leave data available
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Quick Actions
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action: QuickAction) => (
            <button
              key={action.tab}
              onClick={() => onNavigate?.(action.tab)}
              className="flex items-center justify-between px-5 py-4 bg-white border border-slate-200 hover:border-slate-900 rounded-sm group transition-all shadow-sm active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <span className="text-indigo-500 group-hover:text-indigo-700 transition-colors">
                  {action.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 transition-colors">
                  {action.label}
                </span>
              </div>
              <FaArrowRight
                className="text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-1"
                size={12}
              />
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default AdminDashboardView;