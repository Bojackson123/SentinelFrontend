export type AlarmSeverity = "Info" | "Warning" | "Critical";

export type AlarmSourceType =
  | "ExplicitMessage"
  | "TelemetryFallback"
  | "SystemGenerated";

export type AlarmStatus = "Active" | "Acknowledged" | "Suppressed" | "Resolved";

export type CommandStatus =
  | "Pending"
  | "Sent"
  | "Succeeded"
  | "Failed"
  | "TimedOut";

export type DeviceStatus =
  | "Manufactured"
  | "Unprovisioned"
  | "Assigned"
  | "Active"
  | "Decommissioned";

export type UserRole =
  | "InternalAdmin"
  | "InternalTech"
  | "CompanyAdmin"
  | "CompanyTech"
  | "HomeownerViewer";

export type UnassignmentReason =
  | "CustomerRequest"
  | "SubscriptionLapsed"
  | "Transferred"
  | "Decommissioned";

export type SubscriptionStatus =
  | "Trialing"
  | "Active"
  | "PastDue"
  | "Cancelled"
  | "Suspended";
