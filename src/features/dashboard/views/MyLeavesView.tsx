import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaEllipsisV, FaEdit, FaTimes } from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../../auth/hooks/useAuth";
import type { LeaveRecord } from "../types";
import CustomLoader from "../../../components/ui/CustomLoader";
import EditLeaveModal from "../components/EditLeaveModal";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

const MyLeavesView: React.FC = () => {
  const { fetchMyLeaves, cancelLeave, editLeave, loading } = useDashboard();
  const { user } = useAuth();

  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [editingLeave, setEditingLeave] = useState<LeaveRecord | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const loadLeaves = async () => {
      const data = await fetchMyLeaves(user.id);
      setHistory(data);
    };
    loadLeaves();
  }, [user?.id, fetchMyLeaves]);

  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleCancel = async (id: number) => {
    if (!user?.id) return;
    const success = await cancelLeave(id, user.id);
    if (success) {
      const updated = await fetchMyLeaves(user.id);
      setHistory(updated);
    }
  };

  const handleSaveEdit = async (formData: Partial<LeaveRecord>) => {
    if (!user?.id || !editingLeave) return;
    const success = await editLeave(editingLeave.id, { ...formData, employeeId: user.id });
    if (success) {
      const updated = await fetchMyLeaves(user.id);
      setHistory(updated);
      setEditingLeave(null);
    }
  };

  const filteredHistory = useMemo(() => {
    let list = [...history];
    if (statusFilter !== "ALL") {
      list = list.filter((item) => item.status === statusFilter);
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list.map((item) => ({
      ...item,
      displayType: item.leaveType.replace(/_/g, " "),
      displayRange: `${new Date(item.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} - ${new Date(item.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
      displayApplied: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [history, statusFilter]);

  console.log(history);
  

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Loading History" />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <header className="px-1 md:px-0">
        <h3 className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Track and manage your requests</h3>

        {/* Status Filter Tabs - Mobile Friendly Scroll */}
        <div className="mt-4 overflow-x-auto no-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex bg-slate-100 p-1 rounded-sm w-max md:w-full">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-6 py-2 rounded-sm text-xs font-black transition-all snap-start ${statusFilter === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="md:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredHistory.map((item) => (
            <motion.div layout key={item.id} className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0">
                  <span className="text-[9px] font-black text-indigo-500 uppercase block mb-0.5 tracking-wider">{item.displayType}</span>
                  <h3 className="text-base font-bold text-slate-900">{item.days} Days Request</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {item.status === "PENDING" && (
                    <ActionMenu
                      item={item}
                      activeMenu={activeMenu}
                      setActiveMenu={setActiveMenu}
                      onEdit={() => setEditingLeave(item)}
                      onCancel={() => handleCancel(item.id)}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2 border-t border-slate-50 pt-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <FaCalendarAlt className="text-slate-400 shrink-0" size={12} />
                  <span className="text-xs font-bold uppercase tracking-tight">{item.displayRange}</span>
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Submitted: {item.displayApplied}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="hidden md:block bg-white rounded-sm border border-slate-200  overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Duration</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Date Range</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">Actions</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 uppercase text-xs">{item.displayType}</td>
                <td className="px-6 py-4 text-indigo-600 font-bold text-sm">{item.days} Days</td>
                <td className="px-6 py-4 text-slate-600 text-xs font-bold">{item.displayRange}</td>
                <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                <td className="px-6 py-4 text-right">
                  {item.status === "PENDING" ? (
                    <ActionMenu
                      item={item}
                      activeMenu={activeMenu}
                      setActiveMenu={setActiveMenu}
                      onEdit={() => setEditingLeave(item)}
                      onCancel={() => handleCancel(item.id)}
                    />
                    
                  ) : (
                    <span className="text-slate-300 text-[10px] font-bold uppercase italic">Finalized</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatTimeAgo(item.createdAt)}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditLeaveModal
        isOpen={!!editingLeave}
        leave={editingLeave}
        onClose={() => setEditingLeave(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};


const ActionMenu = ({ item, activeMenu, setActiveMenu, onEdit, onCancel }: any) => {
  const isOpen = activeMenu === item.id;
  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setActiveMenu(isOpen ? null : item.id)}
        className={`p-2 rounded-sm transition-colors ${isOpen ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}
      >
        <FaEllipsisV size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-sm  z-[60] overflow-hidden"
          >
            <button onClick={onEdit} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-slate-700 hover:bg-slate-50 text-left uppercase">
              <FaEdit className="text-indigo-500" /> Edit
            </button>
            <button onClick={onCancel} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-rose-600 hover:bg-rose-50 border-t border-slate-50 text-left uppercase">
              <FaTimes /> Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-200/50",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200/50",
  };

  return (
    <span className={`
      inline-flex px-2 py-0.5 rounded-sm border uppercase 
      text-[10px] font-bold tracking-wider 
      ${styles[status.toUpperCase()] || "bg-slate-50 text-slate-600 border-slate-200"}
    `}>
      {status}
    </span>
  );
};

export default MyLeavesView;