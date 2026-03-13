import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaEdit, FaSpinner, FaShieldAlt,
  FaTimes, FaCheck, FaCog,
} from "react-icons/fa";
import { adminService } from "../../services/adminService";
import type { LeaveConfig } from "../../services/adminService";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_OPTIONS = [
  { label: "Indigo",  value: "bg-indigo-500" },
  { label: "Rose",    value: "bg-rose-500"   },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Amber",   value: "bg-amber-500"  },
  { label: "Violet",  value: "bg-violet-500" },
  { label: "Sky",     value: "bg-sky-500"    },
];

const CARD_ACCENTS = [
  "border-l-indigo-400", "border-l-rose-400", "border-l-emerald-400",
  "border-l-amber-400",  "border-l-violet-400","border-l-sky-400",
];

const COLOR_BARS = [
  "bg-indigo-500", "bg-rose-500", "bg-emerald-500",
  "bg-amber-500",  "bg-violet-500","bg-sky-500",
];

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  config?: LeaveConfig | null;
  onClose: () => void;
  onSave: (data: Partial<LeaveConfig>) => Promise<void>;
}

const LeaveTypeModal: React.FC<ModalProps> = ({ config, onClose, onSave }) => {
  const isEdit = !!config;

  const [form, setForm] = useState({
    leaveType:           config?.leaveType           ?? "",
    displayName:         config?.displayName          ?? "",
    annualAllocation:    config?.annualAllocation     ?? 10,
    maxConsecutiveDays:  config?.maxConsecutiveDays   ?? 30,
    carryForwardAllowed: config?.carryForwardAllowed  ?? false,
    maxCarryForward:     config?.maxCarryForward      ?? 0,
    requiresApproval:    config?.requiresApproval     ?? true,
    colorIndex:          0,
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.leaveType.trim())   { toast.warning("Leave type key is required");  return; }
    if (!form.displayName.trim()) { toast.warning("Display name is required");    return; }
    if (form.annualAllocation < 1){ toast.warning("Annual days must be at least 1"); return; }
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { colorIndex, ...payload } = form;
      await onSave(payload);
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={  { scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {isEdit ? "Edit Leave Type" : "New Leave Type"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure leave policy details</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Leave Type Key */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
              Leave Type Key * <span className="text-slate-400 normal-case font-medium">(e.g. SICK_LEAVE)</span>
            </label>
            <input
              value={form.leaveType}
              onChange={e => set("leaveType", e.target.value.toUpperCase().replace(/\s+/g,"_"))}
              placeholder="SICK_LEAVE"
              disabled={isEdit}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
                transition-all disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
              Display Name *
            </label>
            <input
              value={form.displayName}
              onChange={e => set("displayName", e.target.value)}
              placeholder="e.g. Sick Leave"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Annual Days + Max Consecutive */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                Annual Days *
              </label>
              <input
                type="number" min={1} value={form.annualAllocation}
                onChange={e => set("annualAllocation", Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                Max Consecutive
              </label>
              <input
                type="number" min={1} value={form.maxConsecutiveDays}
                onChange={e => set("maxConsecutiveDays", Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
              Accent Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c, idx) => (
                <button
                  key={c.value}
                  onClick={() => set("colorIndex", idx)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full ${c.value} transition-all ${
                    form.colorIndex === idx
                      ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                      : "opacity-50 hover:opacity-90 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">

            {/* Carry Forward */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Allow Carry Forward</p>
                <p className="text-[11px] text-slate-500">Unused days roll over to next year</p>
              </div>
              <button
                onClick={() => set("carryForwardAllowed", !form.carryForwardAllowed)}
                className={`relative w-10 h-5 rounded-full transition-all ${
                  form.carryForwardAllowed ? "bg-indigo-500" : "bg-slate-300"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.carryForwardAllowed ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </button>
            </div>

            <AnimatePresence>
              {form.carryForwardAllowed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={  { opacity: 0, height: 0 }}
                >
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                    Max Carry Forward Days
                  </label>
                  <input
                    type="number" min={0} value={form.maxCarryForward}
                    onChange={e => set("maxCarryForward", Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Requires Approval */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <div>
                <p className="text-sm font-bold text-slate-800">Requires Approval</p>
                <p className="text-[11px] text-slate-500">Must be approved by manager</p>
              </div>
              <button
                onClick={() => set("requiresApproval", !form.requiresApproval)}
                className={`relative w-10 h-5 rounded-full transition-all ${
                  form.requiresApproval ? "bg-indigo-500" : "bg-slate-300"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.requiresApproval ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600
              border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-lg
              hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <FaCheck size={11} />
            }
            {isEdit ? "Save Changes" : "Create Leave Type"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────

const LeaveTypesView: React.FC = () => {
  const [configs,     setConfigs]     = useState<LeaveConfig[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<LeaveConfig | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getLeaveConfigs();
      setConfigs(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to load leave configurations");
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async (data: Partial<LeaveConfig>) => {
    if (editTarget) {
      const updated = await adminService.updateLeaveConfig(editTarget.id, data);
      setConfigs(prev => prev.map(c => c.id === editTarget.id ? { ...c, ...updated } : c));
      toast.success("Leave type updated successfully");
    } else {
      const created = await adminService.createLeaveConfig(data);
      setConfigs(prev => [...prev, created]);
      toast.success("Leave type created successfully");
    }
  };

  const openAdd  = ()                  => { setEditTarget(null);   setModalOpen(true); };
  const openEdit = (c: LeaveConfig)    => { setEditTarget(c);      setModalOpen(true); };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4 md:p-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Leave Configuration</h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Define organizational leave policies and yearly limits
          </p>
        </div>
        <button
          onClick={openAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3
            bg-indigo-600 text-white rounded-lg text-sm font-bold
            shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <FaPlus size={12} /> New Leave Type
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-700 text-xs font-semibold">
          <FaShieldAlt className="shrink-0" /> {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {loading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-3">
            <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Loading Policies...
            </span>
          </div>
        )}

        {!loading && (
          <AnimatePresence mode="popLayout">
            {configs.map((c, i) => (
              <motion.div
                layout key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={  { opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-white rounded-xl border border-l-4 border-slate-200 shadow-sm
                  relative group overflow-hidden flex ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`}
              >
                {/* Color bar */}
                <div className={`w-1.5 shrink-0 ${COLOR_BARS[i % COLOR_BARS.length]}`} />

                <div className="flex-1 p-6">
                  {/* Title row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        {c.displayName}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {c.leaveType}
                      </p>
                    </div>
                    <button
                      onClick={() => openEdit(c)}
                      className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50
                        rounded-md transition-all opacity-0 group-hover:opacity-100"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </button>
                  </div>

                  {/* Days count */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">
                      {c.annualAllocation}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Days / Year</span>
                  </div>

                  {/* Details */}
                  <div className="mt-3 space-y-1">
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <FaCog size={9} />
                      Max {c.maxConsecutiveDays} consecutive days
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <FaCog size={9} />
                      Carry forward:{" "}
                      {c.carryForwardAllowed ? `Yes (max ${c.maxCarryForward}d)` : "No"}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <FaCog size={9} />
                      Approval: {c.requiresApproval ? "Required" : "Auto-approved"}
                    </p>
                  </div>

                  {/* Footer badge */}
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50
                      px-2.5 py-1 rounded uppercase tracking-wide">
                      Active Policy
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Empty state */}
        {!loading && configs.length === 0 && !error && (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FaCog className="text-slate-300" size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-slate-700">No Leave Types Configured</p>
              <p className="text-xs text-slate-400 mt-1">Click "New Leave Type" to get started</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white
                text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all"
            >
              <FaPlus size={11} /> Add First Leave Type
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <LeaveTypeModal
            config={editTarget}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveTypesView;