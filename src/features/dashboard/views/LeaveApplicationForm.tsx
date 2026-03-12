import React, { useState, useRef } from "react";
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
  HiOutlineExclamationTriangle,
  HiOutlinePaperClip,
  HiOutlineXMark,
  HiOutlineCalendarDays
} from "react-icons/hi2";

const LeaveApplicationForm = () => {
  const { user } = useAuth();
  const { applyLeave, bankCompOff, loading, error, setError } = useDashboard();
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    category: "CASUAL" as LeaveType | "COMP_OFF",
    startDate: null as Date | null,
    endDate: null as Date | null,
    compOffPlannedDate: null as Date | null,
    isHalfDay: false,
    halfDayType: "FIRST_HALF" as "FIRST_HALF" | "SECOND_HALF",
    reason: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const leaveLabels: Record<string, string> = {
    SICK: "Sick Leave",
    CASUAL: "Casual Leave",
    EARNED_LEAVES: "Earned Leave",
    COMP_OFF: "Bank Comp-Off",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.startDate) {
      setError("Please select a start date.");
      return;
    }

    const employeeId = user?.id;
    if (!employeeId) {
      setError("User session not found. Please log in again.");
      return;
    }

    // --- CASE A: Bank Comp-Off Logic (JSON) ---
    if (formData.category === "COMP_OFF") {
      if (!formData.compOffPlannedDate) {
        setError("Please select the date you plan to take your leave.");
        return;
      }
      const compOffPayload = {
        employeeId,
        entries: [{
          workedDate: formData.startDate.toISOString().split("T")[0],
          days: formData.isHalfDay ? 0.5 : 1.0,
          plannedLeaveDate: formData.compOffPlannedDate.toISOString().split("T")[0],
          halfDayType: formData.isHalfDay ? formData.halfDayType : null
        }],
      };
      const result = await bankCompOff(compOffPayload);
      if (result) setSubmitted(true);
      return;
    }

    // --- CASE B: Standard Leave Logic (Multipart/Form-Data) ---
    const fd = new FormData();

    // Append standard parameters
    fd.append("employeeId", employeeId.toString());
    fd.append("leaveType", formData.category);
    fd.append("startDate", formData.startDate.toISOString().split("T")[0]);

    // Determine End Date
    const endDateStr = formData.isHalfDay
      ? formData.startDate.toISOString().split("T")[0]
      : formData.endDate?.toISOString().split("T")[0];

    if (!endDateStr) {
      setError("Please select an end date.");
      return;
    }
    fd.append("endDate", endDateStr);
    fd.append("reason", formData.reason);
    fd.append("confirmLossOfPay", "false"); // Defaulting to false as per your original logic

    // Append Half Day Type if applicable
    if (formData.isHalfDay && formData.halfDayType) {
      fd.append("halfDayType", formData.halfDayType);
    }

    // Append the file(s) - Key must match 'value = "files"' in Java @RequestParam
    if (selectedFile) {
      fd.append("files", selectedFile);
    }

    // Call the applyLeave from useDashboard
    // Note: You must ensure your applyLeave hook is updated to accept FormData
    const result = await applyLeave(fd);
    if (result) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-10 text-center bg-white border border-slate-200 rounded-lg shadow-sm">
        <HiOutlineCheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Request Submitted</h2>
        <p className="text-slate-500 mt-2">Your application is awaiting approval.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Apply for another leave →
        </button>
      </div>
    );``
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
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">
            {formData.category === "COMP_OFF" ? "Bank Comp-Off Credit" : "Apply for Leave"}
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
            <HiOutlineShieldCheck size={16} className="text-indigo-500" />
            Reviewer: {user?.managerName || "Manager"}
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
                  className={`py-2.5 px-4 text-sm font-medium rounded-md border transition-all ${formData.category === type ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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
              label={formData.category === "COMP_OFF" ? "02. Date Worked (Holiday)" : "02. Start Date"}
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              maxDate={formData.category === "COMP_OFF" ? new Date() : undefined}
              required
            />

            {formData.category === "COMP_OFF" ? (
              <MyDatePicker
                label="03. Planned Leave Date"
                selected={formData.compOffPlannedDate}
                onChange={(date) => setFormData({ ...formData, compOffPlannedDate: date })}
                minDate={new Date()}
                required
              />
            ) : !formData.isHalfDay && (
              <MyDatePicker
                label="03. End Date"
                selected={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                minDate={formData.startDate || new Date()}
                required
              />
            )}
          </div>

          {/* Half Day Toggle */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.isHalfDay}
                onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
              />
              <span className="text-sm font-medium text-slate-700">
                {formData.category === "COMP_OFF" ? "Register as half-day credit" : "Register as half-day leave"}
              </span>
            </label>

            {formData.isHalfDay && (
              <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                {["FIRST_HALF", "SECOND_HALF"].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setFormData({ ...formData, halfDayType: h as any })}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.halfDayType === h ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {h === "FIRST_HALF" ? "First Half" : "Second Half"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 04. Attachments */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <HiOutlinePaperClip size={16} /> 04. Attachments (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${selectedFile ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50'
                }`}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{selectedFile.name}</span>
                  <HiOutlineXMark onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="text-rose-500 w-5 h-5" />
                </div>
              ) : (
                <span className="text-sm text-slate-500">Click to upload medical certificate or proof</span>
              )}
            </div>
          </div>

          {/* 05. Reason */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <HiOutlineChatBubbleLeftRight size={16} /> 05. Justification / Reason
            </label>
            <textarea
              rows={3}
              placeholder="Provide a reason..."
              className="w-full bg-white border border-slate-200 p-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required={formData.category !== "COMP_OFF"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : formData.category === "COMP_OFF" ? "Request Comp-Off Credit" : "Submit Leave Application"}
            {!loading && <HiOutlinePaperAirplane size={18} className="rotate-45" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;