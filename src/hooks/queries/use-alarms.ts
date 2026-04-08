import { useQuery } from "@tanstack/react-query";
import { getAlarms } from "@/api/alarms";

export function useAlarms(params?: {
  status?: string;
  severity?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["alarms", params],
    queryFn: () => getAlarms(params),
  });
}
