import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { useDashboard } from "../../hooks/useDashboard";

interface LeaveType {
  id: number;
  name: string;
  days: number;
  color: string;
}

const LeaveTypesView: React.FC = () => {
  const { fetchLeaveTypes, removeLeaveType, loading, error } = useDashboard();
  const [types, setTypes] = useState<LeaveType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLeaveTypes();
      if (data) setTypes(data);
    };
    loadData();
  }, [fetchLeaveTypes]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      const success = await removeLeaveType(id);
      if (success) {
        setTypes((prev) => prev.filter((t) => t.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Configuration</h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Define organizational policies and yearly limits
          </p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
          <FaPlus size={12} /> New Leave Type
        </button>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-3 text-rose-700 text-xs font-semibold">
          <FaShieldAlt className="shrink-0" />
          {error}
        </div>
      )}

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading && types.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-3">
            <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Fetching Policies...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {types.map((t) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={t.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden flex"
              >
                {/* Side Accent Bar */}
                <div className={`w-1.5 shrink-0 ${t.color || 'bg-slate-400'}`} />

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Annual Allocation</p>
                    </div>
                    
                    <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all">
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all disabled:opacity-30"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">{t.days}</span>
                    <span className="text-xs font-bold text-slate-500">Days</span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded uppercase tracking-wide">
                      Active Policy
                    </span>
                    {loading && <FaSpinner className="animate-spin text-slate-200" size={12} />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default LeaveTypesView;