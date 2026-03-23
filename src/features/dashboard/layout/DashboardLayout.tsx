import ChangePasswordDialog from "@/features/auth/components/ChangePasswordDialog";
import DashboardRoutes from "./DashboardRoutes";
import { useAuth } from "@/shared/auth/useAuth";
import { useState } from "react";
import PersonalDetailsModal from "@/features/employee/components/PersonalDetailsModal";
import { Sidebar, Topbar } from "@/shared/components";

const DashboardLayout: React.FC = () => {
  const { logout, mustChangePassword, personalDetailsComplete } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (mustChangePassword) return <ChangePasswordDialog />;
  if (!personalDetailsComplete) return <PersonalDetailsModal />;

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