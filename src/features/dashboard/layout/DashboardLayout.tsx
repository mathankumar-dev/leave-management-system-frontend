import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

/* ---------------- ADMIN VIEWS ---------------- */
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";
import LeaveReportDashboard from "../views/admin/LeaveReportDashboard";

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
import ApprovalsView from "../views/manager/ApprovalsView";
import ManagerProfile from "../views/manager/ManagerProfile";
import ChangePasswordDialog from "../../../components/modals/ChangePasswordDialog";
import PendingApprovalsView from "../views/manager/PendingApprovalsView";

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
    // setActiveTab("Profile"); // Navigate to Profile tab
  };

  /* ---------------- ADMIN DEFAULT REDIRECT ---------------- */
  useEffect(() => {
    if (userRole === ROLES.ADMIN && activeTab === "Dashboard") {
      setActiveTab("Employees");
    }
  }, [userRole, activeTab]);

  /* ---------------- SCROLL RESET ON TAB CHANGE ---------------- */
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
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        if (userRole === ROLES.ADMIN) return <EmployeesView />;

        return <DashboardView onNavigate={setActiveTab} />;

      case "Reports":
        if (userRole === ROLES.ADMIN) return <LeaveReportDashboard />;
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return null;

      case "Employees":
        return <EmployeesView />;

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

      case "Profile":
        if (userRole === ROLES.MANAGER) return <ManagerProfile />;
        return <EmployeeProfile />;

      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  /* ---------------- LAYOUT ---------------- */
  return (
    <div className="flex h-screen bg-neutral-25 overflow-hidden">

      {showPasswordPrompt && (
        <ChangePasswordDialog
          onClose={handleDismissPrompt}
          onGoToSettings={handleGoToSettings}
        />
      )}
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}

        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      {/* Main Content */}
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
