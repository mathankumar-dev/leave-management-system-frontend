import { useEmployee } from "@/features/employee/hooks/useEmployee";
import EditLeaveModal from "@/features/leave/components/EditLeaveModal";
import { useLeave } from "@/features/leave/hooks/useLeave";
import { useLeaveAction } from "@/features/leave/hooks/useLeaveActions";
import type { LeaveRecord } from "@/features/leave/types";
import { useAuth } from "@/shared/auth/useAuth";
import { CustomLoader } from "@/shared/components";
import { formatTimeAgo } from "@/shared/utils/formatTimeAgo";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaEdit, FaEllipsisV, FaInfoCircle, FaTimes } from "react-icons/fa";

const MyRequestsView: React.FC = () => {
  const { fetchMyLeaves } = useLeave();
  const { cancelLeave, editLeave, loading } = useLeaveAction();
  const { user } = useAuth();
  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [editingLeave, setEditingLeave] = useState<LeaveRecord | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const accordionVariants: Variants = {
    open: { height: "auto", opacity: 1, transition: { height: { duration: 0.3, ease: "easeOut" }, opacity: { duration: 0.2, delay: 0.1 } } },
    collapsed: { height: 0, opacity: 0, transition: { height: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.1 } } }
  };

  const loadAllHistory = async () => {
    if (!user?.id) return;
    try {
      const [leavesData] = await Promise.all([fetchMyLeaves(user.id)]);
      setHistory([...(leavesData || [])]);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    loadAllHistory();
  }, [user?.id]);

  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleCancel = async (id: number) => {
    if (!user?.id) return;
    const success = await cancelLeave(id, user.id);
    if (success) loadAllHistory();
  };

  const handleSaveEdit = async (formData: Partial<LeaveRecord>) => {
    if (!user?.id || !editingLeave) return;
    const success = await editLeave(editingLeave.id, { ...formData, employeeId: user.id });
    if (success) {
      loadAllHistory();
      setEditingLeave(null);
    }
  };

  const filteredHistory = useMemo(() => {
    let list = [...history];
    if (statusFilter !== "ALL") {
      list = list.filter((item) => item.status === statusFilter);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list.map((item) => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      const isSameDay = item.startDate === item.endDate;

      let calculatedDays = item.days || 0;
      if (calculatedDays === 0) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }

      // Updated Logic: If days are less than 1, show "Partial Day"
      const durationLabel = calculatedDays < 1 
        ? "Half Day" 
        : `${calculatedDays} ${calculatedDays === 1 ? 'Day' : 'Days'}`;

      const dateOptions: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
      const displayRange = isSameDay
        ? start.toLocaleDateString("en-GB", dateOptions)
        : `${start.toLocaleDateString("en-GB", dateOptions)} - ${end.toLocaleDateString("en-GB", dateOptions)}`;

      return {
        ...item,
        days: calculatedDays,
        durationLabel,
        displayType: item.leaveTypeName ? item.leaveTypeName : "N/A",
        displayRange,
      };
    });
  }, [history, statusFilter]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <CustomLoader label="Syncing Records" />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <header className="px-1 md:px-0">
        <h3 className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Track Leaves and OD Requests</h3>
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
              key={`${item.leaveTypeName}-${item.id}`}
              className={`bg-white rounded-sm border overflow-hidden transition-colors ${expandedId === item.id ? 'border-indigo-300 ring-1 ring-indigo-50' : 'border-slate-200 shadow-sm'}`}
            >
              <div className="p-4 cursor-pointer active:bg-slate-50" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0">
                    <span className={`text-[9px] font-black uppercase block mb-0.5 tracking-wider ${item.leaveTypeName === 'ON_DUTY' ? 'text-amber-500' : 'text-indigo-500'}`}>
                      {item.displayType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {item.durationLabel} {item.leaveTypeName === 'ON_DUTY' ? 'OD' : 'Leave'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge status={item.status} />
                    {item.status === "PENDING" && (
                      <ActionMenu item={item} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEdit={() => setEditingLeave(item as LeaveRecord)} onCancel={() => handleCancel(item.id)} />
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
                  <motion.div key="content" variants={accordionVariants} initial="collapsed" animate="open" exit="collapsed" className="bg-slate-50 border-t border-slate-100">
                    <div className="p-4">
                      <DetailContent item={item} />
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
              <React.Fragment key={`${item.leaveTypeName}-${item.id}`}>
                <tr onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className={`transition-colors cursor-pointer ${expandedId === item.id ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'}`}>
                  <td className={`px-6 py-4 font-bold uppercase text-xs ${item.leaveTypeName === 'ON_DUTY' ? 'text-amber-600' : 'text-slate-900'}`}>{item.displayType}</td>
                  <td className="px-6 py-4 text-indigo-600 font-bold text-sm">{item.durationLabel}</td>
                  <td className="px-6 py-4 text-slate-600 text-xs font-bold">{item.displayRange}</td>
                  <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {item.status === "PENDING" ? (
                      <ActionMenu item={item} activeMenu={activeMenu} setActiveMenu={setActiveMenu} onEdit={() => setEditingLeave(item as LeaveRecord)} onCancel={() => handleCancel(item.id)} />
                    ) : (
                      <span className="text-slate-300 text-[10px] font-bold uppercase tracking-tighter">Finalized</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{formatTimeAgo(item.createdAt)}</td>
                </tr>
                <tr>
                  <td colSpan={6} className="p-0 border-none">
                    <AnimatePresence initial={false}>
                      {expandedId === item.id && (
                        <motion.div variants={accordionVariants} initial="collapsed" animate="open" exit="collapsed" className="overflow-hidden bg-slate-50/50 shadow-inner">
                          <div className="px-6 py-8">
                            <DetailContent item={item} />
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

      <EditLeaveModal isOpen={!!editingLeave} leave={editingLeave} onClose={() => setEditingLeave(null)} onSave={handleSaveEdit} />
    </div>
  );
};

const DetailContent = ({ item }: { item: any }) => {
  const { fetchEmployeeName } = useEmployee();
  const [firstApproverName, setFirstApproverName] = useState<string>("Loading...");
  const [secondApproverName, setSecondApproverName] = useState<string>("Loading...");

  useEffect(() => {
    const resolveNames = async () => {
      try {
        if (item.firstApproverId) {
          const response1 = await fetchEmployeeName(item.firstApproverId);
          setFirstApproverName(response1?.empName || item.firstApproverId);
        }
        if (item.secondApproverId) {
          const response2 = await fetchEmployeeName(item.secondApproverId);
          setSecondApproverName(response2?.empName || item.secondApproverId);
        }
      } catch (err) {
        setFirstApproverName(item.firstApproverId || "Unknown");
        setSecondApproverName(item.secondApproverId || "Unknown");
      }
    };
    resolveNames();
  }, [item.firstApproverId, item.secondApproverId]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const showSecondLevel = !!item.secondApproverId && item.firstApproverDecision !== 'REJECTED';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FaInfoCircle className="text-indigo-400" /> Request Details
        </h4>
        <div className="bg-white p-3 rounded-sm border border-slate-200 shadow-sm min-h-[60px]">
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            {item.reason ? `"${item.reason}"` : "No reason provided."}
          </p>
          <div className="flex flex-wrap gap-2">
            {item.isAppointment && (
              <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase">Appointment</span>
            )}
            {item.startDateHalfDayType && (
              <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase">
                {item.startDateHalfDayType.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-slate-200 divide-y divide-slate-100 shadow-sm h-fit">
        <div className="p-2.5 flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase">Start Date</span>
          <span className="text-xs font-black text-slate-700">{item.startDate}</span>
        </div>
        <div className="p-2.5 flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase">End Date</span>
          <span className="text-xs font-black text-slate-700">{item.endDate}</span>
        </div>
        <div className="p-2.5 flex justify-between items-center bg-slate-50/50">
          <span className="text-[9px] font-black text-slate-500 uppercase">Duration</span>
          <span className="text-xs font-black text-indigo-600">{item.durationLabel}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Approval Workflow
        </h4>
        <div className="space-y-6 relative before:absolute before:left-1.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 ml-1">
          <div className="relative pl-6">
            <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-colors 
              ${item.firstApproverDecision === 'APPROVED' ? 'bg-emerald-500' : item.firstApproverDecision === 'REJECTED' ? 'bg-rose-500' : 'bg-slate-300'}`}
            />
            <p className="text-[11px] font-black text-slate-700 uppercase leading-none">
              Level 1: {firstApproverName}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              {item.firstApproverDecision
                ? `${item.firstApproverDecision} • ${formatDate(item.firstApproverDecidedAt)}`
                : 'Awaiting Action'}
            </p>
          </div>

          {showSecondLevel && (
            <div className="relative pl-6">
              <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-colors 
                ${item.secondApproverDecision === 'APPROVED' ? 'bg-emerald-500' : item.secondApproverDecision === 'REJECTED' ? 'bg-rose-500' : 'bg-slate-300'}`}
              />
              <p className="text-[11px] font-black text-slate-700 uppercase leading-none">
                Level 2: {secondApproverName}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {item.secondApproverDecision
                  ? `${item.secondApproverDecision} • ${formatDate(item.secondApproverDecidedAt)}`
                  : (item.firstApproverDecision === 'APPROVED' ? 'Awaiting Secondary Review' : 'Pending Level 1')}
              </p>
            </div>
          )}

          {item.status !== 'PENDING' && (
            <div className="relative pl-6">
              <div className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${item.status === 'APPROVED' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
              <p className="text-[11px] font-black text-slate-700 uppercase leading-none">Request Finalized</p>
              <p className="text-[10px] text-slate-500 mt-1">Status: {item.status}</p>
            </div>
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

export default MyRequestsView;