import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaDownload, FaCheckCircle, FaClock, FaFileInvoiceDollar,
  FaCalendarAlt, FaIdBadge, FaWallet, FaCoins, FaChartLine,
  FaExclamationTriangle,
} from 'react-icons/fa';
import api from '../../../../api/axiosInstance';
import { useAuth } from '../../../auth/hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
type PayslipStatus = 'Pending' | 'Paid';
interface MyPayslip {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  netSalary: number;
  status: PayslipStatus;
  uploadedAt: string;
}


// ─── Mock fallback (removed when real API responds) ───────────────────────────
const MOCK: MyPayslip = {
  id: 1,
  employeeId: 42,
  employeeName: 'Admin One',
  month: 'February',
  year: 2026,
  basicSalary: 75000,
  netSalary: 64237,
  status: 'Pending',
  uploadedAt: '2026-02-28',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');
const initials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
// ─── Stat Pill ────────────────────────────────────────────────────────────────
interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  delay: number;
}


const StatPill: React.FC<StatPillProps> = ({ icon, label, value, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-slate-100 shadow-sm"
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</p>
      <p className="text-sm font-black text-slate-800 truncate">{value}</p>
    </div>
  </motion.div>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const PayslipManagementView: React.FC = () => {
  const { user } = useAuth();
  const [payslip, setPayslip] = useState<MyPayslip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  // ── Fetch logged-in user payslip ───────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<MyPayslip>('/payslips/my');
        setPayslip(res.data);
      } catch {
        // Fall back to mock so UI is always visible during development
        setPayslip({ ...MOCK, employeeName: user?.name ?? MOCK.employeeName });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);
  // ── Download PDF ───────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!payslip) return;
    setDownloading(true);
    try {
      const res = await api.get(`/payslips/${payslip.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${payslip.month}_${payslip.year}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      /* axios interceptor handles toast */
    } finally {
      setDownloading(false);
    }
  }
  // ── Mark as Paid ───────────────────────────────────────────────────────────
  const handleMarkPaid = async () => {
    if (!payslip || payslip.status === 'Paid') return;
    setMarkingPaid(true);
    try {
      await api.post(`/payslips/${payslip.id}/mark-paid`);
      setPayslip(p => p ? { ...p, status: 'Paid' } : p);
    } catch {
      /* handled globally */
    } finally {
      setMarkingPaid(false);
    }
  }
  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400">Loading your payslip…</p>
        </div>
      </div>
    )
  }
  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !payslip) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <FaExclamationTriangle className="text-rose-400" size={20} />
          </div>
          <div>
            <p className="text-base font-black text-slate-700">No payslip found</p>
            <p className="text-xs text-slate-400 mt-1">Your payslip hasn't been uploaded yet.</p>
          </div>
        </div>
      </div>
    )
  }
  const isPending = payslip.status === 'Pending';
  const deductions = Math.max(payslip.basicSalary - payslip.netSalary, 0);
  return (
    <div className="space-y-6 pb-10">
      <PageHeader />
      {/* ── PAYSLIP CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto"
      >

        {/* ── HEADER BAND ── */}
        <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 rounded-t-2xl px-8 pt-8 pb-16 overflow-hidden">
          {/* Decorative bubbles */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-6 right-20 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
          {/* White arch at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-white rounded-t-3xl" />
          <div className="relative flex items-center gap-5">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: 'backOut' }}
              className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur border-2 border-white/30
                flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg"
            >
              {initials(payslip.employeeName)}
            </motion.div>
            {/* Name + ID + status */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
              className="text-white flex-1 min-w-0"
            >
              <p className="text-xl font-black tracking-tight leading-tight truncate">
                {payslip.employeeName}
              </p>
              <p className="text-indigo-200 text-xs font-bold mt-0.5">EMP#{payslip.employeeId}</p>
              <div className="mt-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={payslip.status}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                      isPending
                        ? 'bg-amber-400/20 border-amber-300/40 text-amber-200'
                        : 'bg-emerald-400/20 border-emerald-300/40 text-emerald-200'
                    }`}
                  >
                    {isPending ? <FaClock size={8} /> : <FaCheckCircle size={8} />}
                    {payslip.status}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
            {/* Period — top right */}
            <div className="text-right shrink-0">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Period</p>
              <p className="text-white font-black text-base leading-tight">{payslip.month}</p>
              <p className="text-indigo-300 text-xs font-bold">{payslip.year}</p>
            </div>
          </div>
        </div>
        {/* ── STAT PILLS ── */}
        <div className="bg-white px-6 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatPill icon={<FaCoins size={14} />}    label="Basic Salary" value={fmt(payslip.basicSalary)} accent="bg-indigo-500" delay={0.25} />
          <StatPill icon={<FaChartLine size={14} />} label="Deductions"   value={fmt(deductions)}          accent="bg-rose-500"   delay={0.32} />
          <StatPill icon={<FaWallet size={14} />}    label="Net Salary"   value={fmt(payslip.netSalary)}   accent="bg-emerald-500" delay={0.39} />
        </div>
        {/* ── DETAIL ROWS ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-white px-6 pb-5"
        >
          <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
            {[
              {
                icon: <FaCalendarAlt size={11} className="text-indigo-400" />,
                label: 'Pay Period',
                value: `${payslip.month} ${payslip.year}`,
              },
              {
                icon: <FaIdBadge size={11} className="text-indigo-400" />,
                label: 'Employee ID',
                value: `EMP#${payslip.employeeId}`,
              },
              {
                icon: <FaFileInvoiceDollar size={11} className="text-indigo-400" />,
                label: 'Uploaded On',
                value: payslip.uploadedAt,
              },
              {
                icon: isPending
                  ? <FaClock size={11} className="text-amber-400" />
                  : <FaCheckCircle size={11} className="text-emerald-400" />,
                label: 'Payment Status',
                value: (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={payslip.status}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`font-black ${isPending ? 'text-amber-600' : 'text-emerald-600'}`}
                    >
                      {payslip.status}
                    </motion.span>
                  </AnimatePresence>
                ),
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/70 transition-colors"
              >
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  {icon} {label}
                </span>
                <span className="text-sm font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
        {/* ── NET SALARY HIGHLIGHT ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.96 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.48, duration: 0.3 }}
          className="bg-white px-6 pb-5"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                Net Take-Home
              </p>
              <p className="text-2xl font-black text-white tracking-tight mt-0.5">
                {fmt(payslip.netSalary)}
              </p>
            </div>
            <FaWallet className="text-white/25" size={38} />
          </div>
        </motion.div>
        {/* ── ACTION BUTTONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, duration: 0.3 }}
          className="bg-white rounded-b-2xl px-6 pb-8 pt-1 border-t border-slate-50 flex flex-col sm:flex-row gap-3"
        >
          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5
              bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
              disabled:opacity-60 text-white text-sm font-black rounded-xl
              shadow-md shadow-blue-200/60 transition-all duration-150 select-none"
          >
            {downloading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <FaDownload size={13} />
            }
            {downloading ? 'Preparing…' : 'Download Payslip'}
          </button>
          {/* Mark as Paid — only when Pending */}
          <AnimatePresence>
            {isPending && (
              <motion.button
                key="mark-paid"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                onClick={handleMarkPaid}
                disabled={markingPaid}
                className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5
                  bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]
                  disabled:opacity-60 text-white text-sm font-black rounded-xl
                  shadow-md shadow-emerald-200/60 transition-all duration-150 select-none"
              >
                {markingPaid
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FaCheckCircle size={13} />
                }
                {markingPaid ? 'Processing…' : 'Mark as Paid'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}
// ─── Page Header ──────────────────────────────────────────────────────────────
const PageHeader: React.FC = () => (
  <div className="">
    <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Payslip</h2>
    <p className="text-xs font-medium text-slate-500 mt-0.5">
      View and download your latest salary statement
    </p>
  </div>
)

export default PayslipManagementView;
