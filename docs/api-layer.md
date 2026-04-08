# API Layer

## Overview

The API layer in `src/api/` provides typed functions for communicating with the Sentinel backend. It uses a shared Axios instance with automatic JWT injection and response normalization.

## Axios Client (`src/api/client.ts`)

The shared client is configured with:

- **Base URL**: Read from the `VITE_API_URL` environment variable (defaults to `https://localhost:7001`).
- **Request interceptor**: Attaches `Authorization: Bearer <token>` from `localStorage`.
- **Response interceptor**: On `401`, clears the stored token and redirects to `/login`.

## Response Normalization

The backend returns paginated responses in the shape `{ total, page, pageSize, <collection> }` where `<collection>` is a named array (e.g., `devices`, `alarms`, `commands`). The API functions normalize these into a consistent `{ items: T[], totalCount: number }` shape for the frontend:

```ts
// Backend returns: { total: 42, page: 1, pageSize: 25, devices: [...] }
// API function returns: { items: Device[], totalCount: 42 }
```

This normalization happens in each API function rather than in a middleware, keeping the backend response mapping explicit and close to the call site.

## API Modules

### Auth (`src/api/auth.ts`)

| Function | Method | Endpoint | Returns |
| --- | --- | --- | --- |
| `login(req)` | POST | `/api/auth/login` | `{ token: string }` |
| `register(req)` | POST | `/api/auth/register` | `void` |

### Devices (`src/api/devices.ts`)

| Function | Method | Endpoint | Returns |
| --- | --- | --- | --- |
| `getDevices(params?)` | GET | `/api/devices` | `{ items: Device[], totalCount }` |
| `getDevice(deviceId)` | GET | `/api/devices/:deviceId` | `Device` |
| `getDeviceState(deviceId)` | GET | `/api/devices/:deviceId/state` | `DeviceStateResponse` |
| `getDeviceTelemetry(deviceId, after?, pageSize?)` | GET | `/api/devices/:deviceId/telemetry` | `TelemetryHistory[]` |
| `submitCommand(deviceId, commandType)` | POST | `/api/devices/:deviceId/commands/:type` | `CommandLog` |
| `getCommands(deviceId)` | GET | `/api/devices/:deviceId/commands` | `CommandLog[]` |

Notes:
- `deviceId` is a string (IoT Hub device ID), not a numeric database ID.
- `getDevice()` maps `connectivity` from the backend to `connectivityState` on the frontend type.
- `getCommands()` maps `commandId` from the backend to `id` on each command.

### Alarms (`src/api/alarms.ts`)

| Function | Method | Endpoint | Returns |
| --- | --- | --- | --- |
| `getAlarms(params?)` | GET | `/api/alarms` | `{ items: Alarm[], totalCount }` |
| `acknowledgeAlarm(id)` | POST | `/api/alarms/:id/acknowledge` | `void` |
| `suppressAlarm(id, reason)` | POST | `/api/alarms/:id/suppress` | `void` |
| `resolveAlarm(id, reason?)` | POST | `/api/alarms/:id/resolve` | `void` |
| `getAlarmEvents(id)` | GET | `/api/alarms/:id/events` | `AlarmEvent[]` |

## TanStack Query Hooks (`src/hooks/queries/`)

Query hooks wrap the API functions and provide caching, refetching, and loading states:

| Hook | API Function | Query Key | Options |
| --- | --- | --- | --- |
| `useDevices(params?)` | `getDevices` | `["devices", params]` | — |
| `useDevice(deviceId)` | `getDevice` | `["device", deviceId]` | Enabled when deviceId is truthy |
| `useDeviceState(deviceId)` | `getDeviceState` | `["deviceState", deviceId]` | Refetches every 15 seconds |
| `useDeviceCommands(deviceId)` | `getCommands` | `["deviceCommands", deviceId]` | Enabled when deviceId is truthy |
| `useAlarms(params?)` | `getAlarms` | `["alarms", params]` | — |

### Query Invalidation

Mutations (acknowledge alarm, send command, etc.) are defined inline in page components using `useMutation` and invalidate the relevant query keys on success:

```ts
const ackMutation = useMutation({
  mutationFn: (id: number) => acknowledgeAlarm(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["alarms"] });
  },
});
```

### Default Query Options

Configured in `__root.tsx`:

- `staleTime`: 30 seconds
- `retry`: 1 attempt

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `https://localhost:7001` |

Set in `.env.development` for local development:

```
VITE_API_URL=http://localhost:5288
```
