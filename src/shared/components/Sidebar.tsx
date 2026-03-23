import {
  FaChevronLeft,
  FaSignOutAlt,
  FaThLarge,
  FaListUl,
  FaCalendarAlt,
  FaBell,
  FaUsers,
  FaCog,
  FaExclamationTriangle,
  FaFileSignature,
  FaDollarSign,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { AiFillThunderbolt } from "react-icons/ai";
import { MdVerifiedUser } from "react-icons/md";

import { useNavigate, useLocation } from "react-router-dom";

import logoSVG from "../../../assets/logo.svg";
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

  const tabs = [
    // DASHBOARDS
    { name: "Dashboard", path: "/dashboard/employee/dashboard", icon: <FaThLarge />, roles: ["EMPLOYEE"] },
    { name: "Dashboard", path: "/dashboard/manager/dashboard", icon: <FaThLarge />, roles: ["MANAGER", "TEAM_LEADER"] },
    { name: "Dashboard", path: "/dashboard/hr/dashboard", icon: <FaThLarge />, roles: ["HR"] },
    { name: "Dashboard", path: "/dashboard/admin/dashboard", icon: <FaThLarge />, roles: ["ADMIN"] },

    // MANAGER
    { name: "Pending Approvals", path: "/dashboard/manager/approvals", icon: <FaCog />, roles: ["MANAGER", "TEAM_LEADER"] },
    { name: "Team Calendar", path: "/dashboard/manager/calendar", icon: <FaCalendarAlt />, roles: ["MANAGER", "TEAM_LEADER"] },
    { name: "Team Members", path: "/dashboard/manager/team", icon: <FaUsers />, roles: ["MANAGER", "TEAM_LEADER"] },

    // ADMIN
    { name: "Onboarding Approvals", path: "/dashboard/admin/onboarding", icon: <FaCog />, roles: ["ADMIN"] },
    { name: "Employees", path: "/dashboard/admin/employees", icon: <FaUsers />, roles: ["ADMIN"] },
    { name: "Flash News", path: "/dashboard/admin/flash-news", icon: <AiFillThunderbolt />, roles: ["ADMIN"] },

    // HR
    { name: "All Employees", path: "/dashboard/hr/employees", icon: <FaUsers />, roles: ["HR"] },
    { name: "Low Balance", path: "/dashboard/hr/low-balance", icon: <FaExclamationTriangle />, roles: ["HR"] },
    { name: "Verifications", path: "/dashboard/hr/verifications", icon: <MdVerifiedUser />, roles: ["HR"] },

    // COMMON
    { name: "Request Center", path: "/dashboard/requests", icon: <FaFileSignature />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER", "ADMIN"] },
    { name: "My Requests", path: "/dashboard/employee/requests", icon: <FaListUl />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER"] },
    { name: "Calendar", path: "/dashboard/employee/calendar", icon: <FaCalendarAlt />, roles: ["EMPLOYEE"] },
    { name: "Notifications", path: "/dashboard/notifications", icon: <FaBell />, roles: ["EMPLOYEE", "MANAGER", "TEAM_LEADER", "ADMIN"] },
    { name: "Payroll", path: "/dashboard/payroll", icon: <FaDollarSign />, roles: ["EMPLOYEE", "MANAGER", "ADMIN"] },
    { name: "Payslip", path: "/dashboard/payslip", icon: <FaFileInvoiceDollar />, roles: ["EMPLOYEE", "MANAGER", "ADMIN"] },
  ];

  const visibleTabs = tabs.filter((tab) =>
    userRole ? tab.roles.includes(userRole) : false
  );

  const handleNavigate = (path: string) => {
    navigate(path);
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
          onClick={() => handleNavigate("/dashboard/employee/profile")}
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
              const isActive = location.pathname === tab.path;

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