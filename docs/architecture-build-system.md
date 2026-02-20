# Architecture — Build System & Observability

---

## Turborepo Build System

### turbo.json Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": { "outputs": [] },
    "type-check": { "outputs": [] },
    "clean": { "cache": false }
  }
}
```

### Build Performance

**Full Build** (all apps, parallel):
- Time: 7.023s
- Apps: client + admin + API
- Dependency graph: respects `^build` (packages first)

**Cached Build** (FULL TURBO):
- Time: 89ms
- Improvement: 79x faster (98.7% time reduction)
- Cache hit rate: 100% on repeat builds

### Task Execution

**Parallel Tasks**:
- `npm run type-check` — All apps in parallel (3.937s)
- `npm run lint` — All apps in parallel
- `npm run dev` — All apps in parallel (persistent)

**Sequential Tasks**:
- `npm run build` — Respects dependency graph (packages → apps)

### Filtering

```bash
npx turbo build --filter=client
npx turbo build --filter=admin
npx turbo build --filter=api
npx turbo dev --filter=client
```

### Caching Strategy

**Local Cache**:
- Location: `.turbo/cache`
- Stores: Build outputs, task results
- Invalidation: On source file changes, dependency changes, env var changes

**Remote Cache** (future):
- Vercel Remote Cache
- GitHub Actions cache
- Self-hosted Turbo server

---

## Monitoring & Observability

### Health Checks
- API: `GET /health` endpoint
- Docker: Container health checks
- Database: MongoDB Atlas monitoring
- Cache: Redis Cloud monitoring

### Logging
- API: NestJS built-in logger
- Nginx: Access + error logs
- Docker: `docker compose logs -f [service]`

### Metrics (Future)
- Request latency
- Error rates
- Cache hit rates
- Database query performance

---

## Migration Summary

**Turborepo Migration**: 2025-12-31 (Complete, 7/7 phases)

Achievements:
- Turborepo setup with npm workspaces
- 7 shared packages created
- Type duplication eliminated (100% → 0%)
- Build caching enabled (79x faster)
- Docker migration complete (monorepo-aware)

**Performance**:
- Before: ~20s per app (sequential builds)
- After: 7s full / 89ms cached (parallel builds)
