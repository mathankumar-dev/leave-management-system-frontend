import {
  FaBell,
  FaCalendarAlt,
  FaChevronLeft,
  FaCog,
  FaExclamationTriangle,
  FaFileSignature,
  FaHistory,
  FaSignOutAlt,
  FaThLarge,
  FaUsers,
} from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";

import { useLocation, useNavigate } from "react-router-dom";

import logoSVG from "@/assets/svg/logo.svg";
import { useAuth } from "@/shared/auth/useAuth";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

function Sidebar({ isOpen, setIsOpen, onLogout }: SidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role?.toUpperCase();
  const userName = user?.name;

  const basePathMap = {
    EMPLOYEE: "/employee",
    MANAGER: "/manager",
    TEAM_LEADER: "/manager",
    HR: "/hr",
    ADMIN: "/admin",
    CFO: "/admin",
  };

  const basePath = basePathMap[userRole as keyof typeof basePathMap] || "/employee";

  const tabs = [
    { name: "Dashboard", path: "dashboard", icon: <FaThLarge />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER", "HR", "ADMIN"] },
    
    { name: "Pending Approvals", path: "approvals", icon: <FaCog />, roles: ["MANAGER", "TEAM_LEADER"] },
    { name: "Team Calendar", path: "team-calendar", icon: <FaCalendarAlt />, roles: ["MANAGER", "TEAM_LEADER"] },
    { name: "Team Members", path: "team", icon: <FaUsers />, roles: ["MANAGER", "TEAM_LEADER"] },
    
    // { name: "Onboarding", path: "onboarding", icon: <FaCog />, roles: ["ADMIN"] },
    { name: "Employees", path: "employees", icon: <FaUsers />, roles: ["ADMIN", "HR"] },

    { name: "Low Balance", path: "low-balance", icon: <FaExclamationTriangle />, roles: ["HR"] },
    { name: "Verifications", path: "verifications", icon: <MdVerifiedUser />, roles: ["HR"] },

    { name: "My Requests", path: "requests", icon: <FaHistory />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER", "ADMIN"] },
    { name: "Request Center", path: "request-center", icon: <FaFileSignature />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER", "ADMIN"] },

    { name: "Notifications", path: "notifications", icon: <FaBell />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER", "ADMIN"] },
    { name: "Calendar", path: "calendar", icon: <FaCalendarAlt />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER", "HR", "ADMIN"] },


    // { name: "Payroll", path: "payroll", icon: <FaDollarSign />, roles: ["ADMIN"] },
    // { name: "Payslip", path: "payslip", icon: <FaFileInvoiceDollar />, roles: ["EMPLOYEE", "MANAGER", "ADMIN"] },
    
  ];

  const visibleTabs = tabs.filter((tab) =>
    userRole ? tab.roles.includes(userRole) : false
  );

  const handleNavigate = (path: string) => {
    navigate(`${basePath}/${path}`);
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
        className={`fixed top-0 left-0 z-40 h-screen w-80 bg-neutral-800
        p-6 border-r border-neutral-800 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between mb-8 px-2 border border-gray-50/25 rounded bg-gray-50/25">
          <div className="flex items-center">
            <img src={logoSVG} alt="" width={50} height={50} />
            <span className="text-black text-xl font-bold">WeNxt</span>
            <span className="text-primary-500 text-xl font-bold">Technologies</span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-neutral-500 hover:text-white"
          >
            <FaChevronLeft />
          </button>
        </div>

        {/* PROFILE */}
        <div
          onClick={() => handleNavigate("profile")}
          className="bg-neutral-800 rounded-lg p-4 mb-8 border border-neutral-700/30 flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">
            {userName?.charAt(0) || "U"}
          </div>

          <div>
            <p className="text-sm font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-neutral-300 uppercase">{userRole}</p>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto pr-1">
          <p className="px-4 text-[10px] font-black text-neutral-600 uppercase mb-4">
            Menu
          </p>

          <ul className="space-y-1.5">
            {visibleTabs.map((tab) => {
              const isActive = location.pathname === `${basePath}/${tab.path}`;

              return (
                <li
                  key={tab.path}
                  onClick={() => handleNavigate(tab.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all
                    ${isActive
                      ? "bg-primary-500 text-white shadow-lg"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <span className={`text-lg ${isActive ? "text-white" : "text-neutral-400"}`}>
                    {tab.icon}
                  </span>
                  <span className="text-sm font-bold">{tab.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* LOGOUT */}
        <div className="pt-4 mt-4 border-t border-neutral-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-neutral-300 hover:bg-danger/10 hover:text-danger"
          >
            <FaSignOutAlt />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;