import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   FaSearch,
  FaUsers, FaBuilding, FaCalendarAlt, FaFileExport
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

type ReportTab = 'LEAVE' | 'EMPLOYEE' | 'DEPARTMENT';

const LEAVE_DATA = [
  { month: 'Jan', Sick: 12, Casual: 8, Earned: 5 },
  { month: 'Feb', Sick: 15, Casual: 10, Earned: 7 },
  { month: 'Mar', Sick: 9, Casual: 14, Earned: 6 },
  { month: 'Apr', Sick: 11, Casual: 9, Earned: 8 },
  { month: 'May', Sick: 7, Casual: 12, Earned: 10 },
  { month: 'Jun', Sick: 13, Casual: 6, Earned: 9 },
];

const LEAVE_TYPE_PIE = [
  { name: 'Sick Leave', value: 35, color: '#f43f5e' },
  { name: 'Casual Leave', value: 40, color: '#3b82f6' },
  { name: 'Earned Leave', value: 18, color: '#10b981' },
  { name: 'Comp Off', value: 7, color: '#8b5cf6' },
];

const DEPT_STATS = [
  { name: 'Engineering', employees: 24, color: '#6366f1', avgLeave: '8.5', onLeave: 2 },
  { name: 'Product',     employees: 12, color: '#8b5cf6', avgLeave: '7.2', onLeave: 1 },
  { name: 'Design',      employees: 8,  color: '#ec4899', avgLeave: '9.1', onLeave: 0 },
  { name: 'HR',          employees: 5,  color: '#f59e0b', avgLeave: '6.8', onLeave: 1 },
  { name: 'Finance',     employees: 7,  color: '#10b981', avgLeave: '7.5', onLeave: 0 },
];

const DEPT_DATA = DEPT_STATS;

const MOCK_LEAVE_REPORT = [
  { employee: 'Raj Kumar', dept: 'Engineering', leaveType: 'Sick Leave', days: 3, month: 'March', status: 'APPROVED' },
  { employee: 'Priya Sharma', dept: 'Design', leaveType: 'Casual Leave', days: 1, month: 'March', status: 'PENDING' },
  { employee: 'Arun Patel', dept: 'Product', leaveType: 'Earned Leave', days: 5, month: 'March', status: 'APPROVED' },
];

const MOCK_EMP_REPORT = [
  { name: 'Raj Kumar', dept: 'Engineering', role: 'Developer', joining: '2022-01-10', status: 'ACTIVE' },
  { name: 'Priya Sharma', dept: 'Design', role: 'Designer', joining: '2021-06-15', status: 'ACTIVE' },
  { name: 'Vikram Singh', dept: 'Engineering', role: 'DevOps', joining: '2020-09-01', status: 'INACTIVE' },
];

const AdminReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('LEAVE');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const tabs: { key: ReportTab; label: string; icon: React.ReactNode }[] = [
    { key: 'LEAVE', label: 'Leave Reports', icon: <FaCalendarAlt size={13} /> },
    { key: 'EMPLOYEE', label: 'Employee Reports', icon: <FaUsers size={13} /> },
    { key: 'DEPARTMENT', label: 'Department Reports', icon: <FaBuilding size={13} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reports</h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Generate and export organizational reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-md active:scale-95">
          <FaFileExport size={11} /> Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === t.key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Leave Reports ── */}
        {activeTab === 'LEAVE' && (
          <motion.div key="leave" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Monthly Bar Chart */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-4">Monthly Leave Requests</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={LEAVE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="Sick" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Casual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Earned" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-4">Leave Type Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={LEAVE_TYPE_PIE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                      {LEAVE_TYPE_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">Leave Details</h3>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={11} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Employee', 'Department', 'Leave Type', 'Days', 'Month', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_LEAVE_REPORT.filter(r => r.employee.toLowerCase().includes(search.toLowerCase())).map((r, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{r.employee}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{r.dept}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{r.leaveType}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-700">{r.days}d</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{r.month}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black ${r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Employee Reports ── */}
        {activeTab === 'EMPLOYEE' && (
          <motion.div key="employee" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Employees', value: '56', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                { label: 'Active', value: '52', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                { label: 'Inactive', value: '4', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                { label: 'New This Month', value: '3', color: 'bg-amber-50 text-amber-700 border-amber-200' },
              ].map(s => (
                <div key={s.label} className={`border rounded-xl p-4 shadow-sm ${s.color}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{s.label}</p>
                  <p className="text-2xl font-black mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">Employee Directory</h3>
                <div className="flex gap-2">
                  <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-600">
                    <option value="ALL">All Departments</option>
                    {DEPT_DATA.map(d => <option key={d.name}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['Name', 'Department', 'Role', 'Joining Date', 'Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_EMP_REPORT.filter(e => deptFilter === 'ALL' || e.dept === deptFilter).map((e, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900">{e.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{e.dept}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{e.role}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{e.joining}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black ${e.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{e.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Department Reports ── */}
        {activeTab === 'DEPARTMENT' && (
          <motion.div key="dept" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-4">Employee Distribution by Department</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={DEPT_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="employees" radius={[0, 4, 4, 0]}>
                      {DEPT_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 mb-4">Department Pie</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={DEPT_DATA.map(d => ({ name: d.name, value: d.employees, color: d.color }))} cx="50%" cy="50%" outerRadius={85} dataKey="value" paddingAngle={3}>
                      {DEPT_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dept Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">Department Summary</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Department', 'Employees', 'Avg Leave Balance', 'On Leave Today'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEPT_STATS.map((d, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="font-bold text-slate-900">{d.name}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-700">{d.employees}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{d.avgLeave} days</td>
                      <td className="px-4 py-3 text-xs font-bold text-amber-600">{d.onLeave}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReportsView;