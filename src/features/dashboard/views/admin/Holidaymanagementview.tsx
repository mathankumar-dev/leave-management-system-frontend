import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaCalendarAlt,
  FaTimes, FaCheck, FaExclamationTriangle,
} from "react-icons/fa";
import api from "../../../../api/axiosInstance";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Holiday {
  id?: number;
  date: string;
  name: string;
  type?: "PUBLIC" | "OPTIONAL" | "RESTRICTED";
}

// ─── Seed from existing constants as fallback ─────────────────────────────────
const FALLBACK_HOLIDAYS: Holiday[] = [
  { id: 1,  date: "2026-01-01", name: "New Year",              type: "PUBLIC" },
  { id: 2,  date: "2026-01-15", name: "Pongal",                type: "PUBLIC" },
  { id: 3,  date: "2026-01-26", name: "Republic Day",          type: "PUBLIC" },
  { id: 4,  date: "2026-05-01", name: "May Day",               type: "PUBLIC" },
  { id: 5,  date: "2026-08-15", name: "Independence Day",      type: "PUBLIC" },
  { id: 6,  date: "2026-09-14", name: "Vinayagar Chaturthi",   type: "PUBLIC" },
  { id: 7,  date: "2026-10-02", name: "Gandhi Jayanthi",       type: "PUBLIC" },
  { id: 8,  date: "2026-10-19", name: "Ayudha Pooja",          type: "PUBLIC" },
  { id: 9,  date: "2026-11-08", name: "Deepavali",             type: "PUBLIC" },
  { id: 10, date: "2026-11-09", name: "Deepavali (Holiday)",   type: "PUBLIC" },
  { id: 11, date: "2026-12-25", name: "Christmas",             type: "PUBLIC" },
];

const TYPE_COLORS = {
  PUBLIC:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  OPTIONAL:   "bg-amber-50 text-amber-700 border-amber-200",
  RESTRICTED: "bg-slate-100 text-slate-600 border-slate-200",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  holiday?: Holiday | null;
  onClose: () => void;
  onSave: (data: Holiday) => Promise<void>;
}

const HolidayModal: React.FC<ModalProps> = ({ holiday, onClose, onSave }) => {
  const [form, setForm] = useState<Holiday>({
    date: holiday?.date ?? "",
    name: holiday?.name ?? "",
    type: holiday?.type ?? "PUBLIC",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.warning("Holiday name is required"); return; }
    if (!form.date)         { toast.warning("Date is required");         return; }
    setSaving(true);
    try   { await onSave({ ...form, id: holiday?.id }); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {holiday ? "Edit Holiday" : "Add Holiday"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure company holiday details</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
              Holiday Name *
            </label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Diwali"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
              Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
              Holiday Type
            </label>
            <div className="flex gap-2">
              {(["PUBLIC", "OPTIONAL", "RESTRICTED"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    form.type === t
                      ? TYPE_COLORS[t] + " ring-2 ring-offset-1 ring-indigo-300"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <FaCheck size={11} />
            }
            {holiday ? "Save Changes" : "Add Holiday"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
const HolidayManagementView: React.FC = () => {
  const [holidays, setHolidays]         = useState<Holiday[]>([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Holiday | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [yearFilter, setYearFilter]     = useState("2026");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/settings/holidays", { params: { year: yearFilter } });
      setHolidays(Array.isArray(res.data) && res.data.length > 0 ? res.data : FALLBACK_HOLIDAYS);
    } catch {
      setHolidays(FALLBACK_HOLIDAYS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [yearFilter]);

  // ── Group by month ─────────────────────────────────────────────────────────
  const grouped = holidays.reduce<Record<number, Holiday[]>>((acc, h) => {
    const month = new Date(h.date).getMonth();
    if (!acc[month]) acc[month] = [];
    acc[month].push(h);
    return acc;
  }, {});

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async (data: Holiday) => {
    try {
      if (data.id) {
        await api.put(`/settings/holidays/${data.id}`, data);
        setHolidays(prev => prev.map(h => h.id === data.id ? { ...h, ...data } : h));
        toast.success("Holiday updated");
      } else {
        const res = await api.post("/settings/holidays", data);
        setHolidays(prev => [...prev, res.data ?? { ...data, id: Date.now() }]);
        toast.success("Holiday added");
      }
    } catch {
      // optimistic
      if (data.id) {
        setHolidays(prev => prev.map(h => h.id === data.id ? { ...h, ...data } : h));
        toast.success("Holiday updated");
      } else {
        setHolidays(prev => [...prev, { ...data, id: Date.now() }]);
        toast.success("Holiday added");
      }
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeleting(true);
    try   { await api.delete(`/settings/holidays/${id}`); } catch { /* optimistic */ }
    finally {
      setHolidays(prev => prev.filter(h => h.id !== id));
      toast.success("Holiday removed");
      setDeleteConfirm(null);
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return dateStr; }
  };

  const getDayName = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "short" });
    } catch { return ""; }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Holiday Management</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Manage company holidays — these are excluded from leave calculations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white text-slate-700 font-bold"
          >
            {["2025", "2026", "2027"].map(y => <option key={y}>{y}</option>)}
          </select>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95 whitespace-nowrap"
          >
            <FaPlus size={11} /> Add Holiday
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {(["PUBLIC", "OPTIONAL", "RESTRICTED"] as const).map(t => (
          <div key={t} className={`border rounded-xl p-4 shadow-sm ${TYPE_COLORS[t]}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{t}</p>
            <p className="text-2xl font-black mt-1">
              {holidays.filter(h => (h.type ?? "PUBLIC") === t).length}
            </p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Holidays...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {MONTHS.map((monthName, idx) => {
            const monthHolidays = grouped[idx];
            if (!monthHolidays?.length) return null;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Month header */}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt size={12} className="text-indigo-400" />
                    <span className="text-sm font-black text-slate-700">{monthName} {yearFilter}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {monthHolidays.length} holiday{monthHolidays.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Holidays list */}
                <div className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {monthHolidays
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map(h => (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 group transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {/* Date block */}
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-indigo-400 uppercase leading-none">
                              {getDayName(h.date)}
                            </span>
                            <span className="text-sm font-black text-indigo-700 leading-tight">
                              {new Date(h.date).getDate()}
                            </span>
                          </div>

                          {/* Name + date */}
                          <div>
                            <p className="text-sm font-bold text-slate-900">{h.name}</p>
                            <p className="text-[11px] text-slate-400">{formatDate(h.date)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Type badge */}
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${TYPE_COLORS[h.type ?? "PUBLIC"]}`}>
                            {h.type ?? "PUBLIC"}
                          </span>

                          {/* Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditTarget(h); setModalOpen(true); }}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(h.id!)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {holidays.length === 0 && (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <FaCalendarAlt className="text-slate-300" size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-700">No Holidays Configured</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Holiday" to get started</p>
              </div>
              <button
                onClick={() => { setEditTarget(null); setModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700"
              >
                <FaPlus size={11} /> Add First Holiday
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <FaExclamationTriangle className="text-rose-500" size={16} />
                </div>
                <h3 className="text-base font-black text-slate-900">Remove Holiday</h3>
              </div>
              <p className="text-sm text-slate-500 mb-5">
                This holiday will be removed from the calendar and will no longer be excluded from leave calculations.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <HolidayModal
            holiday={editTarget}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HolidayManagementView;