import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCheck, FaCheckCircle, FaRegClock, FaTimesCircle, 
  FaBell, FaTrashAlt, FaEllipsisV 
} from "react-icons/fa";
import type { Notification } from "../types";
import { useDashboard } from "../hooks/useDashboard"; // Import your hook

const NotificationsView: React.FC = () => {
  const { fetchNotifications, loading } = useDashboard();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<Notification['category'] | "All">("All");

  const categories: (Notification['category'] | "All")[] = ["All", "Personal", "Team", "System"];

  // Fetch real data on mount
  useEffect(() => {
    const getItems = async () => {
      const data = await fetchNotifications();
      if (data && data.length > 0) {
        setNotifications(data);
      }
    };
    getItems();
  }, [fetchNotifications]);

  const getIconTheme = (type: Notification['type']) => {
    switch (type) {
      case "success": return { icon: <FaCheckCircle />, color: "text-emerald-500", bg: "bg-emerald-50" };
      case "info": return { icon: <FaRegClock />, color: "text-amber-500", bg: "bg-amber-50" };
      case "error": return { icon: <FaTimesCircle />, color: "text-rose-500", bg: "bg-rose-50" };
      default: return { icon: <FaBell />, color: "text-indigo-500", bg: "bg-indigo-50" };
    }
  };

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Activity</h1>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {loading ? "Syncing..." : "Update Feed"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 active:scale-95 transition-transform hover:bg-slate-50">
            <FaCheck /> <span>Read All</span>
          </button>
          <button className="p-2.5 bg-slate-900 text-white rounded-xl active:scale-95 transition-transform hover:bg-slate-800">
            <FaTrashAlt size={12} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
        <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl w-max sm:w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                activeFilter === cat ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2 md:space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loading Feed...</p>
          </div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {notifications
              .filter((n) => activeFilter === "All" || n.category === activeFilter)
              .map((n) => {
                const theme = getIconTheme(n.type);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={n.id}
                    className={`relative p-3 md:p-4 rounded-2xl border transition-all duration-200 ${
                      n.unread
                        ? "bg-white border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300"
                        : "bg-slate-50/50 border-transparent hover:bg-slate-100/80 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex gap-3 md:gap-4 items-start">
                      <div className={`shrink-0 w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center ${theme.color} text-lg shadow-sm`}>
                        {theme.icon}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                          <h4 className={`text-sm font-black truncate ${n.unread ? "text-slate-900" : "text-slate-600"}`}>
                            {n.title}
                          </h4>
                          <span className="w-fit text-[8px] font-black uppercase px-1.5 py-0.5 bg-slate-200/50 text-slate-500 rounded tracking-tighter">
                            {n.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-snug">
                          {n.desc}
                        </p>
                        <span className="text-[9px] font-bold text-slate-400 block mt-1 uppercase tracking-tighter">
                          {n.time}
                        </span>
                      </div>

                      <button className="shrink-0 p-1 text-slate-300 hover:text-slate-600 transition-colors">
                        <FaEllipsisV size={10} />
                      </button>

                      {n.unread && (
                        <div className="absolute right-3 top-4">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;