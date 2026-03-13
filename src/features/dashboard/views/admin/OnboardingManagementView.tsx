import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaIdCard, FaSearch, FaCheck, FaTimes,
  FaWifi, FaDesktop, FaFilter, FaCalendarAlt
} from 'react-icons/fa';
import { adminService, type OnboardingRequest } from '../../services/adminService';
import { toast } from 'sonner';

const MOCK_REQUESTS: OnboardingRequest[] = [
  { id: 1, employeeName: 'Arjun Mehta', employeeId: 101, requestType: 'BIOMETRIC', requestedDate: '2025-03-10', status: 'PENDING' },
  { id: 2, employeeName: 'Sneha Rao', employeeId: 102, requestType: 'VPN', requestedDate: '2025-03-11', status: 'PENDING' },
  { id: 3, employeeName: 'Kiran Reddy', employeeId: 103, requestType: 'SYSTEM_ACCESS', requestedDate: '2025-03-09', status: 'APPROVED' },
  { id: 4, employeeName: 'Divya Nair', employeeId: 104, requestType: 'BIOMETRIC', requestedDate: '2025-03-08', status: 'REJECTED', remarks: 'Missing HR clearance' },
  { id: 5, employeeName: 'Rohan Gupta', employeeId: 105, requestType: 'VPN', requestedDate: '2025-03-12', status: 'PENDING' },
];

const requestTypeConfig = {
  BIOMETRIC: { label: 'Biometric Access', icon: <FaIdCard size={13} />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  VPN: { label: 'VPN Access', icon: <FaWifi size={13} />, color: 'text-violet-600 bg-violet-50 border-violet-200' },
  SYSTEM_ACCESS: { label: 'System Access', icon: <FaDesktop size={13} />, color: 'text-sky-600 bg-sky-50 border-sky-200' },
};

const OnboardingManagementView: React.FC = () => {
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOnboardingRequests();
      setRequests(data);
    } catch {
      setRequests(MOCK_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = requests.filter(r => {
    const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchType = typeFilter === 'ALL' || r.requestType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleApprove = async (id: number) => {
    setProcessing(id);
    try {
      await adminService.approveOnboarding(id);
      toast.success('Request approved');
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as const } : r));
    } catch {
      toast.error('Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    setProcessing(rejectId);
    try {
      await adminService.rejectOnboarding(rejectId, rejectRemarks);
      toast.success('Request rejected');
      setRequests(prev => prev.map(r => r.id === rejectId ? { ...r, status: 'REJECTED' as const, remarks: rejectRemarks } : r));
      setRejectId(null);
      setRejectRemarks('');
    } catch {
      toast.error('Failed to reject');
    } finally {
      setProcessing(null);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Onboarding Management</h2>
        <p className="text-xs font-medium text-slate-500 mt-0.5">Approve biometric, VPN, and system access requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Requests', value: stats.total, color: 'border-slate-200 bg-slate-50 text-slate-700' },
          { label: 'Pending', value: stats.pending, color: 'border-amber-200 bg-amber-50 text-amber-700' },
          { label: 'Approved', value: stats.approved, color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
          { label: 'Rejected', value: stats.rejected, color: 'border-rose-200 bg-rose-50 text-rose-700' },
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
            placeholder="Search employee..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          />
        </div>
        <div className="flex gap-2 items-center">
          <FaFilter size={11} className="text-slate-400" />
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {s}
            </button>
          ))}
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none text-slate-700 bg-white"
        >
          <option value="ALL">All Types</option>
          <option value="BIOMETRIC">Biometric</option>
          <option value="VPN">VPN</option>
          <option value="SYSTEM_ACCESS">System Access</option>
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
                  {['Employee', 'Request Type', 'Requested Date', 'Status', 'Remarks', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const rtc = requestTypeConfig[r.requestType];
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0">
                            {r.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{r.employeeName}</p>
                            <p className="text-[10px] text-slate-400">EMP#{r.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border w-fit ${rtc.color}`}>
                          {rtc.icon} {rtc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <FaCalendarAlt size={9} /> {r.requestedDate}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          r.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-[150px] truncate">
                        {r.remarks || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {r.status === 'PENDING' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(r.id)}
                              disabled={processing === r.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-all disabled:opacity-60"
                            >
                              {processing === r.id ? <span className="w-3 h-3 border-2 border-emerald-700/30 border-t-emerald-700 rounded-full animate-spin" /> : <FaCheck size={10} />}
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectId(r.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all"
                            >
                              <FaTimes size={10} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium italic">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <FaIdCard className="mx-auto text-slate-200 mb-3" size={32} />
                      <p className="text-sm font-bold text-slate-400">No requests found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectId !== null && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
            >
              <h3 className="text-base font-black text-slate-900 mb-1">Reject Request</h3>
              <p className="text-xs text-slate-500 mb-4">Provide a reason for rejection (optional)</p>
              <textarea
                value={rejectRemarks}
                onChange={e => setRejectRemarks(e.target.value)}
                placeholder="Reason for rejection..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setRejectId(null)} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                <button
                  onClick={handleReject}
                  disabled={!!processing}
                  className="flex-1 px-4 py-2.5 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {processing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaTimes size={11} />}
                  Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingManagementView;
