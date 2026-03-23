import React, { useState } from "react";
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
import { useAuth } from "../auth/useAuth";
import { useNotifications } from "../../features/notification/hooks/useNotification";

interface TopbarProps {
  activeTab: string;
  onMenuClick: () => void;
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  onMenuClick,
  onLogout,
  setActiveTab,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { user } = useAuth();

  const { notifications, isLoading, pageInfo, unreadCount } =
    useNotifications(user?.id || 0);

  const userRole = user?.role;
  const userName = user?.name;

  const handleViewNotifications = () => {
    setActiveTab("Notifications");
    setIsNotifOpen(false);
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md px-4 md:px-6 py-3 border-b border-neutral-200 w-full transition-all duration-300">

      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="md:hidden p-2.5 rounded-lg text-slate-500 active:bg-slate-100">
          <FaBars size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-primary-500 uppercase   truncate">
            {activeTab}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">

        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-indigo-600"}`}
          >
            <FaBell className="w-4 h-4" />

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-rose-500 text-[9px] font-black text-white border-2 border-white shadow-sm"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-transparent"
                  onClick={() => setIsNotifOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="fixed top-16 left-4 right-4 z-[60] sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-3 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Activity</span>
                      {pageInfo.totalElements > 0 && (
                        <span className="text-[8px] font-bold text-slate-400 uppercase">
                          {pageInfo.totalElements} Notifications
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleViewNotifications}
                      className="text-[10px] font-black uppercase text-indigo-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-10 text-center text-[10px] font-bold text-slate-400 uppercase animate-pulse">
                        Loading...
                      </div>
                    ) : notifications.length ? (
                      notifications.slice(0, 5).map((n) => {
                        const isUnread = n.notificationStatus !== 'READ';
                        return (
                          <div
                            key={n.id}
                            onClick={handleViewNotifications}
                            className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer text-left ${isUnread ? "bg-indigo-50/20" : ""
                              }`}
                          >
                            <div className="flex gap-3">
                              <FaCircle className={`mt-1.5 w-1.5 h-1.5 shrink-0 ${isUnread ? "text-indigo-500" : "text-slate-200"}`} />
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isUnread ? "text-slate-900" : "text-slate-500"}`}>
                                  {n.eventType?.replace(/_/g, ' ')}
                                </p>
                                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                                  {n.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-12 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Updates</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
              <FaUserCircle className="text-slate-400 w-6 h-6" />
            </div>

            <div className="hidden lg:flex flex-col items-start">
              <span className="text-xs font-black text-slate-700 leading-none">{userName}</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">{userRole}</span>
                <FaChevronDown className={`text-[8px] text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10 bg-transparent" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-20"
                >
                  <button
                    onClick={() => { setActiveTab("Profile"); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <FaUserCog /> Profile
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 border-t border-slate-50"
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