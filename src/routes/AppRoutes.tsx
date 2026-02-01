// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth"; // Use your hook
import AuthPage from "../features/auth/pages/AuthPage";
import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Important: Show a loader while checking localStorage on initial boot
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <AuthPage /> // onLogin prop is no longer needed
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />

      {/* Protected Routes: No props needed here either */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;