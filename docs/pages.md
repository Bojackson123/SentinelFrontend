# Pages & Features

## Dashboard (`/`)

**Component**: `src/components/pages/dashboard.tsx`

The landing page after login. Displays a high-level overview of the IoT fleet.

### KPI Summary Cards

Four cards at the top show:

- **Total Devices** — count of all devices in the tenant
- **Active Devices** — devices with `status === "Active"`
- **Offline Devices** — devices where `connectivityState.isOffline === true`
- **Active Alarms** — count of alarms with `status === "Active"`

Each card shows a loading skeleton while data is being fetched.

### Device Fleet Table

Below the cards, a table (powered by TanStack Table) shows all devices with sortable columns:

| Column | Source |
| --- | --- |
| Serial Number | `device.serialNumber` (links to device detail) |
| Status | `device.status` (color-coded badge) |
| Connectivity | `device.connectivityState.isOffline` (Online/Offline badge) |
| Site | Active assignment's site name |
| Last Seen | `connectivityState.lastMessageReceivedAt` |

---

## Device List (`/devices`)

**Component**: `src/components/pages/device-list.tsx`

A filterable, paginated list of all devices in the tenant.

### Filters

- **Search**: Text input filters by serial number (passed as `search` query param).
- **Status dropdown**: Filter by device status (`Manufactured`, `Unprovisioned`, `Assigned`, `Active`, `Decommissioned`).

### Pagination

- Server-side pagination with configurable page size (default 20).
- Previous/Next buttons with page count display.

---

## Device Detail (`/devices/:deviceId`)

**Component**: `src/components/pages/device-detail.tsx`

Detailed view of a single device, accessed by clicking a serial number in any device table.

### Header

- Device serial number, status badge, connectivity badge (Online/Offline).
- Active site name and location (if assigned).

### Telemetry State Card

Displays the latest telemetry snapshot:

- Panel Voltage (V)
- Pump Current (A)
- Temperature (°C)
- Signal Strength (dBm)
- Cycle Count
- Runtime (hours)
- Pump status (Running/Idle)
- High Water alarm indicator

Data auto-refreshes every 15 seconds via `useDeviceState`.

### Commands Card

**Visible to**: Internal and Company users only (`isInternal || isCompanyUser`).

Buttons to send commands to the device:

| Command | Description |
| --- | --- |
| Reboot | Restart the device |
| Ping | Connectivity check |
| Self Test | Run diagnostic self-test |
| Sync Now | Force immediate telemetry sync |
| Clear Fault | Clear fault state |

Below the buttons, a table shows the 5 most recent commands with their status (Pending, Sent, Succeeded, Failed, TimedOut).

### Active Alarms

Lists alarms for this specific device with **Acknowledge** and **Resolve** actions.

---

## Alarm List (`/alarms`)

**Component**: `src/components/pages/alarm-list.tsx`

Manages all alarms across the tenant.

### Filters

- **Status dropdown**: `Active` (default), `Acknowledged`, `Suppressed`, `Resolved`, or All.
- **Severity dropdown**: `Info`, `Warning`, `Critical`, or All.

### Table Columns

| Column | Description |
| --- | --- |
| Alarm Type | Type identifier string |
| Device | Serial number (or device ID as fallback) |
| Severity | Color-coded badge (Info=outline, Warning=secondary, Critical=destructive) |
| Status | Color-coded badge |
| Started | Timestamp |
| Actions | Context-dependent buttons |

### Actions

| Action | Available When |
| --- | --- |
| **Acknowledge** | Status is `Active` |
| **Suppress** | Status is `Active` or `Acknowledged` — opens a side sheet for entering a reason |
| **Resolve** | Status is `Active` or `Acknowledged` |

### Pagination

Server-side, same pattern as the device list.

---

## Login (`/login`)

**Component**: `src/components/login-form.tsx`

- Email and password fields.
- Submits to `POST /api/auth/login`.
- On success, stores the JWT and redirects to `/`.
- Error handling via toast notifications.
- Link to registration page.

## Register (`/register`)

**Component**: `src/components/signup-form.tsx`

- Email, password, first name, last name, role selector.
- Password strength validation.
- Submits to `POST /api/auth/register`.
- On success, redirects to `/login`.
- Link back to login page.
