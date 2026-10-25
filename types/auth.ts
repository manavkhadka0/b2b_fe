export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  gender: Gender;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  isJobSeeker: boolean;
  login: (credentials: LoginCredentials, returnTo?: string) => Promise<void>;
  signup: (data: SignupData, returnTo?: string) => Promise<void>;
  logout: (returnTo?: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkJobSeeker: () => Promise<boolean>;
  isLoading: boolean;
  requireAuth: (returnTo: string) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type Gender = "Male" | "Female" | "Other";

export type UserType = "Job Seeker" | "Employer";

export interface SignupData {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
  gender: Gender;
  address: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  phone_number: string;
  company_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Location {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface RequestResetCodePayload {
  email: string;
}

export interface ResendResetCodePayload {
  email: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface ConfirmResetPasswordPayload {
  email: string;
  code: string;
  new_password: string;
}

export interface ApiResponse<T = unknown> {
  detail: string;
  data?: T;
}

export interface VerifyCodeResponse {
  detail: string;
  valid: boolean;
}

export interface ApiErrorResponse {
  detail?: string;
  email?: string[];
  code?: string[];
  new_password?: string[];
  [key: string]: unknown;
}
