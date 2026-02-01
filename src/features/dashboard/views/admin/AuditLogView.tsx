import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaFileExport, FaFilter, 
  FaHistory, FaShieldAlt, FaUserEdit, 
  FaCalendarCheck, FaTimesCircle 
} from "react-icons/fa";

import { useDashboard } from "../../hooks/useDashboard";
import SuccessModal from "../../../../components/ui/SuccessModal";
import type { AuditLog } from "../../types";

const AuditLogView: React.FC = () => {
  const { fetchAuditLogs, loading } = useDashboard();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 1. Fetch real data from Service via Hook
  useEffect(() => {
    const loadLogs = async () => {
      const data = await fetchAuditLogs();
      if (data) setLogs(data);
    };
    loadLogs();
  }, [fetchAuditLogs]);

  // 2. Helper to assign icons based on the action string from API
  const getActionIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("approve")) return <FaCalendarCheck />;
    if (act.includes("reject")) return <FaTimesCircle />;
    if (act.includes("policy") || act.includes("security")) return <FaShieldAlt />;
    return <FaUserEdit />;
  };

  const handleExport = (): void => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowModal(true);
    }, 800);
  };

  const getStatusStyles = (status: AuditLog['status']): string => {
    switch (status) {
      case "success": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "error": return "bg-rose-50 text-rose-600 border-rose-100";
      case "security": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      default: return "bg-blue-50 text-blue-600 border-blue-100";
    }
  };

  const filteredLogs = logs.filter(log => 
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
            <FaHistory className="text-indigo-600 text-xl" />
            Audit Log
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            System-wide activity tracking and compliance monitoring.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-white border-2 border-slate-100 px-5 py-3 rounded-2xl text-[10px] font-black text-slate-700 hover:border-indigo-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <FaFileExport className={`${isExporting ? "animate-bounce" : "text-indigo-600"}`} /> 
            {isExporting ? "GENERATING..." : "EXPORT CSV"}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border-2 border-slate-50 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by actor or action..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 transition-all outline-none font-medium text-slate-600"
          />
        </div>
      </div>

      {/* LOG TABLE / LOADING STATE */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40">
        <div className="overflow-x-auto">
          {loading && logs.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Retrieving Secure Logs...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Event</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actor</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-base border-2 shadow-sm transition-all group-hover:rotate-6 ${getStatusStyles(log.status)}`}>
                          {/* Use the helper instead of log.icon */}
                          {getActionIcon(log.action)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm tracking-tight">{log.action}</p>
                          <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed max-w-xs">{log.details}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 tracking-tight">{log.actor}</span>
                        <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-widest mt-0.5">{log.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600">{log.time}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{log.timestamp}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyles(log.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <SuccessModal 
            title="Log Exported!"
            message="The system audit log has been successfully converted to CSV and is ready for download."
            buttonText="CONTINUE MONITORING"
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditLogView;