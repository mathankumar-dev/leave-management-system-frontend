export type UserRole = "Employee" | "Manager" | "HR" | "Admin";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
  };
}

export interface RegisterCredentials {
  employeeName: string;
  emailId: string;
  department: string;
  designation: string;
  managerId: string;
  joiningDate: string;
}