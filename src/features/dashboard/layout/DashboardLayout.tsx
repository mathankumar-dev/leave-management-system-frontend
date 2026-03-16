import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { dashboardService } from "../services/dashboardService";
// import PayrollView from "../views/PayrollView";

/* ---------------- ADMIN VIEWS ---------------- */
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";

/* ---------------- HR VIEWS ---------------- */
import { HRDashboard } from "../views/hr/pages/HRDashboard";
import { HREmployeesPage } from "../views/hr/pages/HREmployeesPage";
import LowBalancePage from "../views/hr/pages/LowBalancePage";

/* ---------------- EMPLOYEE VIEWS ---------------- */
import DashboardView from "../views/employee/DashboardView";
import CalendarView from "../views/employee/CalendarView";
import LeaveApplicationForm from "../views/LeaveApplicationForm";
import MyLeavesView from "../views/MyLeavesView";
import NotificationsView from "../views/NotificationsView";
import EmployeeProfile from "../views/employee/EmployeeProfile";

/* ---------------- MANAGER VIEWS ---------------- */
import ManagerDashboardView from "../views/manager/ManagerDashboardView";
import TeamCalendarView from "../views/manager/TeamCalendarView";
import ManagerProfile from "../views/manager/ManagerProfile";
import PendingApprovalsView from "../views/manager/PendingApprovalsView";
import TeamMembersView from "../views/manager/TeamMembersView";

/* ---------------- MODALS ---------------- */
import ChangePasswordDialog from "../../../components/modals/ChangePasswordDialog";
import OtherRequestForm from "../../../common/OtherRequestForm";
import PayrollView from "../views/Payroll";
import PersonalDetailsModal from "../../../common/PersonalDetailsModal";
import { PayslipPage } from "../views/hr/pages/PayslipPage";
import RequestCenter from "../../../common/RequestCenter";

/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  TEAMLEADER: "TEAM_LEADER"
};

const DashboardLayout: React.FC = () => {
  const { user, logout, mustChangePassword, personalDetailsComplete } = useAuth();
  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  /* ---------------- VIEW RENDERER ---------------- */
  const renderView = () => {
    switch (activeTab) {
      case "Dashboard":

        if (userRole === ROLES.MANAGER)
          return <ManagerDashboardView onNavigate={setActiveTab} />;

        if (userRole === ROLES.HR) return <HRDashboard />;

        return <DashboardView onNavigate={setActiveTab} />;

      case "Reports":
        if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER)
          return <ManagerDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return null;

      case "All Employees":
        if (userRole === ROLES.HR) return <HREmployeesPage />;
        return <EmployeesView />;

      case "LowBalance Employee":
        return <LowBalancePage />;

      case "Calendar":
        return <CalendarView />;

      case "Team Calendar":
        return <TeamCalendarView />;

      case "Leave Config":
        return <LeaveTypesView />;
      case "Apply Leave":
        return <LeaveApplicationForm />;

      case "Request Center":
        return <RequestCenter />;

      case "My Leaves":
        return <MyLeavesView />;

      case "Payroll":
        if (user?.role === "HR") return <PayslipPage />;
        return <PayrollView />;

      case "Pending Approvals":
        return <PendingApprovalsView />;

      case "Notifications":
        return <NotificationsView />;

      case "Team Members":
        return <TeamMembersView />;

      case "Profile":
        if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER) return <ManagerProfile />;
        return <EmployeeProfile />;

      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };



  if (mustChangePassword) {
    return <ChangePasswordDialog />;
  }
  if (!personalDetailsComplete) {
    return <PersonalDetailsModal />;
  }


  return (
    <div className="flex h-screen bg-neutral-25 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col md:ml-80 h-full min-w-0 transition-all duration-300">
        <Topbar
          activeTab={activeTab}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
          setActiveTab={setActiveTab}
        />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
        >
          <div className="max-w-400 mx-auto w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;