import { useCalendar } from "@/features/attendance/hooks/useCalendar";
import { useAuth } from "@/shared/auth/useAuth";
import StatusBadge2 from "@/shared/components/StatusBadge";
import React, { useEffect, useMemo, useState } from "react";
import {
    FaArrowLeft,
    FaFileExport,
    FaUserAlt
} from "react-icons/fa";

const AttendanceReports: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // Hooks & State
    const {
        fetchTeamAttendanceReport,
        fetchEmployeeAttendanceReport,
        downloadSelectedReport,
        teamAttendanceReport,
        allEmployeesAttendanceReport,
        attendanceReport,
        downloadAttendanceExcel,
        fetchAllEmployeeAttendanceReport,
        loading
    } = useCalendar();

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [activePunches, setActivePunches] = useState<{ time: string; type: string }[] | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState({
        from: new Date().toISOString().split('T')[0].substring(0, 8) + '01',
        to: new Date().toISOString().split('T')[0]
    });

    // Determine the active data source based on role
    const reportData = isAdmin ? allEmployeesAttendanceReport : teamAttendanceReport;

    // Helper: Parse punch record strings
    const parsePunchRecords = (records: string) => {
        if (!records) return [];
        return records.split(',').filter(r => r.trim() !== '').map(record => {
            const parts = record.split(':');
            const time = `${parts[0]}:${parts[1]}`;
            const type = parts[2]?.includes('in') ? 'IN' : 'OUT';
            return { time, type };
        });
    };

    const getFirstPunch = (records: string) => {
        const list = records?.split(',').filter(r => r.trim() !== '');
        if (!list || list.length === 0) return "-";
        const parts = list[0].split(':');
        return `${parts[0]}:${parts[1]}`;
    };

    const getLastPunch = (records: string) => {
        const list = records?.split(',').filter(r => r.trim() !== '');
        if (!list || list.length === 0) return "-";
        const parts = list[list.length - 1].split(':');
        return `${parts[0]}:${parts[1]}`;
    };

    // Helper: Derive unique employees for the Overview
    const uniqueEmployees = useMemo(() => {
        if (!reportData) return [];
        const map = new Map();
        reportData.forEach(item => {
            if (!map.has(item.employeeId)) map.set(item.employeeId, item);
        });
        return Array.from(map.values());
    }, [reportData]);

    const dataToDisplay = selectedEmployeeId ? attendanceReport : uniqueEmployees;

    // Toggle specific employee
    const toggleEmployee = (empId: string) => {
        setSelectedIds(prev => prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]);
    };

    // Toggle Select All
    const toggleSelectAll = () => {
        if (selectedIds.length === uniqueEmployees.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(uniqueEmployees.map(e => e.employeeId));
        }
    };

    const selectedEmployeeName = useMemo(() => {
        if (!selectedEmployeeId) return "";
        const emp = reportData?.find(e => e.employeeId === selectedEmployeeId);
        return emp ? emp.employeeName : "Loading...";
    }, [selectedEmployeeId, reportData]);

    const handleExport = async () => {
        try {
            if (selectedEmployeeId) {
                await downloadAttendanceExcel(selectedEmployeeId, {
                    fromDate: dateRange.from,
                    toDate: dateRange.to
                });
            } else {
                const idsToExport = selectedIds.length > 0 ? selectedIds : uniqueEmployees.map(e => e.employeeId);
                if (idsToExport.length === 0) return;
                await downloadSelectedReport({
                    empIds: idsToExport,
                    fromDate: dateRange.from,
                    toDate: dateRange.to
                });
            }
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    const formatWorkingHours = (timeStr: string) => {
        if (!timeStr || timeStr === "00:00:00") return "-";
        const [h, m] = timeStr.split(':');
        const hours = parseInt(h);
        const minutes = parseInt(m);
        return `${hours}h ${minutes}m`;
    };

    const getWorkingHoursColor = (timeStr: string) => {
        if (!timeStr || timeStr === "00:00:00") return "text-slate-400";
        const hours = parseInt(timeStr.split(':')[0]);
        return hours >= 8 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold";
    };

    useEffect(() => {
        setSelectedIds([]); 

        if (!selectedEmployeeId) {
            if (isAdmin) {
                fetchAllEmployeeAttendanceReport({ fromDate: dateRange.from, toDate: dateRange.to });
            } else {
                fetchTeamAttendanceReport(user!.id, { fromDate: dateRange.from, toDate: dateRange.to });
            }
        } else {
            fetchEmployeeAttendanceReport(selectedEmployeeId, { fromDate: dateRange.from, toDate: dateRange.to });
        }
    }, [
        selectedEmployeeId, 
        dateRange, 
        isAdmin, // Trigger re-fetch if role changes (rare but good practice)
        fetchTeamAttendanceReport, 
        fetchEmployeeAttendanceReport, 
        fetchAllEmployeeAttendanceReport, 
        user
    ]);

    return (
        <div className="bg-slate-50 min-h-screen ">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {selectedEmployeeId && (
                            <button onClick={() => setSelectedEmployeeId(null)} className="p-2 bg-white border border-slate-200 rounded-sm hover:bg-slate-100 transition-all">
                                <FaArrowLeft size={14} className="text-slate-600" />
                            </button>
                        )}
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">
                            {selectedEmployeeId
                                ? `${selectedEmployeeName} - History`
                                : "Attendance Reports"
                            }
                        </h1>
                    </div>
                    <button onClick={handleExport} className="bg-indigo-600 text-white px-4 py-2 rounded-sm text-xs font-bold hover:bg-indigo-700 flex items-center gap-2 transition-colors">
                        <FaFileExport /> Export Report
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm flex gap-4">
                    <input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} className="border border-slate-200 rounded-sm p-2 text-sm" />
                    <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} className="border border-slate-200 rounded-sm p-2 text-sm" />
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-400">
                            <tr>
                                {!selectedEmployeeId && (
                                    <th className="p-4 w-10">
                                        <input type="checkbox" checked={selectedIds.length === uniqueEmployees.length && uniqueEmployees.length > 0} onChange={toggleSelectAll} className="accent-indigo-600" />
                                    </th>
                                )}
                                <th className="p-4 text-[10px] font-black uppercase">Employee Name</th>
                                {selectedEmployeeId && (
                                    <>
                                        <th className="p-4 text-[10px] font-black uppercase">Date</th>
                                        <th className="p-4 text-[10px] font-black uppercase">Check In</th>
                                        <th className="p-4 text-[10px] font-black uppercase">Check Out</th>
                                        <th className="p-4 text-[10px] font-black uppercase">Total Working Hours</th>
                                        <th className="p-4 text-[10px] font-black uppercase">Status</th>
                                        <th className="p-4 text-[10px] font-black uppercase">Timeline</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dataToDisplay?.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    {!selectedEmployeeId && (
                                        <td className="p-4">
                                            <input type="checkbox" checked={selectedIds.includes(row.employeeId)} onChange={() => toggleEmployee(row.employeeId)} className="accent-indigo-600" />
                                        </td>
                                    )}
                                    <td
                                        className={`p-4 text-sm font-bold flex items-center gap-3 ${!selectedEmployeeId ? 'cursor-pointer text-indigo-600 hover:underline' : 'text-slate-700'}`}
                                        onClick={() => !selectedEmployeeId && setSelectedEmployeeId(row.employeeId)}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                                            <FaUserAlt />
                                        </div>
                                        {row.employeeName || selectedEmployeeName}
                                    </td>

                                    {selectedEmployeeId && (
                                        <>
                                            <td className="p-4 text-sm text-slate-600">{row.date}</td>
                                            <td className="p-4 text-sm font-bold text-emerald-700 font-mono">
                                                {getFirstPunch(row.punchRecords)}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-rose-700 font-mono">
                                                {getLastPunch(row.punchRecords)}
                                            </td>
                                            <td className={`p-4 text-sm font-mono ${getWorkingHoursColor(row.workingHours)}`}>
                                                {formatWorkingHours(row.workingHours)}
                                                {parseInt(row.workingHours.split(':')[0]) < 8 && row.workingHours !== "00:00:00" && (
                                                    <span className="ml-1 text-[10px] bg-amber-50 px-1 rounded">!</span>
                                                )}
                                            </td>
                                            <td className="p-4"><StatusBadge2 status={row.status} /></td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => setActivePunches(parsePunchRecords(row.punchRecords))}
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline bg-indigo-50 px-2 py-1 rounded"
                                                >
                                                    View Punches
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Punch Drawer */}
            {activePunches && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setActivePunches(null)}
                    />
                    <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Punch Timeline</h3>
                            <button
                                onClick={() => setActivePunches(null)}
                                className="p-1 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-2 gap-2">
                                {activePunches.map((p, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col p-3 rounded-lg border ${p.type === 'IN' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}
                                    >
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${p.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {p.type}
                                        </span>
                                        <span className="font-mono font-bold text-slate-700 text-lg">{p.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 text-center uppercase tracking-widest">
                            Total Punches: {activePunches.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceReports;