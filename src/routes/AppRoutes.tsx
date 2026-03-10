
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth"; 
import AuthPage from "../features/auth/pages/AuthPage";
import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import NotFoundPage from "../components/pages/NotFoundPage";
import HeroPage from "../features/hero/HeroPage";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* 2. Hero Page as the Landing Site */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <HeroPage />
        } 
      />

      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <AuthPage />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      {/* 3. Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;