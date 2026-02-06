import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCheck, FaTimes, FaClock, FaCalendarAlt, 
  FaUsers, FaExclamationTriangle, FaCheckDouble,
  FaArrowRight, FaCommentDots, FaLayerGroup, FaBolt
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import type { ApprovalRequest } from "../../types";

const ManagerDashboardView: React.FC = () => {
  
  
  const { fetchApprovals, processApproval } = useDashboard();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);

  useEffect(() => {
    fetchApprovals().then(setApprovals);
  }, [fetchApprovals]);

  const handleAction = async (id: number, status: "Approved" | "Rejected") => {
    if (status === "Rejected") {
      const comment = prompt("Mandatory: Please provide a reason for rejection:");
      if (!comment) return;
      await processApproval(id, status, comment);
    } else {
      await processApproval(id, status);
    }
    setApprovals(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto text-slate-900">
      
      {/* 1. CLEAN HEADER - Stacked on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Manager Dashboard</h2>
          <p className="text-sm text-slate-500">Review leave applications and monitor team capacity.</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
           <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">View Schedule</button>
           <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm">Export Data</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. PENDING REQUESTS (PRIORITY) */}
        <div className="lg:col-span-8 space-y-4 order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Approvals ({approvals.length})</h3>
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
                    {/* Mobile: Vertical Stack | Desktop: Horizontal Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      
                      {/* Top Row: Avatar + Name + ID */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-700 font-bold text-sm shrink-0">
                          {req.employee.charAt(0)}
                        </div>
                        <div className="flex-1 sm:hidden">
                          <p className="font-bold text-sm">{req.employee}</p>
                          <p className="text-[10px] text-slate-500 font-medium">#{req.id}</p>
                        </div>
                      </div>

                      {/* Info Block */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="font-bold text-sm">{req.employee}</span>
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 font-medium">#{req.id}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0 sm:mt-1 text-xs text-slate-500">
                          <span className="font-bold text-indigo-600">{req.type}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{req.days} days requested</span>
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

                      {/* Balance - Visible on Mobile now but styled better */}
                      <div className="flex justify-between items-center w-full sm:w-40 sm:text-right border-t sm:border-0 pt-3 sm:pt-0">
                        <p className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balance</p>
                        <div>
                          <p className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase">Current Balance</p>
                          <p className={`text-xs font-bold ${req.balance < 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {req.balance} Days Left
                          </p>
                        </div>
                      </div>

                      {/* Actions - Full width on mobile */}
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
                   <p className="text-xs font-bold uppercase tracking-widest">No actions pending</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. SIDEBAR STATS - Now appears first on mobile for quick overview */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          
          {/* Capacity Card */}
          <div className="bg-white border border-slate-200 rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Team Capacity</h4>
              <FaUsers className="text-slate-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tighter">84%</span>
              <span className="text-xs text-emerald-600 font-bold">+2% from last week</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 w-[84%]" />
            </div>
          </div>

          {/* Quick Metrics - Grid on mobile to save vertical space */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
             <div className="bg-slate-50 border border-slate-200 p-4 rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Out Today</p>
                  <p className="text-sm sm:text-lg font-bold">04 Members</p>
                </div>
                <FaClock className="text-slate-300 hidden sm:block" />
             </div>
             
             <div className="bg-rose-50 border border-rose-100 p-4 rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Conflicts</p>
                  <p className="text-sm sm:text-lg font-bold text-rose-700">03 Alerts</p>
                </div>
                <FaExclamationTriangle className="text-rose-300 hidden sm:block" />
             </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-md p-5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Upcoming Schedule</h4>
            <div className="space-y-4">
               {[1, 2, 3].map((_, i) => (
                 <div key={i} className="flex items-start gap-3 border-l-2 border-indigo-500 pl-3">
                    <div className="flex-1">
                      <p className="text-xs font-bold">System Maintenance</p>
                      <p className="text-[10px] text-slate-500">Starts Feb 05 • 3 Members Away</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardView;