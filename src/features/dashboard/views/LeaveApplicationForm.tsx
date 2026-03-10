import React, { useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import type { LeaveApplication, LeaveType } from "../types";
import MyDatePicker from "../../../components/ui/datepicker/MyDatePicker";

import { 
  HiOutlineClock, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlinePaperAirplane, 
  HiOutlineCheckCircle, 
  HiOutlineShieldCheck, 
  HiOutlineExclamationTriangle 
} from "react-icons/hi2";

const LeaveApplicationForm = () => {
  const { user } = useAuth();
  const { applyLeave, bankCompOff, loading, error, setError, leaveBalance } = useDashboard();
  const [submitted, setSubmitted] = useState(false);

  const today = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(today.getMonth() + 1);

  const [formData, setFormData] = useState({
    category: "CASUAL" as LeaveType | "COMP_OFF",
    startDate: null as Date | null,
    endDate: null as Date | null,
    isHalfDay: false,
    halfDayType: "FIRST_HALF" as "FIRST_HALF" | "SECOND_HALF",
    reason: "",
  });

  const leaveLabels: Record<string, string> = {
    SICK: "Sick Leave",
    CASUAL: "Casual Leave",
    EARNED_LEAVES: "Earned Leave",
    COMP_OFF: "Bank Comp-Off",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.startDate) return;

    const rawBackupId = Cookies.get("lms_user_id");
    const employeeId = user?.id || (rawBackupId ? parseInt(rawBackupId) : 4);

    if (formData.category === "COMP_OFF") {
      const compOffPayload = {
        employeeId,
        entries: [{
          workedDate: formData.startDate.toISOString().split("T")[0],
          days: formData.isHalfDay ? 0.5 : 1.0,
          plannedLeaveDate: null,
        }],
      };
      const result = await bankCompOff(compOffPayload);
      if (result) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      }
      return;
    }

    const leavePayload: LeaveApplication = {
      employeeId,
      leaveType: formData.category as LeaveType,
      startDate: formData.startDate.toISOString().split("T")[0],
      endDate: formData.isHalfDay
        ? formData.startDate.toISOString().split("T")[0]
        : formData.endDate!.toISOString().split("T")[0],
      reason: formData.reason,
      confirmLossOfPay: false,
      ...(formData.isHalfDay && { halfDayType: formData.halfDayType })
    };

    const result = await applyLeave(leavePayload);
    if (result) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-10 text-center bg-white border border-slate-200 rounded-lg shadow-sm">
        <HiOutlineCheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Request Submitted</h2>
        <p className="text-slate-500 mt-2">Your application has been logged and is awaiting approval.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Apply for another leave →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-3">
          <HiOutlineExclamationTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">
            {formData.category === "COMP_OFF" ? "Bank Comp-Off Credit" : "Apply for Leave"}
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
            <HiOutlineShieldCheck size={16} className="text-indigo-500" />
            <span className="text-xs font-medium text-slate-600">Reviewer: {user?.managerName || "Manager"}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 01. Category */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <HiOutlineClock size={16} /> 01. Leave Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["SICK", "CASUAL", "EARNED_LEAVES", "COMP_OFF"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setError(null); setFormData({ ...formData, category: type }); }}
                  className={`py-2.5 px-4 text-sm font-medium rounded-md border transition-all ${formData.category === type
                      ? "bg-slate-900 border-slate-900 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  {leaveLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* 02. Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MyDatePicker
              label={formData.category === "COMP_OFF" ? "02. Date Worked" : "02. Start Date"}
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              maxDate={formData.category === "COMP_OFF" ? today : oneMonthFromNow}
              minDate={formData.category === "COMP_OFF" ? undefined : today}
              required
            />

            {formData.category !== "COMP_OFF" && !formData.isHalfDay && (
              <MyDatePicker
                label="03. End Date"
                selected={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                minDate={formData.startDate || today}
                maxDate={oneMonthFromNow}
                required
              />
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                checked={formData.isHalfDay}
                onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                Register as a half-day request
              </span>
            </label>

            {formData.isHalfDay && (
              <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                {["FIRST_HALF", "SECOND_HALF"].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setFormData({ ...formData, halfDayType: h as any })}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.halfDayType === h
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {h === "FIRST_HALF" ? "First Half" : "Second Half"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {formData.category !== "COMP_OFF" && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <HiOutlineChatBubbleLeftRight size={16} /> 04. Justification / Reason
              </label>
              <textarea
                rows={3}
                placeholder="Provide a reason for your leave..."
                className="w-full bg-white border border-slate-200 p-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required 
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {formData.category === "COMP_OFF" ? "Request Comp-Off Credit" : "Submit Leave Application"}
                <HiOutlinePaperAirplane size={18} className="rotate-45" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;