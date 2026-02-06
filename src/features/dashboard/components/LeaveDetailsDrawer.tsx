import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCalendarAlt, FaHistory, FaInfoCircle } from "react-icons/fa";

interface LeaveDetailsDrawerProps {
  open: boolean;
  title: string | null;
  onClose: () => void;
}

const LeaveDetailsDrawer: React.FC<LeaveDetailsDrawerProps> = ({ open, title, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{title} Details</h2>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Balance Breakdown</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Total Allocated</p>
                  <p className="text-2xl font-black text-indigo-700">12 Days</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Used to Date</p>
                  <p className="text-2xl font-black text-emerald-700">04 Days</p>
                </div>
              </div>

              {/* History Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <FaHistory className="text-slate-400" />
                  <h3 className="font-bold text-sm uppercase tracking-tight">Recent {title} History</h3>
                </div>
                
                <div className="space-y-3">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                          <FaCalendarAlt size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">Oct 12 - Oct 15</p>
                          <p className="text-[10px] text-slate-400">3 Days • Approved</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">#4402{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Note */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 flex gap-3">
                <FaInfoCircle className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Policy Note:</strong> {title} requires 24-hour advance notice for non-emergencies. Max 3 consecutive days allowed without documentation.
                </p>
              </div>

            </div>

            {/* Footer Action */}
            <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-100 bg-white">
              <button className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">
                Request {title}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeaveDetailsDrawer;