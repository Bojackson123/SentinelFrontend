import { apiClient } from "./client";
import type { SiteSummary, CreateSiteRequest } from "@/types/company";
import type { Device } from "@/types/device";

export async function getSites(params?: {
  companyId?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ items: SiteSummary[]; totalCount: number }> {
  const { data } = await apiClient.get("/api/sites", { params });
  return { items: data.sites ?? [], totalCount: data.total ?? 0 };
}

export async function getSite(siteId: number): Promise<SiteSummary> {
  const { data } = await apiClient.get(`/api/sites/${siteId}`);
  return data;
}

export async function getSiteDevices(
  siteId: number,
  params?: { page?: number; pageSize?: number }
): Promise<{ items: Device[]; totalCount: number }> {
  const { data } = await apiClient.get(`/api/sites/${siteId}/devices`, { params });
  return { items: data.devices ?? [], totalCount: data.total ?? 0 };
}

export async function createSite(
  request: CreateSiteRequest
): Promise<{ id: number; name: string }> {
  const { data } = await apiClient.post("/api/sites", request);
  return data;
}
