import { employeeService, type Employee } from '@/features/employee/services/employeeService';
import { notify } from '@/features/notification/utils/notifications';
import { usePayslip } from '@/features/payroll/hooks/usePayslip';
import type { Payslip, PayslipCreateRequest } from '@/features/payroll/payrollTypes';
import { CustomLoader } from '@/shared/components';
import React, { useEffect, useState } from 'react';
// import { set } from 'react-datepicker/dist/dist/date_utils.js';
import {
  FaCheck,
  FaChevronDown,
  FaDownload,
  FaEdit,
  FaFileInvoiceDollar,
  FaSearch,
  FaSyncAlt, FaTimes,
  FaTrash
} from 'react-icons/fa';

// ─── Confirm Modal ────────────────────────────────────────────────
const ConfirmModal: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-200 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
          <FaTrash className="text-rose-500 text-sm" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">Confirm Delete</p>
          <p className="text-xs text-slate-400 mt-0.5">{message}</p>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          No, Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-colors">
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Payslip Form Modal ───────────────────────────────────────────
const PayslipFormModal: React.FC<{
  mode: 'create' | 'edit';
  initial?: Payslip;
  employees: Employee[];
  year: number;
  month: number;
  onClose: () => void;
  onSave: (data: PayslipCreateRequest) => void;
}> = ({ mode, initial, employees, year, month, onClose, onSave }) => {

  const EMPTY: PayslipCreateRequest = {
    employeeId: initial?.employeeId || 0,
    month: initial?.month || month,
    year: initial?.year || year,
    basicSalary: initial?.basicSalary || 0,
    hra: initial?.hra || 0,
    conveyance: initial?.conveyance || 0,
    medical: initial?.medical || 0,
    otherAllowance: initial?.otherAllowance || 0,
    bonus: initial?.bonus || 0,
    incentive: initial?.incentive || 0,
    stipend: initial?.stipend || 0,
    pf: initial?.pf || 0,
    esi: initial?.esi || 0,
    professionalTax: initial?.professionalTax || 0,
    tds: initial?.tds || 0,
    lop: initial?.lop || 0,
    lopDays: initial?.lopDays || 0,
    variablePay: initial?.variablePay || 0,
    status: ''
  };

  const [form, setForm] = useState<PayslipCreateRequest>(EMPTY);

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

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <FaFileInvoiceDollar className="text-indigo-500 text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{mode === 'create' ? 'Create Payslip' : 'Edit Payslip'}</h3>
              <p className="text-xs text-slate-400">Fill all salary components</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <FaTimes className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee</label>
              <select
                value={form.employeeId}
                onChange={e => update('employeeId', parseInt(e.target.value))}
                disabled={mode === 'edit'}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
              >
                <option value={0}>Select employee</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>#{e.id} {e.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Month</label>
              <select value={form.month} onChange={e => update('month', parseInt(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year</label>
              <select value={form.year} onChange={e => update('year', parseInt(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Earnings</p>
            <div className="grid grid-cols-2 gap-3">
              {EARNINGS_FIELDS.map(({ label, field }) => (
                <div key={field} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                  <input type="number" value={form[field as keyof PayslipCreateRequest]}
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
                  <input type="number" value={form[field as keyof PayslipCreateRequest]}
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
        </div>

        <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.employeeId) { notify.error('Missing', 'Select an employee'); return; }
              onSave(form);
            }}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaCheck className="text-xs" />
            {mode === 'create' ? 'Create Payslip' : 'Update Payslip'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────
interface PayslipPageProps {
  selectedEmployeeId?: number | null;
  onClearSelectedEmployee?: () => void;
}

// ─── Main CFO PayslipPage ─────────────────────────────────────────
export const PayslipPage: React.FC<PayslipPageProps> = ({
  selectedEmployeeId,
  onClearSelectedEmployee,
}) => {

  const {
    payrollData, loading,
    createPayslip, updatePayslip, deletePayslip,
    generatePayroll, preparePayroll,
    fetchPayrollData, exportCSV,
  } = usePayslip();

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Payslip | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payslip | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeMap, setEmployeeMap] = useState<Record<number, Employee>>({});


  // // Fetch employees
  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       // !!!TODO change the structure
  //       const res = await employeeService.getAllEmployees();
  //       setEmployees(res.content);
  //     } catch {
  //       console.warn('Employee list unavailable — names will show as Emp #id');
  //     }
  //   };
  //   load();
  // }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await employeeService.getAllEmployees(0,1000);
        setEmployees(res.content);

        const map: Record<number, Employee> = {};
        res.content.forEach((e: Employee) => {
          map[e.id] = e;
        });

        setEmployeeMap(map);

      } catch {
        console.warn('Employee list unavailable');
      }
    };
    load();
  }, []);

  // Auto select employee when coming from CFOEmployeesPage
  useEffect(() => {
    if (selectedEmployeeId && employees.length > 0) {
      const emp = employees.find(e => e.id === selectedEmployeeId);
      if (emp) {
        setSelectedEmployee(emp);
        if (onClearSelectedEmployee) onClearSelectedEmployee();
      }
    }
  }, [selectedEmployeeId, employees]);

  // Fetch payroll on month/year change
  useEffect(() => {
    fetchPayrollData(year, month);
  }, [year, month]);

  const getEmpName = (row: Payslip) =>
    employeeMap[row.employeeId]?.name || `Emp #${row.employeeId}`;

  const filtered = payrollData.filter(p =>
    getEmpName(p).toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employeeId.toString().includes(searchQuery)
  );

  const totalGross = payrollData.reduce((sum, p) => sum + (p.grossSalary || 0), 0);
  const totalNet = payrollData.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const totalDeductions = payrollData.reduce((sum, p) => sum + (p.pf || 0) + (p.esi || 0) + (p.professionalTax || 0) + (p.tds || 0), 0);

  const handleGeneratePayroll = async () => {
    const result = await generatePayroll(year, month);
    if (result?.success) notify.success(`Payroll generated for ${MONTHS[month - 1]} ${year}`);
    else notify.error('Failed', 'Could not generate payroll');
  };

  const handlePreparePayroll = async () => {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const result = await preparePayroll(nextYear, nextMonth);
    if (result?.success) {
      notify.success(`Payroll prepared for ${MONTHS[nextMonth - 1]} ${nextYear}`);
      setMonth(nextMonth);
      setYear(nextYear);
    } else {
      notify.error('Failed', 'Could not prepare payroll');
    }
  };

  const handleDelete = (p: Payslip) => setDeleteTarget(p);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deletePayslip(deleteTarget.employeeId, deleteTarget.year, deleteTarget.month);
    if (ok) notify.success('Payslip deleted');
    else notify.error('Failed', 'Could not delete payslip');
    setDeleteTarget(null);
  };

  const handleSaveForm = async (data: PayslipCreateRequest) => {
    if (editTarget) {
      const result = await updatePayslip(data);
      if (result) {
        notify.success('Payslip updated');
        fetchPayrollData(year, month);
        setShowFormModal(false);
        setEditTarget(null);
      }
    } else {
      const result = await createPayslip(data);
      if (result) {
        notify.success('Payslip created');
        setShowFormModal(false);
      }
    }
  };

  const handleExportCSV = async () => {
    const ok = await exportCSV(year, month);
    if (!ok) notify.error('Failed', 'Could not export CSV');
  };

  // ─── Create Payslip modal — pre-fill selected employee ───────────
  // const handleOpenCreate = () => {
  //   setEditTarget(null);
  //   setShowFormModal(true);
  // };

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Payroll & Payslip</h1>
          <p className="text-xs text-slate-400 mt-0.5">CFO — Full financial management</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePreparePayroll} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-600 transition-colors disabled:opacity-50"
          >
            <FaSyncAlt className="text-xs" /> Prepare Payroll
          </button>
          <button onClick={handleGeneratePayroll} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-50"
          >
            <FaFileInvoiceDollar className="text-xs" /> Generate Payroll
          </button>
          {/* <button onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white transition-colors"
          >
            <FaPlus className="text-xs" /> Create Payslip
          </button> */}
          <button onClick={handleExportCSV} disabled={!payrollData.length}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors disabled:opacity-40"
          >
            <FaDownload className="text-xs" /> Export CSV
          </button>
        </div>
      </div>

      {/* Selected employee banner */}
      {selectedEmployee && (
        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
              {selectedEmployee.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-800">{selectedEmployee.name}</p>
              <p className="text-xs text-indigo-500">#{selectedEmployee.id} · Pre-selected from Employees</p>
            </div>
          </div>
          <button onClick={() => setSelectedEmployee(null)}
            className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-indigo-400 text-xs" />
          </button>
        </div>
      )}

      {/* Month / Year Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
            className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
        </div>
        <div className="relative">
          <select value={year} onChange={e => setYear(parseInt(e.target.value))}
            className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
          <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
        </div>
        <p className="text-xs text-slate-400">{payrollData.length} employees</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Gross', value: totalGross, color: 'emerald' },
          { label: 'Total Deductions', value: totalDeductions, color: 'rose' },
          { label: 'Total Net Payout', value: totalNet, color: 'indigo' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-xl font-black text-${color}-600`}>
              ₹{value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{MONTHS[month - 1]} {year}</p>
          </div>
        ))}
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Payroll — {MONTHS[month - 1]} {year}
          </p>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input type="text" placeholder="Search employee..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><CustomLoader label="Loading payroll..." /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FaFileInvoiceDollar className="text-slate-200 text-4xl mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No payroll data</p>
            <p className="text-xs text-slate-300 mt-1">Generate or create payslips to see data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  {['Employee', 'Basic', 'HRA', 'Bonus', 'Incentive', 'Stipend', 'Gross', 'PF', 'TDS', 'Prof.Tax', 'LOP', 'Net', 'Actions'].map(h => (
                    <th key={h} className={`py-3 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${h === 'Employee' ? 'text-left' : 'text-right'} ${h === 'Actions' ? 'text-center' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(row => (
                  <tr key={row.employeeId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 bg-indigo-100 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600 shrink-0">
                          {getEmpName(row).charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 text-xs">{getEmpName(row)}</p>
                          <p className="text-[10px] text-slate-400">#{row.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600">₹{(row.basicSalary || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-slate-600">₹{(row.hra || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-semibold">₹{(row.bonus || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-semibold">₹{(row.incentive || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-emerald-600 font-semibold">₹{(row.stipend || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-700">₹{(row.grossSalary || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-rose-500">₹{(row.pf || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-rose-500">₹{(row.tds || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-rose-500">₹{(row.professionalTax || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-rose-500">₹{(row.lop || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-800">₹{(row.netSalary || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditTarget(row); setShowFormModal(true); }}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 rounded-lg transition-colors" title="Edit">
                          <FaEdit className="text-xs" />
                        </button>
                        <button onClick={() => handleDelete(row)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors" title="Delete">
                          <FaTrash className="text-xs" />
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

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete payslip for Emp #${deleteTarget.employeeId} — ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][deleteTarget.month - 1]} ${deleteTarget.year}?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Payslip Form Modal */}
      {showFormModal && (
        <PayslipFormModal
          mode={editTarget ? 'edit' : 'create'}
          initial={editTarget || undefined}
          employees={employees}
          year={year}
          month={month}
          onClose={() => { setShowFormModal(false); setEditTarget(null); }}
          onSave={handleSaveForm}
        />
      )}

    </div>
  );
};