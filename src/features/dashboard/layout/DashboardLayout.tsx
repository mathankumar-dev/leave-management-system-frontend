import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

/* ---------------- ADMIN VIEWS ---------------- */
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";
// import LeaveReportDashboard from "../views/admin/LeaveReportDashboard";

/* ---------------- HR VIEWS ---------------- */
import { HRDashboard } from "../views/hr/pages/HRDashboard";
import { HREmployeesPage } from "../views/hr/pages/HREmployeesPage";
import { LowBalanceTable } from "../views/hr/components/Lowbalancetable";

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

/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

const DashboardLayout: React.FC = () => {
  const { user, logout, mustChangePassword } = useAuth();
  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [adminData, setAdminData] = useState<any>(null);
const [adminLoading, setAdminLoading] = useState(false);
const [adminError, setAdminError] = useState<string | null>(null);

  /* ---------------- ADMIN DEFAULT REDIRECT ---------------- */
  

  /* Scroll reset on tab change */
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeTab]);

  useEffect(() => {
  if (userRole !== ROLES.ADMIN || !user?.id) return;

  const controller = new AbortController();
  setAdminLoading(true);

  fetch(`/dashboard/admin/${user.id}`, {
    signal: controller.signal,
  })
    .then((res) => res.json())
    .then((data) => {
      setAdminData(data);
      setAdminLoading(false);
    })
    .catch((err) => {
      if (err.name === "AbortError") return;
      setAdminError("Failed to load admin dashboard");
      setAdminLoading(false);
    });

  return () => controller.abort();
}, [userRole, user?.id]);

  /* ---------------- VIEW RENDERER ---------------- */
  const renderView = () => {
    switch (activeTab) {

      case "Dashboard":
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        case "Dashboard":
  if (userRole === ROLES.ADMIN) {
    if (adminLoading) return <div>Loading admin dashboard...</div>;
    if (adminError) return <div>{adminError}</div>;

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Employees" value={adminData?.totalEmployees} />
          <StatCard title="Total Managers" value={adminData?.totalManagers} />
          <StatCard title="Pending Leaves" value={adminData?.totalPendingLeaves} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Rejected Leaves" value={adminData?.totalRejectedLeaves} />
          <StatCard title="Carry Forward Balance" value={adminData?.totalCarryForwardBalance} />
          <StatCard title="Comp Off Balance" value={adminData?.totalCompOffBalance} />
        </div>

        {/* Leave Type Table */}
        <div>
          <h2 className="text-xl font-semibold mt-6">Leave Type Breakdown</h2>
          <table className="w-full mt-3 border">
            <thead>
              <tr className="bg-gray-100">
                <th>Type</th>
                <th>Allocated</th>
                <th>Used</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {adminData?.leaveTypeUsage?.map((leave: any, index: number) => (
                <tr key={index}>
                  <td>{leave.leaveType}</td>
                  <td>{leave.totalAllocated}</td>
                  <td>{leave.totalUsed}</td>
                  <td>{leave.totalBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
        return <DashboardView onNavigate={setActiveTab} />;

      case "Reports":
        // if (userRole === ROLES.ADMIN) return <LeaveReportDashboard />;
        if (userRole === ROLES.MANAGER) return <ManagerDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return null;

      // HR sees HREmployeesPage, Admin sees EmployeesView
      case "All Employees":
        if (userRole === ROLES.HR) return <HREmployeesPage />;
        return <EmployeesView />;

      // HR Low Balance — real API via useHRDashboard
      case "LowBalance Employee":
        return <LowBalancePageWrapper />;

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
        return <TeamMembersView />;

      case "Profile":
        if (userRole === ROLES.MANAGER) return <ManagerProfile />;
        return <EmployeeProfile />;

      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  /* ---------------- STRICT PASSWORD LOCK ---------------- */
  if (mustChangePassword) {
    return <ChangePasswordDialog />;
  }

  /* ---------------- STRICT PASSWORD LOCK ---------------- */
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
// ─── LowBalance Wrapper — fetches real API ────────────────────────
// Separate component so it has its own loading state
import { useEffect as useEff, useState as useSt } from "react";
import { hrDashboardService } from "../views/hr/service/hrDashboardService";
import type { LowBalanceEmployee } from "../views/hr/types";
import StatCard from "../components/StatCard";

function LowBalancePageWrapper() {
  const [data, setData] = useSt<LowBalanceEmployee[]>([]);
  const [loading, setLoading] = useSt(true);
  const [error, setError] = useSt<string | null>(null);

  useEff(() => {
    const controller = new AbortController();
    hrDashboardService.getLowBalanceEmployees(controller.signal)
      .then((res) => { setData(res); setLoading(false); })
      .catch((err) => {
        if (err instanceof Error && err.name === 'CanceledError') return;
        setError(err instanceof Error ? err.message : 'Failed to load');
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return <LowBalanceTable data={data} loading={loading} error={error} />;
}