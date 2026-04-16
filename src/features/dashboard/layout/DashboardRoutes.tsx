import { Navigate, Route, Routes } from "react-router-dom";
import OnboardingPendingPage from "@/features/leave/pages/AccessApprovalsPage";
import FlashNewsForm from "@/features/notification/pages/FlashNewsCreate";

/* COMMON */
import TeamCalendarView from "@/features/attendance/pages/TeamCalendarView";
// import AdminDashboardView from "@/features/dashboard/admin/pages/AdminDashboardView";
// import { HRDashboard } from "@/features/dashboard/hr/pages/HRDashboard";
import ManagerDashboardView from "@/features/dashboard/manager/pages/ManagerDashboardView";
import RequestCenter from "@/features/employee/components/RequestCenter";
// import EmployeesView from "@/features/employee/pages/admin/EmployeesView";
import { HRVerificationPage } from "@/features/employee/pages/hr/Hrverificationpage";
import DashboardView from "@/features/employee/pages/self/DashboardView";
import EmployeeProfile from "@/features/employee/pages/self/EmployeeProfile";
import TeamMembersView from "@/features/employee/pages/TeamMembersView";
import LowBalancePage from "@/features/leave/pages/LowBalancePage";
import MyRequestsView from "@/features/leave/pages/MyLeavesView";
import PendingApprovalsView from "@/features/leave/pages/PendingApprovalsView";
import NotificationsView from "@/features/notification/pages/NotificationsView";
import PayrollView from "@/features/payroll/pages/PayrollPage";
import { useAuth } from "@/shared/auth/useAuth";
import EmployeesView from "@/features/employee/pages/admin/EmployeesView";
// import { CFOEmployeesPage } from "@/features/payroll/pages/Cfoemployeepage";

const DashboardRoutes = () => {

  const { user } = useAuth();
  const role = user?.role;

  const renderDashboard = () => {
    switch (role) {
      case "EMPLOYEE":
          return <DashboardView />;
      case "ADMIN":
          return <DashboardView />;
      default:
        return <ManagerDashboardView />;
    }
  };
  const renderEmployees = () => {
    switch (role) { 
      default:
        return <EmployeesView/>;  
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



      {/* MANAGER */}
      <Route path="team" element={<TeamMembersView />} />
      <Route path="action-center" element={<PendingApprovalsView />} />
      <Route path="calendar" element={<TeamCalendarView />} />

      {/* HR */}
      <Route path="employees" element={renderEmployees()} />
      <Route path="low-balance" element={<LowBalancePage />} />
      <Route path="verifications" element={<HRVerificationPage />} />

      {/* ADMIN */}
      <Route path="onboarding" element={<OnboardingPendingPage />} />
      <Route path="flash-news" element={<FlashNewsForm />} />

      {/* PAYROLL */}
      <Route path="payslip" element={<PayrollView />} />

      {/*CFO*/}
      {/* <Route path="payroll" element={<PayslipPage />} /> */}

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="dashboard" />} />

    </Routes>
  );
};

export default DashboardRoutes;