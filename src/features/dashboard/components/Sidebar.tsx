
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
  FaExclamationTriangle,
  FaFileSignature,
  FaDollarSign,
  FaChartBar,
} from "react-icons/fa";
import { useAuth } from "../../auth/hooks/useAuth";
import NameSVG from "../../../assets/svg/NameSVG";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}


function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onLogout,
}: SidebarProps) {


  const { user } = useAuth();

  const userRole = user?.role;
  const userName = user?.name;

  const tabs = [
    { name: "Dashboard", icon: <FaThLarge />, roles: ["EMPLOYEE", "MANAGER","TEAM_LEADER", "HR","ADMIN"] },
    { name: "Pending Approvals", icon: <FaCog />, roles: ["MANAGER","HR","TEAM_LEADER"] },
    { name: "Apply Leave", icon: <FaPlus />, roles: ["EMPLOYEE", "MANAGER","TEAM_LEADER","ADMIN"] },
    { name: "My Leaves", icon: <FaListUl />, roles: ["EMPLOYEE", "MANAGER","TEAM_LEADER","ADMIN"] },
    { name: "Calendar", icon: <FaCalendarAlt />, roles: [ "ADMIN","EMPLOYEE"] },
    { name: "Team Calendar", icon: <FaCalendarAlt />, roles: ["MANAGER","TEAM_LEADER", "HR",] },
    { name: "Notifications", icon: <FaBell />, roles: ["EMPLOYEE", "MANAGER" ,"TEAM_LEADER", "ADMIN"] },
    { name: "All Employees", icon: <FaUsers />, roles: ["HR"] },
    { name: "Team Members", icon: <FaUsers />, roles: ["MANAGER", "TEAM_LEADER"] },
    // { name: "Leave Config", icon: <FaCog />, roles: ["HR",] },
    { name: "Reports", icon: <FaChartBar />, roles: ["HR", "ADMIN"] },
    { name: "LowBalance Employee", icon: <FaExclamationTriangle />, roles: ["HR"] },
    { name: "Request center", icon: <FaFileSignature />, roles: ["MANAGER","TEAM_LEADER","EMPLOYEE",""] },
    { name: "Payroll", icon: <FaDollarSign />, roles: ["EMPLOYEE", "MANAGER", "ADMIN", "HR"] },
    


  ];

  const visibleTabs = tabs.filter((tab) =>
    userRole ? tab.roles.includes(userRole.toUpperCase()) : false
  );
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-35 md:hidden no-scrollbar"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-80 bg-neutral-800
        p-6 border-r border-neutral-800 flex flex-col
        transition-transform duration-300 ease-in-out no-scrollbar
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8 px-2 shrink-0">
          <div className="h-auto w-42">
            <NameSVG color="#ffffff" isDotNeeded={false} />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-neutral-500 hover:text-white"
          >
            <FaChevronLeft />
          </button>
        </div>

        <div
          onClick={() => {
            setActiveTab("Profile");
            if (window.innerWidth < 768) setIsOpen(false);
          }}
          className="bg-neutral-800 rounded-lg p-4 mb-8
          border border-neutral-700/30 flex items-center gap-3
          cursor-pointer hover:bg-neutral-800 transition-all shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-500
            flex items-center justify-center text-white font-bold text-sm
            shadow-lg shadow-primary-500/20">
            {userName?.charAt(0) || "U"}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {userName || "User"}
            </p>
            <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
              {userRole}
            </p>
          </div>
        </div>

        {/* Menu Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar no-scrollbar pr-1">
          <p className="px-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-4">
            Menu
          </p>

          <ul className="space-y-1.5">
            {visibleTabs.map((tab) => {
              return (

                <li
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all  ${activeTab === tab.name
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    // CHANGED: text-neutral-300 provides much better contrast than 400/500
                    : "text-neutral-300 hover:bg-white/5 hover:text-white hover:translate-x-0.5"
                    }`}
                >
                  <span className={`text-lg ${activeTab === tab.name ? "text-white" : "text-neutral-400"}`}>
                    {tab.icon}
                  </span>
                  <span className="text-sm font-bold">{tab.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-4 mt-4 border-t border-neutral-800 shrink-0">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3
            w-full rounded-lg text-neutral-300
            hover:bg-danger/10 hover:text-danger transition-colors"
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