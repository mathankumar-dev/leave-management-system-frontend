import DashboardRoutes from "./DashboardRoutes";
import { useAuth } from "@/shared/auth/useAuth";
import { useState } from "react";
import { Sidebar, Topbar } from "@/shared/components";
import AnnouncementBar from "@/shared/components/AnnouncementBar";
import { useNavigate } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const { contextLogout: logout, user } = useAuth();
  const navigate = useNavigate();

  // ✅ Role-based base path
  const basePathMap: Record<string, string> = {
    EMPLOYEE: "/employee",
    MANAGER: "/manager",
    TEAM_LEADER: "/manager",
    HR: "/hr",
    ADMIN: "/admin",
    CFO: "/admin",
  };

  const basePath = basePathMap[user?.role ?? ""] || "/employee";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">

      {/* ✅ Announcement Bar (FIXED) */}
      <AnnouncementBar
        onEditClick={() => navigate(`${basePath}/profile`)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onLogout={logout}
        />

        <div
          className={`flex-1 flex flex-col h-full min-w-0 transition-all duration-300 ease-in-out
            ${isCollapsed ? "md:ml-20" : "md:ml-80"}`}
        >
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
            onLogout={logout}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
            <div className="max-w-7xl mx-auto w-full">
              <DashboardRoutes />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;