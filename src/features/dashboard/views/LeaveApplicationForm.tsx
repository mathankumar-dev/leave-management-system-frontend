import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import type { LeaveType } from "../types";
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
} from "react-icons/hi2";

// Define the HalfDay type to match backend Enums
type HalfDayType = "FIRST_HALF" | "SECOND_HALF" | null;

const LeaveApplicationForm = () => {
  const { user } = useAuth();
  const {
    applyLeave,
    bankCompOff,
    loading,
    error,
    setError,
    leaveBalance,
    fetchLeaveBalance
  } = useDashboard();

  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    category: "CASUAL" as LeaveType | "COMP_OFF",
    startDate: null as Date | null,
    endDate: null as Date | null,
    compOffPlannedDate: null as Date | null,
    isHalfDay: false, // UI Helper for single-day applications
    startDateHalfDayType: null as HalfDayType,
    endDateHalfDayType: null as HalfDayType,
    reason: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const leaveLabels: Record<string, string> = {
    SICK: "Sick Leave",
    CASUAL: "Casual Leave",
    EARNED_LEAVES: "Earned Leave",
    COMP_OFF: "Bank Comp-Off",
  };

  useEffect(() => {
    if (user?.id) {
      fetchLeaveBalance(user.id, 2026);
    }
  }, [user?.id, fetchLeaveBalance]);

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
      setError("User session not found.");
      return;
    }

    // --- CASE A: Bank Comp-Off Logic ---
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
          halfDayType: formData.isHalfDay ? formData.startDateHalfDayType : null
        }],
      };
      const result = await bankCompOff(compOffPayload);
      if (result) setSubmitted(true);
      return;
    }

    // --- CASE B: Standard Leave Logic ---
    const fd = new FormData();
    fd.append("employeeId", employeeId.toString());
    fd.append("leaveType", formData.category);
    fd.append("startDate", formData.startDate.toISOString().split("T")[0]);

    // Determine end date
    const endDateStr = formData.isHalfDay
      ? formData.startDate.toISOString().split("T")[0]
      : formData.endDate?.toISOString().split("T")[0];

    if (!endDateStr) {
      setError("Please select an end date.");
      return;
    }
    fd.append("endDate", endDateStr);
    fd.append("reason", formData.reason);
    fd.append("confirmLossOfPay", "false");

    if (formData.isHalfDay) {
      fd.append("startDateHalfDayType", formData.startDateHalfDayType || "");
      fd.append("halfDayType", formData.startDateHalfDayType || "");
    } else {
      if (formData.startDateHalfDayType) {
        fd.append("startDateHalfDayType", formData.startDateHalfDayType);
      }
      if (formData.endDateHalfDayType) {
        fd.append("endDateHalfDayType", formData.endDateHalfDayType);
      }
    }

    if (selectedFile) {
      fd.append("files", selectedFile);
    }
    console.log(fd);
    
    const result = await applyLeave(fd);
    if (result) setSubmitted(true);
  };
  const calculateDays = () => {
    if (!formData.startDate) return 0;

    if (formData.isHalfDay || formData.category === "COMP_OFF") {
      return formData.startDateHalfDayType ? 0.5 : 1;
    }

    if (!formData.endDate) return 1;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (formData.startDateHalfDayType) days -= 0.5;
    if (formData.endDateHalfDayType) days -= 0.5;

    return days;
  };

  // Helper to render half-day toggle buttons
  const HalfDaySelector = ({
    label,
    value,
    onChange
  }: {
    label: string,
    value: HalfDayType,
    onChange: (v: HalfDayType) => void
  }) => (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 w-fit">
        {[null, "FIRST_HALF", "SECOND_HALF"].map((type) => (
          <button
            key={String(type)}
            type="button"
            onClick={() => onChange(type as HalfDayType)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${value === type ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {type === null ? "Full Day" : type === "FIRST_HALF" ? "1st Half" : "2nd Half"}
          </button>
        ))}
      </div>
    </div>
  );

  console.log(user);
  

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

      {/* Leave Balance Bar (Remains same) */}
      {leaveBalance && (
        <div className="mb-6 bg-white border border-slate-200 rounded shadow-sm">
          <div className="flex flex-wrap md:flex-row items-center divide-x divide-slate-100">
            {leaveBalance.breakdown.map((item) => {
              const isActive = formData.category === item.leaveType;
              return (
                <div
                  key={item.leaveType}
                  onClick={() => setFormData({ ...formData, category: item.leaveType as any })}
                  className={`flex-1 min-w-[120px] px-4 py-2 cursor-pointer transition-all relative ${isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                >
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                  <div className="flex flex-col">
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {item.leaveType.replace('_', ' ')}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-bold text-slate-700">{item.remainingDays}</span>
                      <span className="text-[10px] font-medium text-slate-400">/ {item.allocatedDays}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">
            {formData.category === "COMP_OFF" ? "Bank Comp-Off Credit" : "Apply for Leave"}
          </h1>

          {/* Replace the static span with this */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Required Approvals
            </span>
            <div className="flex gap-2">
              {/* Always show TL */}
              <Badge label={`TL: ${user?.teamLeaderName || 'Assigning...'}`} active />

              {/* Show Manager if > 1 day */}
              {calculateDays() > 1 && (
                <Badge label={`Manager: ${user?.managerName || 'Assigning...'}`} active />
              )}

              {/* Show HR if > 7 days */}
              {calculateDays() > 7 && (
                <Badge label={`HR: ${user?.hrname || 'Assigning...'}`} active />
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 01. Category Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <HiOutlineClock size={16} /> 01. Leave Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["SICK", "CASUAL", "EARNED_LEAVES", "COMP_OFF"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: type })}
                  className={`py-2.5 px-4 text-sm font-medium rounded-md border transition-all ${formData.category === type ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {leaveLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* 02. Date & Half-Day Selection */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <MyDatePicker
                  label={formData.category === "COMP_OFF" ? "02. Date Worked" : "02. Start Date"}
                  selected={formData.startDate}
                  onChange={(date) => setFormData({ ...formData, startDate: date })}
                  required
                />
                <HalfDaySelector
                  label="Start Day Type"
                  value={formData.startDateHalfDayType}
                  onChange={(v) => setFormData({ ...formData, startDateHalfDayType: v })}
                />
              </div>

              {!formData.isHalfDay && (
                <div className="space-y-4">
                  <MyDatePicker
                    label={formData.category === "COMP_OFF" ? "03. Planned Leave Date" : "03. End Date"}
                    selected={formData.category === "COMP_OFF" ? formData.compOffPlannedDate : formData.endDate}
                    onChange={(date) => setFormData({
                      ...formData,
                      [formData.category === "COMP_OFF" ? "compOffPlannedDate" : "endDate"]: date
                    })}
                    minDate={formData.startDate || new Date()}
                    required
                  />
                  {formData.category !== "COMP_OFF" && (
                    <HalfDaySelector
                      label="End Day Type"
                      value={formData.endDateHalfDayType}
                      onChange={(v) => setFormData({ ...formData, endDateHalfDayType: v })}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Helper Toggle for Single Day */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  checked={formData.isHalfDay}
                  onChange={(e) => setFormData({
                    ...formData,
                    isHalfDay: e.target.checked,
                    endDate: e.target.checked ? null : formData.endDate,
                    endDateHalfDayType: e.target.checked ? null : formData.endDateHalfDayType
                  })}
                />
                <span className="text-sm font-medium text-slate-700">This is a single-day application</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <HiOutlinePaperClip size={16} /> 04. Attachments (Required for future Sick Leave)
            </label>
            <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${selectedFile ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <span className="text-sm text-slate-500">{selectedFile ? selectedFile.name : "Click to upload proof"}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <HiOutlineChatBubbleLeftRight size={16} /> 05. Reason
            </label>
            <textarea
              rows={3}
              className="w-full bg-white border border-slate-200 p-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Application"}
            {!loading && <HiOutlinePaperAirplane size={18} className="rotate-45" />}
          </button>
        </form>
      </div>
    </div>
  );
};
const Badge = ({ label, active }: { label: string; active: boolean }) => (
  <span className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${active
    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
    : "bg-slate-50 text-slate-400 border-slate-100"
    }`}>
    {label}
  </span>
);

export default LeaveApplicationForm;