import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUserPlus,
  FaEllipsisV,
  FaFilter,
  FaBuilding,
  FaEnvelope,
} from "react-icons/fa";

import { useDashboard } from "../../hooks/useDashboard";
import type { Employee } from "../../types";
import AddEmployeeForm from "../../components/AddEmployeeForm";

const EmployeesView: React.FC = () => {
  const { fetchEmployees, loading } = useDashboard();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddEmployee, setOpenAddEmployee] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchEmployees().then((data) => {
      if (isMounted) setEmployees(data);
    });
    return () => {
      isMounted = false;
    };
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.dept?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  if (loading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Loading Directory...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Employee Directory
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Total Workspace Members: {employees.length}
          </p>
        </div>

        {/* 🔥 ONLY LOGIC ADDED */}
        <button
          onClick={() => setOpenAddEmployee(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <FaUserPlus /> Add Employee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search name, email or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <button className="px-5 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-bold text-xs shadow-sm">
          <FaFilter className="text-slate-400" /> Filters
        </button>
      </div>

      {/* Directory Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Department & Role
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredEmployees.map((emp) => (
                  <motion.tr
                    key={emp.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col md:table-row hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Employee Profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 shrink-0 ${
                            emp.color || "bg-indigo-600"
                          } rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                        >
                          {emp.initial || emp.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">
                            {emp.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <FaEnvelope size={10} />
                            <p className="text-xs font-medium truncate">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dept & Role */}
                    <td className="px-6 py-2 md:py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{emp.dept}</span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">
                          {emp.role}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-2 md:py-4 md:text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                          emp.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 md:text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                        <FaEllipsisV size={12} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 POPUP CONNECTION */}
      <AddEmployeeForm
        open={openAddEmployee}
        onClose={() => setOpenAddEmployee(false)}
      />
    </div>
  );
};

export default EmployeesView;
