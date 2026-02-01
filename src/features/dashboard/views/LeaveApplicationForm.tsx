import React, { useState } from "react";
import { FaPaperPlane, FaInfoCircle, FaSpinner } from "react-icons/fa";

import { motion } from "framer-motion";
import SuccessModal from "../../../components/ui/SuccessModal";
import { useDashboard } from "../hooks/useDashboard";

const LeaveApplicationForm: React.FC = () => {
  // Pulling logic from our custom hook
  const { applyLeave, loading, error } = useDashboard();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Pass data through the hook -> service -> api
    const result = await applyLeave(formData);

    // If the service call was successful (returned data)
    if (result) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <SuccessModal
        title="Application Sent!"
        message="Your leave request has been successfully submitted and is now awaiting manager approval."
        buttonText="BACK TO DASHBOARD"
        onClose={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm">
        <header className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Apply for Leave</h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Submit your request for manager approval
          </p>

          {/* Display API errors from the hook */}
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-rose-500 text-[10px] font-black uppercase mt-4 bg-rose-50 p-3 rounded-xl border border-rose-100"
            >
              {error}
            </motion.p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Type Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase px-1">Leave Type</label>
              <select
                disabled={loading}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none appearance-none disabled:opacity-50"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
              </select>
            </div>

            {/* Read-only Days Display */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase px-1">Total Days</label>
              <div className="bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-400">
                {formData.startDate && formData.endDate ? "Auto-calculating..." : "Select Dates"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase px-1">Start Date</label>
              <input
                type="date"
                required
                disabled={loading}
                value={formData.startDate}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all disabled:opacity-50"
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase px-1">End Date</label>
              <input
                type="date"
                required
                disabled={loading}
                value={formData.endDate}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all disabled:opacity-50"
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Reason Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase px-1">Reason / Notes</label>
            <textarea
              rows={4}
              required
              disabled={loading}
              value={formData.reason}
              placeholder="Provide a brief explanation for your leave..."
              className="w-full bg-slate-50 border-none rounded-[2rem] px-6 py-5 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all disabled:opacity-50"
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          {/* Policy Info Box */}
          <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] flex gap-4 items-start border border-indigo-100/50">
            <FaInfoCircle className="text-indigo-500 mt-1 shrink-0" />
            <p className="text-[11px] font-bold text-indigo-600/80 leading-relaxed">
              Your request will be sent to your immediate manager. You will receive a notification once it has been processed.
            </p>
          </div>

          {/* Submit Button with Loading State */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaPaperPlane />
                <span>Submit Application</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;