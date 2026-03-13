import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLayerGroup, FaSearch, FaPlus, FaEdit, FaUsers,
  FaUserTie, FaTimes, FaCheck, FaBuilding
} from 'react-icons/fa';
import { adminService, type Team } from '../../services/adminService';
import { toast } from 'sonner';

interface TeamModalProps {
  team?: Team | null;
  onClose: () => void;
  onSave: (data: Partial<Team>) => Promise<void>;
}

const TeamModal: React.FC<TeamModalProps> = ({ team, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: team?.name ?? '',
    managerName: team?.managerName ?? '',
    department: team?.department ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.department) { toast.warning('Name and department are required'); return; }
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
          <h3 className="text-base font-black text-slate-900">{team ? 'Edit Team' : 'Create Team'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><FaTimes /></button>
        </div>

        <div className="p-6 space-y-4">
          {[
            { label: 'Team Name *', key: 'name', placeholder: 'e.g. Frontend Squad' },
            { label: 'Department *', key: 'department', placeholder: 'e.g. Engineering' },
            { label: 'Assigned Manager', key: 'managerName', placeholder: 'e.g. Alice Johnson' },
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
            {team ? 'Save Changes' : 'Create Team'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const TeamManagementView: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Team | null>(null);

  const ACCENT_COLORS = [
    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
    { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
  ];

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllTeams();
      setTeams(data);
    } catch {
      setTeams([
        { id: 1, name: 'Frontend Squad', managerId: 1, managerName: 'Alice Johnson', department: 'Engineering', memberCount: 5 },
        { id: 2, name: 'Backend Team', managerId: 1, managerName: 'Alice Johnson', department: 'Engineering', memberCount: 6 },
        { id: 3, name: 'Product Alpha', managerId: 2, managerName: 'Bob Williams', department: 'Product', memberCount: 4 },
        { id: 4, name: 'Design Crew', managerId: 3, managerName: 'Carol Smith', department: 'Design', memberCount: 3 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.managerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<Team>) => {
    if (editTarget) {
      await adminService.updateTeam(editTarget.id, data);
      toast.success('Team updated');
    } else {
      await adminService.createTeam(data);
      toast.success('Team created');
    }
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Team Management</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Organize employees into teams under managers</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
        >
          <FaPlus size={11} /> Create Team
        </button>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Teams', value: teams.length, icon: <FaLayerGroup size={14} />, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Departments', value: new Set(teams.map(t => t.department)).size, icon: <FaBuilding size={14} />, color: 'text-violet-600 bg-violet-50' },
          { label: 'Total Members', value: teams.reduce((s, t) => s + t.memberCount, 0), icon: <FaUsers size={14} />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Active Managers', value: new Set(teams.map(t => t.managerId)).size, icon: <FaUserTie size={14} />, color: 'text-amber-600 bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search teams..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((t, i) => {
              const c = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${c.bg} ${c.border} ${c.text}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      {t.department}
                    </div>
                    <button
                      onClick={() => { setEditTarget(t); setModalOpen(true); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <FaEdit size={12} />
                    </button>
                  </div>

                  <h3 className="font-black text-slate-900 text-lg mb-1">{t.name}</h3>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <FaUserTie size={10} className="text-indigo-400" />
                      {t.managerName || 'No manager'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 ml-auto">
                      <FaUsers size={10} className="text-emerald-400" />
                      {t.memberCount} members
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="col-span-2 py-20 flex flex-col items-center gap-3">
              <FaLayerGroup className="text-slate-200" size={40} />
              <p className="text-sm font-bold text-slate-400">No teams found</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <TeamModal team={editTarget} onClose={() => setModalOpen(false)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagementView;
