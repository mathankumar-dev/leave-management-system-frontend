import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaUsers, FaClock, FaCalendarCheck } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import type { ApprovalRequest } from "../../types";

const ManagerDashboardView: React.FC = () => {
  const { fetchApprovals, processApproval, loading } = useDashboard();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);

  useEffect(() => {
    fetchApprovals().then(setApprovals);
  }, [fetchApprovals]);

  const handleAction = async (id: number, status: "Approved" | "Rejected") => {
    await processApproval(id, status);
    setApprovals(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pending Requests", val: approvals.length, icon: <FaClock />, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Team on Leave", val: "4", icon: <FaUsers />, color: "text-indigo-500", bg: "bg-indigo-50" },
          { label: "Approved Today", val: "2", icon: <FaCalendarCheck />, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-5">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-900 tracking-tight">Pending Approvals</h3>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase">Action Required</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Leave Type</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-8 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((req) => (
                <motion.tr layout key={req.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {/* Changed req.employeeName to req.employee */}
                      <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs">
                        {req.employee.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{req.employee}</p>
                        <p className="text-[10px] font-medium text-slate-400">{req.appliedOn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{req.type}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{req.days} Days</td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(req.id, "Rejected")}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => handleAction(req.id, "Approved")}
                        className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardView;