import type { UserRole } from "@/shared/auth/authTypes";
import { useAuth } from "@/shared/auth/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}
const roleRedirectMap: Record<UserRole, string> = {
  EMPLOYEE: "/employee/dashboard",
  MANAGER: "/manager/dashboard",
  TEAM_LEADER: "/manager/dashboard",
  HR: "/hr/dashboard",
  ADMIN: "/admin/dashboard",
  CFO: "/admin/dashboard",
  CEO: "/admin/dashboard"
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {


  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role) {
    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
      return <Navigate to={roleRedirectMap[user.role]} replace />;

    }

    if (!hasAccess) {
      return (
        <div className="flex h-screen items-center justify-center">
          🚫 You don't have permission to view this page
        </div>
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;