import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarAlt, FaSearch, FaUserTie, FaClock,
  FaFilter, FaCheckCircle, FaTimesCircle, FaHourglass
} from 'react-icons/fa';
import { adminService } from '../../services/adminService';

interface LeaveRecord {
  id: number;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  managerName: string;
  reason?: string;
}

const MOCK_LEAVES: LeaveRecord[] = [
  { id: 1, employeeName: 'Raj Kumar', department: 'Engineering', leaveType: 'Sick Leave', startDate: '2025-03-10', endDate: '2025-03-12', days: 3, status: 'APPROVED', managerName: 'Alice Johnson' },
  { id: 2, employeeName: 'Priya Sharma', department: 'Design', leaveType: 'Casual Leave', startDate: '2025-03-11', endDate: '2025-03-11', days: 1, status: 'PENDING', managerName: 'Carol Smith' },
  { id: 3, employeeName: 'Arun Patel', department: 'Product', leaveType: 'Earned Leave', startDate: '2025-03-08', endDate: '2025-03-14', days: 5, status: 'APPROVED', managerName: 'Bob Williams' },
  { id: 4, employeeName: 'Meera Nair', department: 'HR', leaveType: 'Casual Leave', startDate: '2025-03-13', endDate: '2025-03-13', days: 1, status: 'PENDING', managerName: 'Diana Prince' },
  { id: 5, employeeName: 'Vikram Singh', department: 'Engineering', leaveType: 'Comp Off', startDate: '2025-03-15', endDate: '2025-03-15', days: 1, status: 'REJECTED', managerName: 'Alice Johnson' },
];

const LEAVE_TYPE_COLORS: Record<string, string> = {
  'Sick Leave': 'bg-rose-50 text-rose-700 border-rose-200',
  'Casual Leave': 'bg-sky-50 text-sky-700 border-sky-200',
  'Earned Leave': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Maternity Leave': 'bg-pink-50 text-pink-700 border-pink-200',
  'Comp Off': 'bg-violet-50 text-violet-700 border-violet-200',
};

const statusConfig = {
  APPROVED: { icon: <FaCheckCircle size={11} />, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PENDING: { icon: <FaHourglass size={11} />, cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  REJECTED: { icon: <FaTimesCircle size={11} />, cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const LeaveMonitoringView: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminService.getActiveLeaves();
        setLeaves(data);
      } catch {
        setLeaves(MOCK_LEAVES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const departments = ['ALL', ...Array.from(new Set(leaves.map(l => l.department)))];

  const filtered = leaves.filter(l => {
    const matchSearch = l.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      l.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchDept = deptFilter === 'ALL' || l.department === deptFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const stats = {
    total: leaves.length,
    approved: leaves.filter(l => l.status === 'APPROVED').length,
    pending: leaves.filter(l => l.status === 'PENDING').length,
    rejected: leaves.filter(l => l.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Leave Monitoring</h2>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Track and monitor all employee leave requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Leaves', value: stats.total, color: 'text-slate-700 bg-slate-50 border-slate-200' },
          { label: 'Approved', value: stats.approved, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Rejected', value: stats.rejected, color: 'text-rose-700 bg-rose-50 border-rose-200' },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-4 shadow-sm ${s.color}`}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by employee or department..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          />
        </div>

        <div className="flex gap-2 items-center">
          <FaFilter size={11} className="text-slate-400" />
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700 bg-white"
        >
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Employee', 'Department', 'Leave Type', 'Duration', 'Days', 'Reporting Manager', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((l, i) => {
                    const sc = statusConfig[l.status];
                    const ltc = LEAVE_TYPE_COLORS[l.leaveType] || 'bg-slate-50 text-slate-600 border-slate-200';
                    return (
                      <motion.tr
                        key={l.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                              {l.employeeName.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900 whitespace-nowrap">{l.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{l.department}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${ltc}`}>{l.leaveType}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt size={9} className="text-slate-400" />
                            {l.startDate} → {l.endDate}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                            <FaClock size={9} className="text-slate-400" /> {l.days}d
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <FaUserTie size={9} /> {l.managerName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border whitespace-nowrap ${sc.cls}`}>
                            {sc.icon} {l.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <FaCalendarAlt className="mx-auto text-slate-200 mb-3" size={32} />
                      <p className="text-sm font-bold text-slate-400">No leave records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveMonitoringView;

