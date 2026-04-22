// src/features/skillset/skillsetService.ts
import api from "@/services/apiClient";

export interface AssignCoursePayload {
  courseId: number;
  employeeIds: number[];
  dueDate?: string;
}

export const skillsetService = {
  // Existing methods (Mocked)
  getMySkills: async () => ({ data: [] }),
  
  // ── Course APIs (Mocked for Frontend Preview) ──────────────────────────

  /** Returns fake course list to populate your UI cards */
  getMyCourses: async () => {
    return {
      data: [
        { 
          id: 1, title: "React Frontend Architecture", category: "Development", 
          duration: "4h", status: "IN_PROGRESS", progressPct: 65,
          description: "Deep dive into Vite, React, and Service layers."
        },
        { 
          id: 2, title: "Spring Boot Security", category: "Backend", 
          duration: "6h", status: "ASSIGNED", progressPct: 0,
          description: "Understanding JWT and Spring Security 6."
        },
        { 
          id: 3, title: "UI/UX with Tailwind", category: "Design", 
          duration: "2h", status: "COMPLETED", progressPct: 100,
          description: "Modern styling techniques."
        }
      ]
    };
  },

  getCourseCatalog: async () => ({
    data: [
      { id: 101, title: "Advanced SQL", category: "Database", duration: "3h" },
      { id: 102, title: "Docker Containerization", category: "DevOps", duration: "5h" }
    ]
  }),

  getQuiz: async (courseId: number) => ({
    data: {
      timeLimit: 15,
      questions: [
        { id: 1, text: "What does Vite use for HMR?", options: ["Webpack", "ESBuild", "Rollup"], correct: 1 }
      ]
    }
  }),

  submitQuiz: async (payload: any) => ({ data: { success: true, score: 90 } }),
  enrollCourse: async (courseId: number) => ({ data: { success: true } }),

  // ── Manager/HR APIs (Mocked) ────────────────────────────────────────

  getTeamLearningProgress: async () => ({
    data: [
      { id: 1, name: "Madhankumar", role: "Developer", coursesCompleted: 5, avgScore: 88 }
    ]
  }),

  // Add dummy functions for the rest so no "is not a function" errors occur
  createCourse: async (p: any) => ({ data: {} }),
  updateCourse: async (id: number, p: any) => ({ data: {} }),
  deleteCourse: async (id: number) => ({ data: {} }),
  assignCourse: async (p: any) => ({ data: {} }),
  getEmployeeLearningProgress: async (id: any) => ({ data: [] }),
  submitOfflineScore: async (p: any) => ({ data: {} }),
  getBadgeConfig: async () => ({ data: { badges: [] } }),
  saveBadgeConfig: async (p: any) => ({ data: {} }),
};

export default skillsetService;