import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck, FaClock, FaCalendarAlt,
  FaUsers, FaCheckDouble,
  FaCommentDots, FaLayerGroup} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../../auth/hooks/useAuth";

const ManagerDashboardView: React.FC = () => {


  const { user } = useAuth();

  const userId = user?.id;
  const { fetchManagerDashboard, processApproval, loading } = useDashboard();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    if (userId) {

      fetchManagerDashboard(userId).then((data) => {
        if (data) {
          console.log(data.pendingTeamRequests);
          setDashboardData(data);
          setApprovals(data.pendingTeamRequests || []);
        }
      });
    }
  }, [userId, fetchManagerDashboard]);

  const handleAction = async (id: number, status: "Approved" | "Rejected") => {
    let comment: string | null = null;

    // 1. Handle Rejection Logic
    if (status === "Rejected") {
      comment = prompt("Mandatory: Please provide a reason for rejection:");

      // If user clicks "Cancel" or leaves it empty, stop the execution
      if (comment === null || comment.trim() === "") {
        alert("A reason is required to reject a leave request.");
        return;
      }
    }
    const success = await processApproval(id, status, comment || undefined);

    if (success) {
      setApprovals((prev) => prev.filter((req) => req.id !== id));

      if (dashboardData) {
        setDashboardData((prev: any) => ({
          ...prev,
          teamPendingRequestCount: Math.max(0, prev.teamPendingRequestCount - 1),
          // If approved, increment the approved count
          approvedCount: status === "Approved" ? prev.approvedCount + 1 : prev.approvedCount,
          // If rejected, increment the rejected count
          rejectedCount: status === "Rejected" ? prev.rejectedCount + 1 : prev.rejectedCount,
        }));
      }
    }
  };

  if (loading) return <div >Loading data....</div>

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto text-slate-900">

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Manager Dashboard</h2>
          <p className="text-sm text-slate-500">Welcome back, {user?.name || "Manager"}</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">Team Schedule</button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm">Export Data</button>
        </div>
      </div>

      {/* 2. STATS GRID - Using your JSON fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Team Size", value: dashboardData?.teamSize || 0, icon: <FaUsers />, color: "text-blue-600" },
          { label: "Pending Requests", value: dashboardData?.teamPendingRequestCount || 0, icon: <FaClock />, color: "text-amber-600" },
          { label: "On Leave Today", value: dashboardData?.teamOnLeaveCount || 0, icon: <FaCalendarAlt />, color: "text-indigo-600" },
          { label: "Approved (Year)", value: dashboardData?.approvedCount || 0, icon: <FaCheck />, color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-slate-50 ${stat.color} opacity-80`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* 3. PENDING REQUESTS LIST */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Action Required ({approvals.length})
            </h3>
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
                    key={req.id}
                    className="group bg-white border border-slate-200 rounded-md p-4 hover:border-indigo-400 transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">

                      {/* Avatar & Basic Info */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                          {(req.employeeName || req.employee || "E").charAt(0)}
                        </div>
                        <div className="flex-1 sm:hidden">
                          <p className="font-bold text-sm">{req.employeeName || req.employee}</p>
                          <p className="text-[10px] text-slate-500 font-medium">ID: {req.id}</p>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="font-bold text-sm">{req.employeeName || req.employee}</span>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">#{req.id}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0 sm:mt-1 text-xs text-slate-500">
                          <span className="font-bold text-indigo-600">{req.leaveType || req.type}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{req.numberOfDays || req.days} days requested</span>
                        </div>

                        {req.reason && (
                          <div className="mt-3 flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                            <FaCommentDots className="text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-[11px] italic text-slate-600 leading-relaxed">
                              "{req.reason}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => handleAction(req.id, "Rejected")}
                          className="flex-1 sm:flex-none px-4 py-2 sm:px-3 sm:py-1.5 border border-slate-200 rounded text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all text-xs font-bold"
                        >
                          Deny
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "Approved")}
                          className="flex-1 sm:flex-none px-4 py-2 sm:px-3 sm:py-1.5 bg-slate-900 text-white rounded hover:bg-indigo-600 transition-all text-xs font-bold shadow-sm"
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

        {/* 4. SIDEBAR - Team Insight */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <FaLayerGroup className="text-indigo-400" />
              <h3 className="text-sm font-bold tracking-wide">Team Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Monthly Balance Used</span>
                <span className="text-sm font-bold">{dashboardData?.monthlyUsed || 0} Days</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs text-slate-400">Active Team Leaves</span>
                <span className="text-sm font-bold text-indigo-400">{dashboardData?.teamOnLeaveCount || 0}</span>
              </div>
              <div className="pt-2">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-3">On Leave Today</p>
                {dashboardData?.teamOnLeaveToday?.length > 0 ? (
                  <div className="flex -space-x-2">
                    {dashboardData.teamOnLeaveToday.map((name: string, i: number) => (
                      <div key={i} title={name} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                        {name.charAt(0)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No one is out today</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardView;