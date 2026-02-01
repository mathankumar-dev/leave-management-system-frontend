import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
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

  // Load data on component mount
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
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Leave Configuration</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Define policies and limits
          </p>
        </div>
        <button className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
          <FaPlus /> New Leave Type
        </button>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-tight">
          {error}
        </div>
      )}

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && types.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
            <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Fetching Policies...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {types.map((t) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={t.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden"
              >
                {/* Decorative Pattern */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${t.color || 'bg-slate-500'} opacity-5 -mr-8 -mt-8 rounded-full`} />

                <div className="flex justify-between items-start relative z-10">
                  <div className={`w-3 h-3 rounded-full ${t.color || 'bg-slate-500'} shadow-lg`} />
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={loading}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.name}</h3>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-4xl font-black text-slate-800">{t.days}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">
                      Days / Year
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase tracking-tight">
                    Standard Policy
                  </span>
                  {loading && <FaSpinner className="animate-spin text-slate-200" size={12} />}
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