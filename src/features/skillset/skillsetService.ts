import api from "@/services/apiClient";

export interface SkillPayload {
  skillName: string;
  proficiency: string;
  experience?: number;
  certification?: string;
  notes?: string;
}

export const skillsetService = {
  getMySkills: () => api.get("/api/skillset/me"),

  addSkill: (payload: SkillPayload) =>
    api.post("/api/skillset", payload),

  updateSkill: (id: number, payload: SkillPayload) =>
    api.put(`/api/skillset/${id}`, payload),

  getTeamSkills: () => api.get("/api/skillset/team"),

  getSkillById: (id: number) =>
    api.get(`/api/skillset/${id}`),

  getEmployeeSkills: (employeeId: number | string) =>
    api.get(`/api/skillset/employee/${employeeId}`),
};