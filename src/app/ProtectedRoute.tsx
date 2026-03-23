import type { UserRole } from "@/shared/auth/authTypes";
import { useAuth } from "@/shared/auth/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}
  const roleRedirectMap : Record<UserRole, string> = {
    EMPLOYEE: "/dashboard/employee/dashboard",
    MANAGER: "/dashboard/manager/dashboard",
    TEAM_LEADER: "/dashboard/manager/dashboard",
    HR: "/dashboard/hr/dashboard",
    ADMIN: "/dashboard/admin/dashboard",
    CFO: "",
    CEO: ""
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
  }

  return <Outlet />;
};

export default ProtectedRoute;