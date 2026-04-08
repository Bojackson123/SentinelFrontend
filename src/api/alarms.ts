import { apiClient } from "./client";
import type { Alarm, AlarmEvent } from "@/types/alarm";

export async function getAlarms(params?: {
  status?: string;
  severity?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: Alarm[]; totalCount: number }> {
  const { data } = await apiClient.get("/api/alarms", { params });
  // Backend returns { total, page, pageSize, alarms }
  return { items: data.alarms ?? [], totalCount: data.total ?? 0 };
}

export async function acknowledgeAlarm(alarmId: number): Promise<void> {
  await apiClient.post(`/api/alarms/${alarmId}/acknowledge`);
}

export async function suppressAlarm(
  alarmId: number,
  reason: string
): Promise<void> {
  await apiClient.post(`/api/alarms/${alarmId}/suppress`, { reason });
}

export async function resolveAlarm(
  alarmId: number,
  reason?: string
): Promise<void> {
  await apiClient.post(`/api/alarms/${alarmId}/resolve`, { reason });
}

export async function getAlarmEvents(
  alarmId: number
): Promise<AlarmEvent[]> {
  const { data } = await apiClient.get(`/api/alarms/${alarmId}/events`);
  return data;
}
