import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaClock, FaCalendarAlt, FaCalendarPlus, FaCalendarCheck, FaUsers } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import type { ApprovalRequest } from "../../types";

const ManagerDashboardView: React.FC = () => {
  const { fetchApprovals, processApproval } = useDashboard();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);

  useEffect(() => {
    fetchApprovals().then(setApprovals);
  }, [fetchApprovals]);

  const handleAction = async (id: number, status: "Approved" | "Rejected") => {
    await processApproval(id, status);
    setApprovals(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Top Stats Overview - Updated based on your note */}
      {/* Top Stats Overview - Keeping original + adding new metrics */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
  {[
    { label: "Pending Requests", val: approvals.length, icon: <FaClock />, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Team on Leave", val: "4", icon: <FaUsers />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Approved Today", val: "2", icon: <FaCalendarCheck />, color: "text-emerald-600", bg: "bg-emerald-50" },
    // New cards from your notes
    { label: "Next Week Leave", val: "12", icon: <FaCalendarAlt />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Monthly Count", val: "28", icon: <FaCalendarPlus />, color: "text-purple-600", bg: "bg-purple-50" },
  ].map((stat, i) => (
    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      <div className={`w-12 h-12 shrink-0 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center text-lg`}>
        {stat.icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
        <h3 className="text-xl font-bold text-slate-900">{stat.val}</h3>
      </div>
    </div>
  ))}
</div>

      {/* Approvals Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Pending Approvals</h3>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">
            Action Required
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group bg-slate-50/80">
              <tr>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvals.map((req) => (
                <motion.tr 
                  layout 
                  key={req.id} 
                  className="flex flex-col md:table-row hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 md:py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center font-bold text-indigo-600 text-sm border border-indigo-100">
                        {req.employee.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{req.employee}</p>
                        <p className="text-xs text-slate-400">Applied {req.appliedOn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2 md:py-5">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase mr-2">Type:</span>
                    <span className="text-sm font-medium text-slate-600">{req.type}</span>
                  </td>
                  <td className="px-6 py-2 md:py-5">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase mr-2">Duration:</span>
                    <span className="text-sm font-medium text-slate-600">{req.days} Days</span>
                  </td>
                  <td className="px-6 py-4 md:py-5 text-right">
                    <div className="flex justify-start md:justify-end gap-3">
                      <button
                        onClick={() => handleAction(req.id, "Rejected")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 md:p-2 text-rose-600 hover:bg-rose-50 border border-transparent md:hover:border-rose-100 rounded-lg transition-all"
                      >
                        <FaTimes className="text-sm" />
                        <span className="md:hidden text-sm font-semibold">Reject</span>
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "Approved")}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 md:p-2 text-emerald-600 hover:bg-emerald-50 border border-transparent md:hover:border-emerald-100 rounded-lg transition-all"
                      >
                        <FaCheck className="text-sm" />
                        <span className="md:hidden text-sm font-semibold">Approve</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {approvals.length === 0 && (
            <div className="p-10 text-center text-slate-400 text-sm">
              No pending approvals found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardView;