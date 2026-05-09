# SMART Pump

Small full-stack monorepo for the SMART Pump developer exercise: a Hono + LowDB
API and a TanStack Start frontend with cookie-session authentication, account
profile, and balance lookups.

## Stack

- **API** — Hono, LowDB, Zod, HttpOnly cookie sessions
- **Web** — TanStack Start, React 19, TanStack Query, React Hook Form, Tailwind
  CSS v4, shadcn/ui + Base UI primitives
- **Shared** — `@smart-pump/contracts` (Zod schemas), `@workspace/ui`
  (cross-app components)
- **Tooling** — Turborepo, Bun, Ultracite (lint/format), Vitest

## Prerequisites

- Bun ≥ 1.3
- Node-compatible runtime is not required; the API and web both run under Bun

## Install

```bash
bun install
```

## Develop

Start the API and web app together:

```bash
bun run dev
```

- Web → http://localhost:3000
- API → http://localhost:3001

The web app reads `VITE_API_URL` (defaults to `http://localhost:3001`).

## Demo credentials

```
email:    henderson.briggs@geeknet.net
password: 23derd*334
```

Additional seed accounts (including an inactive one for testing rejection) live
in `data/users.json`.

## Common commands

```bash
bun run dev                       # all apps in dev mode
bun run build                     # production build
bun run typecheck                 # all packages
bun run --cwd apps/api test       # API unit/integration tests (Vitest)
bun run test:e2e                  # Playwright E2E (desktop + mobile)
bun run lint                      # ultracite check
bun run format                    # ultracite fix
```

## Structure

```
apps/
  api/        Hono service (auth, users modules)
  web/        TanStack Start app (login, /app account view)
packages/
  contracts/  Shared Zod schemas + inferred types
  ui/         Shared UI components (Tailwind + shadcn/Base UI)
data/
  users.json  Seed data (LowDB)
```

The API follows a per-module layering of `domain / infrastructure / transport`,
and the web app is organized as vertical slices under `src/features/`.

## API surface

```
POST   /auth/login
POST   /auth/logout
GET    /auth/session
GET    /users/me
GET    /users/me/balance
PATCH  /users/me
```

Sessions are persisted in LowDB and exchanged via an HttpOnly cookie.
`PATCH /users/me` accepts an allowlist of editable fields only (first/last
name, phone, address, age, eye color).
