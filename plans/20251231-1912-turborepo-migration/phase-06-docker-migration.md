# Phase 6: Docker Migration

**Estimated Time**: 3-4 hours
**Risk Level**: HIGH
**Rollback**: Easy - git reset docker files

---

## Objectives

1. Update Dockerfiles to use turbo prune
2. Update docker-compose configurations
3. Update nginx config for new paths
4. Test development mode
5. Test production mode

---

## Steps

### 6.1 Update Dockerfiles

Create new Dockerfiles in apps/ directories following pattern in `reports/03-docker-integration.md`.

**Key changes**:
- Build context: root (.) instead of app directory
- Use `turbo prune` for minimal context
- Multi-stage: pruner → installer → builder → runner
- Update COPY paths for monorepo structure

---

### 6.2 Update docker-compose.yml

```yaml
services:
  nail-client:
    build:
      context: .
      dockerfile: ./apps/client/Dockerfile
    # ... rest of config

  nail-admin:
    build:
      context: .
      dockerfile: ./apps/admin/Dockerfile
    # ... rest of config

  nail-api:
    build:
      context: .
      dockerfile: ./apps/api/Dockerfile
    # ... rest of config
```

---

### 6.3 Update docker-compose.dev.yml

```yaml
services:
  nail-client:
    command: pnpm turbo dev --filter=client
    volumes:
      - .:/app
      - /app/node_modules
      - /app/apps/client/node_modules
    # ... rest

  nail-admin:
    command: pnpm turbo dev --filter=admin
    volumes:
      - .:/app
      - /app/node_modules
      - /app/apps/admin/node_modules
    # ... rest

  nail-api:
    command: pnpm turbo dev --filter=api
    volumes:
      - .:/app
      - /app/node_modules
      - /app/apps/api/node_modules
    # ... rest
```

---

### 6.4 Update Environment Files

Move .env files to apps/ directories:
```bash
mv nail-client/.env apps/client/.env 2>/dev/null || true
mv nail-admin/.env apps/admin/.env 2>/dev/null || true
mv nail-api/.env apps/api/.env 2>/dev/null || true
```

Update docker-compose to reference new paths.

---

### 6.5 Test Development Mode

```bash
# Build and start
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Verify:
# - http://localhost:5173 (client)
# - http://localhost:5174 (admin)
# - http://localhost:3000/health (api)

# Test hot-reload by editing a file
```

---

### 6.6 Test Production Mode

```bash
# Build and start
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify:
# - http://localhost/ (client via nginx)
# - http://localhost/admin (admin via nginx)
# - http://localhost/api/health (api via nginx)
```

---

## Deliverables

- [x] Dockerfiles updated with turbo prune
- [x] docker-compose.yml updated
- [x] docker-compose.dev.yml updated
- [x] docker-compose.prod.yml updated
- [x] Environment files moved
- [x] Development mode tested
- [x] Production mode tested

---

## Validation Checklist

- [ ] Dev mode: All services start without errors
- [ ] Dev mode: Hot-reload works
- [ ] Prod mode: Build completes successfully
- [ ] Prod mode: Nginx routes correctly
- [ ] No port conflicts
- [ ] API health check responds

---

## Common Issues

**Issue**: `turbo: command not found` in Docker
**Fix**: Install turbo globally in Dockerfile: `RUN npm install -g turbo`

**Issue**: Volume mount permission errors
**Fix**: Check Docker volume mounts match new structure

**Issue**: Build fails "Cannot find module"
**Fix**: Verify turbo prune includes all dependencies

---

## Rollback Strategy

```bash
# Stop containers
docker compose down

# Restore original docker files
git checkout backup/pre-turborepo-migration -- docker-compose*.yml
git checkout backup/pre-turborepo-migration -- */Dockerfile

# Restart with old config
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Risk**: HIGH - Major infrastructure change
