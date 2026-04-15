import { apiClient } from "./client";
import type { CustomerSummary, CreateCustomerRequest } from "@/types/company";

export async function getCustomers(params?: {
  companyId?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ items: CustomerSummary[]; totalCount: number }> {
  const { data } = await apiClient.get("/api/customers", { params });
  return { items: data.customers ?? [], totalCount: data.total ?? 0 };
}

export async function createCustomer(
  request: CreateCustomerRequest
): Promise<{ id: number; firstName: string; lastName: string; email: string }> {
  const { data } = await apiClient.post("/api/customers", request);
  return data;
}
