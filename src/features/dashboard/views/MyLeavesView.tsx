import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaEllipsisV, FaEdit, FaTimes } from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../../auth/hooks/useAuth";
import type { LeaveRecord } from "../types";
import CustomLoader from "../../../components/ui/CustomLoader";

const MyLeavesView: React.FC = () => {
  const { fetchMyLeaves, cancelLeave, editLeave, loading } = useDashboard();
  const { user } = useAuth();

  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [editingLeave, setEditingLeave] = useState<LeaveRecord | null>(null);
  const [formData, setFormData] = useState<Partial<LeaveRecord>>({});

  // Fetch data on mount
  useEffect(() => {
    if (!user?.id) return;
    const loadLeaves = async () => {
      const data = await fetchMyLeaves(user.id);
      setHistory(data);
    };
    loadLeaves();
  }, [user?.id]);

  // Close menus when clicking anywhere else
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

  // ✅ Triggered from the ActionMenu
  const handleEditInitiate = (item: LeaveRecord) => {
    setEditingLeave(item);
    setFormData({
      startDate: item.startDate,
      endDate: item.endDate,
      reason: item.reason,
      leaveType: item.leaveType
    });
    setActiveMenu(null);
  };

  const handleSaveEdit = async () => {
    if (!user?.id || !editingLeave) return;

    const success = await editLeave(editingLeave.id, {
      ...formData,
      employeeId: user.id,
    });

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
    list.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return list.map((item) => ({
      ...item,
      displayType: item.leaveType.replace(/_/g, " "),
      displayRange: `${new Date(item.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} - ${new Date(item.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
      displayApplied: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [history, statusFilter]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Loading Leaves History" />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <header className="px-1 md:px-0">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight text-primary-500 uppercase italic">My Leave History</h2>
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
            <motion.div layout key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-indigo-500 uppercase block mb-1">{item.displayType}</span>
                  <h3 className="text-lg font-bold text-slate-900 truncate">{item.days} Days Total</h3>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  {item.status === "PENDING" && (
                     <ActionMenu 
                        item={item} 
                        activeMenu={activeMenu} 
                        setActiveMenu={setActiveMenu} 
                        onEdit={() => handleEditInitiate(item)} 
                        onCancel={() => handleCancel(item.id)}
                     />
                  )}
                </div>
              </div>
              <div className="space-y-3 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <FaCalendarAlt className="text-slate-400 shrink-0" size={14} />
                  <span className="text-sm font-medium truncate">PERIOD: {item.displayRange}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Applied: {item.displayApplied}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Duration</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Date Range</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Reason</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                      item={item} 
                      activeMenu={activeMenu} 
                      setActiveMenu={setActiveMenu} 
                      onEdit={() => handleEditInitiate(item)} 
                      onCancel={() => handleCancel(item.id)}
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

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingLeave && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setEditingLeave(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-800 uppercase italic">Edit Leave Request</h3>
                <button onClick={() => setEditingLeave(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <FaTimes className="text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Reason for Leave</label>
                  <textarea
                    rows={3}
                    value={formData.reason || ""}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 flex gap-3">
                <button onClick={() => setEditingLeave(null)} className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase text-slate-500 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

const ActionMenu = ({ item, activeMenu, setActiveMenu, onEdit, onCancel }: any) => {
  const isOpen = activeMenu === item.id;
  return (
    <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setActiveMenu(isOpen ? null : item.id)}
        className={`p-2 rounded-full transition-colors ${isOpen ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100"}`}
      >
        <FaEllipsisV size={14} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <button onClick={onEdit} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <FaEdit className="text-indigo-500" /> Edit Request
            </button>
            <button onClick={onCancel} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 border-t border-slate-50">
              <FaTimes /> Cancel Leave
            </button>
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
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border ${styles[status.toUpperCase()] || "bg-slate-50 text-slate-600"}`}>
      {status}
    </span>
  );
};

export default MyLeavesView;