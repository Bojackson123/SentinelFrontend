# Sentinel Frontend

Management dashboard for the Sentinel IoT platform. Provides device monitoring, alarm management, and fleet overview for all user roles.

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Vite 8** — Build tooling with React Compiler
- **TanStack Router** — File-based routing with auth guards
- **TanStack Query** — Server state, caching, and background refetching
- **Tailwind CSS v4** + **shadcn/ui** — Styling and component library
- **Axios** — HTTP client with JWT interceptors

## Prerequisites

- **Node.js** >= 20
- **Sentinel Backend** running at `http://localhost:5288` (or configure `VITE_API_URL`)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `.env.development` file (or `.env.production` for deploys):

```
VITE_API_URL=http://localhost:5288
```

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `https://localhost:7001` |

## Project Structure

```
src/
├── api/            # Axios client + typed API functions
├── components/
│   ├── ui/         # shadcn/ui primitives
│   └── pages/      # Page-level components
├── hooks/queries/  # TanStack Query hooks
├── routes/         # TanStack Router file-based routes
├── stores/         # Auth context provider
├── types/          # TypeScript type definitions
└── lib/            # Utility functions
```

## Pages

| Route | Description |
| --- | --- |
| `/login` | Login page |
| `/register` | Registration page |
| `/` | Dashboard — KPI cards + device fleet table |
| `/devices` | Device list with search and status filters |
| `/devices/:deviceId` | Device detail — telemetry, commands, alarms |
| `/alarms` | Alarm list with status/severity filters and actions |

## Authentication

JWT-based auth via the backend's `/api/auth/login` endpoint. Tokens are stored in `localStorage` and parsed for user profile and role information. Route guards in the TanStack Router layout routes protect authenticated pages and redirect unauthenticated users to `/login`.

Supported roles: `InternalAdmin`, `InternalTech`, `CompanyAdmin`, `CompanyTech`, `HomeownerViewer`.

## Documentation

Detailed documentation is available in the [`docs/`](docs/) folder:

- [Architecture Overview](docs/architecture.md) — tech stack, project structure, request lifecycle
- [Authentication](docs/authentication.md) — login flow, JWT handling, roles, route guards
- [Routing](docs/routing.md) — route map, layout routes, adding new routes
- [API Layer](docs/api-layer.md) — Axios client, response normalization, query hooks
- [Pages & Features](docs/pages.md) — detailed breakdown of each page
- [State Management](docs/state-management.md) — TanStack Query, auth context, UI state
