import EmptyStateSVG from "@/assets/svg/EmpthyStateSVG";
import DashboardDrawer from "@/features/dashboard/components/DashBoardDrawer";
import { useManagerDashboard, useTeamLeaderDashboard } from "@/features/dashboard/hooks";
import { ManagerStatCardTeam } from "@/features/dashboard/manager/components";
import type { ManagerDashBoardResponse } from "@/features/dashboard/types";
import { useLeaveAction } from "@/features/leave/hooks/useLeaveActions";
import type { LeaveDecision } from "@/features/leave/types";        
import { notify } from "@/features/notification/utils/notifications";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader, CommentDialog, MyFloatingActionButton } from "@/shared/components";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { FaCalendarAlt, FaChartPie, FaUserShield, FaArrowRight, FaCommentDots, FaPlus } from "react-icons/fa";

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
      approverId: Number(user?.id),
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

                <div className="flex justify-between items-center p-4 border-2 border-slate-100 bg-rose-50 border-rose-100">
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
      <div className="flex justify-between items-center border-b border-slate-200 pb-1 gap-4">
        <div>
          <h2 className="text-2xl font-black  text-slate-900 uppercase  ">WELCOME BACK</h2>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">{UserRole}: {user?.name}</p>
        </div>
        <button
          onClick={() => onNavigate?.("Team Calendar")}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
        >
          <FaCalendarAlt /> Team Calendar
        </button>
      </div>

      <section className="space-y-4 pt-4">
        {/* Header Area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartPie className="text-indigo-600" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              My Leave Credits
            </h3>
          </div>
          <button
            onClick={() => setDrawerConfig({ isOpen: true, type: 'PERSONAL' })}
            className="text-[9px] font-black uppercase text-indigo-600 hover:underline tracking-widest"
          >
            View Details
          </button>
        </div>

        {/* Table Container */}
        <div className="w-full bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Leave Category
                </th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Allocated
                </th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Used
                </th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                  Balance
                </th>
                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                  Pending
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {dashboardData?.personalStats.breakdown.map((leave, index) => {
                const balance = leave.allocatedDays - leave.usedDays;

                return (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                        {leave.leaveType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-400">
                        {leave.allocatedDays} 
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-700">
                        {leave.usedDays} 
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black ${balance <= 2 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                        {balance} 
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-bold text-indigo-600">
                        {leave.pendingCount! > 0 ? leave.pendingCount : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Highlighted Monthly Quota Row */}
              <tr className="bg-indigo-50/30 border-t border-indigo-100">
                <td className="px-6 py-4">
                  <span className="text-[10px] font-black text-indigo-600 uppercase">
                    Current Month Quota
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-indigo-400 font-medium">
                  {dashboardData?.personalStats.monthlyAnnualAllocated!} 
                </td>
                <td className="px-6 py-4 text-xs text-indigo-900 font-bold">
                  {dashboardData?.personalStats.monthlyAnnualUsed} 
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs font-black text-indigo-700">
                    {dashboardData?.personalStats.monthlyAnnualAllocated! - dashboardData?.personalStats.monthlyAnnualUsed!} 
                  </span>
                </td>
                <td className="px-6 py-4 text-right">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaUserShield className="text-indigo-600" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Team Governance</h3>
          </div>
          <button
            onClick={() => setDrawerConfig({ isOpen: true, type: 'TEAM' })}
            className="text-[9px] font-black uppercase text-indigo-600 hover:underline tracking-widest"
          >
            View Details
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ManagerStatCardTeam label="Direct Reports" value={dashboardData?.teamSize || 0} iconType="team" onClick={() => onNavigate?.("Team Members")} />
          <ManagerStatCardTeam label="Pending Approval Req." value={approvals.length} iconType="pending" colorClass="text-amber-600" onClick={() => requestsRef.current?.scrollIntoView({ behavior: 'smooth' })} />
          <ManagerStatCardTeam label="Away Today" value={dashboardData?.teamOnLeaveCount || 0} iconType="calendar" colorClass="text-indigo-600" onClick={() => attendanceRef.current?.scrollIntoView({ behavior: 'smooth' })} />
          <ManagerStatCardTeam label="Approved YTD" value={dashboardData?.personalStats.approvedCount || 0} iconType="processed" colorClass="text-emerald-600" />
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

        <div ref={requestsRef} className="space-y-3">
          <AnimatePresence mode="popLayout">
            {approvals.length > 0 ? (
              approvals.slice(0, 3).map((req) => (
                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={req.leaveId} className="bg-white border border-slate-200 rounded-sm p-4 flex flex-col md:flex-row md:items-center gap-4 hover:border-slate-900 transition-all">
                  <div className="flex items-center gap-3 min-w-50">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-sm flex items-center justify-center font-black text-xs ">
                      {(req.employeeName || "E").charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-xs text-slate-900 uppercase ">{req.employeeName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase  ">{req.leaveType}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-2 border border-slate-100 rounded-sm   text-[10px] text-slate-600 flex items-center gap-2">
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
              <div className="py-16 border border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                <EmptyStateSVG />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">All caught up</p>
                <p className="text-[9px] font-bold uppercase text-slate-300 mt-1">No pending requests to process</p>
              </div>
            )}
          </AnimatePresence>

          <section ref={attendanceRef} className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-600" size={14} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Attendance Overview
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData?.teamOnLeaveToday?.length! > 0 ? (
                dashboardData?.teamOnLeaveToday.map((emp: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between group relative overflow-hidden transition-all hover:border-slate-900">
                    <div className="relative z-10">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500">
                        {emp.leaveType}
                      </p>
                      <p className="text-xl font-black text-slate-900 tracking-tight   transition-transform group-hover:-translate-y-0.5 uppercase">
                        {emp.employeeName}
                      </p>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase mt-1  ">
                        Currently Away
                      </p>
                    </div>
                    <div className="text-slate-100 group-hover:text-slate-200 transition-all duration-300 text-3xl absolute right-4 opacity-40">
                      <FaCalendarAlt />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 border border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20 mb-4">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Full Attendance Today</p>
                  <p className="text-[9px] font-bold uppercase text-slate-300 mt-1">No one is on leave today</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {
        !drawerConfig.isOpen &&
        <MyFloatingActionButton icon={<FaPlus />} onClick={() => onNavigate?.("Request center")} title="New Request" />}
    </motion.div>
  );
};

export default ManagerDashboardView;