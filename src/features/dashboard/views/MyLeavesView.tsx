// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { FaSearch, FaCalendarAlt, FaEllipsisV } from "react-icons/fa";
// import { dashboardService } from "../services/dashboardService";
// import type { LeaveRecord } from "../types";

// const MyLeavesView = () => {
//   const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   const statusStyles = {
//     Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
//     Pending: "bg-amber-50 text-amber-600 border-amber-100",
//     Rejected: "bg-rose-50 text-rose-600 border-rose-100",
//   };

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const data = await dashboardService.getMyLeaveHistory();
//         setLeaves(data);
//       } catch (err) {
//         console.error("Error fetching history:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHistory();
//   }, []);

//   const filteredLeaves = leaves.filter(l => 
//     l.type.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="p-8 text-slate-400 font-bold">Loading History...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <h2 className="text-2xl font-black text-slate-900">My Leave History</h2>
//         <div className="relative group max-w-md w-full">
//           <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
//           <input
//             type="text"
//             placeholder="Search by leave type..."
//             className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="grid gap-4">
//         {filteredLeaves.map((l) => (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             key={l.id} 
//             className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm"
//           >
//             <div className="flex justify-between items-start">
//               <div className="space-y-1">
//                 <div className="flex items-center gap-2">
//                   <span className="font-black text-slate-800">{l.type}</span>
//                   <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${statusStyles[l.status]}`}>
//                     {l.status}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-slate-500 text-xs">
//                   <FaCalendarAlt size={10} />
//                   <span>{l.range} ({l.days} Days)</span>
//                 </div>
//               </div>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
//                 Applied: {l.applied}<br/>
//                 Approved by: {l.approvedBy}
//               </p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyLeavesView;

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "REJECTED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Leave History</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Track and manage your requests</p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {["ALL", "PENDING", "APPROVED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${
                statusFilter === tab ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type & Duration</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Range</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied On</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredHistory.map((item) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={item.id} 
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 text-sm">{item.type}</p>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase">{item.days} Days Total</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{item.range}</td>
                  <td className="px-8 py-5 text-[11px] font-bold text-slate-400">{item.applied}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black border tracking-widest ${getStatusStyles(item.status)}`}>
                      {item.status.toUpperCase() === "PENDING" && <FaClock className="animate-spin-slow" />}
                      {item.status.toUpperCase() === "APPROVED" && <FaCheckCircle />}
                      {item.status.toUpperCase() === "REJECTED" && <FaTimesCircle />}
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredHistory.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold italic text-sm">No leave records found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLeavesView;



