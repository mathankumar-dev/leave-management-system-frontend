// src/features/skillset/layout/SkillsetLayout.tsx
// Standalone full-page layout for the SkillSet module.
// Lives at /employee/skillset, /manager/skillset, etc.
// Has its own header — NOT nested inside the Leave/Payroll dashboard.

import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/auth/useAuth";

const HIGHER_ROLES = ["MANAGER", "TEAM_LEADER", "HR", "ADMIN", "CTO", "COO", "CFO", "CEO"];
const ADMIN_ROLES  = ["HR", "ADMIN", "CTO", "CEO", "CFO"];

const SkillsetLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isHigher = HIGHER_ROLES.includes(user?.role ?? "");
  const isAdmin  = ADMIN_ROLES.includes(user?.role ?? "");

  const employeeTabs = [
    { label: "🏠 Home",        path: "home" },
    { label: "🛠 My Skills",   path: "my-skills" },
    { label: "📚 My Courses",  path: "my-courses" },
    { label: "🏆 Badges",      path: "badges" },
    { label: "📈 Progression", path: "progression" },
  ];

  const managerTabs = [
    { label: "👥 Team Skills",    path: "team-skills" },
    { label: "⚙️ Manage Courses", path: "manage-courses" },
    { label: "📊 Team Learning",  path: "team-learning" },
  ];

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: "#f0f2f6",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 border-b border-slate-200"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Brand row */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/portal")}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold transition-colors flex items-center gap-1"
              >
                ← Portal
              </button>
              <div
                className="w-px h-5 bg-slate-200"
              />
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg"
                  style={{ background: "linear-gradient(135deg, #001d3d, #2977d0)" }}
                >
                  🎓
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    WeHRM
                  </p>
                  <h1 className="text-base font-black text-slate-800 leading-none">
                    SkillSet
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  {user?.role}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin/badge-config")}
                  className="px-3 py-1.5 rounded-xl text-xs font-black text-white hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #001d3d, #2977d0)" }}
                >
                  ⚙ Config
                </button>
              )}
            </div>
          </div>

          {/* Tab nav row */}
          <div className="flex items-end gap-1 overflow-x-auto pb-0">
            {/* Employee tabs */}
            {employeeTabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}

            {/* Divider between employee / manager tabs */}
            {isHigher && (
              <div className="w-px h-5 bg-slate-200 mx-2 self-center flex-shrink-0" />
            )}

            {/* Manager tabs */}
            {isHigher &&
              managerTabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                      isActive
                        ? "border-purple-600 text-purple-700"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
          </div>
        </div>
      </div>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SkillsetLayout;