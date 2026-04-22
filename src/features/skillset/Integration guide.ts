/**
 * ═══════════════════════════════════════════════════════════════
 *  INTEGRATION GUIDE — Read this before copying files
 * ═══════════════════════════════════════════════════════════════
 *
 * STEP 1 — File placement
 * ─────────────────────────────────────────────────────────────
 * Copy each file to the path shown below (relative to /src):
 *
 *  AppRoutes.tsx
 *    → src/app/routes/AppRoutes.tsx   (REPLACE existing file)
 *
 *  LaunchPage.tsx
 *    → src/features/launchpage/LaunchPage.tsx   (REPLACE existing)
 *
 *  SkillsetLayout.tsx
 *    → src/features/skillset/layout/SkillsetLayout.tsx
 *
 *  (from previous session — already delivered)
 *  MyCourses.tsx        → src/features/skillset/pages/MyCourses.tsx
 *  ManageCourses.tsx    → src/features/skillset/pages/ManageCourses.tsx
 *  TeamLearningProgress.tsx → src/features/skillset/pages/TeamLearningProgress.tsx
 *  BadgeMasterConfig.tsx    → src/features/skillset/pages/BadgeMasterConfig.tsx
 *  SkillsetLaunchSection.tsx → src/features/skillset/components/SkillsetLaunchSection.tsx
 *  learningService.ts   → src/features/skillset/learningService.ts
 *             (or src/features/learning/learningService.ts — match your import paths)
 *
 * ─────────────────────────────────────────────────────────────
 * STEP 2 — DashboardLayout MUST render <Outlet />
 * ─────────────────────────────────────────────────────────────
 * Your DashboardLayout.tsx needs to include <Outlet /> so that
 * nested routes like /employee/skillset/home actually render.
 *
 * Check your existing DashboardLayout.tsx — look for <Outlet />.
 * If it's already there, you're good.
 * If NOT, add it inside the main content area, e.g.:
 *
 *   import { Outlet } from "react-router-dom";
 *
 *   // inside your layout JSX, wherever page content goes:
 *   <main className="...">
 *     <Outlet />
 *   </main>
 *
 * ─────────────────────────────────────────────────────────────
 * STEP 3 — Add Skillset link to your sidebar/nav
 * ─────────────────────────────────────────────────────────────
 * In your dashboard sidebar nav config (wherever you define
 * the sidebar links), add a Skillset entry:
 *
 *   {
 *     label: "Skillset",
 *     path:  "skillset",     // relative — resolves to /employee/skillset
 *     icon:  <YourIcon />,
 *   }
 *
 * This makes the Skillset tab visible in the dashboard sidebar.
 * The SkillsetLayout then handles the sub-tabs (Home, My Skills, etc.)
 *
 * ─────────────────────────────────────────────────────────────
 * STEP 4 — vite.config.ts proxy (already done in prev session)
 * ─────────────────────────────────────────────────────────────
 * Make sure your vite.config.ts has:
 *
 *   server: {
 *     proxy: {
 *       '/api': {
 *         target: 'http://localhost:8111',
 *         changeOrigin: true,
 *         secure: false,
 *       }
 *     }
 *   }
 *
 * ─────────────────────────────────────────────────────────────
 * STEP 5 — URL structure after integration
 * ─────────────────────────────────────────────────────────────
 *  EMPLOYEE role:
 *    /employee/skillset/home
 *    /employee/skillset/my-skills
 *    /employee/skillset/my-courses
 *    /employee/skillset/badges
 *    /employee/skillset/progression
 *
 *  MANAGER / higher roles (all the above PLUS):
 *    /manager/skillset/team-skills
 *    /manager/skillset/manage-courses
 *    /manager/skillset/team-learning
 *
 *  Admin badge config (HR / ADMIN / CTO / CEO / CFO):
 *    /admin/badge-config
 *    /hr/badge-config
 *
 * ─────────────────────────────────────────────────────────────
 * STEP 6 — Import paths to verify
 * ─────────────────────────────────────────────────────────────
 * learningService is imported in MyCourses, ManageCourses,
 * TeamLearningProgress, BadgeMasterConfig, and SkillsetLaunchSection.
 *
 * All of them use:
 *   import { learningService } from "@/features/learning/learningService";
 *
 * If you placed learningService.ts in @/features/skillset/ instead,
 * do a find-and-replace:
 *   "@/features/learning/learningService"
 *   → "@/features/skillset/learningService"
 *
 * ═══════════════════════════════════════════════════════════════
 */
export {};