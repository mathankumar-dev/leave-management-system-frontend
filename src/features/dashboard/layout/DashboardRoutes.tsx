import { Navigate, Route, Routes } from "react-router-dom";


import OnboardingPendingPage from "@/features/leave/pages/AccessApprovalsPage";
import FlashNewsForm from "@/features/notification/pages/FlashNewsCreate";

/* COMMON */
import TeamCalendarView from "@/features/attendance/pages/TeamCalendarView";
import AdminDashboardView from "@/features/dashboard/admin/pages/AdminDashboardView";
import { HRDashboard } from "@/features/dashboard/hr/pages/HRDashboard";
import ManagerDashboardView from "@/features/dashboard/manager/pages/ManagerDashboardView";
import RequestCenter from "@/features/employee/components/RequestCenter";
import { HREmployeesPage } from "@/features/employee/pages/hr/HREmployeesPage";
import { HRVerificationPage } from "@/features/employee/pages/hr/Hrverificationpage";
import CalendarView from "@/features/employee/pages/self/CalendarView";
import DashboardView from "@/features/employee/pages/self/DashboardView";
import EmployeeProfile from "@/features/employee/pages/self/EmployeeProfile";
import TeamMembersView from "@/features/employee/pages/TeamMembersView";
import LowBalancePage from "@/features/leave/pages/LowBalancePage";
import MyRequestsView from "@/features/leave/pages/MyLeavesView";
import PendingApprovalsView from "@/features/leave/pages/PendingApprovalsView";
import NotificationsView from "@/features/notification/pages/NotificationsView";
import PayrollView from "@/features/payroll/pages/PayrollPage";
import { PayslipPage } from "@/features/payroll/pages/PayslipPage";
import { useAuth } from "@/shared/auth/useAuth";

const DashboardRoutes = () => {

  const { user } = useAuth();
  const role = user?.role;

  const renderDashboard = () => {
    switch (role) {
      case "ADMIN":
        return <AdminDashboardView />;
      case "HR":
        return <HRDashboard />;
      case "MANAGER":
      case "TEAM_LEADER":
        return <ManagerDashboardView />;
      default:
        return <DashboardView />;
    }
  };
  return (
    <Routes>
      {/* DASHBOARD */}
      <Route path="dashboard" element={renderDashboard()} />
      {/* COMMON */}
      <Route path="notifications" element={<NotificationsView />} />
      <Route path="requests" element={<MyRequestsView />} />
      <Route path="profile" element={<EmployeeProfile />} />
      <Route path="request-center" element={<RequestCenter />} />

      {/* CALENDAR */}
      <Route path="calendar" element={<CalendarView />} />

      {/* MANAGER */}
      <Route path="team" element={<TeamMembersView />} />
      <Route path="approvals" element={<PendingApprovalsView />} />
      <Route path="team-calendar" element={<TeamCalendarView />} />

      {/* HR */}
      <Route path="employees" element={<HREmployeesPage />} />
      <Route path="low-balance" element={<LowBalancePage />} />
      <Route path="verifications" element={<HRVerificationPage />} />

      {/* ADMIN */}
      <Route path="onboarding" element={<OnboardingPendingPage />} />
      <Route path="flash-news" element={<FlashNewsForm />} />

      {/* PAYROLL */}
      <Route path="payslip" element={<PayrollView />} />
      <Route path="payroll" element={<PayslipPage />} />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="dashboard" />} />

    </Routes>
  );
};

export default DashboardRoutes;