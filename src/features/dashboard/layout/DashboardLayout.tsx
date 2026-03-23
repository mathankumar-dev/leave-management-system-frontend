import React, { useState } from "react";
import { useAuth } from "../../../shared/auth/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

/* ---------------- ADMIN VIEWS ---------------- */
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";

/* ---------------- HR VIEWS ---------------- */
import { HRDashboard } from "../views/hr/pages/HRDashboard";
import { HREmployeesPage } from "../views/hr/pages/HREmployeesPage";
import LowBalancePage from "../views/hr/pages/LowBalancePage";
import { HRVerificationPage } from "../views/hr/pages/Hrverificationpage";

/* ---------------- EMPLOYEE VIEWS ---------------- */
import DashboardView from "../../employee/pages/DashboardView";
import CalendarView from "../../employee/pages/CalendarView";
import LeaveApplicationForm from "../../leave/components/LeaveApplicationForm";
import NotificationsView from "../../notification/pages/NotificationsView";
import EmployeeProfile from "../../employee/pages/EmployeeProfile";

/* ---------------- MANAGER VIEWS ---------------- */
import ManagerDashboardView from "../views/manager/ManagerDashboardView";
import AdminDashboardView from "../views/admin/AdminDashboardView";
import TeamCalendarView from "../views/manager/TeamCalendarView";
import ManagerProfile from "../views/manager/ManagerProfile";
import PendingApprovalsView from "../../leave/pages/PendingApprovalsView";
import TeamMembersView from "../../employee/pages/TeamMembersView";

/* ---------------------- CFO -----------------------*/
import { PayslipPage } from "../views/CFO/pages/PayslipPage";
import { CFOEmployeesPage } from "../views/CFO/pages/Cfoemployeepage";

/* ---------------- MODALS ---------------- */
import ChangePasswordDialog from "../../../components/modals/ChangePasswordDialog";
import OtherRequestForm from "../../../common/OtherRequestForm";
import PayrollView from "../views/Payroll";
import PersonalDetailsModal from "../../employee/components/PersonalDetailsModal";
import RequestCenter from "../../employee/components/RequestCenter";
import MyRequestsView from "../../leave/pages/MyLeavesView";
import OnboardingPendingPage from "../views/admin/OnboardingPendingPage";
import FlashNewsForm from "../views/admin/FlashNewsCreate";

/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  CFO: "CFO",
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

      case "Reports":
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return null;


      case "Verifications":
        if (userRole === ROLES.HR) return <HRVerificationPage />;
        return null;

      case "All Employees":
        return userRole === ROLES.HR ? <HREmployeesPage /> : <EmployeesView />;

      case "LowBalance Employee":
        return <LowBalancePage />;

      case "Calendar":
        return <CalendarView />;

      case "Team Calendar":
        return <TeamCalendarView />;
      case "Employees":
        return <EmployeesView />;
      case "Onboarding Approvals":
        return <OnboardingPendingPage />;

      case "Leave Config":
        return <LeaveTypesView />;
      case "Apply Leave":
        return <LeaveApplicationForm />;

      case "Request center":
        return <RequestCenter />;

      case "My Requests":
        return <MyRequestsView />;

      // case "Payslip":
      //   return userRole === ROLES.HR ? <PayslipPage /> : <PayrollView />;

      case "Pending Approvals":
        return <PendingApprovalsView />;

      case "Notifications":
        return <NotificationsView />;

      case "Team Members":
        return <TeamMembersView />;

      case "Flash News":
        return <FlashNewsForm />;



      case "Profile":
        if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER) return <ManagerProfile />;
        return <EmployeeProfile />;

      case "Cfoemployees":
        if (userRole === ROLES.CFO) return (
          <CFOEmployeesPage />
        );
        return <EmployeesView />;


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