import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";

/* ---------------- ADMIN VIEWS ---------------- */
import EmployeesView from "../views/admin/EmployeesView";
import LeaveTypesView from "../views/admin/LeaveTypesView";

/* ---------------- HR VIEWS ---------------- */
import { HRDashboard } from "../views/hr/pages/HRDashboard";
import { HREmployeesPage } from "../views/hr/pages/HREmployeesPage";
import LowBalancePage from "../views/hr/pages/LowBalancePage";

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
import OtherRequestForm from "../../../common/OtherRequestForm";
import PayrollView from "../views/Payroll";
import PersonalDetailsModal from "../../../common/PersonalDetailsModal";
import { PayslipPage } from "../views/hr/pages/PayslipPage";
import RequestCenter from "../../../common/RequestCenter";

/* ---------------- ROLE CONSTANTS ---------------- */
const ROLES = {
  ADMIN: "ADMIN",
  HR: "HR",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  TEAMLEADER: "TEAM_LEADER"
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold">{value ?? 0}</p>
  </div>
);

const DashboardLayout: React.FC = () => {

  const { user, logout, mustChangePassword, personalDetailsComplete } = useAuth();

  const userRole = user?.role;

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [adminData, setAdminData] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ---------------- SCROLL RESET ---------------- */
  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  /* ---------------- PROFILE CHECK ---------------- */
  useEffect(() => {
    if (!user) return;

    if (!personalDetailsComplete) {
      navigate("/complete-profile");
      return;
    }

    setCheckingProfile(false);
  }, [user, personalDetailsComplete, navigate]);

  /* ---------------- ADMIN DASHBOARD FETCH ---------------- */
  useEffect(() => {

    if (userRole !== ROLES.ADMIN || !user?.id) return;

    const fetchAdminDashboard = async () => {
      try {

        setAdminLoading(true);

        const res = await api.get(`/dashboard/admin/${user.id}`);

        setAdminData(res.data);

      } catch (error) {

        console.error(error);
        setAdminError("Failed to load admin dashboard");

      } finally {
        setAdminLoading(false);
      }
    };

    fetchAdminDashboard();

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

        if (userRole === ROLES.MANAGER)
          return <ManagerDashboardView onNavigate={setActiveTab} />;

        if (userRole === ROLES.HR)
          return <HRDashboard />;

        return <DashboardView onNavigate={setActiveTab} />;

      case "All Employees":
        return userRole === ROLES.HR ? <HREmployeesPage /> : <EmployeesView />;

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

      case "Request Center":
        return <RequestCenter />;

      case "My Leaves":
        return <MyLeavesView />;

      case "Payroll":
        return userRole === ROLES.HR ? <PayslipPage /> : <PayrollView />;

      case "Pending Approvals":
        return <PendingApprovalsView />;

      case "Notifications":
        return <NotificationsView />;

      case "Team Members":
        return <TeamMembersView />;

      case "Profile":
        if (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER) return <ManagerProfile />;
        return <EmployeeProfile />;
        return (userRole === ROLES.MANAGER || userRole === ROLES.TEAMLEADER)
          ? <ManagerProfile />
          : <EmployeeProfile />;

      case "Other Approvals":
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

  if (mustChangePassword) return <ChangePasswordDialog />;

  if (!personalDetailsComplete) return <PersonalDetailsModal />;

  return (

    <div className="flex h-screen bg-neutral-25 overflow-hidden">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col md:ml-80 h-full min-w-0">

        <Topbar
          activeTab={activeTab}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={logout}
          setActiveTab={setActiveTab}
        />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
        >
          <div className="max-w-7xl mx-auto w-full">
            {renderView()}
          </div>
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;