# Phase 03 — Dockerfile & Docker Compose

**Parent plan**: [plan.md](./plan.md)
**Depends on**: [phase-02-pnpm-workspace-setup.md](./phase-02-pnpm-workspace-setup.md)

---

## Overview

- **Date**: 2026-02-20
- **Priority**: High
- **Status**: pending
- **Description**: Update all 3 Dockerfiles to use pnpm. Docker Compose files require no changes (no npm references found).

---

## Key Insights

- Docker Compose files (`docker-compose.yml`, `docker-compose.dev.yml`, `docker-compose.prod.yml`) contain zero npm references — no changes needed
- All 3 Dockerfiles have identical npm usage patterns — same pnpm migration applies to all
- Current pattern: `COPY package*.json` + `npm ci` → New pattern: `COPY pnpm-lock.yaml pnpm-workspace.yaml` + `pnpm fetch` + `pnpm install --offline`
- `pnpm fetch` + `pnpm install --offline` is the Docker-optimized pattern: fetches only tarball metadata in one layer, installs from virtual store in next — maximizes cache hits
- Current npm cache mount `--mount=type=cache,target=/root/.npm` → becomes `--mount=type=cache,target=/root/.local/share/pnpm/store`
- `CMD ["npm", "run", ...]` → `CMD ["pnpm", "run", ...]` in all dev stages
- `RUN npm run build -- --filter=...` → `RUN pnpm run build -- --filter=...` in builder stages
- API production stage: `npm ci --omit=dev` → `pnpm install --frozen-lockfile --prod`
- Node base images already include npm; pnpm must be installed via corepack or curl

---

## Requirements

- Phase 02 complete (`pnpm-lock.yaml` exists at root)
- Docker BuildKit enabled (already used — `--mount=type=cache` syntax)

---

## Related Code Files

| File | Action |
|------|--------|
| `/Users/hainguyen/Documents/nail-project/apps/client/Dockerfile` | modify |
| `/Users/hainguyen/Documents/nail-project/apps/admin/Dockerfile` | modify |
| `/Users/hainguyen/Documents/nail-project/apps/api/Dockerfile` | modify |
| `/Users/hainguyen/Documents/nail-project/docker-compose.yml` | no change |
| `/Users/hainguyen/Documents/nail-project/docker-compose.dev.yml` | no change |
| `/Users/hainguyen/Documents/nail-project/docker-compose.prod.yml` | no change |

---

## Implementation Steps

### Step 1 — pnpm installation strategy in Docker

Use corepack (ships with Node 24/20) — no extra layer needed:

```dockerfile
# Enable corepack and install pnpm (matches packageManager field in package.json)
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate
```

Place this in the `base` stage so all downstream stages inherit it.

### Step 2 — Cache mount path for pnpm

pnpm store path on Linux (inside container): `/root/.local/share/pnpm/store`

Optionally set store path explicitly for clarity:
```dockerfile
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
```

### Step 3 — Updated `apps/client/Dockerfile`

Full replacement:

```dockerfile
# ==========================================
# BASE LAYER - Package Metadata
# ==========================================
FROM node:24.12.0-alpine AS base

RUN apk add --no-cache dumb-init

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

WORKDIR /app

# Copy workspace manifests (order matters for layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./

# Copy all workspace package manifests
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/
COPY tooling/prettier-config/package.json ./tooling/prettier-config/

# Copy client package.json
COPY apps/client/package.json ./apps/client/

# ==========================================
# DEPENDENCIES LAYER - Fetch packages
# ==========================================
FROM base AS dependencies

# Fetch: download tarballs to virtual store (no node_modules yet)
# This layer only re-runs when pnpm-lock.yaml changes
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm fetch

# Install from virtual store (offline — no network needed)
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --offline

# ==========================================
# DEVELOPMENT LAYER
# ==========================================
FROM dependencies AS development

COPY . .

WORKDIR /app/apps/client

EXPOSE 5173

RUN addgroup -g 1001 -S nodejs && \
  adduser -S viteuser -u 1001 -G nodejs && \
  chown -R viteuser:nodejs /app

USER viteuser

ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==========================================
# BUILDER LAYER
# ==========================================
FROM dependencies AS builder

COPY . .

WORKDIR /app

RUN pnpm run build -- --filter=client

# ==========================================
# PRODUCTION LAYER - Nginx Serving Static Files
# ==========================================
FROM nginx:1.27-alpine AS production

RUN apk add --no-cache dumb-init

COPY apps/client/nginx/nginx.conf /etc/nginx/nginx.conf
COPY apps/client/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

RUN addgroup -g 1001 -S nginx-user && \
  adduser -S nginx-user -u 1001 -G nginx-user

RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
  chown -R nginx-user:nginx-user /var/cache/nginx && \
  chown -R nginx-user:nginx-user /var/log/nginx && \
  chown -R nginx-user:nginx-user /etc/nginx/nginx.conf && \
  chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx-user:nginx-user /var/run/nginx.pid

USER nginx-user

EXPOSE 80

ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
```

### Step 4 — Updated `apps/admin/Dockerfile`

Identical structure to client Dockerfile with these differences:
- `COPY apps/admin/package.json ./apps/admin/` (line 19)
- `WORKDIR /app/apps/admin` in development stage
- `EXPOSE 5174` in development stage
- `RUN pnpm run build -- --filter=admin` in builder stage
- nginx config paths: `apps/admin/nginx/...`
- `COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html`
- `EXPOSE 81` in production stage

Full replacement (only diff sections shown — apply same pnpm pattern as client):

```dockerfile
# BASE LAYER — same as client but for admin
FROM node:24.12.0-alpine AS base
RUN apk add --no-cache dumb-init
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tailwind-config/package.json ./packages/tailwind-config/
COPY tooling/prettier-config/package.json ./tooling/prettier-config/
COPY apps/admin/package.json ./apps/admin/

FROM base AS dependencies
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm fetch
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --offline

FROM dependencies AS development
COPY . .
WORKDIR /app/apps/admin
EXPOSE 5174
RUN addgroup -g 1001 -S nodejs && \
  adduser -S viteuser -u 1001 -G nodejs && \
  chown -R viteuser:nodejs /app
USER viteuser
ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM dependencies AS builder
COPY . .
WORKDIR /app
RUN pnpm run build -- --filter=admin

FROM nginx:1.27-alpine AS production
RUN apk add --no-cache dumb-init
COPY apps/admin/nginx/nginx.conf /etc/nginx/nginx.conf
COPY apps/admin/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html
RUN addgroup -g 1001 -S nginx-user && \
  adduser -S nginx-user -u 1001 -G nginx-user
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
  chown -R nginx-user:nginx-user /var/cache/nginx && \
  chown -R nginx-user:nginx-user /var/log/nginx && \
  chown -R nginx-user:nginx-user /etc/nginx/nginx.conf && \
  chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
  touch /var/run/nginx.pid && \
  chown -R nginx-user:nginx-user /var/run/nginx.pid
USER nginx-user
EXPOSE 81
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
```

### Step 5 — Updated `apps/api/Dockerfile`

Key differences from client/admin:
- Base image: `node:20.18.2-alpine` (different Node version — preserve this)
- No `tailwind-config` in package copies (api doesn't use it)
- `CMD ["pnpm", "run", "start:dev"]` in development stage
- `RUN pnpm run build -- --filter=api` in builder stage
- Has extra `production-deps` stage (install prod-only deps) — updated accordingly
- Production stage copies from `production-deps` node_modules

Full replacement:

```dockerfile
# ==========================================
# BASE LAYER - Package Metadata
# ==========================================
FROM node:20.18.2-alpine AS base

RUN apk add --no-cache dumb-init

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./

COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY tooling/prettier-config/package.json ./tooling/prettier-config/

COPY apps/api/package.json ./apps/api/

# ==========================================
# DEPENDENCIES LAYER - Fetch all deps
# ==========================================
FROM base AS dependencies

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm fetch

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --offline

# ==========================================
# DEVELOPMENT LAYER
# ==========================================
FROM dependencies AS development

COPY . .

WORKDIR /app/apps/api

EXPOSE 3000

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001 -G nodejs && \
  chown -R nestjs:nodejs /app

USER nestjs

ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "run", "start:dev"]

# ==========================================
# BUILD LAYER - Compile TypeScript
# ==========================================
FROM dependencies AS builder

COPY . .

WORKDIR /app

RUN pnpm run build -- --filter=api

# ==========================================
# PRODUCTION DEPENDENCIES LAYER
# ==========================================
FROM base AS production-deps

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm fetch --prod

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --offline --prod

# ==========================================
# PRODUCTION LAYER - Final production image
# ==========================================
FROM node:20.18.2-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001 -G nodejs

COPY --from=production-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

USER nestjs

ENV NODE_ENV=production \
  PORT=3000

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

Note: `COPY apps/api/package*.json` becomes `COPY apps/api/package.json` (no lockfile in production image — only compiled dist + prod node_modules).

### Step 6 — Dev compose volume mounts (no change needed)

`docker-compose.dev.yml` mounts entire monorepo `.:/app` and excludes `node_modules` via anonymous volumes — this works identically with pnpm. No changes required.

### Step 7 — Verify Docker builds locally

```bash
# Test client build
docker build -f apps/client/Dockerfile --target development -t nail-client:dev .
docker build -f apps/client/Dockerfile --target production -t nail-client:prod .

# Test admin build
docker build -f apps/admin/Dockerfile --target development -t nail-admin:dev .
docker build -f apps/admin/Dockerfile --target production -t nail-admin:prod .

# Test api build
docker build -f apps/api/Dockerfile --target development -t nail-api:dev .
docker build -f apps/api/Dockerfile --target production -t nail-api:prod .
```

---

## Todo Checklist

- [ ] `apps/client/Dockerfile` updated — corepack + pnpm fetch + pnpm install + pnpm run
- [ ] `apps/admin/Dockerfile` updated — same pattern
- [ ] `apps/api/Dockerfile` updated — same pattern + `--prod` flag in production-deps stage
- [ ] docker-compose files verified (no changes needed)
- [ ] Client dev Docker build passes
- [ ] Client prod Docker build passes
- [ ] Admin dev Docker build passes
- [ ] Admin prod Docker build passes
- [ ] API dev Docker build passes
- [ ] API prod Docker build passes

---

## Success Criteria

- All 6 Docker build targets succeed without errors
- `pnpm fetch` layer cached on rebuild (only re-fetches when `pnpm-lock.yaml` changes)
- Dev containers start and serve hot-reload correctly
- Production containers start and serve static/compiled assets correctly

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `corepack prepare` slow on first build (downloads pnpm) | Medium | Cache pnpm store layer; subsequent builds use cache |
| `pnpm fetch --prod` not available in pnpm 10 | Low | `pnpm fetch` supports `--prod` flag since pnpm 7 |
| `pnpm install --offline` fails if fetch didn't cache correctly | Low | Both fetch + install share same cache mount — guaranteed consistent |
| API `package*.json` COPY glob missing lockfile in prod stage | N/A | Production stage only copies `package.json` (no lockfile needed — prod node_modules already installed) |

---

## Next Steps

Proceed to [phase-04-validation-and-cleanup.md](./phase-04-validation-and-cleanup.md)
