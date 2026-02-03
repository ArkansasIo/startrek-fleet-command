# Running the Project (Development & Production)

This document explains how to run the project locally, how to build it for production, and common troubleshooting steps.

Prerequisites
- Node.js >= 18
- pnpm (v10+ recommended)
- PostgreSQL (only required if you want to use the real DB; not required for development mock mode)
- `psql` on PATH if you plan to run DB scripts

Quick start
1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file from the included example and update values as needed:
```bash
cp .env.example .env
# edit .env to match your environment
```

3. Start development (client + server):
```bash
pnpm dev
```

Notes:
- `pnpm dev` runs `vite` (client) and `tsx watch server/index.ts` (server) concurrently.
- Client dev server defaults to port `5173`; server defaults to port `3000`.

Run client or server separately
- Client only (Vite):
```bash
pnpm run dev:client
```
- Server only (tsx watch):
```bash
pnpm run dev:server
```

Production build and run
1. Build client and server:
```bash
pnpm build
```
2. Start the compiled server:
```bash
pnpm start
```

What `pnpm build` does
- `build:client` → `vite build` (produces client assets in `dist/spa`)
- `build:server` → `tsc --project tsconfig.server.json` (compiles server into `dist/server`)

Database setup
- The server expects a PostgreSQL database (defaults are provided in `.env.example`).
- To create schema (run locally against your Postgres instance):
```bash
pnpm run db:setup
```
This runs `psql -d startrek_mmorpg -f server/database/schema.sql` — ensure the database `startrek_mmorpg` exists and `psql` can connect using the credentials in your environment.
- To seed demo data:
```bash
pnpm run db:seed
```

Environment variables
- See `.env.example` for recommended development values. Key variables:
  - `PORT` (server port)
  - `NODE_ENV` (development/production)
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`
  - `CORS_ORIGIN` (client origin)

Health check
- When the server is running, check:
  - `http://localhost:3000/health`

Troubleshooting
- `ENOPRO: No file system provider found for resource 'file:///...` when running commands from the assistant environment: this is a tooling limitation of the assistant's runner. Run the commands locally in your terminal instead.
- If the server fails to start due to missing tables, run `pnpm run db:setup` to apply `server/database/schema.sql`.
- If you prefer to run without Postgres in development, set `NODE_ENV=development` (default) and the server will continue in mock mode if DB connection fails.
- Ports conflict: run client and server separately and set a different `PORT` or Vite `--port` option.

Logs and debugging
- Server logs are written using the `Logger` utility (console output). Look for startup messages:
  - `Server running on port <port>`
  - `Database connection established` or `Database connection failed, running in mock mode`.

Next steps
- If you want, I can:
  - Attempt to start the dev server here again (may hit the same FS provider error).
  - Inspect additional server files (DB, routes) to list required env vars and endpoints.
  - Add CI-friendly scripts or Dockerfile for reproducible runs.
