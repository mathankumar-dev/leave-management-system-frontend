import DashboardDrawer from "@/features/dashboard/components/DashBoardDrawer";
import { useManagerDashboard, useTeamLeaderDashboard } from "@/features/dashboard/hooks";
import { ManagerStatCardTeam } from "@/features/dashboard/manager/components";
import type { ManagerDashBoardResponse } from "@/features/dashboard/types";
import { useLeaveAction } from "@/features/leave/hooks/useLeaveActions";
import type { LeaveDecision } from "@/features/leave/types";
import { notify } from "@/features/notification/utils/notifications";
import { useAuth } from "@/shared/auth/useAuth";
import { CommentDialog, CustomLoader, MyFloatingActionButton } from "@/shared/components";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaChartPie, FaPlus } from "react-icons/fa";

const ManagerDashboardView: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { fetchManagerDashboard, loading: dashboardLoading } = useManagerDashboard();
  const { fetchTeamLeaderDashboard } = useTeamLeaderDashboard();

  const { processApproval } = useLeaveAction();


  const [dashboardData, setDashboardData] = useState<ManagerDashBoardResponse>();
  const [approvals, setApprovals] = useState<any[]>([]);
  const attendanceRef = useRef<HTMLDivElement>(null);
  const requestsRef = useRef<HTMLDivElement>(null);

  const [drawerConfig, setDrawerConfig] = useState<{
    isOpen: boolean;
    type: 'PERSONAL' | 'TEAM' | null;
  }>({ isOpen: false, type: null });

  let UserRole = user?.role.toString();
  if (user?.role === "TEAM_LEADER") {
    UserRole = "TEAM LEADER";
  }

  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    req: any;
    status: LeaveDecision | null
  }>({ isOpen: false, req: null, status: null });


  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {

      const response = user.role === "TEAM_LEADER"
        ? await fetchManagerDashboard(user.id)
        : await fetchManagerDashboard(user.id);

      if (response) {
        setDashboardData(response);
        setApprovals(response.pendingTeamRequests || []);
      }
    } catch (error) {
      console.error("Failed to sync dashboard:", error);
      notify.error("Failed to fetch dashboard data");
    }
  }, [user?.id, user?.role, fetchManagerDashboard, fetchTeamLeaderDashboard]);

  useEffect(() => {
    if (!authLoading) loadAllData();
  }, [authLoading, loadAllData]);

  const executeDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
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


  const formatLeaveType = (type?: string) => {
    if (!type) return "General Leave";
    return type.replace(/_/g, " ");
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


      <DashboardDrawer
        isOpen={drawerConfig.isOpen}
        onClose={() => setDrawerConfig({ isOpen: false, type: null })}
        title={drawerConfig.type === 'PERSONAL' ? 'My Leave Ledger' : 'Team Governance Details'}
        subtitle={drawerConfig.type === 'PERSONAL' ? user?.name || '' : 'Direct Reports Overview'}
      >
        {drawerConfig.type === 'PERSONAL' ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 text-white rounded-sm   ">
              <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Status: Active</p>
              <p className="text-xs font-bold">You have {dashboardData?.personalStats.yearlyBalance} days remaining in your annual quota.</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-slate-400 border-b pb-2 tracking-widest">Balance Breakdown</h4>
              <div className="grid grid-cols-1 gap-3">
                {/* Reusing StatCard visual logic manually for drawer consistency */}
                {dashboardData?.personalStats.breakdown.map((item) => (
                  <div
                    key={item.leaveType}
                    className="flex flex-col gap-2 p-4 border-2 border-slate-100 hover:border-slate-200 transition-all bg-white"
                  >
                    {/* Leave Type Title */}
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      {item.leaveType.replace('_', ' ')}
                    </span>

                    <div className="flex justify-between items-end">
                      {/* Left Side: Used / Total */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Used / Total
                        </span>
                        <span className="text-lg font-black   text-slate-900">
                          {item.usedDays}
                          <span className="text-slate-300 font-medium mx-1">/</span>
                          {item.allocatedDays}
                        </span>
                      </div>

                      {/* Right Side: Remaining */}
                      <div className="text-right flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Remaining
                        </span>
                        <span className={`text-lg font-black   ${item.remainingDays <= 1 ? 'text-red-500' : 'text-indigo-600'}`}>
                          {item.remainingDays}
                        </span>
                      </div>
                    </div>
                    {item.halfDayCount > 0 && (
                      <span className="text-[9px] font-bold text-slate-400">
                        Includes {item.halfDayCount} half-day{item.halfDayCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center p-4 border-2 border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400">Comp-Off Bank</span>
                  <span className="text-lg font-black  ">{dashboardData?.personalStats.compoffBalance || 0}d</span>
                </div>
                <div className="flex justify-between items-center p-4 border-2 border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400">Carry Forward</span>
                  <span className="text-lg font-black  ">{dashboardData?.personalStats.carryForwardRemaining || 0}d</span>
                </div>
                <div className="flex flex-col gap-2 p-4 border-2 border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Monthly Stats</span>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Used / Total</span>
                      <span className="text-lg font-black   text-slate-900">
                        {dashboardData?.personalStats.monthlyAnnualUsed}d <span className="text-slate-300 font-medium">/</span> {dashboardData?.personalStats.monthlyAnnualAllocated}d
                      </span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Remaining</span>
                      <span className="text-lg font-black   text-indigo-600">
                        {dashboardData?.personalStats.monthlyAnnualBalance || 0}d
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4 border-2 border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Yearly Stats</span>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Used / Total</span>
                      <span className="text-lg font-black   text-slate-900">
                        {dashboardData?.personalStats.yearlyUsed}d <span className="text-slate-300 font-medium">/</span> {dashboardData?.personalStats.yearlyAllocated}d
                      </span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Remaining</span>
                      <span className="text-lg font-black   text-indigo-600">
                        {dashboardData?.personalStats.yearlyBalance || 0}d
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 border-2 border-slate-100 bg-rose-50">
                  <span className="text-[10px] font-black uppercase text-rose-400">Loss of Pay (%)</span>
                  <span className="text-lg font-black   text-rose-600">{dashboardData?.personalStats.lossOfPayPercentage || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 border-2 border-slate-900  bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Managed Reports</p>
              <p className="text-3xl font-black   tracking-tighter">{dashboardData?.teamSize} Members</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-slate-400 border-b pb-2 tracking-widest">Team Performance</h4>
              <div className="flex justify-between p-4 border border-slate-200">
                <span className="text-[10px] font-black uppercase">Approved this year</span>
                <span className="text-sm font-black   text-emerald-600">{dashboardData?.personalStats.approvedCount!}</span>
              </div>
              <div className="flex justify-between p-4 border border-slate-200">
                <span className="text-[10px] font-black uppercase">Rejected this year</span>
                <span className="text-sm font-black   text-rose-600">{dashboardData?.personalStats.rejectedCount}</span>
              </div>
            </div>
          </div>
        )}
      </DashboardDrawer >
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white shadow-2xl shadow-slate-200/50 flex justify-between items-center">
        <div>
          <p className="text-brand font-black uppercase tracking-[0.3em] text-[10px] mb-1">
            {UserRole} Terminal
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
        </motion.button>
      </div>

      {/* LEAVE CREDITS TABLE: Glass Style */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FaChartPie size={14} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
              Personal Leave Inventory
            </h3>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-white rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Allocated</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dashboardData?.personalStats.breakdown.map((leave, index) => (
                <tr key={index} className="hover:bg-white/60 transition-colors">
                  <td className="px-8 py-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                      {formatLeaveType(leave.leaveType)}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-medium text-slate-400">{leave.allocatedDays}d</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${(leave.allocatedDays - leave.usedDays) <= 1 ? 'bg-rose-50 text-rose-600' : 'bg-brand/10 text-brand'
                      }`}>
                      {leave.allocatedDays - leave.usedDays} Days Left
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TEAM GOVERNANCE: Identity Cards */}
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

      {/* ACTION REQUIRED: Glassmorphic Cards */}
      <section ref={requestsRef} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Pending Governance Decisions</h3>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {approvals.length > 0 ? (
              approvals.slice(0, 3).map((req) => (
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
                {/* <EmptyStateSVG className="w-32 h-32 opacity-20 mb-4" /> */}
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Governance Clear</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {!drawerConfig.isOpen && (
        <MyFloatingActionButton icon={<FaPlus />} onClick={() => onNavigate?.("Request center")} title="New Request" />
      )}
    </motion.div>
  );
};

export default ManagerDashboardView;