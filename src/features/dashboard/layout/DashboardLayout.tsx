import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Views
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";
import CalendarView from "../views/employee/CalendarView";
import DashboardView from "../views/employee/DashboardView";
import LeaveApplicationForm from "../views/LeaveApplicationForm";
import ManagerDashboardView from "../views/manager/ManagerDashboardView";
import TeamCalendarView from "../views/manager/TeamCalendarView";
import MyLeavesView from "../views/MyLeavesView";
import NotificationsView from "../views/NotificationsView";
import ApprovalsView from "../views/manager/ApprovalsView";
import ManagerProfile from "../views/manager/ManagerProfile";
import EmployeeProfile from "../views/employee/EmployeeProfile";
import HRProfile from "../views/admin/HRProfile";

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  let userRole = user?.role || "Employee";

  const renderView = () => {
    switch (activeTab) {
      case "Dashboard":
        return userRole === "Manager"
          ? <ManagerDashboardView />
          : <DashboardView />;

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
        
        if(userRole === "Manager") return <ManagerProfile/>;
        if (userRole === "HR Admin") return <HRProfile/>;
        return <EmployeeProfile/>;

      default:
        return userRole === "Manager"
          ? <ManagerDashboardView />
          : <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen w-full overflow-x-hidden">
        <Topbar
          activeTab={activeTab}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
          setActiveTab={setActiveTab}
        />

        <main className="p-4 md:p-6 flex-1 overflow-y-auto w-full">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
