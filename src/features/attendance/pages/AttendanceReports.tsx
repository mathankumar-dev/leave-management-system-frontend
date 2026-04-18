import { useCalendar } from "@/features/attendance/hooks/useCalendar";
import { useEmployee } from "@/features/employee/hooks/useEmployee";
import type { EmployeeEntity } from "@/features/employee/types";
import { useAuth } from "@/shared/auth/useAuth";
import React, { useEffect, useMemo, useState } from "react";
import {
    FaArrowLeft,
    FaFileExport,
    FaUserAlt
} from "react-icons/fa";

const AttendanceReports: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // Hooks & State (Logic strictly preserved)
    const {
        fetchTeamAttendanceReport,
        fetchEmployeeAttendanceReport,
        downloadSelectedReport,
        teamAttendanceReport,
        allEmployeesAttendanceReport,
        attendanceReport,
        downloadAttendanceExcel,
        // fetchAllEmployeeAttendanceReport,
    } = useCalendar();

    const { getEmployees } = useEmployee();
    const [employees, setEmployees] = useState<EmployeeEntity[]>([]);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [activePunches, setActivePunches] = useState<{ time: string; type: string }[] | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState({
        from: new Date().toISOString().split('T')[0].substring(0, 8) + '01',
        to: new Date().toISOString().split('T')[0]
    });

    // Add these with your other useState hooks
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const SIZE = 10; // Items per page

    const reportData = isAdmin ? allEmployeesAttendanceReport : teamAttendanceReport;
    useEffect(() => {
        if (isAdmin) {
            const loadAllEmployees = async () => {
                try {
                    // Use the page state here
                    const result = await getEmployees({ page, size: 10 });
                    if (result?.content) {
                        setEmployees(result.content);
                        setTotalPages(result.totalPages || 0);
                    }
                } catch (err) {
                    console.error("Failed to fetch employees", err);
                }
            };
            loadAllEmployees();
        }
    }, [isAdmin, getEmployees, page, selectedEmployeeId]);

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

    // const uniqueEmployees = useMemo(() => {
    //     if (!reportData) return [];
    //     const map = new Map();
    //     reportData.forEach(item => {
    //         if (!map.has(item.employeeId)) map.set(item.employeeId, item);
    //     });
    //     return Array.from(map.values());
    // }, [reportData]);

    // // const dataToDisplay = selectedEmployeeId ? attendanceReport : uniqueEmployees;


    // const dataToDisplay = useMemo(() => {
    //     // If an employee is selected, we show their detailed report
    //     if (selectedEmployeeId) return attendanceReport || [];

    //     // If no employee selected:
    //     // Admin sees the list of all employees
    //     if (isAdmin) return employees.map(e => ({
    //         employeeId: e.empId,
    //         employeeName: e.name,
    //         isListView: true // Helper flag
    //     }));

    //     // Non-Admin sees their team report
    //     return teamAttendanceReport || [];
    // }, [selectedEmployeeId, attendanceReport, isAdmin, employees, teamAttendanceReport]);

    const dataToDisplay = useMemo(() => {
        // 1. Detail View: If a specific employee is selected
        if (selectedEmployeeId) {
            return attendanceReport || [];
        }

        // 2. List View: Admin or Team (Deduplicated)
        const map = new Map();

        if (isAdmin) {
            // Admin Logic: Mapping all employees
            employees.forEach((e) => {
                // Only add if not already present
                if (!map.has(e.empId)) {
                    map.set(e.empId, {
                        employeeId: e.empId,
                        employeeName: e.name,
                        isListView: true
                    });
                }
            });
        } else {
            // Team Logic: Using the report data
            (teamAttendanceReport || []).forEach((item) => {
                if (!map.has(item.employeeId)) {
                    map.set(item.employeeId, item);
                }
            });
        }

        return Array.from(map.values());
    }, [selectedEmployeeId, attendanceReport, isAdmin, employees, teamAttendanceReport]);

    const toggleEmployee = (empId: string) => {
        setSelectedIds(prev => prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === employees.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(employees.map(e => e.empId));
        }
    };

    const selectedEmployeeName = useMemo(() => {
        if (!selectedEmployeeId) return "";

        // 1. If Admin, find the name in the employee list (the source of truth)
        if (isAdmin) {
            const emp = employees.find(e => e.empId === selectedEmployeeId);
            return emp ? emp.name : "Loading...";
        }

        // 2. If regular user, find the name in the reportData (team/personal view)
        const emp = reportData?.find(e => e.employeeId === selectedEmployeeId);
        return emp ? emp.employeeName : "Loading...";
    }, [selectedEmployeeId, isAdmin, employees, reportData]);
    const handleExport = async () => {
        try {
            if (selectedEmployeeId) {
                await downloadAttendanceExcel(selectedEmployeeId, {
                    fromDate: dateRange.from,
                    toDate: dateRange.to
                });
            } else {
                const idsToExport = selectedIds.length > 0 ? selectedIds : employees.map(e => e.empId);
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

    useEffect(() => {
        setSelectedIds([]);

        const params = {
            fromDate: dateRange.from,
            toDate: dateRange.to,
            page: page, // Add this
            size: SIZE   // Add this
        };

        if (selectedEmployeeId) {
            fetchEmployeeAttendanceReport(selectedEmployeeId, params);
        } else if (!isAdmin) {
            fetchTeamAttendanceReport(user!.id, params);
        }
        // Note: If you are an Admin viewing the list, ensure your getEmployees 
        // call also updates to use the page state.
    }, [selectedEmployeeId, dateRange, isAdmin, fetchTeamAttendanceReport, fetchEmployeeAttendanceReport, user?.id, page]); // Add 'page' to dependencies

    return (
        <div className=" bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {selectedEmployeeId && (
                            <button onClick={() => setSelectedEmployeeId(null)} className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all text-slate-600">
                                <FaArrowLeft size={16} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {selectedEmployeeId ? `${selectedEmployeeName}` : "Attendance Reports"}
                            </h1>
                            <p className="text-sm text-slate-500 font-medium">{selectedEmployeeId ? "Individual Attendance History" : "Overview of team attendance logs"}</p>
                        </div>
                    </div>
                    <button onClick={handleExport} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all active:scale-95">
                        <FaFileExport size={14} /> Export Report
                    </button>
                </div>

                {/* Filters Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-end gap-6">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From Date</label>
                        <input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} className="border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">To Date</label>
                        <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} className="border border-slate-200 rounded-lg p-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none" />
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50">
                                <tr className="border-b border-slate-200">
                                    {!selectedEmployeeId && (
                                        <th className="px-6 py-4 w-10">
                                            <input
                                                type="checkbox"
                                                onChange={toggleSelectAll}
                                                checked={selectedIds.length > 0 && selectedIds.length === employees.length}
                                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                        </th>
                                    )}
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee Name</th>
                                    {selectedEmployeeId && (
                                        <>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Check In</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Check Out</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Work Hours</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Timeline</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dataToDisplay?.map((row: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                        {!selectedEmployeeId && (
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(row.employeeId)}
                                                    onChange={() => toggleEmployee(row.employeeId)}
                                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                />
                                            </td>
                                        )}
                                        <td
                                            className={`px-6 py-4 text-sm font-medium ${!selectedEmployeeId ? 'cursor-pointer group' : 'text-slate-800'}`}
                                            onClick={() => !selectedEmployeeId && setSelectedEmployeeId(row.employeeId)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-100">
                                                    {row.employeeName ? row.employeeName.charAt(0).toUpperCase() : <FaUserAlt size={12} />}
                                                </div>
                                                <span className={`text-slate-700 ${!selectedEmployeeId ? 'group-hover:text-indigo-600 transition-colors' : ''}`}>
                                                    {row.employeeName || selectedEmployeeName}
                                                </span>
                                            </div>
                                        </td>

                                        {selectedEmployeeId && (
                                            <>
                                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.date}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-emerald-600 font-mono">
                                                    {getFirstPunch(row.punchRecords)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-rose-600 font-mono">
                                                    {getLastPunch(row.punchRecords)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                                    {formatWorkingHours(row.workingHours)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setActivePunches(parsePunchRecords(row.punchRecords))}
                                                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide px-3 py-1 bg-indigo-50 rounded-md transition-all"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        {!selectedEmployeeId && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Page {page + 1} of {totalPages || 1}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                        className="px-3 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={page >= totalPages - 1}
                                        onClick={() => setPage(prev => prev + 1)}
                                        className="px-3 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Punch Drawer */}
            {activePunches && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setActivePunches(null)} />
                    <div className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                            <h3 className="font-bold text-slate-800 text-base">Punch Timeline</h3>
                            <button onClick={() => setActivePunches(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5">
                            <div className="space-y-3">
                                {activePunches.map((p, idx) => (
                                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${p.type === 'IN' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${p.type === 'IN' ? 'text-emerald-700' : 'text-rose-700'}`}>{p.type}</span>
                                            <span className="font-mono font-bold text-slate-800 text-sm mt-0.5">{p.time}</span>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${p.type === 'IN' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceReports;