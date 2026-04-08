import { useQuery } from "@tanstack/react-query";
import { getDevices, getDevice, getDeviceState, getCommands } from "@/api/devices";

export function useDevices(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["devices", params],
    queryFn: () => getDevices(params),
  });
}

export function useDevice(deviceId: string) {
  return useQuery({
    queryKey: ["device", deviceId],
    queryFn: () => getDevice(deviceId),
    enabled: !!deviceId,
  });
}

export function useDeviceState(deviceId: string) {
  return useQuery({
    queryKey: ["deviceState", deviceId],
    queryFn: () => getDeviceState(deviceId),
    enabled: !!deviceId,
    refetchInterval: 15_000,
  });
}

export function useDeviceCommands(deviceId: string) {
  return useQuery({
    queryKey: ["deviceCommands", deviceId],
    queryFn: () => getCommands(deviceId),
    enabled: !!deviceId,
  });
}
