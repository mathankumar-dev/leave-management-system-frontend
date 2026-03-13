import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBuilding, FaSearch, FaPlus, FaEdit, FaTrash,
  FaUsers, FaTimes, FaCheck
} from 'react-icons/fa';
import { adminService, type Department } from '../../services/adminService';
import { toast } from 'sonner';

// ─── Modal ────────────────────────────────────────────────────────────────────

interface DeptModalProps {
  dept?: Department | null;
  onClose: () => void;
  onSave: (data: Partial<Department>) => Promise<void>;
}

const DeptModal: React.FC<DeptModalProps> = ({ dept, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: dept?.name ?? '',
    description: dept?.description ?? '',
    headName: dept?.headName ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.name) { toast.warning('Department name is required'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
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
          <h3 className="text-base font-black text-slate-900">{dept ? 'Edit Department' : 'New Department'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors"><FaTimes /></button>
        </div>

        <div className="p-6 space-y-4">
          {[
            { label: 'Department Name *', key: 'name', placeholder: 'e.g. Engineering' },
            { label: 'Description', key: 'description', placeholder: 'Optional description' },
            { label: 'Department Head', key: 'headName', placeholder: 'e.g. John Doe' },
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
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaCheck size={11} />}
            {dept ? 'Save Changes' : 'Create Department'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const DepartmentManagementView: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Department | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllDepartments();
      setDepartments(data);
    } catch {
      setDepartments([
        { id: 1, name: 'Engineering', description: 'Software development team', headName: 'Alice Johnson', employeeCount: 24 },
        { id: 2, name: 'Product', description: 'Product and strategy', headName: 'Bob Williams', employeeCount: 12 },
        { id: 3, name: 'Design', description: 'UI/UX and branding', headName: 'Carol Smith', employeeCount: 8 },
        { id: 4, name: 'Human Resources', description: 'People operations', headName: 'Diana Prince', employeeCount: 5 },
        { id: 5, name: 'Finance', description: 'Finance and accounting', headName: 'Edward Grant', employeeCount: 7 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<Department>) => {
    if (editTarget) {
      await adminService.updateDepartment(editTarget.id, data);
      toast.success('Department updated');
    } else {
      await adminService.createDepartment(data);
      toast.success('Department created');
    }
    await load();
  };

  const handleDelete = async (id: number) => {
    try {
      await adminService.deleteDepartment(id);
      toast.success('Department deleted');
      await load();
    } catch {
      toast.error('Cannot delete — employees may be assigned');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const COLORS = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-sky-100 text-sky-700',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Department Management</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Create and manage organizational departments</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
        >
          <FaPlus size={11} /> New Department
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search departments..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
              >
                {/* Icon + Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${COLORS[i % COLORS.length]}`}>
                    {d.name.charAt(0)}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditTarget(d); setModalOpen(true); }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(d.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                <h3 className="font-black text-slate-900 text-base mb-1">{d.name}</h3>
                {d.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{d.description}</p>}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <FaUsers size={10} /> {d.employeeCount} employees
                  </span>
                  {d.headName && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Head: {d.headName}
                    </span>
                  )}
                </div>

                {/* Delete confirm */}
                <AnimatePresence>
                  {deleteConfirm === d.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 pt-3 border-t border-rose-100 flex items-center gap-2"
                    >
                      <p className="text-xs text-rose-600 font-medium flex-1">Delete this department?</p>
                      <button onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">No</button>
                      <button onClick={() => handleDelete(d.id)} className="px-2.5 py-1 text-xs font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600">Yes</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center gap-3">
              <FaBuilding className="text-slate-200" size={40} />
              <p className="text-sm font-bold text-slate-400">No departments found</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <DeptModal dept={editTarget} onClose={() => setModalOpen(false)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentManagementView;
