// src/app/routes/AppRoutes.tsx
// SkillSet is now a STANDALONE module — completely separate from Leave/Payroll.
// URL structure:
//   /employee/skillset/home
//   /manager/skillset/team-skills
//   /admin/badge-config  (HR/Admin only)

import NotFoundPage from "@/app/NotFoundPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import DashboardLayout from "@/features/dashboard/layout/DashboardLayout";
import EmployeeProfile from "@/features/employee/pages/self/EmployeeProfile";
import LandingPage from "@/features/landingpage/pages/LandingPage";
import PrivacyPolicy from "@/features/landingpage/pages/PrivacyPolicy";
import TermsOfService from "@/features/landingpage/pages/TermsOfService";
import LaunchPage from "@/features/launchpage/LaunchPage";
import LeavePolicies from "@/features/leave/pages/LeavePolicy";

// ── SkillSet module ──────────────────────────────────────────────────────────
import SkillsetLayout        from "@/features/skillset/Skillsetlayout";
import SkillsetHome          from "@/features/skillset/SkillsetHome";
import MySkills              from "@/features/skillset/Myskills";
import MyCourses             from "@/features/skillset/Mycourses ";
import Badges                from "@/features/skillset/Badges";
import Progression           from "@/features/skillset/Progression";
import ManagerTeamSkills     from "@/features/skillset/ManagerTeamSkills";
import ManageCourses         from "@/features/skillset/Managecourses";
import TeamLearningProgress  from "@/features/skillset/Teamlearningprogress";
import BadgeMasterConfig     from "@/features/skillset/Badgemasterconfig";

import { useAuth } from "@/shared/auth/useAuth";
import Loader from "@/shared/components/Loader";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const HIGHER_ROLES = ["MANAGER", "TEAM_LEADER", "HR", "ADMIN", "CTO", "COO", "CFO", "CEO"];
const ADMIN_ROLES  = ["HR", "ADMIN", "CTO", "CEO", "CFO"];

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  // ── Reusable skillset sub-route tree ──────────────────────────────────────
  // SkillsetLayout renders its own full-page shell (header + tabs).
  // DashboardLayout does NOT need to wrap this — it's standalone.
  const skillsetRoutes = (
    <Route path="skillset" element={<SkillsetLayout />}>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home"        element={<SkillsetHome />} />
      <Route path="my-skills"   element={<MySkills />} />
      <Route path="my-courses"  element={<MyCourses />} />
      <Route path="badges"      element={<Badges />} />
      <Route path="progression" element={<Progression />} />

      {/* Manager / higher-role only tabs */}
      <Route element={<ProtectedRoute allowedRoles={HIGHER_ROLES} />}>
        <Route path="team-skills"    element={<ManagerTeamSkills />} />
        <Route path="manage-courses" element={<ManageCourses />} />
        <Route path="team-learning"  element={<TeamLearningProgress />} />
      </Route>
    </Route>
  );

  return (
    <Routes>
      {/* ── 1. PROTECTED ROUTES ──────────────────────────────────────────── */}
      <Route element={<ProtectedRoute />}>

        {/* Portal / Launch Page */}
        <Route path="/portal" element={<LaunchPage />} />

        {/* ── EMPLOYEE ─────────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
          {/* Leave & Payroll dashboard (unchanged) */}
          <Route path="/employee/*" element={<DashboardLayout />} />
          {/* SkillSet — standalone, outside DashboardLayout */}
          {skillsetRoutes && (
            <Route path="/employee">
              {skillsetRoutes}
            </Route>
          )}
        </Route>

        {/* ── MANAGER / SENIOR ROLES ───────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["MANAGER", "TEAM_LEADER", "CTO", "COO", "CEO", "CFO"]} />}>
          <Route path="/manager/*" element={<DashboardLayout />} />
          <Route path="/manager">
            {skillsetRoutes}
          </Route>
        </Route>

        {/* ── HR ───────────────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["HR"]} />}>
          <Route path="/hr/*" element={<DashboardLayout />} />
          <Route path="/hr">
            {skillsetRoutes}
          </Route>
        </Route>

        {/* ── ADMIN ────────────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/*" element={<DashboardLayout />} />
          <Route path="/admin">
            {skillsetRoutes}
          </Route>
        </Route>

        {/* ── CFO ──────────────────────────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["CFO"]} />}>
          <Route path="/cfo/*" element={<DashboardLayout />} />
          <Route path="/cfo">
            {skillsetRoutes}
          </Route>
        </Route>

        {/* ── BADGE MASTER CONFIG (HR / Admin only, standalone page) ───── */}
        <Route element={<ProtectedRoute allowedRoles={ADMIN_ROLES} />}>
          <Route path="/admin/badge-config" element={<BadgeMasterConfig />} />
          <Route path="/hr/badge-config"    element={<BadgeMasterConfig />} />
        </Route>

        {/* Profile */}
        <Route path="/profile" element={<EmployeeProfile />} />
      </Route>

      {/* ── 2. PUBLIC ROUTES ─────────────────────────────────────────────── */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/portal" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/portal" replace />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── 3. INFO PAGES ────────────────────────────────────────────────── */}
      <Route path="/privacy-policy"   element={<PrivacyPolicy />} />
      <Route path="/leave-policy"     element={<LeavePolicies />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;