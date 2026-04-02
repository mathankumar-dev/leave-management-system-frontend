import { useNotifications } from "@/features/notification/hooks/useNotification";
import { useAuth } from "@/shared/auth/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCog
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { notifications, isLoading, unreadCount } =
    useNotifications(String(user?.id));

  const userRole = user?.role;
  const basePathMap = {
    EMPLOYEE: "/employee",
    MANAGER: "/manager",
    TEAM_LEADER: "/manager",
    HR: "/hr",
    ADMIN: "/admin",
    CFO: "/admin",
  };

  const basePath = basePathMap[userRole as keyof typeof basePathMap] || "/employee";

  const handleNavigate = (path: string) => {
    navigate(`${basePath}/${path}`);
  };

  const title = useMemo(() => {
    const path = location.pathname;

    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("calendar")) return "Calendar";
    if (path.includes("requests")) return "Requests";
    if (path.includes("notifications")) return "Notifications";
    if (path.includes("employees")) return "Employees";
    if (path.includes("approvals")) return "Approvals";
    if (path.includes("profile")) return "Profile";
    if (path.includes("payroll")) return "Payroll";
    if (path.includes("payslip")) return "Payslip";

    return "Dashboard";
  }, [location.pathname]);

  const handleViewNotifications = () => {
    handleNavigate("notifications");
    setIsNotifOpen(false);
  };

  const goToProfile = () => {
    handleNavigate("profile");
    setIsProfileOpen(false);
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md px-4 md:px-6 py-3 border-b border-neutral-200 w-full">

      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="md:hidden p-2.5 rounded-lg text-slate-500 active:bg-slate-100">
          <FaBars size={18} />
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-primary-500 uppercase truncate">
          {title}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* 🔔 NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className={`relative p-2.5 rounded-xl transition-all duration-300 ${isNotifOpen
                ? "bg-brand/10 text-brand shadow-inner"
                : "text-slate-400 hover:text-brand hover:bg-slate-50"
              }`}
          >
            <FaBell size={18} />

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0, y: 5 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-lg shadow-rose-500/40 border border-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <>
                {/* Invisible Backdrop for click-away */}
                <div
                  className="fixed inset-0 z-[60]"
                  onClick={() => setIsNotifOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-white backdrop-blur-3xl border border-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden z-[70]"
                >
                  {/* HEADER */}
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">
                      Notifications
                    </span>
                    <button
                      onClick={handleViewNotifications}
                      className="text-[9px] font-black uppercase tracking-widest text-brand hover:opacity-70 transition-opacity"
                    >
                      Expand All
                    </button>
                  </div>

                  {/* NOTIFICATION LIST */}
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                      <div className="p-10 text-center">
                        <div className="animate-spin h-5 w-5 border-2 border-brand border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Syncing...</p>
                      </div>
                    ) : notifications.length ? (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={handleViewNotifications}
                          className="p-5 border-b border-slate-50 hover:bg-white transition-colors cursor-pointer group"
                        >
                          <div className="flex gap-4">

                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight group-hover:text-brand transition-colors">
                                {n.eventType?.replace(/_/g, " ")}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                                "{n.message}"
                              </p>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                                Recently Processed
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                          Terminal Clear
                        </p>
                      </div>
                    )}
                  </div>

                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* 👤 PROFILE */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 p-1.5 rounded-2xl transition-all duration-300 ${isProfileOpen ? "bg-white shadow-md" : "hover:bg-white/50"
              }`}
          >
            {/* AVATAR STYLE MATCHING YOUR PREVIOUS CARDS */}
            <div className="w-10 h-10 bg-brand text-white flex items-center justify-center rounded-full font-bold text-sm shadow-lg shadow-brand/20">
              {user?.name.charAt(0) || "U"}
            </div>

            <FaChevronDown
              className={`text-[10px] text-slate-400 transition-transform duration-500 mr-1 ${isProfileOpen ? "rotate-180 text-brand" : ""
                }`}
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                {/* INVISIBLE OVERLAY TO CLOSE */}
                <div className="fixed inset-0 z-0" onClick={() => setIsProfileOpen(false)} />

                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/50 p-2 z-50 border border-white"
                >
                  <div className="px-4 py-3 mb-2 border-b border-slate-50 lg:hidden">
                    <p className="text-xs font-black text-slate-800">{user?.name}</p>
                    <p className="text-[10px] text-brand font-bold">{user?.role}</p>
                  </div>

                  <button
                    onClick={goToProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-brand/5 hover:text-brand rounded-full transition-all"
                  >
                    <FaUserCog className="text-lg opacity-70" />
                    Profile
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-full transition-all mt-1"
                  >
                    <FaSignOutAlt className="text-lg opacity-70" />
                    Sign Out
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