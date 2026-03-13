import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserTie, FaSearch, FaPlus, FaEdit, FaUsers,
  FaEnvelope, FaTimes, FaBuilding, FaCheck
} from 'react-icons/fa';
import { adminService, type AdminManager } from '../../services/adminService';
import { toast } from 'sonner';

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ManagerModalProps {
  manager?: AdminManager | null;
  onClose: () => void;
  onSave: (data: Partial<AdminManager>) => Promise<void>;
}

const ManagerModal: React.FC<ManagerModalProps> = ({ manager, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: manager?.name ?? '',
    email: manager?.email ?? '',
    department: manager?.department ?? '',
    designation: manager?.designation ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.department) {
      toast.warning('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-base font-black text-slate-900">
            {manager ? 'Edit Manager' : 'Add New Manager'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {[
            { label: 'Full Name *', key: 'name', placeholder: 'John Smith' },
            { label: 'Email *', key: 'email', placeholder: 'john@company.com' },
            { label: 'Department *', key: 'department', placeholder: 'Engineering' },
            { label: 'Designation', key: 'designation', placeholder: 'Engineering Manager' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
              />
            </div>
          ))}
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
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaCheck size={11} />
            )}
            {manager ? 'Save Changes' : 'Add Manager'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────

const ManagerManagementView: React.FC = () => {
  const [managers, setManagers] = useState<AdminManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminManager | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllManagers();
      setManagers(data);
    } catch {
      // fallback mock
      setManagers([
        { id: 1, name: 'Alice Johnson', email: 'alice@company.com', department: 'Engineering', designation: 'Engineering Manager', teamSize: 8, status: 'ACTIVE', joiningDate: '2021-03-15' },
        { id: 2, name: 'Bob Williams', email: 'bob@company.com', department: 'Product', designation: 'Product Manager', teamSize: 5, status: 'ACTIVE', joiningDate: '2020-07-01' },
        { id: 3, name: 'Carol Smith', email: 'carol@company.com', department: 'Design', designation: 'Design Lead', teamSize: 4, status: 'INACTIVE', joiningDate: '2019-11-20' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = managers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<AdminManager>) => {
    if (editTarget) {
      await adminService.updateManager(editTarget.id, data);
      toast.success('Manager updated successfully');
    } else {
      await adminService.createManager(data);
      toast.success('Manager added successfully');
    }
    await load();
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (m: AdminManager) => { setEditTarget(m); setModalOpen(true); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manager Management</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Manage and configure team managers</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
        >
          <FaPlus size={11} /> Add Manager
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search managers..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Manager', 'Department', 'Designation', 'Team Size', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((m, i) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <FaEnvelope size={9} /> {m.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                          <FaBuilding size={10} className="text-slate-400" /> {m.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{m.designation}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                          <FaUsers size={10} className="text-indigo-400" /> {m.teamSize}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          m.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openEdit(m)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <FaEdit size={10} /> Edit
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <FaUserTie className="mx-auto text-slate-200 mb-3" size={32} />
                      <p className="text-sm font-bold text-slate-400">No managers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <ManagerModal manager={editTarget} onClose={() => setModalOpen(false)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagerManagementView;
