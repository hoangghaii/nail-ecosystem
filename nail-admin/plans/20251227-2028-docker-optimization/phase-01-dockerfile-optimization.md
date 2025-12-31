# Phase 1: Dockerfile Optimization

**Time**: 45 minutes
**Priority**: CRITICAL
**Dependencies**: None

---

## Overview

Fix critical bugs and optimize Dockerfile with multi-stage build best practices.

**Bugs Fixed:**
- Line 34: `npm ci --only=production` → `npm ci` (build needs devDeps)
- Line 56: `&` → `&&` (syntax error in user creation)

**Optimizations Added:**
- ARG for Vite environment variables
- HEALTHCHECK instruction
- BuildKit cache mounts
- Image metadata labels
- Improved layer caching

---

## Current Dockerfile Issues

```dockerfile
# Line 34 - WRONG (build fails, missing devDeps)
RUN npm ci --only=production && \
  npm cache clean --force

# Line 56 - SYNTAX ERROR (user creation fails)
RUN addgroup -g 1001 -S nginx-user & \  # ❌ Should be &&
  adduser -S nginx-user -u 1001 -G nginx-user
```

---

## New Optimized Dockerfile

**Replace entire Dockerfile with:**

```dockerfile
# ==========================================
# ARGUMENTS (Build-time Configuration)
# ==========================================
# These are set during `docker build --build-arg KEY=value`
ARG NODE_VERSION=24.12.0

# Vite environment variables (required for build)
ARG VITE_USE_MOCK_API=true
ARG VITE_FIREBASE_API_KEY=""
ARG VITE_FIREBASE_AUTH_DOMAIN=""
ARG VITE_FIREBASE_PROJECT_ID=""
ARG VITE_FIREBASE_STORAGE_BUCKET=""
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=""
ARG VITE_FIREBASE_APP_ID=""


# ==========================================
# BASE LAYER (Dependency Management)
# ==========================================
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

# Copy package files ONLY for layer caching
# If package.json unchanged, this layer is cached
COPY package*.json ./


# ==========================================
# DEVELOPMENT LAYER
# ==========================================
FROM base AS development

# Install ALL dependencies (includes devDependencies)
# Use cache mount for faster installs (BuildKit feature)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy application source code
COPY . .

# Expose Vite dev server port
EXPOSE 5174

# Start development server
# --host 0.0.0.0 makes server accessible from host machine
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# ==========================================
# BUILDER LAYER (Production Build)
# ==========================================
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (build requires devDependencies!)
# FIX: Removed --only=production (caused build failures)
RUN --mount=type=cache,target=/root/.npm \
    npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Pass Vite env vars to build process
# ARG → ENV makes them available during build
ARG VITE_USE_MOCK_API
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_USE_MOCK_API=${VITE_USE_MOCK_API}
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}

# Build application
RUN npm run build

# Clean up (AFTER build, not before!)
RUN rm -rf src node_modules


# ==========================================
# PRODUCTION LAYER (Nginx Runtime)
# ==========================================
FROM nginx:1.27-alpine AS production

# Image metadata (OCI standard labels)
LABEL org.opencontainers.image.title="Pink Nail Admin"
LABEL org.opencontainers.image.description="Admin dashboard for Pink Nail salon"
LABEL org.opencontainers.image.version="0.2.0"
LABEL org.opencontainers.image.vendor="Pink Nail"
LABEL org.opencontainers.image.created="2025-12-27"
LABEL org.opencontainers.image.url="https://github.com/pinknail/admin"

# Install dumb-init for proper signal handling in containers
RUN apk add --no-cache dumb-init

# Copy nginx configuration files
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user for security
# FIX: Changed & to && (syntax error fix)
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user

# Set ownership for nginx directories
# nginx-user needs write access to these directories
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx-user:nginx-user /var/run/nginx.pid

# Switch to non-root user (security best practice)
USER nginx-user

# Expose nginx port
EXPOSE 81

# Health check for container orchestration
# Kubernetes/Docker Swarm uses this to determine container health
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:81/health || exit 1

# Use dumb-init to handle signals properly (SIGTERM, SIGKILL)
ENTRYPOINT ["dumb-init", "--"]

# Start nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
```

---

## Implementation Steps

### 1. Backup Current Dockerfile (5 min)

```bash
# Navigate to project root
cd /Users/hainguyen/Documents/nail-project/nail-admin

# Create backup
cp Dockerfile Dockerfile.backup.$(date +%Y%m%d-%H%M)

# Verify backup
ls -la Dockerfile.backup.*
```

### 2. Replace Dockerfile (10 min)

```bash
# Option 1: Manual edit
# - Open Dockerfile in editor
# - Replace entire content with template above
# - Save file

# Option 2: Create from template (if automated)
cat > Dockerfile << 'EOF'
[paste template above]
EOF
```

### 3. Test Development Build (10 min)

```bash
# Enable BuildKit for cache mounts
export DOCKER_BUILDKIT=1

# Build development target
docker build --target development -t nail-admin:dev .

# Expected output:
# => [base 1/2] WORKDIR /app
# => [base 2/2] COPY package*.json ./
# => [development 1/2] RUN npm ci
# => [development 2/2] COPY . .
# => exporting to image
# => => naming to docker.io/library/nail-admin:dev

# Verify image exists
docker images | grep nail-admin

# Expected: nail-admin  dev  [image-id]  [time]  ~500MB
```

### 4. Test Production Build (15 min)

```bash
# Build production target with env vars
docker build \
  --target production \
  --build-arg VITE_USE_MOCK_API=true \
  --build-arg VITE_FIREBASE_API_KEY=test_key \
  -t nail-admin:prod \
  .

# Expected output:
# => [builder 1/3] COPY package*.json ./
# => [builder 2/3] RUN npm ci
# => [builder 3/3] COPY . .
# => [builder] RUN npm run build
# => [production] COPY nginx.conf
# => [production] COPY --from=builder /app/dist
# => exporting to image
# => => naming to docker.io/library/nail-admin:prod

# Verify image size (<150MB)
docker images nail-admin:prod

# Expected: nail-admin  prod  [id]  [time]  100-150MB
```

### 5. Verify Health Check (5 min)

```bash
# Run production container
docker run -d --name nail-admin-test -p 8081:81 nail-admin:prod

# Wait 30 seconds for health check
sleep 30

# Check health status
docker inspect nail-admin-test | grep -A 5 "Health"

# Expected:
# "Health": {
#   "Status": "healthy",
#   "FailingStreak": 0,
#   "Log": [...]
# }

# Test health endpoint manually
curl http://localhost:8081/health

# Expected: "healthy"

# Cleanup
docker stop nail-admin-test
docker rm nail-admin-test
```

---

## Validation Checklist

### Build Validation
- [ ] Development build completes without errors
- [ ] Production build completes without errors
- [ ] No missing dependency errors
- [ ] Build time <5 minutes (first build)
- [ ] Subsequent builds use cache (faster)

### Image Validation
- [ ] Development image ~400-600MB
- [ ] Production image 100-150MB (not 1GB+)
- [ ] Images have correct tags (dev, prod)
- [ ] Production image includes nginx

### Runtime Validation
- [ ] Container starts successfully
- [ ] Health check passes after 30s
- [ ] Health endpoint returns 200 OK
- [ ] Non-root user (nginx-user:1001)
- [ ] Static files served correctly

### Security Validation
- [ ] No .env files in image
- [ ] Non-root user in production
- [ ] Minimal base image (alpine)
- [ ] No unnecessary packages

---

## Troubleshooting

### Build Fails with "Module not found"

**Symptom:** Build fails during `npm run build` with missing modules

**Cause:** npm ci --only=production excluded devDependencies

**Fix:** ✅ Already fixed (removed --only=production)

**Verify:**
```bash
# Check package.json has build tools in devDependencies
grep -A 5 "devDependencies" package.json | grep -E "(vite|typescript)"
```

### Syntax Error: "unexpected &"

**Symptom:** Build fails with shell syntax error at line 56

**Cause:** Single `&` instead of `&&` in RUN command

**Fix:** ✅ Already fixed (changed & to &&)

**Verify:**
```bash
# Check Dockerfile has && not single &
grep "addgroup.*nginx-user" Dockerfile
# Should show: addgroup ... && adduser
```

### Health Check Always Unhealthy

**Symptom:** `docker inspect` shows "Status": "unhealthy"

**Causes & Fixes:**

1. **wget not installed**
   ```bash
   # Check if wget exists
   docker exec nail-admin-test which wget
   # Fix: Ensure nginx:alpine includes wget (should by default)
   ```

2. **Wrong port in HEALTHCHECK**
   ```dockerfile
   # Verify port matches EXPOSE
   HEALTHCHECK ... http://localhost:81/health  # Must match EXPOSE 81
   ```

3. **Nginx not running**
   ```bash
   # Check nginx process
   docker exec nail-admin-test ps aux | grep nginx
   # Should show nginx master and worker processes
   ```

4. **/health endpoint not configured**
   ```bash
   # Test endpoint
   docker exec nail-admin-test wget -O- http://localhost:81/health
   # Should return "healthy"
   ```

### Image Size Still Large (>500MB)

**Symptom:** Production image >500MB

**Causes & Fixes:**

1. **Using wrong base image**
   ```dockerfile
   # Wrong: FROM nginx:latest (can be 150MB+)
   # Right: FROM nginx:1.27-alpine (~40MB)
   ```

2. **Not using multi-stage**
   ```bash
   # Check build target
   docker build --target production ...
   # Ensure using 'production' stage
   ```

3. **dist folder too large**
   ```bash
   # Check built assets size
   du -sh dist/
   # Should be <50MB for React app
   ```

### BuildKit Cache Not Working

**Symptom:** `npm ci` runs every time (slow)

**Fix:**
```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Or set in Docker daemon config
# /etc/docker/daemon.json
{
  "features": {
    "buildkit": true
  }
}

# Restart Docker daemon
sudo systemctl restart docker  # Linux
# or restart Docker Desktop (Mac/Windows)
```

---

## Performance Benchmarks

### Expected Build Times

| Scenario | First Build | Cached Build |
|----------|-------------|--------------|
| No changes | 3-5 min | N/A |
| Code change only | 3-4 min | 30-60 sec ✅ |
| package.json change | 4-5 min | 1-2 min ✅ |
| Dockerfile change | 3-5 min | 2-3 min |

### Image Sizes

| Stage | Expected Size | Actual | Status |
|-------|---------------|--------|--------|
| development | 400-600MB | ___ MB | [ ] |
| production | 100-150MB | ___ MB | [ ] |

---

## Rollback Procedure

If issues occur:

```bash
# Stop any running containers
docker stop $(docker ps -q --filter ancestor=nail-admin:prod)

# Restore backup
cp Dockerfile.backup.YYYYMMDD-HHMM Dockerfile

# Remove new images
docker rmi nail-admin:dev nail-admin:prod

# Rebuild with old Dockerfile (if needed)
docker build -t nail-admin:old .
```

---

## Next Steps

After successful validation:

1. ✅ Commit changes
   ```bash
   git add Dockerfile
   git commit -m "fix(docker): optimize Dockerfile with multi-stage build

   - Fix npm ci bug (Line 34: remove --only=production)
   - Fix syntax error (Line 56: & → &&)
   - Add HEALTHCHECK instruction
   - Add ARG for Vite env vars
   - Optimize layer caching
   - Add BuildKit cache mounts
   - Add image metadata labels
   - Reduce image size from 1GB+ to 100-150MB"
   ```

2. ➡️ Proceed to **Phase 2**: .dockerignore creation

3. 📝 Update documentation (after all phases complete)

---

## Completion Criteria

- [x] Dockerfile backup created
- [ ] Development build successful
- [ ] Production build successful
- [ ] Image size <150MB (production)
- [ ] Health check passes
- [ ] No build errors
- [ ] Changes committed to git

**Phase 1 Complete** ✅ → Move to Phase 2
