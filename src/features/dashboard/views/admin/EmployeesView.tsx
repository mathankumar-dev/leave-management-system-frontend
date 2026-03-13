import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch, FaUserPlus, FaFilter, FaEllipsisV,
  FaLock, FaUserSlash, FaUserCheck, FaUserTie,
  FaTimes, FaCheck, FaExclamationTriangle,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import type { Employee } from "../../types";
import AddEmployeeForm from "../../components/AddEmployeeForm";
import { useAuth } from "../../../auth/hooks/useAuth";
import { adminService } from "../../services/adminService";
import { toast } from "sonner";

// ─── Assign Manager Modal ─────────────────────────────────────────────────────
interface AssignManagerModalProps {
  employee: Employee;
  onClose: () => void;
  onAssign: (employeeId: number, managerId: number) => Promise<void>;
}

const AssignManagerModal: React.FC<AssignManagerModalProps> = ({ employee, onClose, onAssign }) => {
  const [managerId, setManagerId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!managerId) { toast.warning("Please enter a Manager ID"); return; }
    setSaving(true);
    try {
      await onAssign(employee.id as number, Number(managerId));
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900">Assign Manager</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Assigning manager for <span className="font-bold text-slate-700">{employee.name}</span>
        </p>
        <div className="mb-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Manager ID</label>
          <input
            type="number"
            value={managerId}
            onChange={e => setManagerId(e.target.value)}
            placeholder="Enter manager ID"
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaCheck size={11} />}
            Assign
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, confirmLabel, confirmClass, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
          <FaExclamationTriangle className="text-amber-500" size={16} />
        </div>
        <h3 className="text-base font-black text-slate-900">{title}</h3>
      </div>
      <p className="text-sm text-slate-500 mb-5">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-lg disabled:opacity-60 flex items-center justify-center gap-2 ${confirmClass}`}>
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Action Menu ──────────────────────────────────────────────────────────────
interface ActionMenuProps {
  employee: Employee;
  onClose: () => void;
  onResetPassword: () => void;
  onDeactivate: () => void;
  onAssignManager: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ employee, onClose, onResetPassword, onDeactivate, onAssignManager }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const isActive = employee.status !== "INACTIVE";

  const actions = [
    { icon: <FaLock size={12} />, label: "Reset Password", color: "text-indigo-600 hover:bg-indigo-50", onClick: onResetPassword },
    { icon: <FaUserTie size={12} />, label: "Assign Manager", color: "text-violet-600 hover:bg-violet-50", onClick: onAssignManager },
    {
      icon: isActive ? <FaUserSlash size={12} /> : <FaUserCheck size={12} />,
      label: isActive ? "Deactivate" : "Activate",
      color: isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50",
      onClick: onDeactivate,
    },
  ];

  return (
    <div ref={ref} className="absolute right-8 top-8 z-30 bg-white border border-slate-200 rounded-xl shadow-xl py-1 w-44 overflow-hidden">
      {actions.map(a => (
        <button
          key={a.label}
          onClick={() => { a.onClick(); onClose(); }}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold transition-colors ${a.color}`}
        >
          {a.icon} {a.label}
        </button>
      ))}
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
const EmployeesView = () => {
  const { user } = useAuth();

  const [employees, setEmployees]           = useState<Employee[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState("");
  const [openAddEmployee, setOpenAddEmployee] = useState(false);
  const [activeMenuId, setActiveMenuId]     = useState<number | null>(null);

  // Action targets
  const [resetTarget, setResetTarget]       = useState<Employee | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(null);
  const [assignTarget, setAssignTarget]     = useState<Employee | null>(null);
  const [actionLoading, setActionLoading]   = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    adminService.getAllEmployees().then((data) => {
      if (mounted) setEmployees(data as unknown as Employee[]);
    }).catch(() => {
      // fallback: keep empty
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() =>
    employees.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [employees, searchTerm]
  );

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleResetPassword = async () => {
    if (!resetTarget?.id) return;
    setActionLoading(true);
    try {
      await adminService.resetPassword(resetTarget.id as number);
      toast.success(`Password reset email sent to ${resetTarget.name}`);
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setActionLoading(false);
      setResetTarget(null);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget?.id) return;
    setActionLoading(true);
    const isActive = deactivateTarget.status !== "INACTIVE";
    try {
      await adminService.deactivateEmployee(deactivateTarget.id as number);
      setEmployees(prev =>
        prev.map(e => e.id === deactivateTarget.id
          ? { ...e, status: isActive ? "INACTIVE" : "ACTIVE" }
          : e
        )
      );
      toast.success(`${deactivateTarget.name} has been ${isActive ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
      setDeactivateTarget(null);
    }
  };

  const handleAssignManager = async (employeeId: number, managerId: number) => {
    await adminService.assignManager(employeeId, managerId);
    toast.success("Manager assigned successfully");
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Total: {filtered.length} employees</p>
        </div>
        <button
          onClick={() => setOpenAddEmployee(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <FaUserPlus /> Add Employee
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
          />
        </div>
        <button className="px-5 py-3 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-bold text-xs shadow-sm">
          <FaFilter /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Employee", "Department", "Role", "Status", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filtered.map(emp => (
                  <motion.tr
                    key={emp.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                          {emp.name?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{emp.name}</p>
                          <p className="text-[11px] text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                      {emp.department || emp.dept || "—"}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {emp.role || "Employee"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        emp.status === "INACTIVE"
                          ? "bg-slate-100 text-slate-500 border border-slate-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {emp.status === "INACTIVE" ? "Inactive" : "Active"}
                      </span>
                    </td>

                    {/* Actions — 3-dot menu */}
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === emp.id ? null : emp.id as number)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <FaEllipsisV size={12} className="text-slate-400" />
                      </button>

                      <AnimatePresence>
                        {activeMenuId === emp.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          >
                            <ActionMenu
                              employee={emp}
                              onClose={() => setActiveMenuId(null)}
                              onResetPassword={() => setResetTarget(emp)}
                              onDeactivate={() => setDeactivateTarget(emp)}
                              onAssignManager={() => setAssignTarget(emp)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && !loading && (
          <div className="py-16 text-center text-slate-500 text-sm font-medium">
            No employees found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* ── Modals & Dialogs ── */}
      <AddEmployeeForm open={openAddEmployee} onClose={() => setOpenAddEmployee(false)} />

      <AnimatePresence>
        {resetTarget && (
          <ConfirmDialog
            title="Reset Password"
            message={`Send a password reset email to ${resetTarget.name}? They will receive a link to set a new password.`}
            confirmLabel="Reset Password"
            confirmClass="bg-indigo-600 hover:bg-indigo-700"
            onConfirm={handleResetPassword}
            onCancel={() => setResetTarget(null)}
            loading={actionLoading}
          />
        )}

        {deactivateTarget && (
          <ConfirmDialog
            title={deactivateTarget.status === "INACTIVE" ? "Activate Account" : "Deactivate Account"}
            message={
              deactivateTarget.status === "INACTIVE"
                ? `Activate ${deactivateTarget.name}'s account? They will regain access to the portal.`
                : `Deactivate ${deactivateTarget.name}'s account? They will lose access to the portal.`
            }
            confirmLabel={deactivateTarget.status === "INACTIVE" ? "Activate" : "Deactivate"}
            confirmClass={deactivateTarget.status === "INACTIVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}
            onConfirm={handleDeactivate}
            onCancel={() => setDeactivateTarget(null)}
            loading={actionLoading}
          />
        )}

        {assignTarget && (
          <AssignManagerModal
            employee={assignTarget}
            onClose={() => setAssignTarget(null)}
            onAssign={handleAssignManager}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeesView;