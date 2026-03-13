import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUserPlus,
  FaEllipsisV,
  FaEnvelope,
  FaFilter,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import type { Employee } from "../../types";
import AddEmployeeForm from "../../components/AddEmployeeForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { User } from "../../../auth/types";

const EmployeesView = () => {
  const { fetchEmployees, loading } = useDashboard();
  const { user } = useAuth();

  const [Employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  

  useEffect(() => {
    const employeeId = user?.id;

    if (!employeeId) {
      console.warn("Employee ID not ready yet");
      return;
    }

    let isMounted = true;

    fetchEmployees().then((data: Employee[]) => {
      if (isMounted) {
        setEmployees(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    return Employees.filter((emp) => {
      return emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [Employees, searchTerm]);

  if (loading && Employees.length === 0) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Employee Directory</h2>
          <p className="text-xs text-slate-500">
            Total Members: {filteredEmployees.length}
          </p>
        </div>

        <button
          onClick={() => setOpenAddEmployee(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <FaUserPlus /> Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
          />
        </div>

        <button className="px-5 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-bold text-xs shadow-sm">
          <FaFilter /> Filters
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500">
                  Employee
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500">
                  Department
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase text-slate-500 text-center">
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
                    className="flex flex-col md:table-row hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm">{emp.name}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold">
                        {emp.department}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        ACTIVE
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded">
                        <FaEllipsisV size={12} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && !loading && (
          <div className="py-16 text-center text-slate-500 text-sm">
            No team members found matching "{searchTerm}"
          </div>
        )}
      </div>

      <AddEmployeeForm
        open={openAddEmployee}
        onClose={() => setOpenAddEmployee(false)}
      />
    </div>
  );
};

export default EmployeesView;