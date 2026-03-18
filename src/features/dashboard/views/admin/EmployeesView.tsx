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
  const { fetchAllEmployees, loading, addUser, deleteUser } = useDashboard();
  const { user } = useAuth();

  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  // Close menu if clicking outside
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

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

  useEffect(() => {
    const delay = setTimeout(() => {
      loadEmployeeData();
    }, 250);

    return () => clearTimeout(delay);
  }, [loadEmployeeData]);
  // Inside EmployeesView component
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; empId: number | null }>({
    isOpen: false,
    empId: null,
  });

  const handleDeactivateClick = (id: number) => {
    setConfirmState({ isOpen: true, empId: id });
    setActiveMenu(null); // Close the ellipsis menu
  };

  const processDeactivation = async () => {
    if (confirmState.empId) {
      await deleteUser(confirmState.empId);
      setConfirmState({ isOpen: false, empId: null });
      loadEmployeeData(); // Refresh the table
    }
  };
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

                      <td className="px-6 py-4 text-right relative overflow-visible">
                        {/* Ellipsis Toggle Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents global click listener from closing it instantly
                            setActiveMenu(activeMenu === emp.id ? null : emp.id);
                          }}
                          className={`p-2 transition-all rounded-sm ${activeMenu === emp.id
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                          <FaEllipsisV size={12} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {activeMenu === emp.id && (
                            <>
                              {/* Invisible overlay to catch clicks and close the menu */}
                              <div
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() => setActiveMenu(null)}
                              />

                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: 10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="absolute right-14 top-1/2 -translate-y-1/2 z-50 min-w-[160px] bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden"
                              >
                                <div className="p-1">
                                  {/* Action: Deactivate */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // We don't call the API here anymore; we just open the Dialog
                                      setConfirmState({ isOpen: true, empId: emp.id });
                                      setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-3 py-2.5 text-[10px] font-black uppercase tracking-tighter text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 group"
                                  >
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ repeat: Infinity, duration: 2 }}
                                      className="w-1.5 h-1.5 rounded-full bg-red-600"
                                    />
                                    Deactivate User
                                  </button>

                                  <div className="h-[1px] bg-slate-100 my-1" />

                                  <button
                                    className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-tighter text-slate-400 cursor-not-allowed opacity-50"
                                    disabled
                                  >
                                    View Full Logs
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
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
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Security Protocol: Deactivation"
        message="Are you certain you want to revoke system access for this member? This action will be logged."
        onConfirm={processDeactivation}
        onCancel={() => setConfirmState({ isOpen: false, empId: null })}
      />
    </div>
  );
};

export default EmployeesView;

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white border border-slate-200 rounded-sm shadow-2xl p-6"
        >
          <h3 className="text-sm font-black text-slate-900 uppercase  mb-2">
            {title}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 uppercase  leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);