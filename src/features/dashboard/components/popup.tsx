import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle
} from "react-icons/fa";
import type { LeaveRecord } from "../types";

interface RecentLeavePopupProps {
  latestLeave: LeaveRecord | null;
}

const RecentLeavePopup: React.FC<RecentLeavePopupProps> = ({ latestLeave }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Session check: only show once per session
    const hasBeenShown = sessionStorage.getItem("recent_leave_shown");

    if (latestLeave && !hasBeenShown) {
      // Small delay so it doesn't pop up the exact millisecond the page loads
      const timer = setTimeout(() => {
        setVisible(true);
        sessionStorage.setItem("recent_leave_shown", "true");
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [latestLeave]);

  if (!latestLeave) return null;

  const config = {
    APPROVED: {
      color: "text-emerald-600",
      bg: "bg-emerald-50/90",
      border: "border-emerald-200",
      accent: "bg-emerald-500",
      icon: <FaCheckCircle />
    },
    REJECTED: {
      color: "text-rose-600",
      bg: "bg-rose-50/90",
      border: "border-rose-200",
      accent: "bg-rose-500",
      icon: <FaTimesCircle />
    },
    PENDING: {
      color: "text-amber-600",
      bg: "bg-amber-50/90",
      border: "border-amber-200",
      accent: "bg-amber-500",
      icon: <FaClock className="animate-spin-slow" />
    }
  };

  const statusKey = latestLeave.status.toUpperCase() as keyof typeof config;
  const theme = config[statusKey] || config.PENDING;

  // Using Portal to ensure it's not cut off by any "overflow-hidden" parent containers
  return ReactDOM.createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed top-6 right-6 z-[100] w-full max-w-[350px] pointer-events-none"
        >
          <div className={`
            pointer-events-auto relative overflow-hidden
            flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-2xl
            ${theme.bg} ${theme.border} ${theme.color}
          `}>
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.accent}`} />

            {/* Icon Circle */}
            <div className={`
              flex items-center justify-center shrink-0
              w-10 h-10 rounded-full bg-white shadow-sm text-lg
            `}>
              {theme.icon}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-black uppercase tracking-tight">
                {latestLeave.type} Leave
              </h4>
              <p className="text-[11px] font-medium opacity-90 truncate">
                {latestLeave.range}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${theme.accent}`} />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                   Status: {latestLeave.status}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setVisible(false)}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <FaTimes size={14} className="opacity-50 hover:opacity-100" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default RecentLeavePopup;