import AddEmployeePopup from "@/features/employee/components/AddEmployeeForm";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { EmployeeEntity } from "@/features/employee/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaFilter,
  FaRegAddressCard,
  FaSearch,
  FaUserCheck,
  FaUserPlus,
  FaUserSlash
} from "react-icons/fa";

const EmployeesView = () => {
  const { getEmployees, loading, addUser, deleteUser } = useEmployee();

  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [openAddEmployee, setOpenAddEmployee] = useState(false);

  // Changed activeMenu and confirmState to use string | null because empId is "WENXT..."
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    empId: string | null;
    mode: 'DEACTIVATE' | 'REACTIVATE'
  }>({
    isOpen: false,
    empId: null,
    mode: 'DEACTIVATE'
  });

  const loadEmployeeData = useCallback(async () => {
    // Pass filters to the hook
    const result = await getEmployees({
      page: currentPage,
      size: 10,
      searchTerm: searchTerm,
      role: roleFilter !== "ALL" ? roleFilter : undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined
    });

    if (result && Array.isArray(result.content)) {
      setEmployees(result.content);
      setPagination({
        totalElements: result.totalElements || 0,
        totalPages: result.totalPages || 0
      });
    } else {
      setEmployees([]);
      setPagination({ totalElements: 0, totalPages: 0 });
    }
  }, [getEmployees, currentPage, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    const delay = setTimeout(loadEmployeeData, 250);
    return () => clearTimeout(delay);
  }, [loadEmployeeData]);

  const handleAction = async () => {
    if (confirmState.empId) {
      // Assuming deleteUser handles the string empId
      await deleteUser(confirmState.empId);
      setConfirmState({ ...confirmState, isOpen: false });
      loadEmployeeData();
    }
  };

  return (
    <div className="space-y-6 max-w-400 mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 rounded-sm text-white">
            <FaRegAddressCard size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Personnel Directory</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              {pagination.totalElements} Total Records
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-sm text-xs font-bold focus:outline-none focus:border-slate-900 uppercase"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
              className="appearance-none bg-slate-50 border border-slate-200 pl-10 pr-8 py-2.5 rounded-sm text-xs font-bold focus:outline-none focus:border-slate-900 cursor-pointer uppercase"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(0); }}
              className="appearance-none bg-slate-50 border border-slate-200 pl-10 pr-8 py-2.5 rounded-sm text-xs font-bold focus:outline-none focus:border-slate-900 cursor-pointer uppercase"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admins</option>
              <option value="HR">HR</option>
              <option value="MANAGER">Managers</option>
              <option value="EMPLOYEE">Employees</option>
            </select>
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
          </div>

          <button
            onClick={() => setOpenAddEmployee(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95"
          >
            <FaUserPlus /> Add Member
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative w-full bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm min-h-[450px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-800 text-white">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Member Identity</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Role</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Options</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.empId} className={`transition-colors duration-150 group ${!emp.active ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-3 ${!emp.active ? 'opacity-60' : ''}`}>
                        <div className={`h-9 w-9 rounded-sm flex items-center justify-center text-[11px] font-black border transition-all ${emp.active ? 'bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-900 group-hover:text-white' : 'bg-slate-200 text-slate-400 border-slate-300'}`}>
                          {emp.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 uppercase">
                            {emp.name} ({emp.empId})
                            {!emp.active && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-[8px] font-black rounded-sm">INACTIVE</span>}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400 lowercase">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-sm text-[10px] font-black uppercase">
                        {/* FIX: Use roleName and Optional Chaining */}
                        {emp.roleName?.replace(/_/g, " ") || "UNASSIGNED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${emp.active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-red-400"}`} />
                        <span className={`text-[10px] font-black uppercase ${emp.active ? "text-slate-600" : "text-red-400"}`}>
                          {emp.active ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative overflow-visible">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === emp.empId ? null : emp.empId); }}
                        className={`p-2 transition-all rounded-sm ${activeMenu === emp.empId ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"}`}
                      >
                        <FaEllipsisV size={12} />
                      </button>

                      <AnimatePresence>
                        {activeMenu === emp.empId && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />
                            <motion.div initial={{ opacity: 0, scale: 0.95, x: 5 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95, x: 5 }} className="absolute right-14 top-1/2 -translate-y-1/2 z-50 min-w-[180px] bg-white border border-slate-200 shadow-2xl rounded-sm p-1">
                              {emp.active ? (
                                <button
                                  onClick={() => { setConfirmState({ isOpen: true, empId: emp.empId, mode: 'DEACTIVATE' }); setActiveMenu(null); }}
                                  className="w-full text-left px-3 py-2.5 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <FaUserSlash size={12} /> Deactivate User
                                </button>
                              ) : (
                                <button
                                  onClick={() => { setConfirmState({ isOpen: true, empId: emp.empId, mode: 'REACTIVATE' }); setActiveMenu(null); }}
                                  className="w-full text-left px-3 py-2.5 text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <FaUserCheck size={12} /> Reactivate User
                                </button>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : !loading && (
                <tr>
                  <td colSpan={4} className="py-32 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">No Personnel Records Match Filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Syncing Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Updating Directory...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-2 pt-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Showing Page {currentPage + 1} of {pagination.totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 0 || loading}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all"
          >
            <FaChevronLeft size={10} />
          </button>
          <button
            disabled={currentPage >= (pagination.totalPages - 1) || loading}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-20 transition-all"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeePopup
        open={openAddEmployee}
        addUser={addUser}
        onClose={() => { setOpenAddEmployee(false); loadEmployeeData(); }}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.mode === 'DEACTIVATE' ? "Security Protocol" : "Restore Access"}
        message={confirmState.mode === 'DEACTIVATE'
          ? "Revoke system access for this member immediately?"
          : "Re-enable system access for this member?"}
        confirmText={confirmState.mode === 'DEACTIVATE' ? "Confirm Deactivation" : "Confirm Reactivation"}
        isDanger={confirmState.mode === 'DEACTIVATE'}
        onConfirm={handleAction}
        onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
      />
    </div>
  );
};

export default EmployeesView;

/* Reusable Confirm Dialog remains the same */
interface ConfirmDialogProps {
  isOpen: boolean; title: string; message: string; confirmText: string;
  isDanger: boolean; onConfirm: () => void; onCancel: () => void;
}

const ConfirmDialog = ({ isOpen, title, message, confirmText, isDanger, onConfirm, onCancel }: ConfirmDialogProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
        <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="relative w-full max-w-sm bg-white border border-slate-200 rounded-sm shadow-2xl p-6">
          <h3 className="text-sm font-black text-slate-900 uppercase mb-2">{title}</h3>
          <p className="text-[11px] font-medium text-slate-500 uppercase leading-relaxed mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 text-[10px] font-black uppercase hover:bg-slate-50 transition-all">Cancel</button>
            <button onClick={onConfirm} className={`flex-1 px-4 py-2 text-white text-[10px] font-black uppercase transition-all shadow-sm ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);