import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSites, getSite, getSiteDevices, createSite } from "@/api/sites";
import type { CreateSiteRequest } from "@/types/company";

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

export function useCreateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateSiteRequest) => createSite(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });
}
