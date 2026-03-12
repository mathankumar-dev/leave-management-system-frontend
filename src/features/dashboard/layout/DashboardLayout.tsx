import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { dashboardService } from "../services/dashboardService";
// import PayrollView from "../views/PayrollView";

/* ---------------- ADMIN VIEWS ---------------- */
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";

/* ---------------- HR VIEWS ---------------- */
import { HRDashboard } from "../views/hr/pages/HRDashboard";
import { HREmployeesPage } from "../views/hr/pages/HREmployeesPage";
import LowBalancePage from "../views/hr/pages/LowBalancePage";
import { PayslipPage } from "../views/hr/pages/PayslipPage";

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
import TeamMembersView from "../views/manager/TeamMembersView";

/* ---------------- MODALS ---------------- */
import ChangePasswordDialog from "../../../components/modals/ChangePasswordDialog";
import ODRequestForm from "../../../common/OtherRequestForm";
import OtherRequestForm from "../../../common/OtherRequestForm";
import PayrollView from "../views/Payroll";

/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  TEAMLEADER : "TEAM_LEADER"
};

/* ---------------- SIMPLE STAT CARD ---------------- */
const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold">{value ?? 0}</p>
  </div>
);

const DashboardLayout: React.FC = () => {
  const { user, logout, mustChangePassword } = useAuth();
  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
const navigate = useNavigate();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [adminData, setAdminData] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  /* ---------------- SCROLL RESET ---------------- */
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0 });
    }
  }, [activeTab]);


//   useEffect(() => {

//   const checkProfile = async () => {

//     try {

//       const profile = await dashboardService.getProfile(user.id);

//       if (!profile.personalDetailsComplete) {
//         navigate("/complete-profile");
//         return;
//       }

//       setCheckingProfile(false);

//     } catch (error) {

//       console.error("Profile verification failed", error);
//       setCheckingProfile(false);

//     }

//   };

//   checkProfile();

// }, []);

  /* ---------------- ADMIN DASHBOARD FETCH ---------------- */
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

              <div>
                <h2 className="text-xl font-semibold mt-6">Leave Type Breakdown</h2>

                <table className="w-full mt-3 border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Type</th>
                      <th className="p-2">Allocated</th>
                      <th className="p-2">Used</th>
                      <th className="p-2">Balance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {adminData?.leaveTypeUsage?.map((leave: any, index: number) => (
                      <tr key={index}>
                        <td className="p-2">{leave.leaveType}</td>
                        <td className="p-2">{leave.totalAllocated}</td>
                        <td className="p-2">{leave.totalUsed}</td>
                        <td className="p-2">{leave.totalBalance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER)
          return <ManagerDashboardView onNavigate={setActiveTab} />;

        if (userRole === ROLES.HR) return <HRDashboard />;

        return <DashboardView onNavigate={setActiveTab} />;

      case "Reports":
         if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER)
          return <ManagerDashboardView onNavigate={setActiveTab} />;
        if (userRole === ROLES.HR) return <HRDashboard />;
        return null;

      case "All Employees":
        if (userRole === ROLES.HR) return <HREmployeesPage />;
        return <EmployeesView />;

      case "Payslip":
        if (userRole === ROLES.HR) return <PayslipPage />;

      case "LowBalance Employee":
        return <LowBalancePage />;

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

        case "Payroll":
  return <PayrollView />;

      case "Pending Approvals":
        return <PendingApprovalsView />;

      case "Notifications":
        return <NotificationsView />;

      case "Team Members":
        return <TeamMembersView />;

      case "Profile":
         if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER) return <ManagerProfile />;
        return <EmployeeProfile />;
      case "Other Applications":
        return <OtherRequestForm />;

      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  if (checkingProfile) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
          <div className="max-w-400 mx-auto w-full">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;