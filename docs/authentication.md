# Authentication

## Overview

Authentication uses JWT bearer tokens issued by the ASP.NET Core backend. The frontend stores the token in `localStorage`, parses claims from it, and attaches it to every API request via an Axios interceptor.

## Login Flow

1. User submits email and password on `/login`.
2. `authApi.login()` POSTs to `POST /api/auth/login`.
3. Backend returns `{ token }` on success.
4. Token is saved to `localStorage` under the key `sentinel_token`.
5. `AuthProvider` parses the JWT to extract user profile and roles.
6. Router redirects the user to the dashboard (`/`).

## Registration Flow

1. User fills out the form on `/register` (email, password, name, role).
2. `authApi.register()` POSTs to `POST /api/auth/register`.
3. On success, the user is redirected to `/login` to sign in.

## Token Management

- **Storage**: `localStorage` key `sentinel_token`.
- **Expiry Check**: On mount, `AuthProvider` checks the `exp` claim. Expired tokens are removed automatically.
- **Injection**: The Axios request interceptor reads the token from storage and sets the `Authorization: Bearer <token>` header on every request.
- **401 Handling**: The Axios response interceptor catches `401 Unauthorized` responses, clears the token, and redirects to `/login` (unless already on an auth page).

## JWT Claim Parsing

The backend uses ASP.NET Identity claim URIs. The auth store maps these to a `UserProfile`:

| Claim URI | Maps to |
| --- | --- |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` | `id` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` | `email` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname` | `firstName` |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname` | `lastName` |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` | `roles[]` |
| `companyId` | `companyId` |
| `customerId` | `customerId` |

Standard OIDC fallback claims (`sub`, `email`, `given_name`, `family_name`, `role`) are also supported.

## Roles

The system has five roles organized into three tiers:

| Tier | Roles | Description |
| --- | --- | --- |
| Internal | `InternalAdmin`, `InternalTech` | Platform operators — full access |
| Company | `CompanyAdmin`, `CompanyTech` | Installer/service company staff — scoped to their company |
| Homeowner | `HomeownerViewer` | End customer — read-only, scoped to their site |

The `useAuth()` hook exposes convenience booleans:

- `isInternal` — true for `InternalAdmin` or `InternalTech`
- `isCompanyUser` — true for `CompanyAdmin` or `CompanyTech`
- `isHomeowner` — true for `HomeownerViewer`

These are used for conditional UI rendering (e.g., showing command buttons only to internal/company users).

## Route Guards

- **`_auth` layout**: Redirects to `/` if a valid token exists (prevents logged-in users from seeing login/register).
- **`_app` layout**: Redirects to `/login` if no token exists (protects all authenticated pages).

Both guards run in `beforeLoad` so navigation is blocked before any component renders.

## Key Files

| File | Purpose |
| --- | --- |
| `src/stores/auth-store.tsx` | AuthContext provider, JWT parsing, role helpers |
| `src/api/client.ts` | Axios instance with token injection and 401 handling |
| `src/api/auth.ts` | Login and register API calls |
| `src/types/auth.ts` | Request/response type definitions |
| `src/types/enums.ts` | `UserRole` type definition |
| `src/routes/_auth.tsx` | Unauthenticated route guard |
| `src/routes/_app.tsx` | Authenticated route guard |
