import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaUserAlt } from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import type { ApprovalRequest } from "../types";

import SuccessModal from "../../../components/ui/SuccessModal";
import FailureModal from "../../../components/ui/FailureModal";

const ApprovalsView: React.FC = () => {
  const { loading, error, fetchApprovals, processApproval, setError } = useDashboard();
  const [list, setList] = useState<ApprovalRequest[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    fetchApprovals().then((data) => {
      if (isMounted) setList(data);
    });
    return () => { isMounted = false; };
  }, [fetchApprovals]);

  const handleAction = async (id: number, status: 'Approved' | 'Rejected') => {
    const success = await processApproval(id, status);
    
    if (success) {
      setList((prev) => prev.filter((item) => item.id !== id));
      setShowSuccess(true);
    }
  };

  if (loading && list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full"
        />
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-2xl font-black text-slate-900">Pending Approvals</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          {list.length} Requests requiring action
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {list.length > 0 ? (
            list.map((req) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                key={req.id}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6"
              >
                {/* Avatar */}
                <div className={`w-14 h-14 shrink-0 ${req.avatarColor || 'bg-indigo-50 text-indigo-600'} rounded-2xl flex items-center justify-center font-black text-lg`}>
                  {req.initial}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-900 leading-tight truncate">{req.employee}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate">
                    {req.dept} • {req.type}
                  </p>
                  <p className="text-xs font-black text-indigo-600 mt-1">{req.range} ({req.days} days)</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(req.id, 'Rejected')}
                    className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    <FaTimes />
                  </button>
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(req.id, 'Approved')}
                    className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    <FaCheck />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200"
            >
              <FaUserAlt className="mx-auto text-slate-200 mb-4" size={30} />
              <p className="text-slate-400 font-bold italic">No pending requests in your queue.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FEEDBACK MODALS */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal 
            title="Action Confirmed"
            message="The leave status has been updated and the employee has been notified."
            onClose={() => setShowSuccess(false)}
          />
        )}
        {error && (
          <FailureModal 
            title="System Error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApprovalsView;