import { useQuery } from "@tanstack/react-query";
import { getSites, getSite, getSiteDevices } from "@/api/sites";

export function useSites(params?: {
  companyId?: number;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["sites", params],
    queryFn: () => getSites(params),
  });
}

export function useSite(siteId: number) {
  return useQuery({
    queryKey: ["site", siteId],
    queryFn: () => getSite(siteId),
    enabled: !!siteId,
  });
}

export function useSiteDevices(
  siteId: number,
  params?: { page?: number; pageSize?: number }
) {
  return useQuery({
    queryKey: ["siteDevices", siteId, params],
    queryFn: () => getSiteDevices(siteId, params),
    enabled: !!siteId,
  });
}
