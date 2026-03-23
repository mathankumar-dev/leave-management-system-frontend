import { Routes, Route, Navigate } from "react-router-dom";


import OnboardingPendingPage from "@/features/leave/pages/AccessApprovalsPage";
import FlashNewsForm from "@/features/notification/pages/FlashNewsCreate";

/* COMMON */
import NotificationsView from "@/features/notification/pages/NotificationsView";
import RequestCenter from "@/features/employee/components/RequestCenter";
import PayrollView from "@/features/payroll/pages/PayrollPage";
import { PayslipPage } from "@/features/payroll/pages/PayslipPage";
import TeamCalendarView from "@/features/attendance/pages/TeamCalendarView";
import AdminDashboardView from "@/features/dashboard/admin/pages/AdminDashboardView";
import { HRDashboard } from "@/features/dashboard/hr/pages/HRDashboard";
import ManagerDashboardView from "@/features/dashboard/manager/pages/ManagerDashboardView";
import EmployeesView from "@/features/employee/pages/admin/EmployeesView";
import { HREmployeesPage } from "@/features/employee/pages/hr/HREmployeesPage";
import { HRVerificationPage } from "@/features/employee/pages/hr/Hrverificationpage";
import CalendarView from "@/features/employee/pages/self/CalendarView";
import DashboardView from "@/features/employee/pages/self/DashboardView";
import EmployeeProfile from "@/features/employee/pages/self/EmployeeProfile";
import TeamMembersView from "@/features/employee/pages/TeamMembersView";
import LowBalancePage from "@/features/leave/pages/LowBalancePage";
import MyRequestsView from "@/features/leave/pages/MyLeavesView";
import PendingApprovalsView from "@/features/leave/pages/PendingApprovalsView";

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* EMPLOYEE */}
      <Route path="employee/dashboard" element={<DashboardView />} />
      <Route path="employee/calendar" element={<CalendarView />} />
      <Route path="employee/requests" element={<MyRequestsView />} />
      <Route path="employee/profile" element={<EmployeeProfile />} />

      {/* MANAGER */}
      <Route path="manager/dashboard" element={<ManagerDashboardView />} />
      <Route path="manager/team" element={<TeamMembersView />} />
      <Route path="manager/approvals" element={<PendingApprovalsView />} />
      <Route path="manager/calendar" element={<TeamCalendarView />} />

      {/* HR */}
      <Route path="hr/dashboard" element={<HRDashboard />} />
      <Route path="hr/employees" element={<HREmployeesPage />} />
      <Route path="hr/low-balance" element={<LowBalancePage />} />
      <Route path="hr/verifications" element={<HRVerificationPage />} />

      {/* ADMIN */}
      <Route path="admin/dashboard" element={<AdminDashboardView />} />
      <Route path="admin/employees" element={<EmployeesView />} />
      <Route path="admin/onboarding" element={<OnboardingPendingPage />} />
      <Route path="admin/flash-news" element={<FlashNewsForm />} />

      {/* COMMON */}
      <Route path="notifications" element={<NotificationsView />} />
      <Route path="requests" element={<RequestCenter />} />
      <Route path="payroll" element={<PayrollView />} />
      <Route path="payslip" element={<PayslipPage />} />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="employee/dashboard" />} />
    </Routes>
  );
};

export default DashboardRoutes;