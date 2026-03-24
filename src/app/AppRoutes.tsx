import NotFoundPage from "@/app/NotFoundPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import LandingPage from "@/features/landingpage/pages/LandingPage";
import PrivacyPolicy from "@/features/landingpage/pages/PrivacyPolicy";
import TermsOfService from "@/features/landingpage/pages/TermsOfService";
import LaunchPage from "@/features/launchpage/LaunchPage";
import LeavePolicies from "@/features/leave/pages/LeavePolicy";
import { useAuth } from "@/shared/auth/useAuth";
import Loader from "@/shared/components/Loader";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeProfile from "@/features/employee/pages/self/EmployeeProfile";



const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <Routes>

      <Route path="/portal" element={<LaunchPage />} />

      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/portal" replace /> : <LandingPage />
        }
      />

      <Route
        path="/login"
        element={
          !isAuthenticated ? <AuthPage /> : <Navigate to="/portal" replace />
        }
      />

      {/* EMPLOYEE */}
      <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
        <Route path="/employee/*" element={<DashboardLayout />} />
      </Route>

      {/* MANAGER */}
      <Route element={<ProtectedRoute allowedRoles={["MANAGER", "TEAM_LEADER"]} />}>
        <Route path="/manager/*" element={<DashboardLayout />} />
      </Route>

      {/* HR */}
      <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
        <Route path="/hr/*" element={<DashboardLayout />} />
      </Route>

      {/* ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin/*" element={<DashboardLayout />} />
      </Route>

      {/* COMMON */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/leave-policy" element={<LeavePolicies />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/profile" element={<EmployeeProfile />} />

      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default AppRoutes;