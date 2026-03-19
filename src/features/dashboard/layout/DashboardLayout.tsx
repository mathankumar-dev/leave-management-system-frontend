import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

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
import LeaveApplicationForm from "../../../common/forms/LeaveApplicationForm";
import NotificationsView from "../views/NotificationsView";
import EmployeeProfile from "../views/employee/EmployeeProfile";

/* ---------------- MANAGER VIEWS ---------------- */
import ManagerDashboardView from "../views/manager/ManagerDashboardView";
import AdminDashboardView from "../views/admin/AdminDashboardView";
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
import MyRequestsView from "../views/MyLeavesView";

/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  TEAMLEADER: "TEAM_LEADER"
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold">{value ?? 0}</p>
  </div>
);

const DashboardLayout: React.FC = () => {

  const { user, logout, mustChangePassword, personalDetailsComplete } = useAuth();

  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  /* ---------------- VIEW RENDERER ---------------- */
  const renderView = () => {

    switch (activeTab) {

      case "Dashboard":
        if (userRole === ROLES.ADMIN)
          return <AdminDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER)
          return <ManagerDashboardView onNavigate={setActiveTab} />;



        if (userRole === ROLES.HR)
          return <HRDashboard />;

        return <DashboardView onNavigate={setActiveTab} />;

      case "All Employees":
        return userRole === ROLES.HR ? <HREmployeesPage /> : <EmployeesView />;

      case "LowBalance Employee":
        return <LowBalancePage />;

      case "Calendar":
        return <CalendarView />;

      case "Team Calendar":
        return <TeamCalendarView />;
      case "Employees":
        return <EmployeesView  />;

      case "Leave Config":
        return <LeaveTypesView />;
      case "Apply Leave":
        return <LeaveApplicationForm />;

      case "Request center":
        return <RequestCenter />;

      case "My Requests":
        return <MyRequestsView />;

      case "Payroll":
        return userRole === ROLES.HR ? <PayslipPage /> : <PayrollView />;

      case "Pending Approvals":
        return <PendingApprovalsView />;

      case "Notifications":
        return <NotificationsView />;

      case "Team Members":
        return <TeamMembersView />;



      case "Profile":
        if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER) return <ManagerProfile />;
        return <EmployeeProfile />;


      case "Other Approvals":
        return <OtherRequestForm />;

      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };



  if (mustChangePassword) return <ChangePasswordDialog />;

  if (!personalDetailsComplete) return <PersonalDetailsModal />;

  return (

    <div className="flex h-screen bg-neutral-25 overflow-hidden">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col md:ml-80 h-full min-w-0">

        <Topbar
          activeTab={activeTab}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
          setActiveTab={setActiveTab}
        />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
        >
          <div className="max-w-7xl mx-auto w-full">
            {renderView()}
          </div>
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;