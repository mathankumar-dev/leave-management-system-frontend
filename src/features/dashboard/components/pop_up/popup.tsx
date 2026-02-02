// src/features/dashboard/components/RecentLeavePopup.tsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import type { LeaveRecord } from "../../types";

interface RecentLeavePopupProps {
  latestLeave: LeaveRecord | null;
}

const RecentLeavePopup: React.FC<RecentLeavePopupProps> = ({ latestLeave }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (latestLeave) {
      setVisible(true);

      // auto hide after 8 seconds (optional)
      const timer = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [latestLeave]);

  if (!latestLeave || !visible) return null;

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return <FaCheckCircle className="text-emerald-500" />;
      case "REJECTED":
        return <FaTimes className="text-rose-500" />;
      default:
        return <FaClock className="text-amber-500 animate-pulse" />;
    }
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-[92%] max-w-lg">
      <div
        className={`
          relative bg-black flex items-start gap-4 p-4 rounded-2xl border shadow-2xl
          bg-white
          animate-slide-down
          ${getStatusStyles(latestLeave.status)}
        `}
      >
        {/* Icon */}
        <div className="mt-1 text-lg">
          {getStatusIcon(latestLeave.status)}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-semibold">
            {latestLeave.type} Update
          </p>
          <p className="text-xs opacity-80 mt-1">
            {latestLeave.range}
          </p>
          <p className="text-xs mt-1 font-medium">
            Status: {latestLeave.status}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition"
        >
          <FaTimesCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default RecentLeavePopup;
