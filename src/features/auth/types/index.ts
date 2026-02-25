export type UserRole = "Employee" | "Manager" | "HR" | "Admin";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id : number;
  role: string;

}

export interface RegisterCredentials {
  employeeName: string;
  emailId: string;
  department: string;
  designation: string;
  managerId: string;
  joiningDate: string;
}