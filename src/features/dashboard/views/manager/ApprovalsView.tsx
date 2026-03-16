import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaInbox, FaInfoCircle } from "react-icons/fa";
import FailureModal from "../../../../components/ui/FailureModal";
import SuccessModal from "../../../../components/ui/SuccessModal";
import { useDashboard } from "../../hooks/useDashboard";
import type { ApprovalRequest } from "../../types";

const ApprovalsView: React.FC = () => {
  const { loading, error, fetchApprovals, processApproval, setError } = useDashboard();
  const [list, setList] = useState<ApprovalRequest[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

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
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Updating Queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-200 pb-5 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pending Requests</h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            There are {list.length} leave applications awaiting your decision.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm border border-indigo-100 uppercase tracking-wider">
          <FaInfoCircle /> Manager View
        </div>
      </div>
      
      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 gap-1">
        <AnimatePresence mode="popLayout">
          {list.length > 0 ? (
            list.map((req) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                key={req.id}
                className="bg-white border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all flex items-center gap-6 group rounded-sm"
              >
                {/* Employee Signature Square with Tiny Corners */}
                <div className={`w-12 h-12 shrink-0 ${req.avatarColor || 'bg-slate-50 text-slate-600'} border border-slate-200 rounded-md flex items-center justify-center font-bold text-sm`}>
                  {req.initial || req.employee.charAt(0)}
                </div>
                
                {/* Details Section */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{req.employee}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{req.dept}</p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-bold text-slate-700">{req.type}</span>
                    <p className="text-[11px] text-slate-500 font-medium">{req.range}</p>
                  </div>

                  <div className="flex items-center">
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-sm text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                      {req.days} Working Days
                    </span>
                  </div>
                </div>

                {/* Professional Action Buttons with Tiny Corners */}
                <div className="flex gap-2 shrink-0 border-l border-slate-100 pl-6">
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(req.id, 'Rejected')}
                    className="h-9 px-4 border border-slate-200 rounded-md text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-50 text-xs font-bold"
                  >
                    Deny
                  </button>
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(req.id, 'Approved')}
                    className="h-9 px-4 bg-slate-900 text-white rounded-md hover:bg-indigo-600 transition-all disabled:opacity-50 text-xs font-bold shadow-sm"
                  >
                    Approve
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-md"
            >
              <FaInbox className="mx-auto text-slate-200 mb-3" size={32} />
              <p className="text-sm font-bold text-slate-500 tracking-tight">Queue Cleared</p>
              <p className="text-xs text-slate-400 mt-1">All employee requests have been processed.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FEEDBACK MODALS */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal 
            title="Update Successful"
            message="The request has been processed and logs have been updated."
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