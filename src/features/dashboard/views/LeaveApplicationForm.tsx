import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import type { LeaveType } from "../types";

const LeaveApplicationForm = () => {
  const { user } = useAuth();
  const { applyLeave, loading } = useDashboard();

  const [formData, setFormData] = useState({
    category: "CASUAL" as LeaveType, // Defaulted for faster testing
    startDate: "",
    endDate: "",
    isHalfDay: false,
    halfDayType: "FIRST_HALF" as "FIRST_HALF" | "SECOND_HALF",
    reason: "Test leave request",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();

    // Ensure everything is explicitly cast to String
    submitData.append("employeeId", "4"); // Hardcode '4' for a quick test
    submitData.append("leaveType", String(formData.category));
    submitData.append("startDate", String(formData.startDate));
    submitData.append("endDate", String(formData.isHalfDay ? formData.startDate : formData.endDate));
    submitData.append("reason", String(formData.reason));

    if (formData.isHalfDay) {
      submitData.append("halfDayType", String(formData.halfDayType));
    }

    // Debugging loop
    console.log("--- DEBUGGING FORM DATA ---");
    submitData.forEach((value, key) => {
      console.log(key, ":", value);
    });

    await applyLeave(submitData);
  };

  return (
    <div className="p-10 max-w-lg mx-auto bg-white border-2 border-dashed border-slate-300 rounded-lg">
      <h1 className="text-xl font-bold mb-4">Internal Testing Form</h1>
      <p className="text-sm text-slate-500 mb-6">Sending as <b>multipart/form-data</b></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label className="block text-xs font-bold uppercase">Type</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as LeaveType })}
          >
            <option value="SICK">SICK</option>
            <option value="CASUAL">CASUAL</option>
            <option value="EARNED">EARNED</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase">Start Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          {!formData.isHalfDay && (
            <div>
              <label className="block text-xs font-bold uppercase">End Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          )}
        </div>

        {/* Half Day Toggle */}
        <label className="flex items-center gap-2 cursor-pointer bg-slate-100 p-2 rounded">
          <input
            type="checkbox"
            checked={formData.isHalfDay}
            onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
          />
          <span className="text-sm font-medium">Is Half Day?</span>
        </label>

        {formData.isHalfDay && (
          <div className="flex gap-4">
            <label className="text-sm">
              <input
                type="radio"
                name="hd"
                checked={formData.halfDayType === "FIRST_HALF"}
                onChange={() => setFormData({ ...formData, halfDayType: "FIRST_HALF" })}
              /> First Half
            </label>
            <label className="text-sm">
              <input
                type="radio"
                name="hd"
                checked={formData.halfDayType === "SECOND_HALF"}
                onChange={() => setFormData({ ...formData, halfDayType: "SECOND_HALF" })}
              /> Second Half
            </label>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-xs font-bold uppercase">Reason</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded font-bold hover:bg-slate-800 disabled:bg-slate-300"
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>
    </div>
  );
};

export default LeaveApplicationForm;