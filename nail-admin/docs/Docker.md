# Docker Guide - Pink Nail Admin

Comprehensive guide for Docker infrastructure with multi-stage builds, hot reload development, and production orchestration.

---

## Overview

**Architecture**: Multi-stage Docker build with shared dependency caching

```
BASE (package.json)
  → DEPENDENCIES (npm ci - CACHED!)
    → DEVELOPMENT (Vite dev server)
    → BUILDER (npm run build)
      → PRODUCTION (nginx + static files)
```

**Image Sizes:**
- Development: ~450MB (Node.js + dependencies)
- Production: **78.6MB** (nginx + built assets only)

**Build Performance:**
- First build: 3-5 min
- Code-only rebuild: 30-60 sec (dependencies cached!)
- package.json change: 1-2 min

---

## Prerequisites

- Docker 24.0+ with BuildKit enabled
- Docker Compose 2.20+
- 4GB RAM minimum, 8GB recommended

**Enable BuildKit:**
```bash
export DOCKER_BUILDKIT=1
# Or add to ~/.bashrc / ~/.zshrc
```

---

## Quick Start

### Development (3 commands)

```bash
# 1. Navigate to project
cd nail-admin

# 2. Start development (auto-loads compose.override.yml)
docker compose up

# 3. Visit http://localhost:5174
# Login: admin@pinknail.com / admin123
```

**Hot reload works automatically!** Edit files in `src/` and see changes instantly.

### Production (2 commands)

```bash
# 1. Build and start production
docker compose -f docker-compose.prod.yml up -d

# 2. Visit http://localhost:8081
curl http://localhost:8081/health  # Should return "healthy"
```

---

## Development Guide

### Starting Development

```bash
docker compose up        # Foreground (see logs)
docker compose up -d     # Background (detached)
```

### Hot Module Replacement (HMR)

**Automatic** - Edit any file in `src/` and browser reloads in <3 seconds.

**How it works:**
- `CHOKIDAR_USEPOLLING=true` enables file watching in Docker
- Bind mounts sync host files → container: `./src:/app/src:cached`
- Vite HMR config: `server.watch.usePolling: true`

### View Logs

```bash
docker compose logs       # All logs
docker compose logs -f    # Follow (tail -f)
docker compose logs app   # App service only
```

### Shell Access

```bash
# Interactive shell in running container
docker compose exec app sh

# Run commands
docker compose exec app npm run lint
docker compose exec app ls -la src/
```

### Rebuilding After Dependencies Change

```bash
# Rebuild when package.json changes
docker compose up --build

# Force rebuild (ignore cache)
docker compose build --no-cache
```

### Stopping Development

```bash
docker compose down           # Stop and remove containers
docker compose down -v        # Also remove volumes
```

---

## Production Deployment

### Build Production Image

```bash
# Build with environment variables
docker compose -f docker-compose.prod.yml build \
  --build-arg VITE_USE_MOCK_API=false \
  --build-arg VITE_FIREBASE_API_KEY=your_key
```

### Start Production

```bash
# Start detached with auto-restart
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
```

### Health Checks

```bash
# Check health endpoint
curl http://localhost:8081/health
# Output: healthy

# Check Docker health status
docker inspect nail-admin-prod --format='{{.State.Health.Status}}'
# Output: healthy
```

### Resource Monitoring

```bash
# Real-time stats
docker stats nail-admin-prod

# Resource limits (from compose):
# - CPU: 1 core max, 0.25 reserved
# - Memory: 512MB max, 128MB reserved
```

### Logs

```bash
# View production logs
docker compose -f docker-compose.prod.yml logs -f

# Logs are rotated automatically:
# - Max 10MB per file
# - Keep 3 files (30MB total)
```

### Stopping Production

```bash
docker compose -f docker-compose.prod.yml down
```

---

## Environment Variables

### Build-time Variables (ARG)

Set during `docker build` or in compose `args:`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_VERSION` | `24.12.0` | Node.js version |
| `VITE_USE_MOCK_API` | `true` | Use mock data vs real API |
| `VITE_FIREBASE_API_KEY` | `""` | Firebase API key (placeholder) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `""` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | `""` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `""` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `""` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | `""` | Firebase app ID |

### Runtime Variables (ENV)

Set in compose `environment:` or via `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `CHOKIDAR_USEPOLLING` | `true` (dev) | File watching (Docker required) |

### Setting Variables

**Development (.env file):**
```env
VITE_USE_MOCK_API=true
VITE_FIREBASE_API_KEY=dev_key_here
```

**Production (compose file):**
```yaml
build:
  args:
    - VITE_FIREBASE_API_KEY=${FIREBASE_KEY}
```

---

## Docker Compose Reference

### File Structure

```
nail-admin/
├── docker-compose.yml           # Base config
├── docker-compose.override.yml  # Dev overrides (auto-loaded!)
└── docker-compose.prod.yml      # Production config
```

### Key Commands

| Command | Description |
|---------|-------------|
| `docker compose up` | Start dev (auto-loads override) |
| `docker compose up -d` | Start dev detached |
| `docker compose build` | Rebuild dev image |
| `docker compose down` | Stop dev containers |
| `docker compose logs -f` | Follow dev logs |
| `docker compose -f docker-compose.prod.yml up -d` | Start production |
| `docker compose -f docker-compose.prod.yml ps` | Check prod status |
| `docker compose -f docker-compose.prod.yml down` | Stop production |

---

## Troubleshooting

### Hot Reload Not Working

**Symptoms:** Code changes don't trigger browser reload

**Solutions:**
1. Verify `CHOKIDAR_USEPOLLING=true` in compose.override.yml
2. Check vite.config.ts has `server.watch.usePolling: true`
3. Ensure bind mounts correct (not node_modules)
4. Restart: `docker compose restart app`
5. WSL2 users: File watching has known issues - use native Docker

### Build Fails: Module Not Found

**Symptoms:** Build fails with missing dependencies

**Solutions:**
1. Ensure DEPENDENCIES stage uses `npm ci` (NOT `npm ci --omit=dev`)
2. Check .dockerignore doesn't exclude package-lock.json
3. Clear BuildKit cache: `docker builder prune`
4. Rebuild without cache: `docker compose build --no-cache`

### Health Check Failing

**Symptoms:** Container marked unhealthy

**Solutions:**
1. Check /health endpoint: `curl http://localhost:8081/health`
2. Verify wget installed: `docker exec nail-admin-prod which wget`
3. Check nginx running: `docker exec nail-admin-prod ps aux | grep nginx`
4. Review logs: `docker compose -f docker-compose.prod.yml logs`

### Large Image Size

**Symptoms:** Production image >500MB

**Solutions:**
1. Verify using production target: `--target production`
2. Check .dockerignore excludes node_modules, .git
3. Inspect layers: `docker history nail-admin:prod`
4. Expected size: ~80MB (nginx:alpine + static files)

### Container Crashes on Startup

**Symptoms:** Container exits immediately or restarts

**Solutions:**
1. Check logs: `docker logs nail-admin-prod`
2. Common issues:
   - nginx config syntax error: `docker run --rm -v $(pwd)/nginx:/etc/nginx nginx:alpine nginx -t`
   - Permission errors: Check file ownership in Dockerfile
   - Port already in use: `lsof -i :8081`

### Permission Denied Errors

**Symptoms:** nginx can't read config files

**Solutions:**
1. Verify ownership set in Dockerfile before `USER nginx-user`
2. Check: `chown -R nginx-user:nginx-user /etc/nginx`
3. Remove read_only if enabled (complex setup needed)

---

## Security

### Implemented Security Measures

✅ **Non-root user** - Container runs as `nginx-user:1001`
✅ **Minimal base image** - Alpine Linux (~40MB)
✅ **Security headers** - CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
✅ **No secret leakage** - .dockerignore excludes .env files
✅ **Health checks** - Automatic container restart on failure
✅ **no-new-privileges** - Prevents privilege escalation
✅ **Log rotation** - Prevents disk exhaustion

### Security Headers

Verify headers:
```bash
curl -I http://localhost:8081 | grep -E "X-Frame|Content-Security|Permissions"
```

Should include:
- `X-Frame-Options: SAMEORIGIN` (clickjacking protection)
- `Content-Security-Policy: ...` (XSS protection)
- `Permissions-Policy: ...` (feature restrictions)
- `X-Content-Type-Options: nosniff` (MIME sniffing protection)

### Vulnerability Scanning

```bash
# Scan image with Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image nail-admin:prod

# Scan Dockerfile
docker run --rm -i hadolint/hadolint < Dockerfile
```

**Expected**: <10 high/critical CVEs (nginx:alpine baseline)

### Secrets Management

**Never commit secrets!**

**Development:** Use .env files (gitignored)
**Production:** Use Docker secrets or environment variables from secret manager

```bash
# Docker Swarm secrets
echo "real_firebase_key" | docker secret create firebase_key -
docker service create --secret firebase_key ...

# Or Kubernetes secrets
kubectl create secret generic firebase --from-literal=key=real_value
```

---

## Performance Optimization

### BuildKit Caching

**Already enabled** with `RUN --mount=type=cache,target=/root/.npm`

**Benefits:**
- 60-70% faster dependency installs
- Shared cache across builds
- Persistent even with `--no-cache`

### Layer Caching Strategy

**Optimized order:**
1. Copy package.json (changes rarely)
2. Run npm ci (cached if package.json unchanged)
3. Copy source code (changes frequently)
4. Build application

**Result:** Source changes don't rebuild dependencies!

### Build Performance Benchmarks

| Scenario | Time | Explanation |
|----------|------|-------------|
| First build | 3-5 min | Full download + install + build |
| Code change only | 30-60 sec | Reuses DEPENDENCIES layer |
| package.json change | 1-2 min | Rebuilds dependencies |
| Full cache clear | 3-5 min | Same as first build |

### Image Size Optimization

**Achieved:**
- Production: 78.6MB (91% smaller than unoptimized ~1GB)
- Uses nginx:alpine (smallest nginx image)
- Multi-stage build discards Node.js layers

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          target: production
          push: true
          tags: myregistry/nail-admin:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            VITE_FIREBASE_API_KEY=${{ secrets.FIREBASE_KEY }}
```

---

## File Structure

```
nail-admin/
├── Dockerfile                       # Multi-stage build
├── .dockerignore                    # Build context exclusions
├── docker-compose.yml               # Base configuration
├── docker-compose.override.yml      # Development (auto-loaded!)
├── docker-compose.prod.yml          # Production
├── nginx/
│   ├── nginx.conf                   # Global nginx config
│   └── default.conf                 # Site config
├── docs/
│   └── Docker.md                    # This file
└── .env                             # Environment variables (gitignored)
```

---

## Appendix

### Useful Commands

```bash
# Clean up everything
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove specific image
docker rmi nail-admin:prod

# Inspect image layers
docker history nail-admin:prod

# View image size breakdown
docker images nail-admin:prod

# Export image
docker save nail-admin:prod | gzip > nail-admin-prod.tar.gz

# Import image
docker load < nail-admin-prod.tar.gz
```

### References

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose Spec](https://docs.docker.com/compose/compose-file/)
- [Nginx Docker](https://hub.docker.com/_/nginx)
- [Vite Docker Guide](https://vitejs.dev/guide/backend-integration.html)

---

**Last Updated:** 2025-12-27
**Version:** 1.0.0
**Maintainer:** Pink Nail Admin Team
