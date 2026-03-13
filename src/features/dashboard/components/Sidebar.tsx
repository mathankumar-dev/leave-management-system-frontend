import React, { useState } from "react";
import {
  FaChevronLeft, FaSignOutAlt, FaThLarge, FaPlus, FaListUl,
  FaCalendarAlt, FaBell, FaUsers, FaCog, FaChartBar,
  FaExclamationTriangle,  FaLayerGroup,
  FaEye, FaIdCard, FaWallet, FaChevronDown, 
} from "react-icons/fa";
import { useAuth } from "../../auth/hooks/useAuth";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

interface TabItem {
  name: string;
  icon: React.ReactNode;
  roles: string[];
}

interface SectionGroup {
  label: string;
  roles: string[];
  items: TabItem[];
}

const SECTIONS: SectionGroup[] = [
  {
    label: "Overview",
    roles: ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
    items: [
      { name: "Dashboard",    icon: <FaThLarge />,   roles: ["EMPLOYEE", "MANAGER", "HR", "ADMIN"] },
      { name: "Notifications",icon: <FaBell />,      roles: ["EMPLOYEE", "MANAGER", "ADMIN"] },
    ],
  },
  {
    label: "Leave",
    roles: ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
    items: [
      { name: "Apply Leave",       icon: <FaPlus />,              roles: ["EMPLOYEE", "MANAGER", "ADMIN"] },
      { name: "My Leaves",         icon: <FaListUl />,            roles: ["EMPLOYEE", "MANAGER", "HR", "ADMIN"] },
      { name: "Pending Approvals", icon: <FaCog />,               roles: ["MANAGER"] },
      { name: "Leave Monitor",     icon: <FaEye />,               roles: ["ADMIN"] },
      { name: "Leave Config",      icon: <FaCog />,               roles: ["HR", "ADMIN"] },
      { name: "Reports",           icon: <FaChartBar />,          roles: ["HR", "ADMIN"] },
      { name: "LowBalance Employee",icon: <FaExclamationTriangle />, roles: ["HR"] },
    ],
  },
  {
    label: "Calendar",
    roles: ["EMPLOYEE", "MANAGER", "HR", "ADMIN"],
    items: [
      { name: "Calendar",      icon: <FaCalendarAlt />, roles: ["EMPLOYEE"] },
      { name: "Team Calendar", icon: <FaCalendarAlt />, roles: ["MANAGER", "HR", "ADMIN"] },
      { name: "Holidays",      icon: <FaCalendarAlt />, roles: ["ADMIN"] },
    ],
  },
  {
    label: "Organisation",
    roles: ["MANAGER", "HR", "ADMIN"],
    items: [
      { name: "All Employees",  icon: <FaUsers />,     roles: ["HR", "ADMIN"] },
      { name: "Team Members",   icon: <FaUsers />,     roles: ["MANAGER"] },
      //{ name: "Managers",       icon: <FaUserTie />,   roles: ["ADMIN"] },
      //{ name: "Departments",    icon: <FaBuilding />,  roles: ["ADMIN"] },
      { name: "Teams",          icon: <FaLayerGroup />,roles: ["ADMIN"] },
    ],
  },
  {
    label: "Admin",
    roles: ["ADMIN"],
    items: [
      { name: "Onboarding", icon: <FaIdCard />,     roles: ["ADMIN"] },
      { name: "Payslips",   icon: <FaWallet />,     roles: ["ADMIN"] },
    ],
  },
];

function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: SidebarProps) {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase() ?? "";
  const userName = user?.name;

  // Track which sections are collapsed
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleSection = (label: string) =>
    setCollapsed(c => ({ ...c, [label]: !c[label] }));

  const handleNav = (name: string) => {
    setActiveTab(name);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-35 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 bg-neutral-900
          flex flex-col border-r border-neutral-800
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5 shrink-0 border-b border-neutral-800">
          <div>
            <h1 className="text-white font-black text-base tracking-tight uppercase leading-tight">
              Leave <span className="text-indigo-400">Mgmt</span>
            </h1>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-0.5">
              Employee Portal
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-neutral-500 hover:text-white p-1">
            <FaChevronLeft size={14} />
          </button>
        </div>

        {/* User card */}
        <div
          onClick={() => handleNav("Profile")}
          className="mx-4 mt-4 mb-2 px-3 py-3 rounded-xl bg-neutral-800 border border-neutral-700/50
            flex items-center gap-3 cursor-pointer hover:bg-neutral-700/60 transition-all shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center
            text-white font-black text-sm shadow-lg shadow-indigo-500/20 shrink-0">
            {userName?.charAt(0) ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight">{userName ?? "User"}</p>
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{userRole}</p>
          </div>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 no-scrollbar">
          {SECTIONS.map(section => {
            // Filter items by role
            const visibleItems = section.items.filter(item => item.roles.includes(userRole));
            // Hide section if no visible items or role not in section
            if (visibleItems.length === 0 || !section.roles.includes(userRole)) return null;
            const isCollapsed = collapsed[section.label];

            return (
              <div key={section.label}>
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 mb-1 group"
                >
                  <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]
                    group-hover:text-neutral-400 transition-colors">
                    {section.label}
                  </span>
                  <FaChevronDown
                    size={8}
                    className={`text-neutral-600 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                  />
                </button>

                {!isCollapsed && (
                  <ul className="space-y-0.5 mb-2">
                    {visibleItems.map(tab => {
                      const isActive = activeTab === tab.name;
                      return (
                        <li
                          key={tab.name}
                          onClick={() => handleNav(tab.name)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
                            transition-all text-sm font-bold select-none
                            ${isActive
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                            }`}
                        >
                          <span className={`text-base shrink-0 ${isActive ? "text-white" : "text-neutral-500"}`}>
                            {tab.icon}
                          </span>
                          <span className="truncate">{tab.name}</span>
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-neutral-800 shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg
              text-neutral-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold text-sm"
          >
            <FaSignOutAlt className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;