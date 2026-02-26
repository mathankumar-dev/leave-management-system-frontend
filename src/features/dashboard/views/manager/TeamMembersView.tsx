import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaSearch,
    FaChartPie,
    FaCalendarCheck,
    FaFilter,
} from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";
import { useAuth } from "../../../auth/hooks/useAuth";
import type { Employee } from "../../types";

const TeamMembersView: React.FC = () => {
    const { getTeamMembers, loading } = useDashboard();
    const { user } = useAuth();

    const [members, setMembers] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (user?.id) {
            getTeamMembers(user.id).then(setMembers);
        }
    }, [user?.id, getTeamMembers]);

    const filteredMembers = useMemo(() => {
        return members.filter((emp) =>
            emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    }, [members, searchTerm]);

    if (loading && members.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Syncing Team Data...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Team</h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                        Managing {filteredMembers.length} Direct Reports
                    </p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                    <FaCalendarCheck /> Team Calendar
                </button>
            </div>

            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search team member name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm transition-all"
                    />
                </div>
                <button className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-bold text-xs shadow-sm">
                    <FaFilter /> Sort By
                </button>
            </div>

            {/* Team Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider">Member</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider text-center">Remaining Leave</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider text-center">Comp-Off</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase text-slate-500 tracking-wider text-center">LOP %</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence mode="popLayout">
                                {filteredMembers.map((emp) => (
                                    <motion.tr
                                        key={emp.employeeId}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                                                    {emp.employeeName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{emp.employeeName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">ID: #00{emp.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                                                {emp.totalRemaining.toFixed(1)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold text-slate-600">
                                                {emp.compOffBalance.toFixed(1)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-xs font-black ${emp.lopPercentage > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                                    {emp.lopPercentage}%
                                                </span>
                                                <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className={`h-full ${emp.lopPercentage > 0 ? "bg-rose-500" : "bg-emerald-500"}`}
                                                        style={{ width: `${Math.min(emp.lopPercentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <FaChartPie size={14} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredMembers.length === 0 && !loading && (
                    <div className="py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                            <FaSearch className="text-slate-300" size={24} />
                        </div>
                        <p className="text-slate-500 font-medium">No team members found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamMembersView;