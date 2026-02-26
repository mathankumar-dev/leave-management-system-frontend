import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

/* ---------------- ADMIN VIEWS ---------------- */
import AdminDashboardView from "../views/admin/pages/AdminDashboardView";
import EmployeesView from "../views/admin/pages/EmployeesView";
import LeaveTypesView from "../views/admin/components/LeaveTypesView";
import LeaveReportDashboard from "../views/admin/components/LeaveReportDashboard";
import AdminProfile from "../views/admin/components/AdminProfile";
import RequestListPage from "../views/admin/pages/RequestListPage";

/* ---------------- HR VIEWS ---------------- */
import { HRDashboard } from "../views/hr/pages/HRDashboard";

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

import ChangePasswordDialog from "../../../components/modals/ChangePasswordDialog";
import AuditLogView from "../views/admin/pages/AuditLogView";


/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const userRole = user?.role;
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ---------------- PASSWORD PROMPT ---------------- */
  useEffect(() => {
    const hasBeenPrompted = sessionStorage.getItem("passwordPromptShown");

    if (userId && !hasBeenPrompted) {
      const timer = setTimeout(() => {
        setShowPasswordPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const handleDismissPrompt = () => {
    setShowPasswordPrompt(false);
    sessionStorage.setItem("passwordPromptShown", "true");
  };

  const handleGoToSettings = () => {
    setShowPasswordPrompt(false);
    sessionStorage.setItem("passwordPromptShown", "true");
    setActiveTab("Profile");
  };

  /* ---------------- SCROLL RESET ---------------- */
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [activeTab]);

  /* ---------------- VIEW RENDERER ---------------- */
  const renderView = () => {
    switch (activeTab) {
      case "Dashboard":
        if (userRole === ROLES.ADMIN) return <AdminDashboardView />;
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return <DashboardView onNavigate={setActiveTab} />;

      case "Reports":
        if (userRole === ROLES.ADMIN) return <LeaveReportDashboard />;
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return null;

      case "Employees":
        if (userRole === ROLES.ADMIN) return <EmployeesView />;
        return null;

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

      case "AuditLog":
         return <AuditLogView />;

      case "Requests":
        if (userRole === ROLES.ADMIN) return <RequestListPage/>;
        return null;

      case "Profile":
        if (userRole === ROLES.MANAGER) return <ManagerProfile />;
         if (userRole === ROLES.ADMIN) return <AdminProfile />;
        return <EmployeeProfile />;

      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-25 overflow-hidden">
      {showPasswordPrompt && (
        <ChangePasswordDialog
          onClose={handleDismissPrompt}
          onGoToSettings={handleGoToSettings}
        />
      )}

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
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300 w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;