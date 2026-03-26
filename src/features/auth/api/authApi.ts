import type { User } from "@/features/employee/types";
import api from "@/services/apiClient";
import type { LoginCredentials, AuthResponse, ExperienceType } from "@/shared/auth/authTypes";
import axios from "axios";
import Cookies from "js-cookie";

export const authService = {

  loginUser: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  

  getEmployeeProfile: async (id: number): Promise<User> => {

    const response = await api.get<User>(`/employees/profile/${id}`);
    return response.data;
  },

  getMyProfile: async (): Promise<User> => {
    const response = await api.get<User>('/employees/me');
    return response.data;
  },
  getProfileByID: async (id  : number): Promise<User> => {
    const response = await api.get<User>(`/employees/profile/${id}`);
    console.log(response);
    
    return response.data;
  },

  submitMultipartDetails: async (
    id: number,
    type: ExperienceType,
    data: any,
    files: Record<string, File | null>
  ): Promise<any> => {
    const formData = new FormData();

    const commonFields = [
      'fullName', 'lastName', 'surName', 'contactNumber', 'gender',
      'aadharNumber', 'personalEmail', 'dateOfBirth', 'presentAddress',
      'permanentAddress', 'bloodGroup', 'maritalStatus', 'designation',
      'skillSet', 'bankName', 'accountNumber',
      'fatherName', 'fatherDateOfBirth', 'fatherOccupation', 'fatherAlive',
      'motherName', 'motherDateOfBirth', 'motherOccupation', 'motherAlive'
    ];

    const requestPayload: any = {};

    commonFields.forEach(key => {
      if (data[key] !== undefined) requestPayload[key] = data[key];
    });

    if (type === 'EXPERIENCED') {
      requestPayload.unaNumber = data.unaNumber;
      requestPayload.previousRole = data.previousRole;
      requestPayload.oldCompanyName = data.oldCompanyName;
      requestPayload.oldCompanyFromDate = data.oldCompanyFromDate;
      requestPayload.oldCompanyEndDate = data.oldCompanyEndDate;
    }

    formData.append("data", JSON.stringify(requestPayload));

    if (type === 'FRESHER') {
      if (files.aadhaarCard) formData.append("aadhaarCard", files.aadhaarCard);
      if (files.tc) formData.append("tc", files.tc);
      if (files.offerLetter) formData.append("offerLetter", files.offerLetter);
    } else {
      if (files.aadhaarCard) formData.append("aadhaarCard", files.aadhaarCard);
      if (files.experienceCertificate) formData.append("experienceCertificate", files.experienceCertificate);
      if (files.leavingLetter) formData.append("leavingLetter", files.leavingLetter);
    }

    let urlType  = type.toString().toLowerCase();
    const response = await api.post(`/employees/personal-details/${id}/${urlType}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  refreshToken: async (refreshToken: string) => {

  const refreshToken = Cookies.get("lms_refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await axios.post("/auth/refresh", {
    refreshToken
  });

  return response.data;
},

  changePassword: async (newPassword: string): Promise<void> => {
    await api.put('/auth/change-password', {
      newPassword,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/password-reset/request', null, {
      params: { email }
    });
  }
};