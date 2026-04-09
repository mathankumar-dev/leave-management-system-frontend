import type { User } from "@/features/employee/types";
import api from "@/services/apiClient";
import type { AuthResponse, LoginCredentials } from "@/shared/auth/authTypes";
import axios from "axios";
import Cookies from "js-cookie";

export const authService = {

  loginUser: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getEmployeeProfile: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/employees/profile/${id}`);
    return response.data;
  },

  getMyProfile: async (): Promise<User> => {
    const response = await api.get<User>('/employees/me');
    return response.data;
  },

  getProfileByID: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/employees/profile/${id}`);
    return response.data;
  },

  // ─── POST — first time submission ────────────────────────────
  submitMultipartDetails: async (
    id: string,
    type: "FRESHER" | "EXPERIENCED",
    data: any,
    files: Record<string, File | File[] | null>
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (files.idProof)       formData.append("idProof",       files.idProof as File);
    if (files.passportPhoto) formData.append("passportPhoto", files.passportPhoto as File);

    if (type === "FRESHER") {
      if (files.tenthMarksheet)    formData.append("tenthMarksheet",    files.tenthMarksheet as File);
      if (files.twelfthMarksheet)  formData.append("twelfthMarksheet",  files.twelfthMarksheet as File);
      if (files.degreeCertificate) formData.append("degreeCertificate", files.degreeCertificate as File);
      if (files.offerLetter)       formData.append("offerLetter",       files.offerLetter as File);
    } else {
      // experienceCerts — List<MultipartFile> → multiple appends with same key
      if (Array.isArray(files.experienceCerts)) {
        files.experienceCerts.forEach(f => formData.append("experienceCerts", f));
      }
      // joiningLetters — List<MultipartFile>
      if (Array.isArray(files.joiningLetters)) {
        files.joiningLetters.forEach(f => formData.append("joiningLetters", f));
      }
      // relievingLetter — List<MultipartFile>
      if (Array.isArray(files.relievingLetter)) {
        files.relievingLetter.forEach(f => formData.append("relievingLetter", f));
      }
    }

    const response = await api.post(
      `/employees/personal-details/${id}/${type.toLowerCase()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },

  // ─── PUT — profile update ─────────────────────────────────────
  // Backend: PUT /employees/profile/{id}
  // Parts:
  //   data           → JSON string (ProfileUpdateRequest)
  //   idProof        → MultipartFile (optional)
  //   passportPhoto  → MultipartFile (optional)
  //   FRESHER only:
  //     tenthMarksheet, twelfthMarksheet, degreeCertificate, offerLetter
  //   EXPERIENCED only:
  //     experienceCerts[]  → List<MultipartFile>  (one per experience entry)
  //     joiningLetters[]   → List<MultipartFile>  (one per experience entry)
  //     relievingLetter[]  → List<MultipartFile>  (one per experience entry)
  //
  // IMPORTANT: data JSON must include experiences[] for EXPERIENCED type
  // so backend can match files by index.
  // ─── PUT — profile update ─────────────────────────────────────
updateProfileDetails: async (
  id: string,
  type: "FRESHER" | "EXPERIENCED",
  data: any,
  files: Record<string, File | File[] | null>
): Promise<any> => {
  const formData = new FormData();

  // ── 1. JSON payload ───────────────────────────────────────────
  formData.append("data", JSON.stringify(data));

  // ── 2. Common files (optional — only if user selected new file) ──
  if (files.idProof)       formData.append("idProof",       files.idProof as File);
  if (files.passportPhoto) formData.append("passportPhoto", files.passportPhoto as File);

  // ── 3. Type-specific files ────────────────────────────────────
  if (type === "FRESHER") {
    // Backend patchFresherDocFiles — only replaces if file sent
    if (files.tenthMarksheet)    formData.append("tenthMarksheet",    files.tenthMarksheet as File);
    if (files.twelfthMarksheet)  formData.append("twelfthMarksheet",  files.twelfthMarksheet as File);
    if (files.degreeCertificate) formData.append("degreeCertificate", files.degreeCertificate as File);
    if (files.offerLetter)       formData.append("offerLetter",       files.offerLetter as File);

  } else {
    // EXPERIENCED — Backend expects arrays for ALL experience entries
    // Send arrays matching experiences.length - null/empty for unchanged entries
    const experiences = data.experiences || [];
    
    // experienceCerts[] — one per experience entry
    experiences.forEach((_: any, i: number) => {
      const certFile = (files as any)[`experienceCerts_${i}`];
      if (certFile) formData.append("experienceCerts", certFile);
    });

    // joiningLetters[] — one per experience entry  
    experiences.forEach((_: any, i: number) => {
      const joiningFile = (files as any)[`joiningLetters_${i}`];
      if (joiningFile) formData.append("joiningLetters", joiningFile);
    });

    // relievingLetters[] — one per experience entry (backend param: relievingLetters)
    experiences.forEach((_: any, i: number) => {
      const relievingFile = (files as any)[`relievingLetters_${i}`];
      if (relievingFile) formData.append("relievingLetters", relievingFile);
    });
  }

  const response = await api.put(
    `/employees/profile/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
},

  refreshToken: async () => {
    const refreshToken = Cookies.get("lms_refresh_token");
    if (!refreshToken) throw new Error("No refresh token found");
    return axios.post("/refresh-token", { refreshToken });
  },

  changePassword: async (newPassword: string): Promise<void> => {
    await api.post('/auth/force-change', { newPassword });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/password-reset/forgot-password', { email });
  },

  verifyOtp: async (data: { email: string; otp: string; newPassword: string }) => {
    return api.post("/password-reset/verify-otp", data);
  },
};