import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCompanies, getCompany, createCompany } from "@/api/companies";
import type { CreateCompanyRequest } from "@/types/company";

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

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCompanyRequest) => createCompany(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
