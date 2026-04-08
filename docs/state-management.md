# State Management

## Overview

The frontend uses two complementary patterns for state:

| Concern | Solution | Where |
| --- | --- | --- |
| Server state (API data) | TanStack Query | `src/hooks/queries/` |
| Auth state (user, token) | React Context | `src/stores/auth-store.tsx` |
| UI state (filters, modals) | Component-local `useState` | Individual components |

There is **no global client state store** (no Redux, Zustand, etc.). This is intentional — TanStack Query handles caching, deduplication, and background refetching for all server data, which eliminates the need for a separate client cache.

## TanStack Query

### Configuration

The `QueryClient` is created in `__root.tsx` with:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // Data considered fresh for 30 seconds
      retry: 1,          // One retry on failure
    },
  },
});
```

### Query Hooks

Custom hooks in `src/hooks/queries/` wrap API calls:

- **`useDevices(params?)`** — fetches the device list with optional filters.
- **`useDevice(deviceId)`** — fetches a single device by its IoT Hub ID.
- **`useDeviceState(deviceId)`** — fetches latest telemetry, polls every 15s.
- **`useDeviceCommands(deviceId)`** — fetches the command log for a device.
- **`useAlarms(params?)`** — fetches the alarm list with optional filters.

### Mutations

Write operations (acknowledge alarm, send command, etc.) use `useMutation` defined inline in page components. On success, they invalidate the relevant query keys to trigger refetches:

```ts
queryClient.invalidateQueries({ queryKey: ["alarms"] });
```

## Auth Context

`AuthProvider` in `src/stores/auth-store.tsx` provides:

- `user` — parsed `UserProfile` from the JWT
- `token` — raw JWT string
- `isAuthenticated` — boolean
- `isLoading` — true during initial token check
- Role helpers: `isInternal`, `isCompanyUser`, `isHomeowner`
- Actions: `login()`, `register()`, `logout()`

Consumed via the `useAuth()` hook:

```tsx
const { user, isInternal, logout } = useAuth();
```

## UI State

Page-level state (selected filters, current page, modal open/close, form input) is managed with `useState` directly in the component that owns it. This state is ephemeral and resets on navigation.

Examples:
- `DeviceListPage`: `search`, `status`, `page`
- `AlarmListPage`: `statusFilter`, `severityFilter`, `page`, `selectedAlarm`, `suppressReason`
