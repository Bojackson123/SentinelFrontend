import { apiClient } from "./client";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/api/auth/login", req);
  return data;
}

export async function register(req: RegisterRequest): Promise<void> {
  await apiClient.post("/api/auth/register", req);
}
