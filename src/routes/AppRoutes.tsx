
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../features/auth/pages/AuthPage";
import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

interface AppRoutesProps {
  isAuthenticated: boolean;
  userRole: string | null;
  onLogin: (role: string) => void;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ 
  isAuthenticated, 
  userRole, 
  onLogin, 
  onLogout 
}) => {
  return (
    <Routes>
      {/* Public Route: Auth Page (Login/Register) */}
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <AuthPage onLogin={onLogin} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />

      {/* Protected Routes: Dashboard */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route 
          path="/dashboard/*" 
          element={<DashboardLayout role={userRole} onLogout={onLogout} />} 
        />
      </Route>

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;