import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../../auth/hooks/useAuth";
import type { LeaveRecord } from "../types";
import CustomLoader from "../../../components/ui/CustomLoader";

const MyLeavesView: React.FC = () => {
  const { fetchMyLeaves, cancelLeave, editLeave, loading } = useDashboard();
  const { user } = useAuth();

  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingLeave, setEditingLeave] = useState<LeaveRecord | null>(null);
  const [formData, setFormData] = useState<Partial<LeaveRecord>>({});

  // ✅ Fixed useEffect (no infinite loop)
  useEffect(() => {
    if (!user?.id) return;

    const loadLeaves = async () => {
      const data = await fetchMyLeaves(user.id);
      setHistory(data);
    };

    loadLeaves();
  }, [user?.id]); // removed fetchMyLeaves dependency

  const handleCancel = async (id: number) => {
    if (!user?.id) return;

    const success = await cancelLeave(id, user.id);
    if (success) {
      const updated = await fetchMyLeaves(user.id);
      setHistory(updated);
    }
  };

  const filteredHistory = useMemo(() => {
    let list = [...history];

    if (statusFilter !== "ALL") {
      list = list.filter((item) => item.status === statusFilter);
    }

    list.sort(
      (a, b) =>
        new Date(b.startDate).getTime() -
        new Date(a.startDate).getTime()
    );

    return list.map((item) => ({
      ...item,
      displayType: item.leaveType.replace("_", " "),
      displayRange: `${new Date(item.startDate).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short" }
      )} - ${new Date(item.endDate).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short" }
      )}`,
      displayApplied: new Date(item.createdAt).toLocaleDateString(),
    }));
  }, [history, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <CustomLoader label="Loading Leaves History" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <header>
        <h2 className="text-2xl font-black text-slate-900">
          My Leave History
        </h2>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Track and manage your requests
        </p>

        <div className="mt-4 flex bg-slate-100 p-1 rounded-xl w-max">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-bold ${
                statusFilter === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black">Type</th>
              <th className="px-6 py-4 text-xs font-black">Duration</th>
              <th className="px-6 py-4 text-xs font-black">Date Range</th>
              <th className="px-6 py-4 text-xs font-black">Reason</th>
              <th className="px-6 py-4 text-xs font-black text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-xs font-bold uppercase">
                  {item.displayType}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                  {item.days} Days
                </td>
                <td className="px-6 py-4 text-sm">
                  {item.displayRange}
                </td>
                <td className="px-6 py-4 text-sm">
                  {item.reason || "—"}
                </td>
                <td className="px-6 py-4 text-right space-y-2">
                  <StatusBadge status={item.status} />

                  {item.status === "PENDING" && (
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingLeave(item);
                          setFormData(item);
                        }}
                        className="text-xs font-bold text-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="text-xs font-bold text-rose-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          No records found.
        </div>
      )}

      {/* Edit Modal */}
      {editingLeave && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] space-y-4">
            <h3 className="text-lg font-bold">Edit Leave</h3>

            <input
              type="date"
              value={formData.startDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              type="date"
              value={formData.endDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            <input
              type="text"
              value={formData.reason || ""}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full border rounded-lg p-2"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingLeave(null)}
                className="text-sm font-bold text-slate-500"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!user?.id || !editingLeave) return;

                  const success = await editLeave(
                    editingLeave.id,
                    {
                      ...formData,
                      employeeId: user.id,
                    }
                  );

                  if (success) {
                    const updated = await fetchMyLeaves(user.id);
                    setHistory(updated);
                    setEditingLeave(null);
                  }
                }}
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-rose-50 text-rose-700",
    PENDING: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
        styles[status.toUpperCase()] || "bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

export default MyLeavesView;