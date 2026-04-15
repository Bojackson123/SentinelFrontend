import { apiClient } from "./client";
import type { Company, CreateCompanyRequest } from "@/types/company";

export async function getCompanies(params?: {
  page?: number;
  pageSize?: number;
}): Promise<{ items: Company[]; totalCount: number }> {
  const { data } = await apiClient.get("/api/companies", { params });
  return { items: data.companies ?? [], totalCount: data.total ?? 0 };
}

export async function getCompany(companyId: number): Promise<Company> {
  const { data } = await apiClient.get(`/api/companies/${companyId}`);
  return data;
}

export async function createCompany(
  request: CreateCompanyRequest
): Promise<{ id: number; name: string }> {
  const { data } = await apiClient.post("/api/companies", request);
  return data;
}
