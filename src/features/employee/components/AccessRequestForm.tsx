import React, { useState } from "react";
import { useAuth } from "@/shared/auth/useAuth";
import { useRequest } from "@/features/leave/hooks/useRequest";

import {
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const AccessRequestForm = () => {
  const { user } = useAuth();
  const { createAccessRequest, loading, setError, error } = useRequest();

  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    accessType: "VPN",
    reason: "",
    startDate: "",
    endDate: "",
  });

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) return 0;

    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60 * 24) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.reason) {
      setError("Please enter reason");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Select start & end date");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date");
      return;
    }

    if (!user?.id) {
      setError("User not found");
      return;
    }

    const success = await createAccessRequest(
      {
        accessType: formData.accessType,
        reason: formData.reason,
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
      user.id
    );

    if (success) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl shadow-sm">
        <HiOutlineCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Request Submitted</h2>
        <p className="text-gray-500 mt-2">
          Your VPN request is under approval.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">

      {/* 🔥 MAIN CONTAINER (SOFT UI) */}
      <div className="bg-white rounded-2xl shadow-sm">

        {/* 🔹 HEADER */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100">

          <h1 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            <HiOutlineShieldCheck className="text-indigo-500" />
            VPN Access Request
          </h1>

          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              Approval Workflow
            </p>
            <div className="mt-1 px-3 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-md font-medium">
              {user?.reportingName || "Manager"}
            </div>
          </div>
        </div>

        {/* 🔹 BODY */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">

          {/* ERROR */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex gap-2">
              <HiOutlineExclamationTriangle /> {error}
            </div>
          )}

          {/* 🔥 TOTAL DAYS (MATCH UI) */}
          <div className="bg-slate-50 rounded-xl p-6 flex items-center gap-4">

            <div className="bg-white px-4 py-2 rounded-lg text-indigo-600 font-bold shadow-sm">
              {String(calculateDays()).padStart(2, "0")}
            </div>

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Working Days Requested for VPN
            </div>
          </div>

          {/* 🔥 DATE FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Work Starts On *
              </label>
              <input
                type="date"
                value={formData.startDate}
                className="w-full mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Work Ends On *
              </label>
              <input
                type="date"
                value={formData.endDate}
                className="w-full mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>

          </div>

          {/* 🔥 REASON */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase flex gap-2">
              <HiOutlineChatBubbleLeftRight /> Duty Details & Reason
            </label>

            <textarea
              rows={4}
              placeholder="E.g. Client visit / Remote work requirement..."
              value={formData.reason}
              className="w-full mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white outline-none"
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            />
          </div>

          {/* 🔥 BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold tracking-wide flex items-center justify-center gap-3 shadow-md"
          >
            {loading ? "Processing..." : "Confirm VPN Request"}
            {!loading && <HiOutlinePaperAirplane className="rotate-45" />}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AccessRequestForm;