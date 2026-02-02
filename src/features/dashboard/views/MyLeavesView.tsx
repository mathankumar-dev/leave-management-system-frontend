import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import type { LeaveRecord } from "../types";

const MyLeavesView: React.FC = () => {
  const { fetchMyLeaves, loading } = useDashboard();
  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchMyLeaves().then(setHistory);
  }, [fetchMyLeaves]);

  const filteredHistory = useMemo(() => {
    if (statusFilter === "ALL") return history;
    return history.filter(item => item.status.toUpperCase() === statusFilter);
  }, [history, statusFilter]);

  if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading History...</div>;

  return (
    <div className="w-full space-y-6">
      {/* Header with scrollable tabs for mobile */}
      <header className="px-1 md:px-0">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Leave History</h2>
        <p className="text-xs font-medium text-slate-500 mt-1">Track and manage your requests</p>
        
        <div className="mt-4 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex bg-slate-100 p-1 rounded-xl w-max md:w-auto">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE LIST: Visible only on small screens */}
      <div className="md:hidden space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-indigo-500 uppercase block mb-1">{item.type}</span>
                  <h3 className="text-lg font-bold text-slate-900 truncate">{item.days} Days Total</h3>
                </div>
                <StatusBadge status={item.status} />
              </div>
              
              <div className="space-y-3 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <FaCalendarAlt className="text-slate-400 shrink-0" size={14} />
                  <span className="text-sm font-medium truncate">PERIOD: {item.range}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                   <span className="uppercase">Applied: {item.applied}</span>
                   <FaChevronRight size={12} className="text-slate-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DESKTOP TABLE: Visible only on desktop */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Date Range</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-slate-900">{item.type}</td>
                <td className="px-6 py-5 text-indigo-600 font-bold text-sm">{item.days} Days</td>
                <td className="px-6 py-5 text-slate-600 text-sm">{item.range}</td>
                <td className="px-6 py-5 text-right"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHistory.length === 0 && (
        <div className="py-20 text-center text-slate-400 font-medium">No leave records found.</div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  };
  const currentStyle = styles[status.toUpperCase()] || "bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider whitespace-nowrap ${currentStyle}`}>
      {status}
    </span>
  );
};

export default MyLeavesView;