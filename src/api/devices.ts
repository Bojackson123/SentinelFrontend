import { apiClient } from "./client";
import type { Device, DeviceStateResponse, TelemetryHistory, CommandLog, CommandType } from "@/types/device";

export async function getDevices(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}): Promise<{ items: Device[]; totalCount: number }> {
  const { data } = await apiClient.get("/api/devices", { params });
  // Backend returns { total, page, pageSize, devices }
  return { items: data.devices ?? [], totalCount: data.total ?? 0 };
}

export async function getDevice(deviceId: string): Promise<Device> {
  const { data } = await apiClient.get(`/api/devices/${deviceId}`);
  // Backend returns "connectivity" not "connectivityState"
  return { ...data, connectivityState: data.connectivity ?? null };
}

export async function getDeviceState(
  deviceId: string
): Promise<DeviceStateResponse> {
  const { data } = await apiClient.get<DeviceStateResponse>(
    `/api/devices/${deviceId}/state`
  );
  return data;
}

export async function getDeviceTelemetry(
  deviceId: string,
  after?: string,
  pageSize?: number
): Promise<TelemetryHistory[]> {
  const { data } = await apiClient.get(
    `/api/devices/${deviceId}/telemetry`,
    { params: { after, pageSize } }
  );
  return data;
}

export async function submitCommand(
  deviceId: string,
  commandType: CommandType
): Promise<CommandLog> {
  const { data } = await apiClient.post(
    `/api/devices/${deviceId}/commands/${commandType}`
  );
  // Backend returns commandId instead of id
  return { ...data, id: data.commandId ?? data.id };
}

export async function getCommands(deviceId: string): Promise<CommandLog[]> {
  const { data } = await apiClient.get(
    `/api/devices/${deviceId}/commands`
  );
  // Backend returns { total, page, pageSize, commands }
  const commands = data.commands ?? data ?? [];
  return commands.map((c: any) => ({ ...c, id: c.commandId ?? c.id }));
}

export async function assignDevice(
  serialNumber: string,
  siteId: number
): Promise<{ assignmentId: number; serialNumber: string; siteId: number }> {
  const { data } = await apiClient.post(
    `/api/devices/${encodeURIComponent(serialNumber)}/assign`,
    { siteId }
  );
  return data;
}
