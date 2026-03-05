import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt, FaCommentDots, FaArrowRight,
  FaPlus, FaUserShield, FaChartPie, FaCheckDouble
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../../auth/hooks/useAuth";
import CustomLoader from "../../../../components/ui/CustomLoader";
import type { LeaveDecision } from "../../types";
import { notify } from "../../../../utils/notifications";
import CommentDialog from "../../../../components/ui/CommentDialog";
import MyFloatingActionButton from "../../../../components/ui/MyFloatingActionButton";
import ManagerStatCard from "../../components/ManagerStatCard";

const MergedManagerDashboard: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchManagerDashboard, fetchDashboard, processApproval, loading: dashboardLoading } = useDashboard();

  const [managerData, setManagerData] = useState<any>(null);
  const [personalData, setPersonalData] = useState<any>(null);
  const [approvals, setApprovals] = useState<any[]>([]);

  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    req: any;
    status: LeaveDecision | null
  }>({ isOpen: false, req: null, status: null });

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;
    const [mngData, persData] = await Promise.all([
      fetchManagerDashboard(user.id),
      fetchDashboard(user.id)
    ]);
    if (mngData) {
      setManagerData(mngData);
      setApprovals(mngData.pendingTeamRequests || []);
    }
    if (persData) setPersonalData(persData);
  }, [user?.id, fetchManagerDashboard, fetchDashboard]);

  useEffect(() => {
    if (!authLoading) loadAllData();
  }, [authLoading, loadAllData]);

  const executeDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
    const success = await processApproval({
      leaveId: req.leaveId,
      managerId: Number(user?.id),
      decision: status,
      comments: commentText
    });

    if (success) {
      notify.leaveAction(status, req.employeeName || req.employee);
      setApprovals((prev) => prev.filter((item) => item.leaveId !== req.leaveId));
      setManagerData((prev: any) => ({
        ...prev,
        approvedCount: status === 'APPROVED' ? prev.approvedCount + 1 : prev.approvedCount,
      }));
      setDialogConfig({ isOpen: false, req: null, status: null });
    }
  };

  if (dashboardLoading || authLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Syncing Manager Portal" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 max-w-7xl mx-auto pb-20">
      <CommentDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig({ isOpen: false, req: null, status: null })}
        title={dialogConfig.status === 'REJECTED' ? 'Reject Leave Request' : 'Discussion Required'}
        onSubmit={(comment: string) => executeDecision(dialogConfig.req, dialogConfig.status!, comment)}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-1 gap-4">
        <div>
          <h2 className="text-2xl font-black  text-slate-900 uppercase italic">WELCOME BACK</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Manager: {user?.name}</p>
        </div>
        <button
          onClick={() => onNavigate?.("Team Calendar")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
        >
          <FaCalendarAlt /> Team Calendar
        </button>
      </div>

      {/* MY LEAVE CREDITS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FaChartPie className="text-indigo-600" size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">My Leave Credits</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ManagerStatCard
            label="Yearly Balance"
            value={(personalData?.yearlyAllocated - personalData?.yearlyUsed) || 0}
            iconType="leave"
          />
          <ManagerStatCard
            label="Monthly Balance"
            value={(personalData?.monthlyAllocated - personalData?.monthlyUsed) || 0}
            iconType="calendar"
          />
          <ManagerStatCard
            label="My Pending"
            value={personalData?.pendingCount || 0}
            iconType="pending"
            colorClass="text-amber-600"
          />
        </div>
      </section>

      {/* TEAM GOVERNANCE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FaUserShield className="text-indigo-600" size={14} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Team Governance</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ManagerStatCard label="Direct Reports" value={managerData?.teamSize || 0} iconType="team" />
          <ManagerStatCard label="Approval Req." value={approvals.length} iconType="pending" colorClass="text-amber-600" />
          <ManagerStatCard label="Away Today" value={managerData?.teamOnLeaveCount || 0} iconType="calendar" colorClass="text-indigo-600" />
          <ManagerStatCard label="Processed" value={managerData?.approvedCount || 0} iconType="processed" colorClass="text-emerald-600" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Action Required</h3>
          </div>
          <button onClick={() => onNavigate?.("Pending Approvals")} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
            Manage All <FaArrowRight className="inline ml-1" />
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {approvals.length > 0 ? (
              approvals.slice(0, 3).map((req) => (
                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={req.leaveId} className="bg-white border border-slate-200 rounded-sm p-4 flex flex-col md:flex-row md:items-center gap-4 hover:border-slate-900 transition-all">
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-sm flex items-center justify-center font-black text-xs ">
                      {(req.employeeName || "E").charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-xs text-slate-900 uppercase ">{req.employeeName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase italic">{req.leaveType}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-2 border border-slate-100 rounded-sm italic text-[10px] text-slate-600 flex items-center gap-2">
                    <FaCommentDots className="text-slate-300" /> "{req.reason || "No reason provided."}"
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setDialogConfig({ isOpen: true, req, status: 'MEETING_REQUIRED' })} className="px-4 py-2 border border-slate-200 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-orange-100 hover:text-rose-600 transition-all">Discuss</button>
                    <button onClick={() => setDialogConfig({ isOpen: true, req, status: 'REJECTED' })} className="px-4 py-2 border border-slate-200 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all">Deny</button>
                    <button onClick={() => executeDecision(req, 'APPROVED')} className="px-4 py-2 bg-slate-900 text-white rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[2px_2px_0px_0px_rgba(79,70,229,0.3)]">Approve</button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-300">
                <FaCheckDouble size={24} className="mb-2 opacity-20" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">All caught up</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <MyFloatingActionButton icon={<FaPlus />} onClick={() => onNavigate?.("Apply Leave")} title="Apply Leave" />
    </motion.div>
  );
};

export default MergedManagerDashboard;