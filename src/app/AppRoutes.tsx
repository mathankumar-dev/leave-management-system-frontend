import LeavePolicies from "@/features/leave/pages/LeavePolicy";
import NotFoundPage from "@/app/NotFoundPage";
import PrivacyPolicy from "@/features/landing/pages/PrivacyPolicy";
import TermsOfService from "@/features/landing/pages/TermsOfService";
import { useAuth } from "@/shared/auth/useAuth";
import AuthPage from "@/features/auth/pages/AuthPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import LandingPage from "@/features/landing/pages/LandingPage";
import LaunchPage from "@/features/lauchpage/LaunchPage";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "@/shared/components/Loader";



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
          !isAuthenticated ? (
            <AuthPage />
          ) : (
            <Navigate to="/portal" replace />
          )
        }
      />

      {/* 3. Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/leave-policy" element={<LeavePolicies />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;