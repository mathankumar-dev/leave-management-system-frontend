import React, { useEffect, useRef, useState } from "react";
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
import { HRVerificationPage } from "../views/hr/pages/Hrverificationpage";

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
import ChangePasswordDialog from "../../../components/modals/ChangePasswordDialog";
import PendingApprovalsView from "../views/manager/PendingApprovalsView";
import TeamMembersView from "../views/manager/TeamMembersView";

/* ---------------------- CFO -----------------------*/
import { PayslipPage } from "../views/CFO/pages/PayslipPage";
import { CFOEmployeesPage } from "../views/CFO/pages/Cfoemployeepage";

/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  CFO: "CFO",
};

const DashboardLayout: React.FC = () => {
  const { user, logout, mustChangePassword } = useAuth();
  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cfoSelectedEmpId, setCfoSelectedEmpId] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userRole === ROLES.ADMIN && activeTab === "Dashboard") {
      setActiveTab("Employees");
    }
    if (userRole === ROLES.CFO && activeTab === "Dashboard") {
      setActiveTab("Cfoemployees");
    }
  }, [userRole, activeTab]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeTab]);

  const renderView = () => {
    switch (activeTab) {

      case "Dashboard":
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        if (userRole === ROLES.ADMIN) return <EmployeesView />;
        return <DashboardView onNavigate={setActiveTab} />;

      case "Reports":
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return null;


      case "Verifications":
        if (userRole === ROLES.HR) return <HRVerificationPage />;
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

      case "My Leaves":
        return <MyLeavesView />;

      case "Pending Approvals":
        return <PendingApprovalsView />;

      case "Notifications":
        return <NotificationsView />;

      case "Team Members":
        return <TeamMembersView onNavigate={setActiveTab} />;

      case "Profile":
        if (userRole === ROLES.MANAGER) return <ManagerProfile />;
        return <EmployeeProfile />;

      // case "Payroll":
      //   if (userRole === ROLES.CFO) return (
      //     <PayslipPage />
      //   );
      //   return null;

      case "Cfoemployees":
        if (userRole === ROLES.CFO) return (
          <CFOEmployeesPage />
        );
        return <EmployeesView />;

      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  if (mustChangePassword) {
    return <ChangePasswordDialog />;
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
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
        >
          <div className="max-w-400 mx-auto animate-in fade-in duration-300 w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;