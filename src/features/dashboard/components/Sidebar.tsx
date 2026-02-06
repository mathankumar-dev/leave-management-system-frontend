import React from "react";
import {
  FaChevronLeft,
  FaSignOutAlt,
  FaThLarge,
  FaPlus,
  FaListUl,
  FaCalendarAlt,
  FaBell,
  FaUsers,
  FaCog,
  FaChartBar,
} from "react-icons/fa";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

function Sidebar({
  activeTab,
  setActiveTab,
  user,
  isOpen,
  setIsOpen,
  onLogout,
}: SidebarProps) {
  const role = user?.role || "Employee";

  /* ----------------------------- MENU CONFIG ----------------------------- */

  const tabs = [
    { name: "Dashboard", icon: <FaThLarge />, roles: ["Employee", "Manager"] },

    { name: "Apply Leave", icon: <FaPlus />, roles: ["Employee", "Manager"] },
    { name: "My Leaves", icon: <FaListUl />, roles: ["Employee", "Manager"] },

    { name: "Calendar", icon: <FaCalendarAlt />, roles: ["Employee"] },

    {
      name: "Team Calendar",
      icon: <FaCalendarAlt />,
      roles: ["Manager", "HR Admin"],
    },

    { name: "Notifications", icon: <FaBell />, roles: ["Employee", "Manager"] },

    { name: "Employees", icon: <FaUsers />, roles: ["Manager", "HR Admin"] },

    { name: "Leave Config", icon: <FaCog />, roles: ["HR Admin"] },

    {
      name: "Reports",
      icon: <FaChartBar />,
      roles: ["HR Admin"],
    },

    { name: "Pending Requests", icon: <FaCog />, roles: ["Manager"] },
  ];

  const visibleTabs = tabs.filter((tab) => tab.roles.includes(role));

  /* ------------------------------ UI ------------------------------------ */

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[35] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[40] h-screen w-64 bg-[#0F172A]
        p-4 md:p-6 border-r border-slate-800 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6 px-2 shrink-0">
          <h1 className="text-white font-black text-xl italic tracking-tight">
            LMS<span className="text-indigo-500">.</span>
          </h1>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-500 hover:text-white"
          >
            <FaChevronLeft />
          </button>
        </div>

        {/* Profile Card */}
        <div
          onClick={() => {
            setActiveTab("Profile");
            if (window.innerWidth < 768) setIsOpen(false);
          }}
          className="bg-slate-800/40 rounded-2xl p-4 mb-6
          border border-slate-700/50 flex items-center gap-3
          cursor-pointer hover:bg-slate-800/70 transition-all shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500
            flex items-center justify-center text-white font-bold text-sm
            shadow-lg shadow-indigo-500/20">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {role}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">
            Main Menu
          </p>

          <ul className="space-y-1.5">
            {visibleTabs.map((tab) => (
              <li
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3
                rounded-xl cursor-pointer transition-all duration-200
                ${
                  activeTab === tab.name
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm font-bold">{tab.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign Out */}
        <div className="pt-4 mt-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3
            w-full rounded-xl text-slate-400
            hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
