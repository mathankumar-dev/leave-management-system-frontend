import React, { useState, useEffect } from "react";
import {
  FaBars, FaBell, FaUserCircle, FaSignOutAlt,
  FaUserCog, FaChevronDown, FaCheckDouble, FaCircle
} from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import { motion, AnimatePresence } from "framer-motion";

interface TopbarProps {
  activeTab: string;
  user: any;
  onMenuClick: () => void;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ activeTab, user, onMenuClick, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { fetchNotifications } = useDashboard();
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);

  useEffect(() => {
    if (isNotifOpen) {
      fetchNotifications().then(data => {
        if (data) setRecentNotifs(data.slice(0, 5));
      });
    }
  }, [isNotifOpen, fetchNotifications]);

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 sticky top-0 z-40 shrink-0">

      {/* Left: Menu & Title */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 active:bg-slate-100 rounded-lg text-slate-500 shrink-0"
        >
          <FaBars size={18} />
        </button>
        <div className="flex flex-col min-w-0">
          <h1 className="text-base md:text-lg font-bold text-slate-900 leading-none truncate">
            {activeTab}
          </h1>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden xs:block">
            Portal Workspace
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-4 shrink-0">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${isNotifOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400"
              }`}
          >
            <FaBell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative rounded-full h-2 w-2 bg-rose-500 border border-white"></span>
            </span>
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                {/* 1. Backdrop: Essential for focus and closing on mobile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 sm:z-10"
                  onClick={() => setIsNotifOpen(false)}
                />

                {/* 2. Responsive Notification Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`
          /* Mobile: Centered card with padding */
          fixed top-20 left-4 right-4 z-[60] 
          /* Desktop: Reset to standard dropdown */
          sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-3 
          sm:w-80 sm:z-20
          bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden
        `}
                >
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-800">Recent Updates</span>
                    <button className="text-[10px] font-bold text-indigo-600">Mark all read</button>
                  </div>

                  {/* Adjust max-height for mobile screens */}
                  <div className="max-h-[60vh] sm:max-h-[350px] overflow-y-auto">
                    {recentNotifs.length > 0 ? (
                      recentNotifs.map((n) => (
                        <div key={n.id} className="p-4 active:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                          <div className="flex gap-3">
                            <FaCircle className={`shrink-0 w-2 h-2 mt-1.5 ${n.unread ? 'text-indigo-500' : 'text-slate-200'}`} />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-slate-400 text-xs">No updates</div>
                    )}
                  </div>

                  {/* Mobile-only footer to "View All" as per specs */}
                  <button className="w-full py-3 text-center text-[11px] font-bold text-slate-500 border-t border-slate-50 sm:hidden">
                    View All Notifications
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-2 p-1 rounded-full md:rounded-xl active:bg-slate-100 transition-all"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full md:rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatar ? <img src={user.avatar} className="object-cover w-full h-full" alt="" /> : <FaUserCircle size={24} className="text-slate-400" />}
            </div>
            <FaChevronDown className={`text-[10px] text-slate-400 hidden sm:block transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-20"
                >
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 active:bg-slate-50">
                    <FaUserCog /> Settings
                  </button>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 active:bg-rose-50">
                    <FaSignOutAlt /> Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Topbar;