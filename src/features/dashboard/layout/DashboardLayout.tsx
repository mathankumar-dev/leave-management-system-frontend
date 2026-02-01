import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Sidebar from "./components/Sidebar";
// import Topbar from "./components/Topbar";
import type { UserRole } from "../../auth/types";

// // Import your views
// import EmployeeDashboard from "./views/EmployeeDashboard";
// import ManagerDashboard from "./views/ManagerDashboard";
// import LeaveApplicationForm from "./views/LeaveApplicationForm";
// import ApprovalsView from "./views/ApprovalsView";

interface DashboardLayoutProps {
  role: UserRole | string | null;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, onLogout }) => {
  // Local state to handle navigation within the dashboard
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Helper to render the correct view based on navigation and role
  const renderView = () => {
    // switch (activeTab) {
    //   case "apply":
    //     return <LeaveApplicationForm />;
    //   case "approvals":
    //     return role === "Manager" || role === "HR Admin" ? <ApprovalsView /> : <EmployeeDashboard />;
    //   case "overview":
    //   default:
    //     return role === "Manager" ? <ManagerDashboard /> : <EmployeeDashboard />;
    // }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar Navigation */}
      {/* <Sidebar 
        role={role as UserRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
      /> */}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header Section */}
        {/* <Topbar 
          onLogout={onLogout} 
          role={role} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        /> */}

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {/* {renderView()} */}.
              <div></div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;