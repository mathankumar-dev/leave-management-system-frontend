import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Admin Views
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";
import HRProfile from "../views/admin/HRProfile";

// Employee Views
import DashboardView from "../views/employee/DashboardView";
import CalendarView from "../views/employee/CalendarView";
import LeaveApplicationForm from "../views/LeaveApplicationForm";
import MyLeavesView from "../views/MyLeavesView";
import NotificationsView from "../views/NotificationsView";
import EmployeeProfile from "../views/employee/EmployeeProfile";
import LeaveReportDashboard from "../views/admin/LeaveReportDashboard";



// Manager Views
import ManagerDashboardView from "../views/manager/ManagerDashboardView";
import TeamCalendarView from "../views/manager/TeamCalendarView";
import ApprovalsView from "../views/manager/ApprovalsView";
import ManagerProfile from "../views/manager/ManagerProfile";

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = user?.role || "Employee";

  /* ---------------- HR DEFAULT REDIRECT ---------------- */
  useEffect(() => {
    if (userRole === "HR Admin" && activeTab === "Dashboard") {
      setActiveTab("Employees");
    }
  }, [userRole, activeTab]);

  /* ---------------- VIEW RENDERER ---------------- */
  const renderView = () => {
  switch (activeTab) {

    case "Reports":
      if (userRole === "HR Admin") {
        return <LeaveReportDashboard  />;
      }
      if (userRole === "Manager") {
        return <LeaveReportDashboard />;
      }
      return null;

    case "Dashboard":
      return userRole === "Manager"
        ? <ManagerDashboardView />
        : userRole === "Employee"
        ? <DashboardView />
        : <EmployeesView />;

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

    case "Pending Requests":
      return <ApprovalsView />;

    case "Notifications":
      return <NotificationsView />;

    case "Profile":
      if (userRole === "Manager") return <ManagerProfile />;
      if (userRole === "HR Admin") return <HRProfile />;
      return <EmployeeProfile />;

    default:
      return <DashboardView />;
  }
};


  /* ---------------- LAYOUT ---------------- */
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen w-full">
        <Topbar
          activeTab={activeTab}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
          setActiveTab={setActiveTab}
        />

        <main className="p-4 md:p-6 flex-1 overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
