import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomers, createCustomer } from "@/api/customers";
import type { CreateCustomerRequest } from "@/types/company";

export function useCustomers(params?: {
  companyId?: number;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCustomerRequest) => createCustomer(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
