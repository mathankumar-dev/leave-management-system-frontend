import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFileInvoiceDollar, FaCog, FaTimes, FaChevronRight, FaRupeeSign, FaDownload, FaTrash } from 'react-icons/fa';
import { employeeService, type Employee } from '../service/employeeService';
import { payslipService } from '../service/payslipService';
import { usePayslip } from '../hooks/usePayslip';
import { notify } from '../../../../../utils/notifications';
import CustomLoader from '../../../../../components/ui/CustomLoader';
import type { Payslip } from '../types';

// ─── Salary Structure Config ──────────────────────────────────────
interface SalaryStructureConfig {
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
  hra: number;
  conveyance: number;
  medical: number;
  otherAllowance: number;
  pfPercent: number;
  professionalTax: number;
  esiPercent: number;
}

// ─── Salary Structure Modal ───────────────────────────────────────
const SalaryStructureModal: React.FC<{
  onClose: () => void;
  onSave: (structures: SalaryStructureConfig[]) => void;
  structures: SalaryStructureConfig[];
}> = ({ onClose, onSave, structures }) => {
  const [selectedRole, setSelectedRole] = useState<'EMPLOYEE' | 'MANAGER' | 'ADMIN'>('EMPLOYEE');
  const [localStructures, setLocalStructures] = useState<SalaryStructureConfig[]>(structures);

  const current = localStructures.find(s => s.role === selectedRole);
  if (!current) return null;

  const updateField = (field: keyof Omit<SalaryStructureConfig, 'role'>, value: number) => {
    setLocalStructures(prev => prev.map(s =>
      s.role === selectedRole ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <FaCog className="text-indigo-500 text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Salary Structure</h3>
              <p className="text-xs text-slate-400">Configure role-based salary components</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <FaTimes className="text-slate-400" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 p-6 pb-0">
          {(['EMPLOYEE', 'MANAGER', 'ADMIN'] as const).map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedRole === role
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'HRA (₹)', field: 'hra' },
              { label: 'Conveyance (₹)', field: 'conveyance' },
              { label: 'Medical (₹)', field: 'medical' },
              { label: 'Other Allowance (₹)', field: 'otherAllowance' },
              { label: 'PF %', field: 'pfPercent' },
              { label: 'Professional Tax (₹)', field: 'professionalTax' },
              { label: 'ESI %', field: 'esiPercent' },
            ].map(({ label, field }) => (
              <div key={field} className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                <input
                  type="number"
                  value={current[field as keyof Omit<SalaryStructureConfig, 'role'>]}
                  onChange={e => updateField(field as keyof Omit<SalaryStructureConfig, 'role'>, parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-indigo-50 rounded-xl p-4 space-y-1">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Preview</p>
            {[
              { label: 'HRA', value: `₹${current.hra.toLocaleString('en-IN')}`, red: false },
              { label: 'Conveyance', value: `₹${current.conveyance.toLocaleString('en-IN')}`, red: false },
              { label: 'Medical', value: `₹${current.medical.toLocaleString('en-IN')}`, red: false },
              { label: 'Other Allowance', value: `₹${current.otherAllowance.toLocaleString('en-IN')}`, red: false },
              { label: 'PF Deduction', value: `${current.pfPercent}% of Basic`, red: true },
              { label: 'Professional Tax', value: `₹${current.professionalTax}`, red: true },
              { label: 'ESI', value: `${current.esiPercent}% of Basic`, red: true },
            ].map(({ label, value, red }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-slate-500">{label}</span>
                <span className={`font-bold ${red ? 'text-rose-500' : 'text-slate-700'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button onClick={() => { onSave(localStructures); onClose(); }}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

// ─── Main PayslipPage ─────────────────────────────────────────────
export const PayslipPage: React.FC = () => {
  const {
    history, payrollData, loading,
    setEmployeeSalary,
    fetchPayslip, fetchHistory, generatePayroll,
    fetchEmployeeSalary, fetchSalaryStructure,
  } = usePayslip();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [structures, setStructures] = useState<SalaryStructureConfig[]>([]);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [basicSalaryMap, setBasicSalaryMap] = useState<Record<number, string>>({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [lopDeduction, setLopDeduction] = useState('0');

  const basicSalary = selectedEmployee ? (basicSalaryMap[selectedEmployee.id] ?? '') : '';
  const setBasicSalary = (val: string) => {
    if (!selectedEmployee) return;
    setBasicSalaryMap(prev => ({ ...prev, [selectedEmployee.id]: val }));
  };

  // Fetch salary structures
  useEffect(() => {
    const load = async () => {
      const data = await fetchSalaryStructure();
      if (data.length > 0) {
        setStructures(data.map(s => ({
          role: s.role as 'EMPLOYEE' | 'MANAGER' | 'ADMIN',
          hra: s.hra,
          conveyance: s.conveyance,
          medical: s.medical,
          otherAllowance: s.otherAllowance,
          pfPercent: s.pfPercent,
          professionalTax: s.professionalTax,
          esiPercent: s.esiPercent,
        })));
      }
    };
    load();
  }, []);

  // Fetch employees
  useEffect(() => {
    const isMounted = { current: true };
    const timer = setTimeout(async () => {
      if (!isMounted.current) return;
      try {
        const res = await employeeService.getAllEmployees(0, 1000);
        if (isMounted.current) setEmployees(res.content);
      } catch {
        notify.error('Failed', 'Could not load employees');
      } finally {
        if (isMounted.current) setEmpLoading(false);
      }
    }, 100);
    return () => { isMounted.current = false; clearTimeout(timer); };
  }, []);

  // When employee selected
  useEffect(() => {
    if (!selectedEmployee) return;
    fetchPayslip(selectedEmployee.id, year, month);
    fetchHistory(selectedEmployee.id, year, month);
  }, [selectedEmployee, year, month]);

  const getStructure = useCallback(() => {
    if (!selectedEmployee) return null;
    const role = selectedEmployee.role?.toUpperCase() as 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
    return structures.find(s => s.role === role) || structures[0];
  }, [selectedEmployee, structures]);

  const structure = getStructure();
  const basic = parseFloat(basicSalary) || 0;
  const hra = structure?.hra || 0;
  const conveyance = structure?.conveyance || 0;
  const medical = structure?.medical || 0;
  const otherAllowance = structure?.otherAllowance || 0;
  const pfDeduction = basic * ((structure?.pfPercent || 0) / 100);
  const professionalTax = structure?.professionalTax || 0;
  const esiDeduction = basic * ((structure?.esiPercent || 0) / 100);
  const lop = parseFloat(lopDeduction) || 0;
  const grossEarnings = basic + hra + conveyance + medical + otherAllowance;
  const totalDeductions = pfDeduction + professionalTax + esiDeduction + lop;
  const netSalary = grossEarnings - totalDeductions;

  const filteredEmployees = employees.filter(e =>
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id?.toString().includes(searchQuery)
  );

  // ✅ FIX 1: effectiveFrom → selected month first date
  const handleSetSalary = async () => {
    if (!selectedEmployee || !basicSalary) {
      notify.error('Missing', 'Select employee and enter basic salary');
      return;
    }
    await setEmployeeSalary({
      employeeId: selectedEmployee.id,
      basicSalary: basic,
      effectiveFrom: `${year}-${String(month).padStart(2, '0')}-01`,
    });
    notify.success('Salary set successfully');
  };

  const handleGeneratePayroll = async () => {
    const result = await generatePayroll(year, month);
    if (result?.success) {
      notify.success('Payroll generated for all employees');
      if (selectedEmployee) fetchHistory(selectedEmployee.id, year, month);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!selectedEmployee) return;
    const result = await generatePayroll(year, month);
    if (result?.success) {
      notify.success('Payslip generated successfully');
      fetchHistory(selectedEmployee.id, year, month);
    }
  };

  // ✅ FIX 2: Delete Payroll handler
  const handleDeletePayroll = async () => {
    const confirm = window.confirm(`Delete payroll for ${MONTHS[month - 1]} ${year}? This cannot be undone.`);
    if (!confirm) return;
    try {
      setDeleteLoading(true);
      await payslipService.deletePayroll(year, month);
      notify.success(`Payroll for ${MONTHS[month - 1]} ${year} deleted`);
      if (selectedEmployee) fetchHistory(selectedEmployee.id, year, month);
    } catch {
      notify.error('Failed', 'Could not delete payroll');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!payrollData.length) return;
    const header = 'EmployeeId,Year,Month,BasicSalary,HRA,Conveyance,PF,ProfessionalTax,LOP,NetSalary';
    const rows = (payrollData as Payslip[]).map(r =>
      `${r.employeeId},${r.year},${r.month},${r.basicSalary},${r.hra},${r.conveyance},${r.pf},${r.professionalTax},${r.lop},${r.netSalary}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${year}_${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveStructures = async (updated: SalaryStructureConfig[]) => {
    try {
      await Promise.all(updated.map(s =>
        payslipService.updateSalaryStructure(s.role, {
          hra: s.hra,
          conveyance: s.conveyance,
          medical: s.medical,
          otherAllowance: s.otherAllowance,
          pfPercent: s.pfPercent,
          professionalTax: s.professionalTax,
          esiPercent: s.esiPercent,
        })
      ));
      setStructures(updated);
      notify.success('Salary structure updated');
    } catch {
      notify.error('Failed', 'Could not update salary structure');
    }
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const CSVDownloadButton = () => (
    <button
      onClick={handleDownloadCSV}
      disabled={!payrollData.length}
      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <FaDownload className="text-xs" />
      Download CSV
    </button>
  );

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Payslip Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Generate and manage employee payslips</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStructureModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors"
          >
            <FaCog className="text-slate-400" />
            Salary Structure
          </button>

          {/* ✅ Delete Payroll button */}
          <button
            onClick={handleDeletePayroll}
            disabled={deleteLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 transition-colors disabled:opacity-50"
          >
            {deleteLoading ? (
              <div className="h-3 w-3 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
            ) : (
              <FaTrash className="text-xs" />
            )}
            Delete Payroll
          </button>

          <button
            onClick={handleGeneratePayroll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50"
          >
            <FaFileInvoiceDollar />
            Generate Payroll
          </button>
        </div>
      </div>

      <div className="flex gap-6 w-full">

        {/* ─── Left — Employee List ─────────────────────── */}
        <div className="w-72 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {empLoading ? (
              <div className="flex justify-center py-8">
                <CustomLoader label="Loading..." />
              </div>
            ) : filteredEmployees.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No employees found</p>
            ) : (
              filteredEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={async () => {
                    setSelectedEmployee(emp);
                    setLopDeduction('0');
                    if (basicSalaryMap[emp.id] === undefined) {
                      const saved = await fetchEmployeeSalary(emp.id);
                      setBasicSalaryMap(prev => ({
                        ...prev,
                        [emp.id]: saved ? String(saved) : '',
                      }));
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left ${
                    selectedEmployee?.id === emp.id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      selectedEmployee?.id === emp.id ? 'bg-indigo-600' : 'bg-slate-400'
                    }`}>
                      {emp.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{emp.name}</p>
                      <p className="text-[10px] text-slate-400">#{emp.id} · {emp.role}</p>
                    </div>
                  </div>
                  {selectedEmployee?.id === emp.id && (
                    <FaChevronRight className="text-indigo-400 text-xs" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ─── Right ───────────────────────────────────── */}
        {!selectedEmployee ? (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaFileInvoiceDollar className="text-slate-300 text-2xl" />
                </div>
                <p className="text-sm font-semibold text-slate-400">Select an employee</p>
                <p className="text-xs text-slate-300 mt-1">to manage their payslip</p>
              </div>
            </div>

            {/* Payroll Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Payroll — {MONTHS[month - 1]} {year}
                </p>
                <CSVDownloadButton />
              </div>
              {payrollData.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Generate payroll to see data here
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emp ID</th>
                        <th className="text-right py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Basic</th>
                        <th className="text-right py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">HRA</th>
                        <th className="text-right py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conveyance</th>
                        <th className="text-right py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">PF</th>
                        <th className="text-right py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prof. Tax</th>
                        <th className="text-right py-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(payrollData as Payslip[]).map(row => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-700">#{row.employeeId}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">₹{row.basicSalary.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">₹{row.hra.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">₹{(row.conveyance || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-rose-500">₹{row.pf.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right text-rose-500">₹{row.professionalTax.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-800">₹{row.netSalary.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">

            {/* Employee Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedEmployee.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{selectedEmployee.name}</p>
                  <p className="text-xs text-slate-400">#{selectedEmployee.id} · {selectedEmployee.role}</p>
                </div>
              </div>
            </div>

            {/* Salary Setup */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month</label>
                  <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</label>
                  <select value={year} onChange={e => setYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Basic Salary (₹)</label>
                  <input
                    type="text"
                    value={basicSalary}
                    onChange={e => setBasicSalary(e.target.value)}
                    placeholder="40000"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <button onClick={handleSetSalary} disabled={loading || !basicSalary}
                className="w-full py-2.5 border border-indigo-200 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                Set Employee Salary
              </button>

              <div className="border-t border-slate-100" />

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Salary Components ({selectedEmployee.role})
                </p>
                <div className="grid grid-cols-2 gap-3">

                  <div className="bg-emerald-50 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Earnings</p>
                    {[
                      { label: 'Basic', value: basic },
                      { label: 'HRA', value: hra },
                      { label: 'Conveyance', value: conveyance },
                      { label: 'Medical', value: medical },
                      { label: 'Other', value: otherAllowance },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span className="text-slate-500">{label}</span>
                        <span className="font-bold text-slate-700">₹{value.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-rose-50 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Deductions</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">PF ({structure?.pfPercent}%)</span>
                      <span className="font-bold text-slate-700">₹{pfDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Prof. Tax</span>
                      <span className="font-bold text-slate-700">₹{professionalTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">ESI ({structure?.esiPercent}%)</span>
                      <span className="font-bold text-slate-700">₹{esiDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-slate-500">LOP</span>
                      <input type="number" value={lopDeduction}
                        onChange={e => setLopDeduction(e.target.value)}
                        className="w-20 px-2 py-1 bg-white border border-rose-200 rounded-lg text-xs font-bold text-right focus:outline-none"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaRupeeSign className="text-white opacity-60 text-xs" />
                  <span className="text-sm font-bold text-white">Net Salary</span>
                </div>
                <span className="text-xl font-black text-white">
                  ₹{netSalary.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Generate Payslip Button */}
              <button
                onClick={handleGeneratePayslip}
                disabled={loading || !basicSalary}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaFileInvoiceDollar />
                )}
                Generate Payslip
              </button>

            </div>

            {/* History — all employees */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Payslip History
                  </p>
                  <CSVDownloadButton />
                </div>
                <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
                  {history.map(h => (
                    <div key={h.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          #{h.employeeId} · {MONTHS[h.month - 1]} {h.year}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Generated: {new Date(h.generatedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800">₹{h.netSalary.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400">Net Salary</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Salary Structure Modal */}
      {showStructureModal && (
        <SalaryStructureModal
          structures={structures}
          onClose={() => setShowStructureModal(false)}
          onSave={handleSaveStructures}
        />
      )}

    </div>
  );
};