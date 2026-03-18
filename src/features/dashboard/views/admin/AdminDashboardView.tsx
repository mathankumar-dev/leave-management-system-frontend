import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt, FaUserShield, FaChartPie, FaPlus,
  FaUsers, FaUserCheck, FaExclamationTriangle, FaHistory
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../../auth/hooks/useAuth";
import CustomLoader from "../../../../components/ui/CustomLoader";
import { notify } from "../../../../utils/notifications";
import MyFloatingActionButton from "../../../../components/ui/MyFloatingActionButton";
import ManagerStatCardTeam from "../../components/ManagerStatCardTeam";
import DashboardDrawer from "../../components/DashBoardDrawer";
import type { AdminDashBoardResponse } from "../../types";

const AdminDashboardView: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchAdminDashboard, loading: dashboardLoading } = useDashboard();

  const [dashboardData, setDashboardData] = useState<AdminDashBoardResponse>();
  const [drawerConfig, setDrawerConfig] = useState<{
    isOpen: boolean;
    type: 'PERSONAL' | 'SYSTEM' | null;
  }>({ isOpen: false, type: null });

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetchAdminDashboard(user.id);
      if (response) {
        setDashboardData(response);
      }
    } catch (error) {
      console.error("Failed to sync Admin dashboard:", error);
      notify.error("Failed to fetch administrative data");
    }
  }, [user?.id, fetchAdminDashboard]);

  useEffect(() => {
    if (!authLoading) loadAllData();
  }, [authLoading, loadAllData]);

  if (dashboardLoading || authLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Syncing Admin Control Panel" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto pb-20">

      <DashboardDrawer
        isOpen={drawerConfig.isOpen}
        onClose={() => setDrawerConfig({ isOpen: false, type: null })}
        title={drawerConfig.type === 'PERSONAL' ? 'Admin Personal Ledger' : 'System Compliance Audit'}
        subtitle={drawerConfig.type === 'PERSONAL' ? user?.name || '' : `Year ${dashboardData?.currentYear}`}
      >
        {/* Reusing your Personal Stats logic from Manager View */}
        {drawerConfig.type === 'PERSONAL' ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 text-white rounded-sm italic">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Admin Access</p>
              <p className="text-xs font-bold">Your Balance: {dashboardData?.personalStats.yearlyBalance} days</p>
            </div>
            {/* Add your table or breakdown list here similar to manager view */}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 border-2 border-red-500 bg-red-50">
              <p className="text-[10px] font-black uppercase text-red-400 mb-1">Critical Issues</p>
              <p className="text-3xl font-black italic tracking-tighter text-red-600">
                {dashboardData?.complianceIssues?.length || 0} Alerts
              </p>
            </div>
            {/* Compliance List mapping */}
          </div>
        )}
      </DashboardDrawer>

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-2 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">ADMIN CONSOLE</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Global Oversight: {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate?.("User Management")} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
            <FaUsers /> Employees
          </button>
        </div>
      </div>
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartPie className="text-indigo-600" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">My Personal Credits</h3>
          </div>
          <button onClick={() => setDrawerConfig({ isOpen: true, type: 'PERSONAL' })} className="text-[9px] font-black uppercase text-indigo-600 hover:underline tracking-widest">
            Detailed Ledger
          </button>
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-800 text-white">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Allocated</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Used</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Balance</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardData?.personalStats.breakdown.map((leave, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-xs uppercase text-slate-900">{leave.leaveType.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{leave.allocatedDays}d</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{leave.usedDays}d</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-black">
                      {leave.remainingDays} Left
                    </span>
                  </td>
                </tr>

              ))}
              {/* MONTHLY STATS ROW (SPECIAL HIGHLIGHT) */}
              <tr className="bg-indigo-50/30">
                <td className="px-6 py-4">
                  <span className="text-xs font-black text-indigo-600 uppercase italic">Monthly Quota</span>
                </td>
                <td className="px-6 py-4 text-slate-400">{dashboardData?.personalStats.monthlyAllocated} Days</td>
                <td className="px-6 py-4 font-bold text-slate-700">{dashboardData?.personalStats.monthlyUsed} Days</td>
                {/* <td className="px-6 py-4 font-bold text-slate-700">{dashboardData?.personalStats.monthlyBalance} Days</td> */}

                {/* <td className="px-6 py-4">
                 
                  {/* <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Current Period</span> 
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-black text-indigo-700">
                    {dashboardData?.personalStats.monthlyAllocated! - dashboardData?.personalStats.monthlyUsed!}
                  </span>
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SYSTEM OVERVIEW STATS */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <FaUserShield className="text-red-600" size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Organization Health</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ManagerStatCardTeam label="Total Workforce" value={dashboardData?.totalEmployees || 0} iconType="team" onClick={() => onNavigate?.("Employee Directory")} />
          <ManagerStatCardTeam label="Pending Onboarding" value={dashboardData?.newEmployeesPendingOnboarding || 0} iconType="pending" colorClass="text-blue-600" />
          <ManagerStatCardTeam label="Global Pending Leaves" value={dashboardData?.totalPendingLeaves || 0} iconType="calendar" colorClass="text-amber-600" onClick={() => onNavigate?.("All Requests")} />
          <ManagerStatCardTeam label="AVG LOP (%)" value={dashboardData?.averageLossOfPayPercentage?.toFixed(1) || 0} iconType="processed" colorClass="text-rose-600" />
        </div>
      </section>

      {/* PERSONAL LEAVE CREDITS (ADMIN AS EMPLOYEE) */}


      {/* RECENT SYSTEM ACTIVITY / REJECTIONS */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <FaHistory className="text-slate-400" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Recent Audit Logs (Rejections)</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {dashboardData?.recentRejections && dashboardData.recentRejections.length > 0 ? (
            dashboardData.recentRejections.slice(0, 5).map((log) => (
              <div key={log.leaveId} className="bg-white border border-slate-200 p-4 rounded-sm flex justify-between items-center group hover:border-red-200">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase">{log.employeeName}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">{log.leaveType} • Rejected by {log.rejectedByName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-red-500 italic">"{log.reason}"</p>
                  <p className="text-[8px] text-slate-300 uppercase mt-1">{new Date(log.rejectedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 border border-dashed border-slate-200 rounded-sm text-center">
              <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">No recent rejection audits</p>
            </div>
          )}
        </div>
      </section>

      {!drawerConfig.isOpen && (
        <MyFloatingActionButton icon={<FaPlus />} onClick={() => onNavigate?.("Request center")} title="New Request" />
      )}
    </motion.div>
  );
};

export default AdminDashboardView;