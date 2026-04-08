# Routing

## Overview

The app uses [TanStack Router](https://tanstack.com/router) with **file-based routing**. Route files live in `src/routes/` and the route tree is auto-generated into `src/routeTree.gen.ts` by the `@tanstack/router-plugin` Vite plugin.

## Route Map

| Path | Route File | Component | Auth Required |
| --- | --- | --- | --- |
| `/login` | `_auth/login.tsx` | `LoginForm` | No (redirects to `/` if logged in) |
| `/register` | `_auth/register.tsx` | `SignupForm` | No (redirects to `/` if logged in) |
| `/` | `_app/index.tsx` | `DashboardPage` | Yes |
| `/devices` | `_app/devices/index.tsx` | `DeviceListPage` | Yes |
| `/devices/:deviceId` | `_app/devices/$deviceId.tsx` | `DeviceDetailPage` | Yes |
| `/alarms` | `_app/alarms/index.tsx` | `AlarmListPage` | Yes |

## Layout Routes

TanStack Router uses **pathless layout routes** (prefixed with `_`) to share layouts without affecting the URL:

- **`__root.tsx`** — Root layout. Wraps everything in providers (QueryClient, Auth, Tooltip, Toaster).
- **`_auth.tsx`** — Unauthenticated layout. Centered card on a muted background. Guard: redirects to `/` if a token exists.
- **`_app.tsx`** — Authenticated layout. Sidebar + header shell. Guard: redirects to `/login` if no token.

## File-Based Routing Conventions

| Pattern | Meaning |
| --- | --- |
| `__root.tsx` | Root layout (always rendered) |
| `_auth.tsx` | Pathless layout group (no URL segment) |
| `_auth/login.tsx` | `/login` (child of `_auth` layout) |
| `_app/index.tsx` | `/` (index route of `_app` layout) |
| `_app/devices/$deviceId.tsx` | `/devices/:deviceId` (dynamic param) |

## Route Generation

The Vite plugin automatically regenerates `routeTree.gen.ts` when files in `src/routes/` change. This file should **not** be edited manually — it is git-tracked but machine-generated.

Configuration in `vite.config.ts`:

```ts
TanStackRouterVite({
  routesDirectory: "./src/routes",
  generatedRouteTree: "./src/routeTree.gen.ts",
})
```

## Adding a New Route

1. Create a file under `src/routes/_app/` (e.g., `_app/settings/index.tsx`).
2. Export a `Route` using `createFileRoute` and a `component`.
3. The route tree will be auto-regenerated.
4. Add a nav item in `src/components/app-sidebar.tsx` if needed.

Example:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return <div>Settings</div>;
}
```
