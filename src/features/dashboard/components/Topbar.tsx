import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaUserCog,
  FaChevronDown,
  FaCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../hooks/useDashboard";

interface TopbarProps {
  activeTab: string;
  user: any;
  onMenuClick: () => void;
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  user,
  onMenuClick,
  onLogout,
  setActiveTab,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);
  const { fetchNotifications } = useDashboard();

  useEffect(() => {
    if (isNotifOpen) {
      fetchNotifications().then((data) => {
        if (data) setRecentNotifs(data.slice(0, 5));
      });
    }
  }, [isNotifOpen, fetchNotifications]);

  return (
    // <div className="sticky top-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
<div className="sticky top-0 z-30 flex items-center justify-between 
                bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 
                border-b border-neutral-200 w-full transition-all duration-300">
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2.5 rounded-lg text-slate-500 active:bg-slate-100"
        >
          <FaBars size={18} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-slate-900 truncate">
            {activeTab}
          </h1>
          <p className="hidden xs:block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Portal Workspace
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className={`p-2.5 rounded-xl transition-all ${
              isNotifOpen
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-400 hover:text-indigo-600"
            }`}
          >
            <FaBell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white" />
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 sm:z-10"
                  onClick={() => setIsNotifOpen(false)}
                />

                {/* Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="
                    fixed top-20 left-4 right-4 z-[60]
                    sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-3
                    sm:w-80 sm:z-20
                    bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden
                  "
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Recent Updates
                    </span>
                    <button className="text-[10px] font-bold text-indigo-600">
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[60vh] sm:max-h-[350px] overflow-y-auto">
                    {recentNotifs.length ? (
                      recentNotifs.map((n) => (
                        <div
                          key={n.id}
                          className="p-4 border-b border-slate-50 last:border-0"
                        >
                          <div className="flex gap-3">
                            <FaCircle
                              className={`mt-1.5 w-2 h-2 ${
                                n.unread
                                  ? "text-indigo-500"
                                  : "text-slate-200"
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {n.title}
                              </p>
                              <p className="text-[11px] text-slate-500 line-clamp-2">
                                {n.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-xs text-slate-400">
                        No updates
                      </div>
                    )}
                  </div>

                  <button className="sm:hidden w-full py-3 text-[11px] font-bold text-slate-500 border-t">
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
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="object-cover w-full h-full"
                  alt=""
                />
              ) : (
                <FaUserCircle className="text-slate-400 w-6 h-6" />
              )}
            </div>

            <div className="hidden lg:flex flex-col items-start">
              <span className="text-xs font-black text-slate-700 leading-none">
                {user?.name}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">
                  {user?.role}
                </span>
                <FaChevronDown
                  className={`text-[8px] text-slate-400 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-20"
                >
                  <button
                    onClick={() => setActiveTab("Profile")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <FaUserCog /> Profile
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50"
                  >
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
