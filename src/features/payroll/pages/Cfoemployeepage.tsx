import { employeeService, type Employee } from '@/features/employee/services/employeeService';
import { notify } from '@/features/notification/utils/notifications';
import type { Payslip, PayslipCreateRequest } from '@/features/payroll/payrollTypes';
import { PayslipService } from '@/features/payroll/services/payslipService';
import api from '@/services/apiClient';
import { CustomLoader } from '@/shared/components';
import React, { useEffect, useState } from 'react';
import {
    FaCalendarAlt, FaChartBar,
    FaCheck,
    FaFileInvoiceDollar,
    FaSearch,
    FaSyncAlt,
    FaTimes,
    FaToggleOff,
    FaToggleOn,
    FaTrash,
    FaUserCheck, FaUserTimes,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';

// ─── Types ────────────────────────────────────────────────────────
interface LeaveBreakdown {
    leaveType: string;
    allocatedDays: number;
    usedDays: number;
    remainingDays: number;
    halfDayCount: number;
}

interface LeaveBalance {
    employeeId: string;
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

interface YearlySummaryResponse {
    year: number;
    totalBasic: number;
    totalHra: number;
    totalConveyance: number;
    totalMedical: number;
    totalOtherAllowance: number;
    totalBonus: number;
    totalIncentive: number;
    totalStipend: number;
    totalPf: number;
    totalEsi: number;
    totalProfessionalTax: number;
    totalTds: number;
    totalLop: number;
    totalGrossSalary: number;
    totalNetSalary: number;
}

interface MonthlyPayslip {
    month: number;
    year: number;
    basicSalary: number;
    hra: number;
    conveyance: number;
    medical: number;
    otherAllowance: number;
    bonus: number;
    incentive: number;
    stipend: number;
    variablePay: number;
    grossSalary: number;
    pf: number;
    esi: number;
    professionalTax: number;
    tds: number;
    lopDays: number;
    lop: number;
    netSalary: number;
    generatedDate: string;
    status: string;
}

// ─── Constants ────────────────────────────────────────────────────
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const STATUS_STYLES: Record<string, string> = {
    PAID:      'bg-emerald-100 text-emerald-700',
    GENERATED: 'bg-indigo-100 text-indigo-700',
    PENDING:   'bg-amber-100 text-amber-700',
    CANCELLED: 'bg-rose-100 text-rose-700',
};

const fmt = (v: number) => `₹${(v || 0).toLocaleString('en-IN')}`;

// ─── Leave Modal ──────────────────────────────────────────────────
const LeaveModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
    const [balance, setBalance] = useState<LeaveBalance | null>(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchBalance = async () => {
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
        fetchBalance();
    }, [employee.id, year]);

    const LEAVE_COLORS: Record<string, string> = {
        SICK:         'bg-rose-100 text-rose-600',
        ANNUAL_LEAVE: 'bg-indigo-100 text-indigo-600',
        PATERNITY:    'bg-blue-100 text-blue-600',
        COMP_OFF:     'bg-amber-100 text-amber-600',
        MATERNITY:    'bg-pink-100 text-pink-600',
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
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
                        <select
                            value={year}
                            onChange={e => setYear(parseInt(e.target.value))}
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
                                    { label: 'Total Allocated', value: balance.totalAllocated,  color: 'slate'   },
                                    { label: 'Used',            value: balance.totalUsed,        color: 'rose'    },
                                    { label: 'Remaining',       value: balance.totalRemaining,   color: 'emerald' },
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
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all"
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
    const [summary, setSummary] = useState<YearlySummaryResponse | null>(null);
    const [monthly, setMonthly] = useState<MonthlyPayslip[]>([]);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingMonthly, setLoadingMonthly] = useState(false);
    const [activeTab, setActiveTab] = useState<'monthly' | 'summary'>('monthly');

    // ── Fetch yearly summary ──────────────────────────────────────
    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoadingSummary(true);
                const res = await api.get(`/payslip/employee/${employee.id}/${year}`);
                setSummary(res.data);
            } catch {
                setSummary(null);
            } finally {
                setLoadingSummary(false);
            }
        };
        fetchSummary();
    }, [employee.id, year]);

    // ── Fetch monthly breakdown ───────────────────────────────────
    useEffect(() => {
        const fetchMonthly = async () => {
            try {
                setLoadingMonthly(true);
                const res = await api.get(`/payslip/employee/${employee.id}/${year}/monthly`);
                const sorted = [...(res.data as MonthlyPayslip[])].sort((a, b) => a.month - b.month);
                setMonthly(sorted);
            } catch {
                setMonthly([]);
            } finally {
                setLoadingMonthly(false);
            }
        };
        fetchMonthly();
    }, [employee.id, year]);

    const EARNINGS = [
        { label: 'Basic',           key: 'totalBasic'           },
        { label: 'HRA',             key: 'totalHra'             },
        { label: 'Conveyance',      key: 'totalConveyance'      },
        { label: 'Medical',         key: 'totalMedical'         },
        { label: 'Other Allowance', key: 'totalOtherAllowance'  },
        { label: 'Bonus',           key: 'totalBonus'           },
        { label: 'Incentive',       key: 'totalIncentive'       },
        { label: 'Stipend',         key: 'totalStipend'         },
    ] as const;

    const DEDUCTIONS = [
        { label: 'PF',               key: 'totalPf'              },
        { label: 'ESI',              key: 'totalEsi'             },
        { label: 'Professional Tax', key: 'totalProfessionalTax' },
        { label: 'TDS',              key: 'totalTds'             },
        { label: 'LOP',              key: 'totalLop'             },
    ] as const;

    const totalDeductions = summary
        ? summary.totalPf + summary.totalEsi + summary.totalProfessionalTax + summary.totalTds + summary.totalLop
        : 0;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
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
                        <select
                            value={year}
                            onChange={e => setYear(parseInt(e.target.value))}
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

                {/* Tabs */}
                <div className="flex gap-1 px-6 pt-4 shrink-0">
                    {(['monthly', 'summary'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                activeTab === tab
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                        >
                            {tab === 'monthly' ? 'Monthly Breakdown' : 'Annual Summary'}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6 space-y-5">

                    {/* ════ MONTHLY TAB ════════════════════════════ */}
                    {activeTab === 'monthly' && (
                        loadingMonthly ? (
                            <div className="flex justify-center py-8">
                                <CustomLoader label="Fetching monthly data..." />
                            </div>
                        ) : monthly.length === 0 ? (
                            <div className="text-center py-8">
                                <FaChartBar className="text-slate-200 text-4xl mx-auto mb-3" />
                                <p className="text-sm text-slate-400">No payslips for {year}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50">
                                            {['Month', 'Gross', 'PF', 'TDS', 'ESI', 'LOP', 'Net', 'Status'].map(h => (
                                                <th
                                                    key={h}
                                                    className={`py-2.5 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ${
                                                        h === 'Month' ? 'text-left' : 'text-right'
                                                    }`}
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {monthly.map(p => (
                                            <tr key={p.month} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                                                    {MONTH_NAMES[p.month - 1]} {p.year}
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">
                                                    {fmt(p.grossSalary)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-slate-500">
                                                    {fmt(p.pf)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-slate-500">
                                                    {fmt(p.tds)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-slate-500">
                                                    {fmt(p.esi)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-rose-400">
                                                    {p.lopDays > 0 ? `${p.lopDays}d` : '—'}
                                                </td>
                                                <td className="py-2.5 px-3 text-right font-black text-indigo-600">
                                                    {fmt(p.netSalary)}
                                                </td>
                                                <td className="py-2.5 px-3 text-right">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                                                        STATUS_STYLES[p.status] ?? 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {/* Totals row */}
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-200 bg-slate-50">
                                            <td className="py-2.5 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Total
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                                                {fmt(monthly.reduce((s, p) => s + p.grossSalary, 0))}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-black text-slate-500">
                                                {fmt(monthly.reduce((s, p) => s + p.pf, 0))}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-black text-slate-500">
                                                {fmt(monthly.reduce((s, p) => s + p.tds, 0))}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-black text-slate-500">
                                                {fmt(monthly.reduce((s, p) => s + p.esi, 0))}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-black text-rose-400">
                                                {monthly.reduce((s, p) => s + (p.lopDays || 0), 0) > 0
                                                    ? `${monthly.reduce((s, p) => s + (p.lopDays || 0), 0)}d`
                                                    : '—'}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-black text-indigo-600">
                                                {fmt(monthly.reduce((s, p) => s + p.netSalary, 0))}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )
                    )}

                    {/* ════ SUMMARY TAB ════════════════════════════ */}
                    {activeTab === 'summary' && (
                        loadingSummary ? (
                            <div className="flex justify-center py-8">
                                <CustomLoader label="Fetching annual data..." />
                            </div>
                        ) : !summary ? (
                            <div className="text-center py-8">
                                <FaChartBar className="text-slate-200 text-4xl mx-auto mb-3" />
                                <p className="text-sm text-slate-400">No payslips for {year}</p>
                            </div>
                        ) : (
                            <>
                                {/* Top cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Gross</p>
                                        <p className="text-xl font-black text-emerald-600">{fmt(summary.totalGrossSalary)}</p>
                                    </div>
                                    <div className="bg-indigo-50 rounded-xl p-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Net</p>
                                        <p className="text-xl font-black text-indigo-600">{fmt(summary.totalNetSalary)}</p>
                                    </div>
                                </div>

                                {/* Earnings */}
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Earnings</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {EARNINGS.map(({ label, key }) => (
                                            <div key={key} className="bg-emerald-50/50 rounded-xl p-3 flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-500">{label}</span>
                                                <span className="text-xs font-black text-emerald-600">{fmt(summary[key])}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deductions */}
                                <div>
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-3">Deductions</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {DEDUCTIONS.map(({ label, key }) => (
                                            <div key={key} className="bg-rose-50/50 rounded-xl p-3 flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-500">{label}</span>
                                                <span className="text-xs font-black text-rose-500">{fmt(summary[key])}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Net bar */}
                                <div className="bg-slate-800 rounded-xl p-4 grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Gross</p>
                                        <p className="text-sm font-black text-emerald-400">{fmt(summary.totalGrossSalary)}</p>
                                    </div>
                                    <div className="text-center border-x border-slate-700">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Deductions</p>
                                        <p className="text-sm font-black text-rose-400">{fmt(totalDeductions)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Net</p>
                                        <p className="text-sm font-black text-white">{fmt(summary.totalNetSalary)}</p>
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Helper ───────────────────────────────────────────────────────
const fillFormFromData = (data: any, employeeId: string, month: number, year: number): PayslipCreateRequest => ({
    employeeId, month, year,
    status: data.status || 'PAID',
    basicSalary:      data.basicSalary      || 0,
    hra:              data.hra              || 0,
    conveyance:       data.conveyance       || 0,
    medical:          data.medical          || 0,
    otherAllowance:   data.otherAllowance   || 0,
    bonus:            data.bonus            || 0,
    incentive:        data.incentive        || 0,
    stipend:          data.stipend          || 0,
    pf:               data.pf               || 0,
    esi:              data.esi              || 0,
    professionalTax:  data.professionalTax  || 0,
    tds:              data.tds              || 0,
    lop:              data.lop              || 0,
    lopDays:          data.lopDays          || 0,
    variablePay:      data.variablePay      || 0,
});

// ─── Create/Edit Payslip Modal ────────────────────────────────────
const CreatePayslipModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [existingPayslip, setExistingPayslip] = useState<Payslip | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [prefillBadge, setPrefillBadge] = useState(false);

    const [form, setForm] = useState<PayslipCreateRequest>({
        employeeId:     employee.id,
        month:          new Date().getMonth() + 1,
        year:           new Date().getFullYear(),
        status:         'PAID',
        basicSalary:    0, hra: 0, conveyance: 0, medical: 0, otherAllowance: 0,
        bonus:          0, incentive: 0, stipend: 0,
        pf:             0, esi: 0, professionalTax: 0, tds: 0,
        lop:            0, lopDays: 0, variablePay: 0,
    });

    // Destructure to use as stable effect dependencies
    const { month: formMonth, year: formYear } = form;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchLoading(true);
                setPrefillBadge(false);

                // 1. Try exact payslip (edit mode)
                try {
                    const res = await api.get(`/payslip/employee/${employee.id}/${formYear}/${formMonth}`);
                    setExistingPayslip(res.data);
                    setForm(fillFormFromData(res.data, employee.id, formMonth, formYear));
                    return;
                } catch {
                    setExistingPayslip(null);
                }

                // 2. Try prefill (create mode with previous data)
                try {
                    const res = await api.get(`/payslip/prefill?employeeId=${employee.id}&year=${formYear}&month=${formMonth}`);
                    setForm(fillFormFromData(res.data, employee.id, formMonth, formYear));
                    setPrefillBadge(true);
                } catch {
                    setForm(prev => ({
                        ...prev,
                        basicSalary: 0, hra: 0, conveyance: 0, medical: 0, otherAllowance: 0,
                        bonus: 0, incentive: 0, stipend: 0,
                        pf: 0, esi: 0, professionalTax: 0, tds: 0,
                        lop: 0, lopDays: 0, variablePay: 0,
                    }));
                }
            } finally {
                setFetchLoading(false);
            }
        };
        fetchData();
    }, [formMonth, formYear, employee.id]);

    const update = (field: keyof PayslipCreateRequest, val: number | string) =>
        setForm(prev => ({ ...prev, [field]: val }));

    const gross = form.basicSalary + form.hra + form.conveyance + form.medical +
        form.otherAllowance + form.bonus + form.incentive + form.stipend;
    const deductions = form.pf + form.esi + form.professionalTax + form.tds + form.variablePay + form.lop;
    const net = gross - deductions;

    const EARNINGS_FIELDS = [
        { label: 'Basic Salary',    field: 'basicSalary'    },
        { label: 'HRA',             field: 'hra'            },
        { label: 'Conveyance',      field: 'conveyance'     },
        { label: 'Medical',         field: 'medical'        },
        { label: 'Other Allowance', field: 'otherAllowance' },
        { label: 'Bonus',           field: 'bonus'          },
        { label: 'Incentive',       field: 'incentive'      },
        { label: 'Stipend',         field: 'stipend'        },
    ];
    const DEDUCTION_FIELDS = [
        { label: 'PF',               field: 'pf'              },
        { label: 'ESI',              field: 'esi'             },
        { label: 'Professional Tax', field: 'professionalTax' },
        { label: 'TDS',              field: 'tds'             },
        { label: 'LOP',              field: 'lop'             },
        { label: 'LOP Days',         field: 'lopDays'         },
        { label: 'Variable Pay',     field: 'variablePay'     },
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
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month</label>
                                <select
                                    value={form.month}
                                    onChange={e => update('month', parseInt(e.target.value))}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    {MONTH_NAMES.map((m, i) => (
                                        <option key={m} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</label>
                                <select
                                    value={form.year}
                                    onChange={e => update('year', parseInt(e.target.value))}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <option value={2026}>2026</option>
                                    <option value={2025}>2025</option>
                                </select>
                            </div>
                        </div>

                        {fetchLoading ? (
                            <div className="flex justify-center py-4">
                                <CustomLoader label="Fetching payslip data..." />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Earnings</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {EARNINGS_FIELDS.map(({ label, field }) => (
                                            <div key={field} className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                                                <input
                                                    type="number"
                                                    value={form[field as keyof PayslipCreateRequest] as number}
                                                    onChange={e => update(field as keyof PayslipCreateRequest, parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-3">Deductions</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {DEDUCTION_FIELDS.map(({ label, field }) => (
                                            <div key={field} className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                                                <input
                                                    type="number"
                                                    value={form[field as keyof PayslipCreateRequest] as number}
                                                    onChange={e => update(field as keyof PayslipCreateRequest, parseFloat(e.target.value) || 0)}
                                                    className="w-full px-3 py-2 bg-rose-50 border border-rose-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-800 rounded-xl p-4 grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Gross</p>
                                        <p className="text-sm font-black text-emerald-400">{fmt(gross)}</p>
                                    </div>
                                    <div className="text-center border-x border-slate-700">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Deductions</p>
                                        <p className="text-sm font-black text-rose-400">{fmt(deductions)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Net</p>
                                        <p className="text-sm font-black text-white">{fmt(net)}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white border-t border-slate-100">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || fetchLoading}
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

            {/* Delete confirm */}
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
                                    Delete payslip for {employee.name} — {MONTH_NAMES[form.month - 1]} {form.year}?
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ─── Main CFO Employees Page ──────────────────────────────────────
const PAGE_SIZE = 10;

export const CFOEmployeesPage: React.FC = () => {
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

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [employeeMap, setEmployeeMap] = useState<Record<number, Employee>>({});

    const load = async (page = 0) => {
        try {
            setLoading(true);
            const res = await employeeService.getAllEmployeesHR(page, PAGE_SIZE);

            setEmployees(res.content);
            setTotalPages(res.totalPages);
            setTotalElements(res.totalElements);
            setCurrentPage(res.number);

            setEmployeeMap(prev => {
                const updated = { ...prev };
                res.content.forEach((e: Employee) => { updated[e.id] = e; });
                return updated;
            });

            const defaults: Record<number, 'OLD' | 'NEW'> = {};
            res.content.forEach((e: Employee) => { defaults[e.id] = 'OLD'; });
            setTaxRegimes(prev => ({ ...defaults, ...prev }));
        } catch {
            notify.error('Failed', 'Could not load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(0); }, []);

    const getManagerName = (managerId: number | null) => {
        if (!managerId) return '—';
        return employeeMap[managerId]?.name || `#${managerId}`;
    };

    const filtered = employees.filter(e => {
        const matchSearch =
            e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.id?.toString().includes(searchQuery) ||
            e.role?.toLowerCase().includes(searchQuery.toLowerCase());
        const joinDate = e.joiningDate ? new Date(e.joiningDate) : null;
        const selectedDate = new Date(year, month - 1, 1);
        const matchJoin = joinDate ? joinDate <= selectedDate : true;
        return matchSearch && matchJoin;
    });

    const toggleTaxRegime = (id: number) => {
        setTaxRegimes(prev => ({ ...prev, [id]: prev[id] === 'OLD' ? 'NEW' : 'OLD' }));
    };

    const handleGeneratePayroll = async () => {
        try {
            setPayrollLoading(true);
            await api.post(`/payroll/generate?year=${year}&month=${month}`);
            notify.success(`Payroll generated for ${MONTH_NAMES[month - 1]} ${year}`);
        } catch {
            notify.error('Failed', 'Could not generate payroll');
        } finally {
            setPayrollLoading(false);
        }
    };

    const handlePreparePayroll = async () => {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear  = month === 12 ? year + 1 : year;
        try {
            setPayrollLoading(true);
            await api.post(`/payroll/prepare?year=${nextYear}&month=${nextMonth}`);
            notify.success(`Payroll prepared for ${MONTH_NAMES[nextMonth - 1]} ${nextYear}`);
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
                    <select
                        value={month}
                        onChange={e => setMonth(parseInt(e.target.value))}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none shadow-sm"
                    >
                        {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                    </select>
                    <select
                        value={year}
                        onChange={e => setYear(parseInt(e.target.value))}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none shadow-sm"
                    >
                        <option value={2026}>2026</option>
                        <option value={2025}>2025</option>
                    </select>
                    <button
                        onClick={handlePreparePayroll}
                        disabled={payrollLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-600 transition-colors disabled:opacity-50"
                    >
                        <FaSyncAlt className="text-xs" /> Prepare Payroll
                    </button>
                    <button
                        onClick={handleGeneratePayroll}
                        disabled={payrollLoading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50"
                    >
                        <FaFileInvoiceDollar className="text-xs" /> Generate Payroll
                    </button>
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                        <p className="text-xs text-slate-500">{totalElements} employees</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                    type="text"
                    placeholder="Search by name, ID or role..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                />
            </div>

            {/* Table */}
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
                                        <th
                                            key={h}
                                            className={`py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${h === 'Employee' ? 'text-left' : 'text-center'}`}
                                        >
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
                                        <td className="py-3 px-4 text-center text-slate-500">
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
                                            {emp.joiningDate
                                                ? new Date(emp.joiningDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : '—'}
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
                                            <button
                                                onClick={() => toggleTaxRegime(emp.id)}
                                                className={`flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                                                    taxRegimes[emp.id] === 'NEW'
                                                        ? 'bg-violet-100 text-violet-600'
                                                        : 'bg-amber-100 text-amber-600'
                                                }`}
                                            >
                                                {taxRegimes[emp.id] === 'NEW'
                                                    ? <FaToggleOn className="text-sm" />
                                                    : <FaToggleOff className="text-sm" />
                                                }
                                                {taxRegimes[emp.id] || 'OLD'} Regime
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setLeaveModal(emp)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-[10px] font-bold transition-colors"
                                                >
                                                    <FaCalendarAlt className="text-[10px]" /> Leave
                                                </button>
                                                <button
                                                    onClick={() => setCreatePayslipModal(emp)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-[10px] font-bold transition-colors"
                                                >
                                                    <FaFileInvoiceDollar className="text-[10px]" /> Payslip
                                                </button>
                                                <button
                                                    onClick={() => setAnnualModal(emp)}
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                                <p className="text-xs text-slate-400">
                                    Showing{' '}
                                    <span className="font-bold text-slate-600">{currentPage * PAGE_SIZE + 1}</span>
                                    {' '}–{' '}
                                    <span className="font-bold text-slate-600">{Math.min((currentPage + 1) * PAGE_SIZE, totalElements)}</span>
                                    {' '}of{' '}
                                    <span className="font-bold text-slate-600">{totalElements}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 0 || loading}
                                        onClick={() => load(currentPage - 1)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaChevronLeft className="text-[10px]" /> Prev
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => load(i)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                                                i === currentPage
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        disabled={currentPage >= totalPages - 1 || loading}
                                        onClick={() => load(currentPage + 1)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next <FaChevronRight className="text-[10px]" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {leaveModal        && <LeaveModal         employee={leaveModal}        onClose={() => setLeaveModal(null)}        />}
            {annualModal       && <AnnualPayslipModal  employee={annualModal}       onClose={() => setAnnualModal(null)}       />}
            {createPayslipModal && <CreatePayslipModal employee={createPayslipModal} onClose={() => setCreatePayslipModal(null)} />}
        </div>
    );
};