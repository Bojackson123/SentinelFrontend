# Architecture Overview

The Sentinel Frontend is a single-page application (SPA) that serves as the management dashboard for the Sentinel IoT platform. It communicates with the ASP.NET Core backend API to provide device monitoring, alarm management, and system administration capabilities.

## Tech Stack

| Layer              | Technology                                       |
| ------------------ | ------------------------------------------------ |
| Framework          | React 19                                         |
| Language           | TypeScript 6                                     |
| Build Tool         | Vite 8                                           |
| Routing            | TanStack Router (file-based)                     |
| Server State       | TanStack Query (React Query)                     |
| HTTP Client        | Axios                                            |
| Styling            | Tailwind CSS v4                                  |
| Component Library  | shadcn/ui (Radix UI primitives)                  |
| Tables             | TanStack Table                                   |
| Notifications      | Sonner (toast)                                   |
| Compiler           | React Compiler (via Babel plugin)                |

## Project Structure

```
src/
├── api/                  # Axios-based API client functions
│   ├── client.ts         # Shared Axios instance (base URL, interceptors)
│   ├── auth.ts           # Login / register endpoints
│   ├── devices.ts        # Device CRUD, telemetry, commands
│   └── alarms.ts         # Alarm list, acknowledge, suppress, resolve
│
├── components/
│   ├── ui/               # shadcn/ui primitives (button, card, table, etc.)
│   ├── pages/            # Page-level components (composed into routes)
│   │   ├── dashboard.tsx
│   │   ├── device-list.tsx
│   │   ├── device-detail.tsx
│   │   └── alarm-list.tsx
│   ├── app-sidebar.tsx   # Main sidebar navigation
│   ├── site-header.tsx   # Top header with dynamic page title
│   ├── device-fleet-table.tsx  # Reusable device table (TanStack Table)
│   ├── section-cards.tsx # IoT KPI summary cards
│   ├── login-form.tsx    # Login form with validation
│   ├── signup-form.tsx   # Registration form with validation
│   ├── nav-main.tsx      # Primary nav items
│   └── nav-user.tsx      # User avatar, role badge, logout
│
├── hooks/
│   └── queries/          # TanStack Query hooks
│       ├── use-devices.ts
│       └── use-alarms.ts
│
├── routes/               # TanStack Router file-based routes
│   ├── __root.tsx        # Root layout (providers)
│   ├── _auth.tsx         # Unauthenticated layout
│   ├── _auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── _app.tsx          # Authenticated layout (sidebar + header)
│   └── _app/
│       ├── index.tsx     # Dashboard (/)
│       ├── devices/
│       │   ├── index.tsx # Device list (/devices)
│       │   └── $deviceId.tsx  # Device detail (/devices/:deviceId)
│       └── alarms/
│           └── index.tsx # Alarm list (/alarms)
│
├── stores/
│   └── auth-store.tsx    # Auth React Context (JWT parsing, role helpers)
│
├── types/                # TypeScript type definitions
│   ├── enums.ts          # String union types matching backend enums
│   ├── common.ts         # Shared response shapes
│   ├── auth.ts           # Auth request/response types
│   ├── device.ts         # Device, telemetry, command types
│   └── alarm.ts          # Alarm and alarm event types
│
├── lib/                  # Utility functions (cn helper for Tailwind)
├── App.tsx               # Router provider mount
├── main.tsx              # React DOM entry point
└── index.css             # Global styles and Tailwind imports
```

## Request Lifecycle

```
User Action
    │
    ▼
React Component
    │ calls hook
    ▼
TanStack Query Hook  (useDevices, useAlarms, …)
    │ queryFn
    ▼
API Function  (src/api/devices.ts, etc.)
    │ normalizes backend response
    ▼
Axios Instance  (src/api/client.ts)
    │ attaches JWT, handles 401
    ▼
Backend API  (http://localhost:5288)
```

## Provider Hierarchy

The root layout (`__root.tsx`) wraps the entire app in the following provider order:

```
QueryClientProvider        ← TanStack Query cache
  └── AuthProvider         ← JWT auth context
       └── TooltipProvider ← Radix UI tooltips
            └── Outlet     ← Route content
            └── Toaster    ← Sonner toast container
```
