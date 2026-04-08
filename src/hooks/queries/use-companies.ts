import { useQuery } from "@tanstack/react-query";
import { getCompanies, getCompany } from "@/api/companies";

export function useCompanies(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => getCompanies(params),
  });
}

export function useCompany(companyId: number) {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
    enabled: !!companyId,
  });
}
