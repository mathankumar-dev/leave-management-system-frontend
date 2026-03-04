import React, { useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import type { LeaveApplication, LeaveType } from "../types";
import { Clock, MessageSquare, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import MyDatePicker from "../../../components/ui/datepicker/MyDatePicker";

const LeaveApplicationForm = () => {
  const { user } = useAuth();
  const { applyLeave, loading } = useDashboard();
  const [submitted, setSubmitted] = useState(false);

  const today = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(today.getMonth() + 1);

  const [formData, setFormData] = useState({
    category: "CASUAL" as LeaveType,
    startDate: null as Date | null,
    endDate: null as Date | null,
    isHalfDay: false,
    halfDayType: "FIRST_HALF" as "FIRST_HALF" | "SECOND_HALF",
    reason: "",
  });

  const leaveLabels: Record<string, string> = {
    SICK: "SICK",
    CASUAL: "CASUAL",
    EARNED_LEAVES: "EARNED",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || (!formData.isHalfDay && !formData.endDate)) return;

    const rawBackupId = Cookies.get("lms_user_id");
    const employeeId = user?.id || (rawBackupId ? parseInt(rawBackupId) : 4);

    const payload: LeaveApplication = {
      employeeId,
      leaveType: formData.category,
      // Converting Date object to YYYY-MM-DD string
      startDate: formData.startDate.toISOString().split('T')[0],
      endDate: formData.isHalfDay
        ? formData.startDate.toISOString().split('T')[0]
        : formData.endDate!.toISOString().split('T')[0],
      reason: formData.reason,
      confirmLossOfPay: false,
    };

    if (formData.isHalfDay) payload.halfDayType = formData.halfDayType;

    const result = await applyLeave(payload);
    if (result) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-6 p-8 text-center bg-white border border-slate-200 shadow-sm rounded-sm">
        <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Transmission Sent</h2>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-[10px] font-black uppercase text-indigo-600 underline">New Application +</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-2 px-4">
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">Apply for Leave</h1>
            {/* <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Reviewer: {user?.managerName || "HR"}</p> */}
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 rounded-sm">
            <ShieldCheck size={12} className="text-indigo-600" />
            <span className="text-[9px] font-black uppercase text-slate-600 italic">Reviewer: {user?.managerName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Category Selection */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} className="text-indigo-600" /> 01. Select Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["SICK", "CASUAL", "EARNED_LEAVES"] as LeaveType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: type })}
                  className={`py-2 text-[10px] font-black uppercase border rounded-sm transition-all ${formData.category === type
                      ? "bg-primary-900 border-primary-900 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {leaveLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Dates using MyDatePicker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MyDatePicker
              label="02. Start Date"
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              placeholder="DD / MM / YYYY"
              required
              minDate={today} // Prevents backdating
              maxDate={oneMonthFromNow} // Restricts to 1 month ahead
            />

            {!formData.isHalfDay && (
              <MyDatePicker
                label="03. End Date"
                selected={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                placeholder="DD / MM / YYYY"
                required
                minDate={formData.startDate || today} // End date can't be before start
                maxDate={oneMonthFromNow}
              />
            )}
          </div>

          {/* Row 3: Half Day Toggle */}
          <div className="py-2 border-y border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 border-slate-300 rounded-sm text-indigo-600 focus:ring-0 cursor-pointer"
                checked={formData.isHalfDay}
                onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
              />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">Partial Day Assignment</span>
            </label>

            {formData.isHalfDay && (
              <div className="flex bg-slate-100 p-0.5 rounded-sm border border-slate-200">
                {["FIRST_HALF", "SECOND_HALF"].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setFormData({ ...formData, halfDayType: h as any })}
                    className={`px-3 py-1 text-[8px] font-black uppercase transition-all rounded-sm ${formData.halfDayType === h ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
                      }`}
                  >
                    {h.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Row 4: Reason */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} className="text-indigo-600" /> 04. Justification
            </label>
            <textarea
              rows={2}
              placeholder="ENTER REASON..."
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-sm font-bold text-xs outline-none focus:bg-white resize-none transition-all"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-900 text-white py-3 rounded-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : (
              <>Submit Application <Send size={14} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;