import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFileInvoiceDollar, FaCog, FaTimes, FaChevronRight, FaRupeeSign } from 'react-icons/fa';
import { employeeService, type Employee } from '../service/employeeService';
import { usePayslip } from '../hooks/usePayslip';
import { notify } from '../../../../../utils/notifications';
import CustomLoader from '../../../../../components/ui/CustomLoader';

interface SalaryStructureConfig {
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
  hra: number;
  transport: number;
  pfPercent: number;
  taxPercent: number;
}

const defaultStructures: SalaryStructureConfig[] = [
  { role: 'EMPLOYEE', hra: 8000,  transport: 2000, pfPercent: 12, taxPercent: 5  },
  { role: 'MANAGER',  hra: 15000, transport: 3000, pfPercent: 12, taxPercent: 8  },
  { role: 'ADMIN',    hra: 20000, transport: 4000, pfPercent: 12, taxPercent: 10 },
];

// ─── Salary Structure Modal ───────────────────────────────────────
const SalaryStructureModal: React.FC<{
  onClose: () => void;
  onSave: (structures: SalaryStructureConfig[]) => void;
  structures: SalaryStructureConfig[];
}> = ({ onClose, onSave, structures }) => {
  const [selectedRole, setSelectedRole] = useState<'EMPLOYEE' | 'MANAGER' | 'ADMIN'>('EMPLOYEE');
  const [localStructures, setLocalStructures] = useState<SalaryStructureConfig[]>(structures);

  const current = localStructures.find(s => s.role === selectedRole)!;

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
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HRA (₹)</label>
              <input
                type="number"
                value={current.hra}
                onChange={e => updateField('hra', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transport (₹)</label>
              <input
                type="number"
                value={current.transport}
                onChange={e => updateField('transport', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PF %</label>
              <input
                type="number"
                value={current.pfPercent}
                onChange={e => updateField('pfPercent', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax %</label>
              <input
                type="number"
                value={current.taxPercent}
                onChange={e => updateField('taxPercent', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-indigo-50 rounded-xl p-4 space-y-1">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Preview</p>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">HRA</span>
              <span className="font-bold text-slate-700">₹{current.hra.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Transport</span>
              <span className="font-bold text-slate-700">₹{current.transport.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">PF Deduction</span>
              <span className="font-bold text-rose-500">{current.pfPercent}% of Basic</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tax Deduction</span>
              <span className="font-bold text-rose-500">{current.taxPercent}% of Basic</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(localStructures); onClose(); }}
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
    history, loading,
    setEmployeeSalary, generatePayslip,
    fetchPayslip, fetchHistory, generatePayroll,
  } = usePayslip();

  // Employee list
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Salary structure
  const [structures, setStructures] = useState<SalaryStructureConfig[]>(defaultStructures);
  const [showStructureModal, setShowStructureModal] = useState(false);

  // Form
  const [basicSalary, setBasicSalary] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [lopDeduction, setLopDeduction] = useState('0');

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

  // When employee selected → fetch history + existing payslip
  useEffect(() => {
    if (!selectedEmployee) return;
    fetchPayslip(selectedEmployee.id, year, month);
    fetchHistory(selectedEmployee.id, year, 1, year, 12);
  }, [selectedEmployee, year, month]);

  // Get salary structure for selected employee role
  const getStructure = useCallback(() => {
    if (!selectedEmployee) return null;
    const role = selectedEmployee.role?.toUpperCase() as 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
    return structures.find(s => s.role === role) || structures[0];
  }, [selectedEmployee, structures]);

  // Auto calculate
  const structure = getStructure();
  const basic = parseFloat(basicSalary) || 0;
  const hra = structure?.hra || 0;
  const transport = structure?.transport || 0;
  const pfDeduction = basic * ((structure?.pfPercent || 0) / 100);
  const taxDeduction = basic * ((structure?.taxPercent || 0) / 100);
  const lop = parseFloat(lopDeduction) || 0;
  const netSalary = basic + hra + transport - pfDeduction - taxDeduction - lop;

  // Filtered employees
  const filteredEmployees = employees.filter(e =>
    e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id?.toString().includes(searchQuery)
  );

  const handleSetSalary = async () => {
    if (!selectedEmployee || !basicSalary) {
      notify.error('Missing', 'Select employee and enter basic salary');
      return;
    }
    await setEmployeeSalary({
      employeeId: selectedEmployee.id,
      basicSalary: basic,
      effectiveFrom: new Date().toISOString().split('T')[0],
    });
    notify.success('Salary set successfully');
  };

  const handleGenerate = async () => {
    if (!selectedEmployee || !basicSalary) {
      notify.error('Missing', 'Select employee and enter basic salary');
      return;
    }
    const result = await generatePayslip({
      employeeId: selectedEmployee.id,
      month,
      year,
      basicSalary: basic,
      hra,
      transportAllowance: transport,
      pfDeduction,
      taxDeduction,
      lopDeduction: lop,
    });
    if (result?.success) {
      notify.success('Payslip generated successfully');
      fetchHistory(selectedEmployee.id, year, 1, year, 12);
    }
  };

  const handleGeneratePayroll = async () => {
    const result = await generatePayroll(year, month);
    if (result?.success) notify.success('Payroll generated for all employees');
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
                  onClick={() => setSelectedEmployee(emp)}
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

        {/* ─── Right — Payslip Form ─────────────────────── */}
        {!selectedEmployee ? (
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaFileInvoiceDollar className="text-slate-300 text-2xl" />
              </div>
              <p className="text-sm font-semibold text-slate-400">Select an employee</p>
              <p className="text-xs text-slate-300 mt-1">to manage their payslip</p>
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

            {/* Salary Setup + Generate */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">

              {/* Month Year + Basic Salary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month</label>
                  <select
                    value={month}
                    onChange={e => setMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</label>
                  <select
                    value={year}
                    onChange={e => setYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Basic Salary (₹)</label>
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={e => setBasicSalary(e.target.value)}
                    placeholder="40000"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Set Salary Button */}
              <button
                onClick={handleSetSalary}
                disabled={loading || !basicSalary}
                className="w-full py-2.5 border border-indigo-200 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                Set Employee Salary
              </button>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Auto-filled components */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Salary Components ({selectedEmployee.role})
                </p>
                <div className="grid grid-cols-2 gap-3">

                  {/* Earnings */}
                  <div className="bg-emerald-50 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Earnings</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Basic</span>
                      <span className="font-bold text-slate-700">₹{basic.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">HRA</span>
                      <span className="font-bold text-slate-700">₹{hra.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Transport</span>
                      <span className="font-bold text-slate-700">₹{transport.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="bg-rose-50 rounded-xl p-3 space-y-2">
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Deductions</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">PF ({structure?.pfPercent}%)</span>
                      <span className="font-bold text-slate-700">₹{pfDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Tax ({structure?.taxPercent}%)</span>
                      <span className="font-bold text-slate-700">₹{taxDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-slate-500">LOP</span>
                      <input
                        type="number"
                        value={lopDeduction}
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

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
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

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Payslip History
                </p>
                <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
                  {history.map(h => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {MONTHS[h.month - 1]} {h.year}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Generated: {new Date(h.generatedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800">
                          ₹{h.netSalary.toLocaleString('en-IN')}
                        </p>
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
          onSave={(updated) => {
            setStructures(updated);
            notify.success('Salary structure updated');
          }}
        />
      )}

    </div>
  );
};