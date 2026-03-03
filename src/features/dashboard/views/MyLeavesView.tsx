import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaChevronRight, FaEllipsisV, FaEdit, FaTimes } from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../../auth/hooks/useAuth";
import type { LeaveRecord } from "../types";
import CustomLoader from "../../../components/ui/CustomLoader";

const MyLeavesView: React.FC = () => {
  const { fetchMyLeaves, loading } = useDashboard();
  const { user } = useAuth();
  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Track which item's menu is open
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchMyLeaves(user.id).then(setHistory);
    }
  }, [fetchMyLeaves, user?.id]);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const filteredHistory = useMemo(() => {
    let list = [...history];
    if (statusFilter !== "ALL") {
      list = list.filter((item) => item.status === statusFilter);
    }
    list.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return list.map((item) => ({
      ...item,
      displayType: item.leaveType.replace("_", " "),
      displayRange: `${new Date(item.startDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })} - ${new Date(item.endDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })}`,
      displayApplied: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [history, statusFilter]);

  const handleEdit = (id: string) => {
    console.log("Edit leave:", id);
    // Logic for opening edit modal goes here
  };

  const handleCancel = (id: string) => {
    console.log("Cancel leave:", id);
    // Logic for cancellation API call goes here
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Loading Leaves History" />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <header className="px-1 md:px-0">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Leave History</h2>
        <p className="text-xs font-medium text-slate-500 mt-1">Track and manage your requests</p>

        <div className="mt-4 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex bg-slate-100 p-1 rounded-xl w-max md:w-auto">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-indigo-500 uppercase block mb-1">
                    {item.displayType}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 truncate">{item.days} Days Total</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {item.status === "PENDING" && (
                     <ActionMenu 
                        id={item.id} 
                        activeMenu={activeMenu} 
                        setActiveMenu={setActiveMenu} 
                        onEdit={handleEdit} 
                        onCancel={handleCancel}
                     />
                  )}
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <FaCalendarAlt className="text-slate-400 shrink-0" size={14} />
                  <span className="text-sm font-medium truncate">PERIOD: {item.displayRange}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="uppercase">Applied: {item.displayApplied}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Date Range</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-slate-900 uppercase text-xs">{item.displayType}</td>
                <td className="px-6 py-5 text-indigo-600 font-bold text-sm">{item.days} Days</td>
                <td className="px-6 py-5 text-slate-600 text-sm">{item.displayRange}</td>
                <td className="px-6 py-5 text-slate-500 text-sm max-w-xs truncate">{item.reason || "—"}</td>
                <td className="px-6 py-5"><StatusBadge status={item.status} /></td>
                <td className="px-6 py-5 text-right relative">
                  {item.status === "PENDING" ? (
                    <ActionMenu 
                      id={item.id} 
                      activeMenu={activeMenu} 
                      setActiveMenu={setActiveMenu} 
                      onEdit={handleEdit} 
                      onCancel={handleCancel}
                    />
                  ) : (
                    <span className="text-slate-300 text-[10px] font-bold uppercase">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SUB-COMPONENT: ACTION MENU
const ActionMenu = ({ id, activeMenu, setActiveMenu, onEdit, onCancel }: any) => {
  const isOpen = activeMenu === id;

  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setActiveMenu(isOpen ? null : id)}
        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
      >
        <FaEllipsisV size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="py-1">
              <button
                onClick={() => { onEdit(id); setActiveMenu(null); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FaEdit className="text-indigo-500" /> Edit Request
              </button>
              <button
                onClick={() => { onCancel(id); setActiveMenu(null); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-50"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  };
  const currentStyle = styles[status.toUpperCase()] || "bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider whitespace-nowrap ${currentStyle}`}>
      {status}
    </span>
  );
};

export default MyLeavesView;