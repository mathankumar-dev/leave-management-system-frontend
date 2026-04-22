// ─────────────────────────────────────────────────────────────────────────────
//  src/features/skillset/skillsetService.ts
//  Central API layer for the SkillSet module.
//  All methods call real backend endpoints; swap the mocked ones as your
//  friend builds them out.
// ─────────────────────────────────────────────────────────────────────────────
import api from "@/services/apiClient";

// ── Payload types ─────────────────────────────────────────────────────────────
export interface SkillPayload {
  skillName: string;
  category: "TECHNICAL" | "TOOLS" | "INTERPERSONAL";
  rating: number;
  learnedAt?: string;
  appliedAt?: string;
  dateLearned?: string;
  certDate?: string;
}

export interface AssignCoursePayload {
  courseId: number;
  employeeIds: number[];
  dueDate?: string;
}

export interface QuizSubmitPayload {
  courseId: number;
  score: number;
  answers: Record<string, number>;
}

export interface OfflineScorePayload {
  empId: number;
  courseId: number;
  score: number;
}

export interface BadgeConfig {
  badges: BadgeDef[];
  settings: ModuleSettings;
}

export interface BadgeDef {
  id: string;
  icon: string;
  label: string;
  color: string;
  colorBg: string;
  skillsRequired: number;
  coursesRequired?: number;
  quizzesRequired?: number;
  minAvgScore?: number;
  description: string;
  category: "tech_tool" | "interpersonal" | "learning";
}

export interface ModuleSettings {
  allowSelfEnroll: boolean;
  allowQuizRetakes: boolean;
  maxQuizRetakes: number;
  showScoresToEmployee: boolean;
  managerCanAssignCourses: boolean;
  managerCanEnterOfflineMarks: boolean;
  notifyOnAssignment: boolean;
  notifyOnCompletion: boolean;
  progressVisibleToManager: boolean;
  progressVisibleToHR: boolean;
}

// ── Helper: multipart form ────────────────────────────────────────────────────
function buildFormData(payload: SkillPayload, file?: File): FormData {
  const fd = new FormData();
  fd.append("dto", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  if (file) fd.append("proofFile", file);
  return fd;
}

// ─────────────────────────────────────────────────────────────────────────────
//  skillsetService
// ─────────────────────────────────────────────────────────────────────────────
export const skillsetService = {

  // ── EMPLOYEE — SKILLS ────────────────────────────────────────────────────

  getMySkills: () =>
    api.get("/api/skillset/my-skills"),

  addSkill: (payload: SkillPayload, file?: File) =>
    api.post("/api/skillset/skills", buildFormData(payload, file), {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateSkill: (id: number, payload: SkillPayload, file?: File) =>
    api.put(`/api/skillset/skills/${id}`, buildFormData(payload, file), {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteSkill: (id: number) =>
    api.delete(`/api/skillset/skills/${id}`),

  getSkillFile: (id: number) =>
    api.get(`/api/skillset/skills/${id}/file`, { responseType: "blob" }),

  // ── EMPLOYEE — BADGES ────────────────────────────────────────────────────

  /** Returns { techToolCombined, interpersonalCount, earnedBadges[] } */
  getMyBadges: () =>
    api.get("/api/skillset/badges/my"),

  // ── EMPLOYEE — COURSES ───────────────────────────────────────────────────

  getMyCourses: () =>
    api.get("/api/skillset/courses/my"),

  getCourseCatalog: () =>
    api.get("/api/skillset/courses/catalog"),

  enrollCourse: (courseId: number) =>
    api.post(`/api/skillset/courses/${courseId}/enroll`),

  // ── EMPLOYEE — QUIZ ──────────────────────────────────────────────────────

  getQuiz: (courseId: number) =>
    api.get(`/api/skillset/courses/${courseId}/quiz`),

  submitQuiz: (payload: QuizSubmitPayload) =>
    api.post("/api/skillset/quiz/submit", payload),

  // ── MANAGER — TEAM SKILLS ────────────────────────────────────────────────

  getTeamSkills: () =>
    api.get("/api/skillset/manager/team-skills"),

  getEmployeeSkills: (empId: number) =>
    api.get(`/api/skillset/manager/team-skills/${empId}`),

  // ── MANAGER — COURSES ────────────────────────────────────────────────────

  createCourse: (payload: any) =>
    api.post("/api/skillset/courses", payload),

  updateCourse: (id: number, payload: any) =>
    api.put(`/api/skillset/courses/${id}`, payload),

  deleteCourse: (id: number) =>
    api.delete(`/api/skillset/courses/${id}`),

  assignCourse: (payload: AssignCoursePayload) =>
    api.post("/api/skillset/courses/assign", payload),

  // ── MANAGER — LEARNING PROGRESS ─────────────────────────────────────────

  getTeamLearningProgress: () =>
    api.get("/api/skillset/manager/team-learning"),

  getEmployeeLearningProgress: (empId: number) =>
    api.get(`/api/skillset/manager/team-learning/${empId}`),

  submitOfflineScore: (payload: OfflineScorePayload) =>
    api.patch("/api/skillset/scores/offline", payload),

  // ── ADMIN / HR — BADGE MASTER CONFIG ────────────────────────────────────

  getBadgeConfig: () =>
    api.get("/api/skillset/admin/badge-config"),

  saveBadgeConfig: (payload: BadgeConfig) =>
    api.put("/api/skillset/admin/badge-config", payload),
};

export default skillsetService;