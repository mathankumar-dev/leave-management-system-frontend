// import React, { useState } from "react";
// import { useAuth } from "../../auth/hooks/useAuth";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";

// // Existing Views

// import ManagerDashboardView from "../views/manager/ManagerDashboardView";

// // New Views
// import LeaveTypesView from "../views/admin/LeaveTypesView";
// import TeamCalendarView from "../views/manager/TeamCalendarView";
// import EmployeesView from "../views/admin/EmployeesView";
// import DashboardView from "../views/employee/DashboardView";
// import LeaveApplicationForm from "../views/LeaveApplicationForm";
// import MyLeavesView from "../views/MyLeavesView";
// import NotificationsView from "../views/NotificationsView";
// import CalendarView from "../views/employee/CalendarView";

// const DashboardLayout: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState("Dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const userRole = user?.role || "Employee";

//   const renderView = () => {
//     switch (activeTab) {
//       case "Dashboard":
//         return userRole === "Manager" ? <ManagerDashboardView /> : <DashboardView />;

//       case "Employees":
//         // Usually only managers see the employee list
//         return <EmployeesView />;

//       case "Calendar":
//         return <CalendarView />

//       case "Team Calendar":
//         // New Manager view for team oversight
//         return <TeamCalendarView />;

//       case "Leave Config":
//         // New Manager view for setting up leave types
//         return <LeaveTypesView />;

//       case "Apply Leave":
//         return <LeaveApplicationForm />;

//       case "My Leaves":
//         return <MyLeavesView />;
        
//       case "Notifications":
//         return <NotificationsView />;

//       default:
//         return userRole === "Manager" ? <ManagerDashboardView /> : <DashboardView />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#F8FAFC]">
//       {/* Sidebar needs the same activeTab keys used in the switch above */}
//       <Sidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         user={user}
//         isOpen={sidebarOpen}
//         setIsOpen={setSidebarOpen}
//         onLogout={logout}
//       />

//       <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
//         <Topbar
//           activeTab={activeTab}
//           user={user}
//           onMenuClick={() => setSidebarOpen(true)}
//           onLogout={logout}
//         />

//         <main className="p-4 md:p-8 flex-1 overflow-y-auto">
//           {/* Transition wrapper for smooth view changes */}
//           <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
//             {renderView()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;



import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";
import CalendarView from "../views/employee/CalendarView";
import DashboardView from "../views/employee/DashboardView";
import LeaveApplicationForm from "../views/LeaveApplicationForm";
import ManagerDashboardView from "../views/manager/ManagerDashboardView";
import TeamCalendarView from "../views/manager/TeamCalendarView";
import MyLeavesView from "../views/MyLeavesView";
import NotificationsView from "../views/NotificationsView";

// Existing Views imports...

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = user?.role || "Employee";

  const renderView = () => {
    switch (activeTab) {
      case "Dashboard": return userRole === "Manager" ? <ManagerDashboardView /> : <DashboardView />;
      case "Employees": return <EmployeesView />;
      case "Calendar": return <CalendarView />;
      case "Team Calendar": return <TeamCalendarView />;
      case "Leave Config": return <LeaveTypesView />;
      case "Apply Leave": return <LeaveApplicationForm />;
      case "My Leaves": return <MyLeavesView />;
      case "Notifications": return <NotificationsView />;
      default: return userRole === "Manager" ? <ManagerDashboardView /> : <DashboardView />;
    }
  };

  return (
    /* Added overflow-x-hidden to prevent body-level shaking */
    <div className="flex min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      {/* FIX: Ensure flex-1 and w-full are present. 
        The md:ml-64 should only take up space on desktop.
      */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen w-full max-w-full overflow-x-hidden">
        <Topbar
          activeTab={activeTab}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
        />

        {/* FIX: Set p-4 for mobile and p-8 for desktop. 
            Removed potential width conflicts. */}
        <main className="p-4 md:p-6 flex-1 overflow-y-auto w-full">
          <div className="max-w-400 mx-auto animate-in fade-in duration-500 w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;