import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaFileInvoiceDollar, FaCalendarAlt, FaChartBar,
  FaTimes, FaUserCheck, FaUserTimes, FaToggleOn, FaToggleOff, FaCheck, FaSyncAlt, FaTrash
} from 'react-icons/fa';
import { employeeService, type Employee } from '../../hr/service/employeeService';
import { PayslipService } from '../service/payslipService';
import { notify } from '../../../../../utils/notifications';
import CustomLoader from '../../../../../components/ui/CustomLoader';
import type { Payslip, PayslipCreateRequest } from '../../types';
import api from '../../../../../api/axiosInstance';

// ─── Types ────────────────────────────────────────────────────────
interface LeaveBreakdown {
  leaveType: string;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
  halfDayCount: number;
}

interface LeaveBalance {
  employeeId: number;
  employeeName: string;
  year: number;
  totalAllocated: number;
  totalUsed: number;
  totalRemaining: number;
  compOffBalance: number;
  compOffEarned: number;
  compOffUsed: number;
  carriedFromLastYear: number;
  breakdown: LeaveBreakdown[];
}

// ─── Leave Modal ──────────────────────────────────────────────────
const LeaveModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/leaves-balance/${employee.id}?year=${year}`);
        setBalance(res.data);
      } catch {
        notify.error('Failed', 'Could not load leave balance');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [employee.id, year]);

  const LEAVE_COLORS: Record<string, string> = {
    SICK: 'bg-rose-100 text-rose-600',
    ANNUAL_LEAVE: 'bg-indigo-100 text-indigo-600',
    PATERNITY: 'bg-blue-100 text-blue-600',
    COMP_OFF: 'bg-amber-100 text-amber-600',
    MATERNITY: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-emerald-500 text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{employee.name}</h3>
              <p className="text-xs text-slate-400">Leave Balance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={year} onChange={e => setYear(parseInt(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
              <FaTimes className="text-slate-400" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex justify-center py-8"><CustomLoader label="Loading..." /></div>
          ) : balance ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Allocated', value: balance.totalAllocated, color: 'slate' },
                  { label: 'Used', value: balance.totalUsed, color: 'rose' },
                  { label: 'Remaining', value: balance.totalRemaining, color: 'emerald' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`bg-${color}-50 rounded-xl p-3 text-center`}>
                    <p className={`text-xl font-black text-${color}-600`}>{value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-600">Comp Off Balance</p>
                  <p className="text-[10px] text-slate-400">Earned: {balance.compOffEarned} · Used: {balance.compOffUsed}</p>
                </div>
                <p className="text-xl font-black text-amber-600">{balance.compOffBalance}</p>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leave Breakdown</p>
                {balance.breakdown.map(b => (
                  <div key={b.leaveType} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${LEAVE_COLORS[b.leaveType] || 'bg-slate-200 text-slate-600'}`}>
                        {b.leaveType.replace(/_/g, ' ')}
                      </span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700">
                          {b.usedDays} used · {b.remainingDays} remaining
                        </span>
                        <span className="text-[10px] text-slate-400 block">of {b.allocatedDays} days</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${b.allocatedDays > 0 ? (b.usedDays / b.allocatedDays) * 100 : 0}%` }}
                      />
                    </div>
                    {b.halfDayCount > 0 && (
                      <p className="text-[10px] text-slate-400 mt-1">Half days: {b.halfDayCount}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-slate-400 py-8">No leave data found</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Annual Payslip Modal ─────────────────────────────────────────
const AnnualPayslipModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/payslip/employee/${employee.id}/${year}`, { silent: [404, 500] });
        setPayslips(res.data || []);
      } catch {
        setPayslips([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [employee.id, year]);

  const totalNet = payslips.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const totalGross = payslips.reduce((sum, p) => sum + (p.grossSalary || 0), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-violet-50 rounded-xl flex items-center justify-center">
              <FaChartBar className="text-violet-500 text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{employee.name}</h3>
              <p className="text-xs text-slate-400">Annual Payslip Summary</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={year} onChange={e => setYear(parseInt(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
              <FaTimes className="text-slate-400" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex justify-center py-8"><CustomLoader label="Fetching annual data..." /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Gross</p>
                  <p className="text-xl font-black text-emerald-600">₹{totalGross.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Net</p>
                  <p className="text-xl font-black text-indigo-600">₹{totalNet.toLocaleString('en-IN')}</p>
                </div>
              </div>
              {payslips.length === 0 ? (
                <div className="text-center py-8">
                  <FaChartBar className="text-slate-200 text-4xl mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No payslips for {year}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        {['Month', 'Basic', 'Gross', 'PF', 'TDS', 'Net'].map(h => (
                          <th key={h} className={`py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${h === 'Month' ? 'text-left' : 'text-right'}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {payslips.map(p => (
                        <tr key={p.month} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-700">{MONTHS[p.month - 1]}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">₹{(p.basicSalary || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">₹{(p.grossSalary || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-rose-500">₹{(p.pf || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-rose-500">₹{(p.tds || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-800">₹{(p.netSalary || 0).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-800">
                        <td className="py-2.5 px-3 font-black text-white">Total</td>
                        <td className="py-2.5 px-3 text-right text-slate-300">-</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400">₹{totalGross.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-400">₹{payslips.reduce((s, p) => s + (p.pf || 0), 0).toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-400">₹{payslips.reduce((s, p) => s + (p.tds || 0), 0).toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right font-black text-white">₹{totalNet.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Helper: fill form from data ──────────────────────────────────
const fillFormFromData = (data: any, employeeId: number, month: number, year: number): PayslipCreateRequest => ({
  employeeId,
  month,
  year,
  status: data.status || 'PAID',
  basicSalary: data.basicSalary || 0,
  hra: data.hra || 0,
  conveyance: data.conveyance || 0,
  medical: data.medical || 0,
  otherAllowance: data.otherAllowance || 0,
  bonus: data.bonus || 0,
  incentive: data.incentive || 0,
  stipend: data.stipend || 0,
  pf: data.pf || 0,
  esi: data.esi || 0,
  professionalTax: data.professionalTax || 0,
  tds: data.tds || 0,
  lop: data.lop || 0,
  lopDays: data.lopDays || 0,
  variablePay: data.variablePay || 0,
});

// ─── Create/Edit Payslip Modal ────────────────────────────────────
const CreatePayslipModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [existingPayslip, setExistingPayslip] = useState<Payslip | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [prefillBadge, setPrefillBadge] = useState(false);

  const [form, setForm] = useState<PayslipCreateRequest>({
    employeeId: employee.id,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: 'PAID',
    basicSalary: 0, hra: 0, conveyance: 0, medical: 0, otherAllowance: 0,
    bonus: 0, incentive: 0, stipend: 0,
    pf: 0, esi: 0, professionalTax: 0, tds: 0, lop: 0, lopDays: 0, variablePay: 0,
  });

  // Month/Year change → first check existing, then prefill
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setPrefillBadge(false);

        // Step 1: Check existing payslip
        try {
          const res = await api.get(
            `/payslip/employee/${employee.id}/${form.year}/${form.month}`,
            { silent: [404, 500] }
          );
          setExistingPayslip(res.data);
          setForm(fillFormFromData(res.data, employee.id, form.month, form.year));
          return; // existing iruku → stop here
        } catch {
          setExistingPayslip(null);
        }

        // Step 2: No existing → prefill from previous month
        try {
          const res = await api.get(
            `/payslip/prefill?employeeId=${employee.id}&year=${form.year}&month=${form.month}`,
            { silent: [404, 500] }
          );
          setForm(fillFormFromData(res.data, employee.id, form.month, form.year));
          setPrefillBadge(true); // prefill aaguthu badge kaanum
        } catch {
          // No prefill either → empty form
          setForm(prev => ({
            ...prev,
            basicSalary: 0, hra: 0, conveyance: 0, medical: 0, otherAllowance: 0,
            bonus: 0, incentive: 0, stipend: 0,
            pf: 0, esi: 0, professionalTax: 0, tds: 0, lop: 0, lopDays: 0, variablePay: 0,
          }));
        }
      } finally {
        setFetchLoading(false);
      }
    };
    fetchData();
  }, [form.month, form.year, employee.id]);

  const update = (field: keyof PayslipCreateRequest, val: number) =>
    setForm(prev => ({ ...prev, [field]: val }));

  const gross = form.basicSalary + form.hra + form.conveyance + form.medical +
    form.otherAllowance + form.bonus + form.incentive + form.stipend;
  const deductions = form.pf + form.esi + form.professionalTax + form.tds + form.variablePay + form.lop;
  const net = gross - deductions;

  const EARNINGS_FIELDS = [
    { label: 'Basic Salary', field: 'basicSalary' },
    { label: 'HRA', field: 'hra' },
    { label: 'Conveyance', field: 'conveyance' },
    { label: 'Medical', field: 'medical' },
    { label: 'Other Allowance', field: 'otherAllowance' },
    { label: 'Bonus', field: 'bonus' },
    { label: 'Incentive', field: 'incentive' },
    { label: 'Stipend', field: 'stipend' },
  ];

  const DEDUCTION_FIELDS = [
    { label: 'PF', field: 'pf' },
    { label: 'ESI', field: 'esi' },
    { label: 'Professional Tax', field: 'professionalTax' },
    { label: 'TDS', field: 'tds' },
    { label: 'LOP', field: 'lop' },
    { label: 'LOP Days', field: 'lopDays' },
    { label: 'Variable Pay', field: 'variablePay' },
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      if (existingPayslip) {
        await PayslipService.updatePayslip(form);
        notify.success('Payslip updated successfully');
      } else {
        await PayslipService.createPayslip(form);
        notify.success('Payslip created successfully');
      }
      onClose();
    } catch {
      notify.error('Failed', existingPayslip ? 'Could not update payslip' : 'Could not create payslip');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await PayslipService.deletePayslip(employee.id, form.year, form.month);
      notify.success('Payslip deleted');
      onClose();
    } catch {
      notify.error('Failed', 'Could not delete payslip');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                <FaFileInvoiceDollar className="text-indigo-500 text-sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800">
                    {existingPayslip ? 'Edit Payslip' : 'Create Payslip'}
                  </h3>
                  {existingPayslip && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black">EXISTS</span>
                  )}
                  {!existingPayslip && prefillBadge && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black">PREFILLED</span>
                  )}
                </div>
                <p className="text-xs text-indigo-500 font-semibold">#{employee.id} · {employee.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {existingPayslip && (
                <button onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors"
                >
                  <FaTrash className="text-xs" /> Delete
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
                <FaTimes className="text-slate-400" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Month + Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month</label>
                <select value={form.month} onChange={e => update('month', parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</label>
                <select value={form.year} onChange={e => update('year', parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>

            {fetchLoading ? (
              <div className="flex justify-center py-4"><CustomLoader label="Fetching payslip data..." /></div>
            ) : (
              <>
                {/* Earnings */}
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Earnings</p>
                  <div className="grid grid-cols-2 gap-3">
                    {EARNINGS_FIELDS.map(({ label, field }) => (
                      <div key={field} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                        <input type="tel" value={form[field as keyof PayslipCreateRequest]}
                          onChange={e => update(field as keyof PayslipCreateRequest, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-3">Deductions</p>
                  <div className="grid grid-cols-2 gap-3">
                    {DEDUCTION_FIELDS.map(({ label, field }) => (
                      <div key={field} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                        <input type="tel" value={form[field as keyof PayslipCreateRequest]}
                          onChange={e => update(field as keyof PayslipCreateRequest, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-rose-50 border border-rose-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-800 rounded-xl p-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Gross</p>
                    <p className="text-sm font-black text-emerald-400">₹{gross.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-center border-x border-slate-700">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Deductions</p>
                    <p className="text-sm font-black text-rose-400">₹{deductions.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Net</p>
                    <p className="text-sm font-black text-white">₹{net.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white border-t border-slate-100">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >Cancel</button>
            <button onClick={handleSave} disabled={loading || fetchLoading}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading
                ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <FaCheck className="text-xs" />
              }
              {existingPayslip ? 'Update Payslip' : 'Create Payslip'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                <FaTrash className="text-rose-500 text-sm" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Confirm Delete</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Delete payslip for {employee.name} — {MONTHS[form.month - 1]} {form.year}?
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >No, Cancel</button>
              <button onClick={handleDelete} disabled={loading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Main CFO Employees Page ──────────────────────────────────────
export const CFOEmployeesPage: React.FC = () => {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [taxRegimes, setTaxRegimes] = useState<Record<number, 'OLD' | 'NEW'>>({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [payrollLoading, setPayrollLoading] = useState(false);
  const [leaveModal, setLeaveModal] = useState<Employee | null>(null);
  const [annualModal, setAnnualModal] = useState<Employee | null>(null);
  const [createPayslipModal, setCreatePayslipModal] = useState<Employee | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await employeeService.getAllEmployees(0, 1000);
        setEmployees(res.content);
        const defaults: Record<number, 'OLD' | 'NEW'> = {};
        res.content.forEach((e: Employee) => { defaults[e.id] = 'OLD'; });
        setTaxRegimes(defaults);
      } catch {
        notify.error('Failed', 'Could not load employees');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Manager name → employees array-la find pannuvom
  const getManagerName = (managerId: number | null) => {
    if (!managerId) return '—';
    const manager = employees.find(e => e.id === managerId);
    return manager?.name || `#${managerId}`;
  };

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id?.toString().includes(searchQuery) ||
    e.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTaxRegime = (id: number) => {
    setTaxRegimes(prev => ({ ...prev, [id]: prev[id] === 'OLD' ? 'NEW' : 'OLD' }));
  };

  const handleGeneratePayroll = async () => {
    try {
      setPayrollLoading(true);
      await api.post(`/payroll/generate?year=${year}&month=${month}`);
      notify.success(`Payroll generated for ${MONTHS[month - 1]} ${year}`);
    } catch {
      notify.error('Failed', 'Could not generate payroll');
    } finally {
      setPayrollLoading(false);
    }
  };

  const handlePreparePayroll = async () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    try {
      setPayrollLoading(true);
      await api.post(`/payroll/prepare?year=${nextYear}&month=${nextMonth}`);
      notify.success(`Payroll prepared for ${MONTHS[nextMonth - 1]} ${nextYear}`);
      setMonth(nextMonth);
      setYear(nextYear);
    } catch {
      notify.error('Failed', 'Could not prepare payroll');
    } finally {
      setPayrollLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Employees</h1>
          <p className="text-xs text-slate-400 mt-0.5">CFO — Employee financial overview</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none shadow-sm"
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none shadow-sm"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
          <button onClick={handlePreparePayroll} disabled={payrollLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-600 transition-colors disabled:opacity-50"
          >
            <FaSyncAlt className="text-xs" /> Prepare Payroll
          </button>
          <button onClick={handleGeneratePayroll} disabled={payrollLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50"
          >
            <FaFileInvoiceDollar className="text-xs" /> Generate Payroll
          </button>
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <p className="text-xs text-slate-500">{filtered.length} employees</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
        <input type="text" placeholder="Search by name, ID or role..."
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><CustomLoader label="Loading employees..." /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><p className="text-sm text-slate-400">No employees found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Employee', 'Role', 'Manager', 'Joined', 'Status', 'Tax Regime', 'Actions'].map(h => (
                    <th key={h} className={`py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${h === 'Employee' ? 'text-left' : 'text-center'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-indigo-100 rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">
                          {emp.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700">{emp.name}</p>
                          <p className="text-[10px] text-slate-400">#{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">{emp.role || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      {emp.managerId ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs font-semibold text-slate-700">{getManagerName(emp.managerId)}</span>
                          <span className="text-[10px] text-slate-400">#{emp.managerId}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">
                      {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {emp.active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">
                          <FaUserCheck className="text-[8px]" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold">
                          <FaUserTimes className="text-[8px]" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleTaxRegime(emp.id)}
                        className={`flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                          taxRegimes[emp.id] === 'NEW' ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {taxRegimes[emp.id] === 'NEW' ? <FaToggleOn className="text-sm" /> : <FaToggleOff className="text-sm" />}
                        {taxRegimes[emp.id] || 'OLD'} Regime
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setLeaveModal(emp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-bold transition-colors"
                        >
                          <FaCalendarAlt className="text-[10px]" /> Leave
                        </button>
                        <button onClick={() => setCreatePayslipModal(emp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-bold transition-colors"
                        >
                          <FaFileInvoiceDollar className="text-[10px]" /> Payslip
                        </button>
                        <button onClick={() => setAnnualModal(emp)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl text-[10px] font-bold transition-colors"
                        >
                          <FaChartBar className="text-[10px]" /> Annual
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {leaveModal && <LeaveModal employee={leaveModal} onClose={() => setLeaveModal(null)} />}
      {annualModal && <AnnualPayslipModal employee={annualModal} onClose={() => setAnnualModal(null)} />}
      {createPayslipModal && <CreatePayslipModal employee={createPayslipModal} onClose={() => setCreatePayslipModal(null)} />}
    </div>
  );
};