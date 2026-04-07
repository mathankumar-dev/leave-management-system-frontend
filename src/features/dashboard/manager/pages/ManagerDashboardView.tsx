import { useManagerDashboard } from "@/features/dashboard/hooks";
import { ManagerStatCardTeam } from "@/features/dashboard/manager/components";
import type { ManagerDashBoardResponse } from "@/features/dashboard/types";
import { useLeaveAction } from "@/features/leave/hooks/useLeaveActions";
import type { LeaveDecision } from "@/features/leave/types";
import { notify } from "@/features/notification/utils/notifications";
import { useAuth } from "@/shared/auth/useAuth";
import { CommentDialog, CustomLoader, MyFloatingActionButton } from "@/shared/components";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaBriefcaseMedical, FaChartPie, FaPlaneDeparture, FaPlus, FaStethoscope, FaUmbrellaBeach } from "react-icons/fa";

const ManagerDashboardView: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchManagerDashboard, loading: dashboardLoading } = useManagerDashboard();
  const { processApproval } = useLeaveAction();

  const [dashboardData, setDashboardData] = useState<ManagerDashBoardResponse>();
  const [approvals, setApprovals] = useState<any[]>([]);
  const requestsRef = useRef<HTMLDivElement>(null);

  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    req: any;
    status: LeaveDecision | null
  }>({ isOpen: false, req: null, status: null });

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetchManagerDashboard(user.id);
      if (response) {
        setDashboardData(response);
        setApprovals(response.pendingTeamRequests || []);
      }
    } catch (error) {
      console.error("Failed to sync dashboard:", error);
      notify.error("Failed to fetch dashboard data");
    }
  }, [user?.id, fetchManagerDashboard]);

  useEffect(() => {
    if (!authLoading) loadAllData();
  }, [authLoading, loadAllData]);

  const executeDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
    console.log(status);
    
    const success = await processApproval({
      leaveId: req.leaveId,
      approverId: user!.id,
      decision: status,
      comments: commentText
    });

    if (success) {
      notify.leaveAction(status, req.employeeName || req.employee);
      setApprovals((prev) => prev.filter((item) => item.leaveId !== req.leaveId));
      setDashboardData((prev: any) => ({
        ...prev,
        approvedCount: status === 'APPROVED' ? (prev.approvedCount || 0) + 1 : (prev.approvedCount || 0),
      }));
      setDialogConfig({ isOpen: false, req: null, status: null });
    }
  };

  const getLeaveIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t.includes('SICK')) return <FaStethoscope className="text-rose-500" />;
    if (t.includes('ANNUAL')) return <FaUmbrellaBeach className="text-blue-500" />;
    if (t.includes('CASUAL')) return <FaPlaneDeparture className="text-amber-500" />;
    return <FaBriefcaseMedical className="text-indigo-500" />;
  };

  const formatLeaveType = (type?: string) => {
    if (!type) return "General Leave";
    return type.replace(/_/g, " ");
  };

  if (dashboardLoading || authLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Syncing Manager Portal" />
    </div>
  );

  const stats = dashboardData?.personalStats;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-7xl mx-auto pb-20">
      <CommentDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig({ isOpen: false, req: null, status: null })}
        title={dialogConfig.status === 'REJECTED' ? 'Reject Leave Request' : 'Discussion Required'}
        onSubmit={(comment: string) => executeDecision(dialogConfig.req, dialogConfig.status!, comment)}
      />

      {/* HEADER */}
      {/* <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white shadow-2xl shadow-slate-200/50 flex justify-between items-center"> */}
      {/* <div>
          <p className="text-brand font-black uppercase tracking-[0.3em] text-[10px] mb-1">
            {user?.role.replace('_', ' ')} Terminal
          </p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, <span className="text-slate-500 font-bold">{user?.name?.split(' ')[0]}</span>
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate?.("Team Calendar")}
          className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand/20 transition-all"
        >
          <FaCalendarAlt /> Team Calendar
        </motion.button>*/}
      {/* </div>  */}

      {/* MONTHLY HIGHLIGHTS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MonthlyCard
          label="Monthly Annual"
          val={stats?.monthlyAnnualBalance || 0}
          sub={`Used ${stats?.monthlyAnnualUsed || 0} of ${stats?.monthlyAnnualAllocated || 0}`}
          color="bg-blue-600"
        />
        <MonthlyCard
          label="Monthly Sick"
          val={stats?.monthlySickBalance || 0}
          sub={`Used ${stats?.monthlySickUsed || 0} of ${stats?.monthlySickAllocated || 0}`}
          color="bg-rose-500"
        />
        <div className="bg-gray-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Monthly Balance</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black">{stats?.monthlyTotalBalance || 0}</h2>
            <span className="text-sm font-bold text-gray-400">Days Remaining</span>
          </div>
        </div>
      </section>

      {/* STRIPED FLOATING ROW TABLE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FaChartPie size={14} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
            Personal Leave Inventory
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 bg-brand/10 border-b border-gray-200 text-[14px] font-bold text-black tracking-wider">
            <div className="col-span-4">Leave Category</div>
            <div className="col-span-2 text-center">Allocated (Y)</div>
            <div className="col-span-2 text-center">Used</div>
            <div className="col-span-2 text-center">Balance</div>
            <div className="col-span-2 text-right pr-4">Pending</div>
          </div>

          <div className="divide-y divide-gray-100">
            {stats?.breakdown.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ backgroundColor: "#F3F4F6" }}
                className={`grid grid-cols-12 items-center px-6 py-4 transition-colors cursor-pointer group ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
              >
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm shadow-sm">
                    {getLeaveIcon(item.leaveTypeName)}
                  </div>
                  <span className="font-semibold text-gray-700 text-sm uppercase tracking-tight">
                    {formatLeaveType(item.leaveTypeName)}
                  </span>
                </div>
                <div className="col-span-2 text-center text-sm text-gray-600 font-medium">{item.allocatedDays}d</div>
                <div className="col-span-2 text-center text-sm font-semibold text-gray-700">{item.usedDays}d</div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-bold text-blue-600">{item.remainingDays}</span>
                </div>
                <div className="col-span-2 flex justify-end items-center pr-4">
                  <span className="text-gray-300 text-xs">—</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM GOVERNANCE CARDS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-brand rounded-full" /> Team Intelligence
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <ManagerStatCardTeam label="Direct Reports" value={dashboardData?.teamSize || 0} iconType="team" onClick={() => onNavigate?.("Team Members")} />
          <ManagerStatCardTeam label="Pending" value={approvals.length} iconType="pending" colorClass="text-amber-600" onClick={() => requestsRef.current?.scrollIntoView({ behavior: 'smooth' })} />
          <ManagerStatCardTeam label="Away Today" value={dashboardData?.teamOnLeaveCount || 0} iconType="calendar" colorClass="text-indigo-600" />
          <ManagerStatCardTeam label="Approved YTD" value={dashboardData?.personalStats.approvedCount || 0} iconType="processed" colorClass="text-emerald-600" />
        </div>
      </section>

      {/* PENDING ACTIONS */}
      <section ref={requestsRef} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Pending Governance Decisions</h3>
        </div>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {approvals.length > 0 ? (
              approvals.map((req) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={req.leaveId}
                  className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-slate-100"
                >
                  <div className="w-14 h-14 bg-brand rounded-2xl text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand/20">
                    {(req.employeeName || "E").charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm text-slate-800 uppercase tracking-tight">{req.employeeName}</p>
                    <p className="text-[10px] text-brand font-black uppercase tracking-widest">{formatLeaveType(req.leaveType)}</p>
                  </div>
                  <div className="flex-2 bg-slate-50/50 p-4 rounded-2xl text-xs text-slate-500 font-medium italic border border-slate-100">
                    "{req.reason || "Operational requirement not specified."}"
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setDialogConfig({ isOpen: true, req, status: 'REJECTED' })} className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all">Deny</button>
                    <button onClick={() => executeDecision(req, 'APPROVED')} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand transition-all shadow-lg">Approve</button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 bg-white/40 backdrop-blur-sm border border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Governance Clear</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <MyFloatingActionButton icon={<FaPlus />} onClick={() => onNavigate?.("Request center")} title="New Request" />
    </motion.div>
  );
};

// --- Sub-components ---

const MonthlyCard = ({ label, val, sub, color }: any) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
    <div className="flex justify-between items-end mt-2">
      <h3 className="text-3xl font-black text-gray-900">{val} <span className="text-xs font-bold text-gray-400">Days</span></h3>
      <p className="text-[10px] font-bold text-gray-400 mb-1">{sub}</p>
    </div>
    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: '65%' }} />
    </div>
  </div>
);

export default ManagerDashboardView;