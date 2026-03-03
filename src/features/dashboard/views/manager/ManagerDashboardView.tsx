import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck, FaClock, FaCalendarAlt,
  FaUsers, FaCheckDouble,
  FaCommentDots, FaArrowRight
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../../auth/hooks/useAuth";
import CustomLoader from "../../../../components/ui/CustomLoader";
import type { LeaveDecision, LeaveDecisionRequest } from "../../types";
import { notify } from "../../../../utils/notifications"; 
import CommentDialog from "../../../../components/ui/CommentDialog";

interface ManagerDashboardViewProps {
  onNavigate?: (tab: string) => void;
}

const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({ onNavigate }) => {
  const { user, isLoading } = useAuth();
  const { fetchManagerDashboard, processApproval, loading } = useDashboard();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [approvals, setApprovals] = useState<any[]>([]);

  // Dialog State
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    req: any;
    status: LeaveDecision | null;
  }>({ isOpen: false, req: null, status: null });

  useEffect(() => {
    if (isLoading) return;
    if (!user?.id) return;

    fetchManagerDashboard(user.id).then((data) => {
      if (data) {
        setDashboardData(data);
        setApprovals(data.pendingTeamRequests || []);
      }
    });
  }, [user, isLoading, fetchManagerDashboard]);

  // Step 1: Logic to decide if we need a dialog
  const handleAction = (req: any, status: LeaveDecision) => {
    if (!user?.id) {
      notify.error("Auth Error", "Manager ID not found.");
      return;
    }

    if (status === 'REJECTED' || status === 'MEETING_REQUIRED') {
      setDialogConfig({ isOpen: true, req, status });
      return;
    }

    executeDecision(req, status);
  };

  const executeDecision = async (req: any, status: LeaveDecision, commentText?: string) => {
    const decisionPayload: LeaveDecisionRequest = {
      leaveId: req.leaveId,
      managerId: Number(user?.id),
      decision: status,
      comments: commentText
    };

    const success = await processApproval(decisionPayload);

    if (success) {
      notify.leaveAction(status, req.employeeName || req.employee);

      setApprovals((prev) => prev.filter((item) => item.leaveId !== req.leaveId));
      setDashboardData((prev: any) => ({
        ...prev,
        teamPendingRequestCount: Math.max(0, prev.teamPendingRequestCount - 1),
        approvedCount: status === 'APPROVED' ? prev.approvedCount + 1 : prev.approvedCount,
        rejectedCount: status === 'REJECTED' ? prev.rejectedCount + 1 : prev.rejectedCount,
      }));

      setDialogConfig({ isOpen: false, req: null, status: null });
    } else {
      notify.error("Update Failed", "Please try again later.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Loading Dashboard" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-7xl mx-auto text-slate-900"
    >
      <CommentDialog
        isOpen={dialogConfig.isOpen}
        onClose={() => setDialogConfig({ isOpen: false, req: null, status: null })}
        title={dialogConfig.status === 'REJECTED' ? 'Reject Leave Request' : 'Discussion Required'}
        placeholder={`Provide context for ${dialogConfig.req?.employeeName || 'this employee'}...`}
        confirmLabel={dialogConfig.status === 'REJECTED' ? 'Confirm Rejection' : 'Confirm Discussion'}
        onSubmit={(comment: string) => executeDecision(dialogConfig.req, dialogConfig.status!, comment)}
      />

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Manager Dashboard</h2>
            <p className="text-sm text-slate-500">Welcome back, {user?.name || "Manager"}</p>
          </div>

          {/* NEW BUTTON ADDED HERE */}
          {onNavigate && (
            <button
              onClick={() => onNavigate("Team Calendar")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
            >
              <FaCalendarAlt className="text-indigo-600" />
              View Team Calendar
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Team Size", value: dashboardData?.teamSize || 0, icon: <FaUsers />, color: "text-blue-600" },
            { label: "Pending Requests", value: dashboardData?.teamPendingRequestCount || 0, icon: <FaClock />, color: "text-amber-600" },
            { label: "On Leave Today", value: dashboardData?.teamOnLeaveCount || 0, icon: <FaCalendarAlt />, color: "text-indigo-600" },
            { label: "Approved", value: dashboardData?.approvedCount || 0, icon: <FaCheck />, color: "text-emerald-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-slate-50 ${stat.color} opacity-80`}>{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 space-y-4">
            
            {/* Action Required Header with View All Button */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action Required ({approvals.length})
                </h3>
              </div>
              
              {onNavigate && (
                <button 
                  onClick={() => onNavigate("Pending Approvals")}
                  className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-all group"
                >
                  View All Requests 
                  <FaArrowRight className="text-[8px] group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {approvals.length > 0 ? (
                  approvals.map((req) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={req.leaveId}
                      className="group bg-white border border-slate-200 rounded-md p-4 hover:border-indigo-400 transition-all shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                            {(req.employeeName || req.employee || "E").charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm">{req.employeeName || req.employee}</p>
                            <p className="text-[10px] text-slate-500 font-medium">ID: {req.employeeId}</p>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span className="font-bold text-indigo-600">{req.leaveType || req.type}</span>
                            <span>•</span>
                            <span>{req.numberOfDays || req.days} days requested</span>
                          </div>
                          {req.reason && (
                            <div className="mt-2 flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                              <FaCommentDots className="text-slate-400 mt-0.5 shrink-0" />
                              <p className="text-[11px] italic text-slate-600">"{req.reason}"</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                          <button
                            onClick={() => handleAction(req, 'REJECTED')}
                            className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all text-xs font-bold"
                          >
                            Deny
                          </button>
                          <button
                            onClick={() => handleAction(req, 'MEETING_REQUIRED')}
                            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded hover:bg-indigo-50 hover:text-indigo-700 transition-all text-xs font-bold"
                          >
                            Discuss
                          </button>
                          <button
                            onClick={() => handleAction(req, 'APPROVED')}
                            className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 text-white rounded hover:bg-indigo-600 transition-all text-xs font-bold shadow-sm"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-md flex flex-col items-center justify-center text-slate-400">
                    <FaCheckDouble className="mb-2 opacity-20" size={24} />
                    <p className="text-xs font-bold uppercase tracking-widest">Everything Caught Up</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerDashboardView;