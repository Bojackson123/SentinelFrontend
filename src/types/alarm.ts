import type { AlarmSeverity, AlarmSourceType, AlarmStatus } from "./enums";

export interface Alarm {
  id: number;
  deviceId: number;
  siteId: number | null;
  customerId: number | null;
  companyId: number | null;
  alarmType: string;
  severity: AlarmSeverity;
  status: AlarmStatus;
  sourceType: AlarmSourceType;
  triggerMessageId: string | null;
  startedAt: string;
  resolvedAt: string | null;
  suppressReason: string | null;
  createdAt: string;
  updatedAt: string;
  device: {
    serialNumber: string;
    deviceId: string | null;
  } | null;
}

export interface AlarmEvent {
  id: number;
  alarmId: number;
  eventType: string;
  userId: string | null;
  reason: string | null;
  metadataJson: string | null;
  createdAt: string;
}
