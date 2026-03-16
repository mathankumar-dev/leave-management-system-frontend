import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FaCalendarAlt, FaEllipsisV, FaEdit, FaTimes, FaInfoCircle } from "react-icons/fa";
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
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const accordionVariants: Variants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: "easeIn" },
        opacity: { duration: 0.1 }
      }
    }
  };

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
    }));
  }, [history, statusFilter]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Loading History" />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <header className="px-1 md:px-0">
        <h3 className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Track and manage your requests</h3>

        <div className="mt-4 overflow-x-auto no-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex bg-slate-100 p-1 rounded-sm w-max md:w-full">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-6 py-2 rounded-sm text-xs font-black transition-all snap-start ${statusFilter === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-3">
        <AnimatePresence initial={false}>
          {filteredHistory.map((item) => (
            <motion.div
              layout
              key={item.id}
              className={`bg-white rounded-sm border overflow-hidden transition-colors ${expandedId === item.id ? 'border-indigo-300 ring-1 ring-indigo-50' : 'border-slate-200 shadow-sm'}`}
            >
              <div
                className="p-4 cursor-pointer active:bg-slate-50"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-indigo-500 uppercase block mb-0.5 tracking-wider">{item.displayType}</span>
                    <h3 className="text-base font-bold text-slate-900">{item.days} Days Request</h3>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FaCalendarAlt className="text-slate-400 shrink-0" size={12} />
                    <span className="text-xs font-bold uppercase tracking-tight">{item.displayRange}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatTimeAgo(item.createdAt)}</span>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {expandedId === item.id && (
                  <motion.div
                    key="content"
                    variants={accordionVariants}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    className="bg-slate-50 border-t border-slate-100"
                  >
                    <div className="p-4">
                      <DetailContent item={item} userRole={user?.role} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block bg-white rounded-sm border border-slate-200 overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Duration</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Date Range</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">Actions</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((item) => (
              <React.Fragment key={item.id}>
                <tr
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className={`transition-colors cursor-pointer ${expandedId === item.id ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'}`}
                >
                  <td className="px-6 py-4 font-bold text-slate-900 uppercase text-xs">{item.displayType}</td>
                  <td className="px-6 py-4 text-indigo-600 font-bold text-sm">{item.days} Days</td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-bold">{item.displayRange}</td>
                  <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {item.status === "PENDING" ? (
                      <ActionMenu
                        item={item}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        onEdit={() => setEditingLeave(item)}
                        onCancel={() => handleCancel(item.id)}
                      />
                    ) : (
                      <span className="text-slate-300 text-[10px] font-bold uppercase italic tracking-tighter">Finalized</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{formatTimeAgo(item.createdAt)}</td>
                </tr>
                {/* DESKTOP ANIMATED ROW */}
                <tr>
                  <td colSpan={6} className="p-0 border-none">
                    <AnimatePresence initial={false}>
                      {expandedId === item.id && (
                        <motion.div
                          variants={accordionVariants}
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          className="overflow-hidden bg-slate-50/50 shadow-inner"
                        >
                          <div className="px-6 py-8">
                            <DetailContent item={item} userRole={user?.role} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              </React.Fragment>
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

const DetailContent = ({ item, userRole }: { item: any; userRole?: string }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const { user } = useAuth();
  const days = item.days;

  const needsTL = true; 
  const needsManager = days > 1;
  const needsHR = days > 7;

  const isEmployee = userRole === "EMPLOYEE" || userRole === "USER";
  const showTLStep = isEmployee && needsTL;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Reason Section */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FaInfoCircle className="text-indigo-400" /> Reason & Impact
        </h4>
        <div className="bg-white p-3 rounded-sm border border-slate-200 shadow-sm min-h-15">
          <p className="text-xs text-slate-600 leading-relaxed italic">
            {item.reason ? `"${item.reason}"` : "No reason provided."}
          </p>
        </div>
      </div>

      {/* Timing Section */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FaCalendarAlt className="text-indigo-400" /> Timing
        </h4>
        <div className="bg-white rounded-sm border border-slate-200 divide-y divide-slate-100 shadow-sm">
          <div className="p-2.5 flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase">Starts</span>
            <span className="text-xs font-black text-slate-700">{item.startDate}</span>
          </div>
          <div className="p-2.5 flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-500 uppercase">Ends</span>
            <span className="text-xs font-black text-slate-700">{item.endDate}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Approval Tracker */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Approval Flow ({days} {days === 1 ? 'Day' : 'Days'})
        </h4>
        <div className="space-y-4 relative before:absolute before:left-1.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 ml-1">

          {/* TEAM LEADER STEP */}
          {showTLStep && (
            <div className="relative pl-6">
              <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${item.teamLeaderDecision === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <p className="text-[11px] font-black text-slate-700 uppercase leading-none">Team Leader</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {item.teamLeaderDecision ? `${item.teamLeaderDecision} ${formatDate(item.teamLeaderDecidedAt)}` : 'Awaiting Review'}
              </p>
            </div>
          )}

          {/* MANAGER STEP */}
          {needsManager && (
            <div className="relative pl-6">
              <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${item.managerDecision === 'APPROVED' ? 'bg-emerald-500' : item.managerDecision === 'REJECTED' ? 'bg-rose-500' : 'bg-slate-300'}`} />
              <p className="text-[11px] font-black text-slate-700 uppercase leading-none">Manager</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {item.managerDecision
                  ? `${item.managerDecision} on ${formatDate(item.managerDecidedAt)}`
                  : (showTLStep && !item.teamLeaderDecision) ? 'Waiting for TL' : 'Awaiting Review'}
              </p>
            </div>
          )}

          {/* HR STEP */}
          {needsHR && (
            <div className="relative pl-6">
              <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${item.hrDecision === 'APPROVED' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <p className="text-[11px] font-black text-slate-700 uppercase leading-none">HR Finalization</p>
              <p className="text-[10px] text-slate-500 mt-1">
                {item.hrDecision
                  ? `${item.hrDecision}`
                  : (needsManager && !item.managerDecision) ? 'Waiting for Manager' : 'Awaiting Review'}
              </p>
            </div>
          )}

          {/* Fallback if only TL is needed and user is a TL */}
          {!showTLStep && !needsManager && !needsHR && (
            <p className="text-[10px] font-bold text-indigo-500 uppercase italic">Self-Approved / Auto-Finalized</p>
          )}
        </div>
      </div>
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
            className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-sm z-[60] shadow-xl overflow-hidden"
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
    <span className={`inline-flex px-2 py-0.5 rounded-sm border uppercase text-[10px] font-bold tracking-wider ${styles[status.toUpperCase()] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
};

export default MyLeavesView;