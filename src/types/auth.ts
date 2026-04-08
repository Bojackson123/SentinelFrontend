import type { UserRole } from "./enums";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId?: number;
  customerId?: number;
}

export interface LoginResponse {
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  companyId: number | null;
  customerId: number | null;
}
