import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import {
  FaUserPlus,
  FaSearch,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
  FaRegAddressCard,
  FaFilter
} from "react-icons/fa";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";
import type { EmployeeEntity } from "../../types";
import AddEmployeePopup from "../../../../common/forms/AddEmployeeForm";

const EmployeesView = () => {
  const { fetchAllEmployees, loading, addUser } = useDashboard();
  const { user } = useAuth();

  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);

  const loadEmployeeData = useCallback(async () => {
    const result = await fetchAllEmployees({
      page: currentPage,
      size: 10,
      name: searchTerm,
      role: roleFilter === "ALL" ? undefined : roleFilter,
      active: true
    });

    if (result) {
      setEmployees(result.content);
      setPagination({
        totalElements: result.totalElements,
        totalPages: result.totalPages
      });
      setCurrentPage(result.number); // keep UI in sync
    }
  }, [fetchAllEmployees, currentPage, searchTerm, roleFilter]);

  // 🔥 SINGLE debounced effect (fix + smoother UX)
  useEffect(() => {
    const delay = setTimeout(() => {
      loadEmployeeData();
    }, 250);

    return () => clearTimeout(delay);
  }, [loadEmployeeData]);

  // 🎬 Animation Variants (ENHANCED)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.03, staggerDirection: -1 }
    }
  } as const; // Added as const

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring", // TypeScript now validates this correctly
        stiffness: 260,
        damping: 18
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  } as const; // Added as const

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-3 bg-slate-900 rounded-sm text-white"
          >
            <FaRegAddressCard size={20} />
          </motion.div>

          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Personnel Directory
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              {pagination.totalElements} Records System-Wide
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-sm text-xs font-bold focus:outline-none focus:border-slate-900 transition-all uppercase tracking-tighter"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="appearance-none bg-slate-50 border border-slate-200 pl-10 pr-8 py-2.5 rounded-sm text-xs font-bold focus:outline-none focus:border-slate-900 transition-all uppercase tracking-tighter cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins</option>
              <option value="HR">HR</option>
              <option value="MANAGER">Managers</option>
              <option value="TEAM_LEADER">Team Leaders</option>
              <option value="EMPLOYEE">Employees</option>
            </select>
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
          </div>

          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenAddEmployee(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm"
          >
            <FaUserPlus /> Add Member
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="relative w-full bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-800 text-white">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Member Identity</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Designated Role</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Team ID</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Options</th>
              </tr>
            </thead>

            <AnimatePresence mode="wait">
              <motion.tbody
                key={`${currentPage}-${searchTerm}-${roleFilter}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="divide-y divide-slate-100"
              >
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <motion.tr
                      key={emp.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-sm bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all uppercase">
                            {emp.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                              {`${emp.name || "Unknown"} ( EMP ID : ${emp.id || '?'})`}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-sm text-[10px] font-black uppercase tracking-tight">
                          {emp.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-sm text-[10px] font-black uppercase tracking-tight">
                          {emp.teamId ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <motion.div
                            animate={{ scale: emp.active ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.6 }}
                            className={`h-1.5 w-1.5 rounded-full ${emp.active ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {emp.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-300 hover:text-slate-900 p-2">
                          <FaEllipsisV size={12} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : !loading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
                        No Records Found
                      </span>
                    </td>
                  </tr>
                ) : null}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>

        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"
            />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
              Syncing Personnel...
            </span>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-2 pt-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Viewing Page {currentPage + 1} of {pagination.totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 0 || loading}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2.5 rounded-sm border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all bg-white"
          >
            <FaChevronLeft size={10} />
          </button>

          <button
            disabled={
              pagination.totalPages === 0 ||
              currentPage >= pagination.totalPages - 1 ||
              loading
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2.5 rounded-sm border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all bg-white"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      <AddEmployeePopup
        open={openAddEmployee}
        addUser={addUser}
        onClose={() => {
          setOpenAddEmployee(false);
          loadEmployeeData();
        }}
      />
    </div>
  );
};

export default EmployeesView;