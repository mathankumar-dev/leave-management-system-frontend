import React, { useState } from "react";
import Cookies from "js-cookie"; // Ensure this is installed
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import type { LeaveApplication, LeaveType } from "../types";
import { Calendar, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";

const LeaveApplicationForm = () => {
  const { user } = useAuth();
  const { applyLeave, loading } = useDashboard();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    category: "CASUAL" as LeaveType,
    startDate: "",
    endDate: "",
    isHalfDay: false,
    halfDayType: "FIRST_HALF" as "FIRST_HALF" | "SECOND_HALF",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawBackupId = Cookies.get("lms_user_id");
    const employeeId = user?.id || (rawBackupId ? parseInt(rawBackupId) : 4);

    const payload: LeaveApplication = {
      employeeId,
      leaveType: formData.category,
      startDate: formData.startDate,
      endDate: formData.isHalfDay ? formData.startDate : formData.endDate,
      reason: formData.reason,
      confirmLossOfPay: false,
    };

    if (formData.isHalfDay) {
      payload.halfDayType = formData.halfDayType;
    }

    const result = await applyLeave(payload);

    // Show success state if submission worked
    if (result) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000); // Reset after 5s
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-12 text-center bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={64} className="text-emerald-500 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Application Submitted!</h2>
        <p className="text-slate-500 mt-2">Your leave request has been sent for approval.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-indigo-600 font-medium hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
        {/* Header */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Apply for Leave</h1>
          <p className="text-sm text-slate-500 mt-1">Submit your request to the management team.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Leave Type Grid */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} /> Select Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["SICK", "CASUAL", "EARNED"] as LeaveType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: type })}
                  className={`py-3 px-4 text-sm font-semibold rounded-xl border transition-all duration-200 ${formData.category === type
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/30"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
                  className="w-full pl-3 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {!formData.isHalfDay && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">End Date</label>
                <input
                  type="date"
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            )}
          </div>

          {/* Half Day Custom Selector */}
          <div className={`p-1 rounded-xl transition-all ${formData.isHalfDay ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-slate-100'}`}>
            <div className="flex items-center justify-between p-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isHalfDay}
                    onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span className="text-sm font-semibold text-slate-700">Partial Day (Half Day)</span>
              </label>

              {formData.isHalfDay && (
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-indigo-100">
                  {["FIRST_HALF", "SECOND_HALF"].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFormData({ ...formData, halfDayType: h as any })}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-tighter font-bold rounded-md transition-all ${formData.halfDayType === h ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      {h.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reason Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Reason for Request</label>
            <textarea
              rows={4}
              placeholder="Please explain the necessity of this leave..."
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-slate-900 hover:bg-indigo-600 text-white p-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-200 active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="tracking-wide">Submit Application</span>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;