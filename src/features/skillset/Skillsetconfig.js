// ─────────────────────────────────────────────
//  WeHRM SkillSet — Master Configuration
//  All badges, thresholds, and module settings
//  are defined here. Backend admin can later
//  expose these via a /config API endpoint.
// ─────────────────────────────────────────────

export const BADGE_CONFIG = [
  {
    id: "beginner",
    label: "Beginner",
    icon: "🌱",
    color: "#22c55e",
    colorBg: "#dcfce7",
    coursesRequired: 1,
    quizzesRequired: 1,
    minAvgScore: 0,
    description: "Complete your first course and quiz",
  },
  {
    id: "learner",
    label: "Learner",
    icon: "📚",
    color: "#3b82f6",
    colorBg: "#dbeafe",
    coursesRequired: 3,
    quizzesRequired: 3,
    minAvgScore: 50,
    description: "Complete 3 courses with passing scores",
  },
  {
    id: "skilled",
    label: "Skilled",
    icon: "⚡",
    color: "#f59e0b",
    colorBg: "#fef3c7",
    coursesRequired: 5,
    quizzesRequired: 5,
    minAvgScore: 65,
    description: "Complete 5 courses with avg score ≥ 65%",
  },
  {
    id: "proficient",
    label: "Proficient",
    icon: "🎯",
    color: "#8b5cf6",
    colorBg: "#ede9fe",
    coursesRequired: 8,
    quizzesRequired: 8,
    minAvgScore: 75,
    description: "Complete 8 courses with avg score ≥ 75%",
  },
  {
    id: "expert",
    label: "Expert",
    icon: "🏆",
    color: "#ef4444",
    colorBg: "#fee2e2",
    coursesRequired: 12,
    quizzesRequired: 12,
    minAvgScore: 85,
    description: "Complete 12 courses with avg score ≥ 85%",
  },
  {
    id: "master",
    label: "Master",
    icon: "👑",
    color: "#0ea5e9",
    colorBg: "#e0f2fe",
    coursesRequired: 20,
    quizzesRequired: 20,
    minAvgScore: 90,
    description: "Complete 20 courses with avg score ≥ 90%",
  },
];

export const SKILLSET_MODULE_CONFIG = {
  allowSelfEnroll: true,          // Employees can self-enroll in courses
  allowQuizRetakes: true,         // Can retake quizzes
  maxQuizRetakes: 3,              // Max retake attempts
  showScoresToEmployee: true,     // Employee can see their own scores
  managerCanAssignCourses: true,  // Managers can assign courses to reports
  managerCanEnterOfflineMarks: true, // Managers can key in offline test marks
  notifyOnAssignment: true,       // Email/notification when course assigned
  notifyOnCompletion: true,       // Email/notification when course completed
  progressVisibleToManager: true, // Manager can view team progress
  progressVisibleToHR: true,      // HR can view all employee progress
};

// ── Helper: compute an employee's current badge ──────────────────────────────
export function computeBadge(stats) {
  // stats = { completedCourses, completedQuizzes, avgScore }
  const earned = BADGE_CONFIG.filter(
    (b) =>
      stats.completedCourses >= b.coursesRequired &&
      stats.completedQuizzes >= b.quizzesRequired &&
      stats.avgScore >= b.minAvgScore
  );
  return earned.length > 0 ? earned[earned.length - 1] : null;
}

// ── Helper: what's the next badge and how far along? ─────────────────────────
export function nextBadgeProgress(stats) {
  const current = computeBadge(stats);
  const currentIdx = current
    ? BADGE_CONFIG.findIndex((b) => b.id === current.id)
    : -1;
  const next = BADGE_CONFIG[currentIdx + 1] || null;
  if (!next) return { next: null, percent: 100 };

  const coursesPct = Math.min(
    (stats.completedCourses / next.coursesRequired) * 100,
    100
  );
  const quizPct = Math.min(
    (stats.completedQuizzes / next.quizzesRequired) * 100,
    100
  );
  const scorePct = next.minAvgScore > 0
    ? Math.min((stats.avgScore / next.minAvgScore) * 100, 100)
    : 100;

  return {
    next,
    percent: Math.round((coursesPct + quizPct + scorePct) / 3),
    coursesNeeded: Math.max(0, next.coursesRequired - stats.completedCourses),
    quizzesNeeded: Math.max(0, next.quizzesRequired - stats.completedQuizzes),
    scoreNeeded: Math.max(0, next.minAvgScore - stats.avgScore),
  };
}