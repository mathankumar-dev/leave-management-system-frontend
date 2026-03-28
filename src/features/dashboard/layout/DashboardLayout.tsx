import DashboardRoutes from "./DashboardRoutes";
import { useAuth } from "@/shared/auth/useAuth";
import { useState } from "react";
import { Sidebar, Topbar } from "@/shared/components";

const DashboardLayout: React.FC = () => {
  const { contextLogout : logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-25 overflow-hidden">

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col md:ml-80 h-full min-w-0">

        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto w-full">
            <DashboardRoutes />   
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;