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
    console.log(response);

    return response.data;
  },

  submitMultipartDetails: async (
    id: string,
    type: "FRESHER" | "EXPERIENCED",
    data: any,
    files: Record<string, File | File[] | null>
  ): Promise<any> => {
    const formData = new FormData();

    // 1. JSON Payload
    formData.append("data", JSON.stringify(data));

    // 2. Common Multipart Keys
    if (files.idProof) formData.append("idProof", files.idProof as File);
    if (files.passportPhoto) formData.append("passportPhoto", files.passportPhoto as File);

    // 3. Conditional Keys based on Employee Type
    if (type === "FRESHER") {
      // Keys must match Spring Boot @RequestPart names exactly
      if (files.tenthMarksheet) formData.append("tenthMarksheet", files.tenthMarksheet as File);
      if (files.twelfthMarksheet) formData.append("twelfthMarksheet", files.twelfthMarksheet as File);
      if (files.degreeCertificate) formData.append("degreeCertificate", files.degreeCertificate as File);
      if (files.offerLetter) formData.append("offerLetter", files.offerLetter as File);
    } else {
      // Experienced: handle List<MultipartFile> for experienceCerts
      if (files.relievingLetter) formData.append("relievingLetter", files.relievingLetter as File);

      if (Array.isArray(files.experienceCerts)) {
        files.experienceCerts.forEach((file) => {
          formData.append("experienceCerts", file);
        });
      }
    }

    // POST endpoint only
    const response = await api.post(
      `/employees/personal-details/${id}/${type.toLowerCase()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  },
  updateProfileDetails: async (
    id: string,
    type: "FRESHER" | "EXPERIENCED",
    data: any,
    files: Record<string, File | File[] | null>
  ): Promise<any> => {
    const formData = new FormData();

    // 1. JSON Payload
    formData.append("data", JSON.stringify(data));

    // 2. Common Multipart Keys
    if (files.idProof) formData.append("idProof", files.idProof as File);
    if (files.passportPhoto) formData.append("passportPhoto", files.passportPhoto as File);

    // 3. Conditional Keys based on Employee Type
    if (type === "FRESHER") {
      // Keys must match Spring Boot @RequestPart names exactly
      if (files.tenthMarksheet) formData.append("tenthMarksheet", files.tenthMarksheet as File);
      if (files.twelfthMarksheet) formData.append("twelfthMarksheet", files.twelfthMarksheet as File);
      if (files.degreeCertificate) formData.append("degreeCertificate", files.degreeCertificate as File);
      if (files.offerLetter) formData.append("offerLetter", files.offerLetter as File);

      if (files.idProof) formData.append("idProof", files.idProof as File);
    } else {
      // Experienced: handle List<MultipartFile> for experienceCerts
      if (files.relievingLetter) formData.append("relievingLetter", files.relievingLetter as File);

      if (Array.isArray(files.experienceCerts)) {
        files.experienceCerts.forEach((file) => {
          formData.append("experienceCerts", file);
        });
      }
    }

    // PUT endpoint only
    const response = await api.put(
      `/employees/personal-details/${id}/${type.toLowerCase()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  },

  refreshToken: async () => {

    const refreshToken = Cookies.get("lms_refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token found");
    }

    return axios.post("/refresh-token", { refreshToken });
  },

  changePassword: async (newPassword: string): Promise<void> => {
    await api.post('/auth/force-change', {
      newPassword,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/password-reset/forgot-password', {
      email
    });
  }
};