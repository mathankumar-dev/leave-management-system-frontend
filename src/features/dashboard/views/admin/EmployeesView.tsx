import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaUserPlus, FaEllipsisV, FaFilter, FaBuilding, FaEnvelope } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import type { Employee } from "../../types";

const containerVars = {
  animate: { transition: { staggerChildren: 0.05 } }
};

const rowVars = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, scale: 0.95 }
};

const EmployeesView: React.FC = () => {
  const { fetchEmployees, loading } = useDashboard();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchEmployees().then(data => {
      if (isMounted) setEmployees(data);
    });
    return () => { isMounted = false; };
  }, [fetchEmployees]);

  // FIXED: Using 'dept' to match your Interface and added null-checks
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.dept?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  if (loading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full"
        />
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Total Workspace Members: {employees.length}
          </p>
        </div>
        <button className="flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl shadow-slate-200 active:scale-95 transition-all">
          <FaUserPlus className="text-indigo-400" /> Add Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all outline-none"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 font-bold text-xs">
          <FaFilter /> Filters
        </button>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department & Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVars}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence mode="popLayout">
                {filteredEmployees.map((emp) => (
                  <motion.tr
                    key={emp.id}
                    variants={rowVars}
                    layout
                    className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 shrink-0 ${emp.color || 'bg-indigo-600'} rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform uppercase`}>
                          {emp.initial || emp.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{emp.name}</p>
                          <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                            <FaEnvelope size={10} />
                            <p className="text-[10px] font-bold truncate">{emp.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <FaBuilding size={10} className="text-slate-300" />
                          <span className="text-xs font-bold">{emp.dept}</span>
                        </div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{emp.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest border transition-colors ${emp.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current ${emp.status === 'ACTIVE' ? 'animate-pulse' : ''}`} />
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                        <FaEllipsisV size={12} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEmployees.length === 0 && !loading && (
          <div className="py-20 text-center bg-slate-50/20">
            <p className="text-slate-400 font-bold italic text-sm">No team members found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {filteredEmployees.length} Members
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50">PREV</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesView;