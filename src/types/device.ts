import type { CommandStatus, DeviceStatus, UnassignmentReason } from "./enums";

export interface Device {
  id: number;
  deviceId: string | null;
  serialNumber: string;
  hardwareRevision: string | null;
  firmwareVersion: string | null;
  status: DeviceStatus;
  provisionedAt: string | null;
  manufacturedAt: string | null;
  createdAt: string;
  updatedAt: string;
  latestState: LatestDeviceState | null;
  connectivityState: DeviceConnectivityState | null;
  assignments: DeviceAssignment[];
}

export interface LatestDeviceState {
  deviceId: number;
  lastTelemetryTimestampUtc: string;
  lastMessageId: string | null;
  panelVoltage: number | null;
  pumpCurrent: number | null;
  pumpRunning: boolean | null;
  highWaterAlarm: boolean | null;
  temperatureC: number | null;
  signalRssi: number | null;
  runtimeSeconds: number | null;
  reportedCycleCount: number | null;
  derivedCycleCount: number | null;
  updatedAt: string;
}

export interface DeviceStateResponse {
  deviceId: string;
  lastTelemetryTimestampUtc: string;
  panelVoltage: number | null;
  pumpCurrent: number | null;
  pumpRunning: boolean | null;
  highWaterAlarm: boolean | null;
  temperatureC: number | null;
  signalRssi: number | null;
  runtimeSeconds: number | null;
  reportedCycleCount: number | null;
  derivedCycleCount: number | null;
  updatedAt: string;
}

export interface DeviceConnectivityState {
  deviceId: number;
  lastMessageReceivedAt: string;
  lastTelemetryReceivedAt: string | null;
  isOffline: boolean;
  offlineThresholdSeconds: number;
  suppressedByMaintenanceWindow: boolean;
  updatedAt: string;
}

export interface DeviceAssignment {
  id: number;
  deviceId: number;
  siteId: number;
  assignedByUserId: string;
  assignedAt: string;
  unassignedAt: string | null;
  unassignmentReason: UnassignmentReason | null;
  site: Site | null;
}

export interface Site {
  id: number;
  customerId: number;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
}

export interface TelemetryHistory {
  id: number;
  deviceId: number;
  messageId: string;
  messageType: string;
  timestampUtc: string;
  enqueuedAtUtc: string;
  receivedAtUtc: string;
  panelVoltage: number | null;
  pumpCurrent: number | null;
  pumpRunning: boolean | null;
  highWaterAlarm: boolean | null;
  temperatureC: number | null;
  signalRssi: number | null;
  runtimeSeconds: number | null;
  reportedCycleCount: number | null;
  derivedCycleCount: number | null;
  firmwareVersion: string | null;
}

export interface CommandLog {
  id: number;
  deviceId: number;
  commandType: string;
  status: CommandStatus;
  requestedByUserId: string;
  requestedAt: string;
  sentAt: string | null;
  completedAt: string | null;
  responseJson: string | null;
  errorMessage: string | null;
}

export type CommandType =
  | "reboot"
  | "ping"
  | "capture-snapshot"
  | "run-self-test"
  | "sync-now"
  | "clear-fault";
