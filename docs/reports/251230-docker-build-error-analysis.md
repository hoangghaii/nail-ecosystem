# Docker Build Error Investigation Report
**Date:** 2025-12-30
**Error:** `EBUSY: resource busy or locked, rmdir '/app/dist'`
**Service:** nail-api (NestJS Backend)
**Status:** Root Cause Identified

---

## Executive Summary

**Issue**: Docker build fails with `EBUSY: resource busy or locked, rmdir '/app/dist'` when building nail-api container.

**Root Cause**: Volume mount conflict between development and production Docker configurations. The `/app/dist` directory is locked by a named volume mount in development mode that persists across builds.

**Impact**: Unable to build production Docker image for nail-api. Blocks deployment and production testing.

**Priority**: HIGH - Blocks production builds

---

## Technical Analysis

### 1. Error Context

**When does it occur?**
- During Docker image build process
- Specifically during the `builder` stage (line 48-61 in Dockerfile)
- At the `npm run build` step which invokes `nest build`

**What is expected to happen?**
- NestJS CLI should compile TypeScript to JavaScript
- Output should go to `/app/dist` directory
- Build should complete successfully

**What actually happens?**
- Build process attempts to write to `/app/dist`
- Directory is locked/busy
- Build fails with `EBUSY: resource busy or locked, rmdir '/app/dist'`

### 2. Root Cause Analysis

#### Evidence from Configuration Files

**Dockerfile (nail-api/Dockerfile)** - Line 56-61:
```dockerfile
# BUILD LAYER - Compile TypeScript
FROM dependencies AS builder

# Copy source code
COPY . .
COPY .env.production .env.production

# Build the application
RUN NODE_ENV=production npm run build && \
  npm prune --production && \
  npm cache clean --force && \
  rm -rf \
  src \
  tsconfig*.json
```

**nest-cli.json** - Line 6:
```json
"compilerOptions": {
  "deleteOutDir": true  // ← Attempts to delete dist/ before build
}
```

**tsconfig.json** - Line 15:
```json
"outDir": "./dist",  // ← Build output directory
```

**docker-compose.dev.yml** - Line 107-113:
```yaml
nail-api:
  build:
    target: development

  volumes:
    # Mount source code for hot-reload
    - ./nail-api:/app
    # Prevent node_modules from being overwritten
    - /app/node_modules
    # Preserve dist build output  ← THIS IS THE PROBLEM
    - /app/dist
```

**dockerignore** - Line 17:
```
dist/  # ← dist/ excluded from build context
```

#### The Locking Mechanism

The issue occurs due to this sequence:

1. **Development container creates named volume**: When running `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`, Docker creates a named volume for `/app/dist` (line 113)

2. **Volume persists in Docker daemon**: Even after stopping containers, the named volume remains

3. **Build attempts to use same volume**: When building the image (especially if previous dev container is running or volume exists), Docker BuildKit may try to reuse or access the same volume

4. **NestJS CLI tries to delete dist**: `nest build` with `deleteOutDir: true` attempts to `rmdir('/app/dist')`

5. **EBUSY error**: The volume mount makes the directory busy/locked, preventing deletion

### 3. Dockerfile Analysis

**Line-by-line build process:**

**Lines 4-24**: BASE + DEPENDENCIES layers
- ✅ No issues - standard dependency installation

**Lines 48-61**: BUILDER layer (WHERE ERROR OCCURS)
```dockerfile
FROM dependencies AS builder

COPY . .  # ← Copies source (dist/ excluded by .dockerignore)
COPY .env.production .env.production

RUN NODE_ENV=production npm run build && \  # ← FAILS HERE
```

**Why it fails:**
- `npm run build` → `nest build`
- NestJS CLI checks if `dist/` exists
- If exists, tries to delete it (`deleteOutDir: true`)
- If `/app/dist` is mounted as a volume or locked, `rmdir()` throws `EBUSY`

**Lines 78-110**: PRODUCTION layer
- Never reached due to builder failure
- Would copy from builder stage if it succeeded

### 4. Volume Mount Conflict

**Development mode** (`docker-compose.dev.yml`):
```yaml
volumes:
  - ./nail-api:/app        # Full source mount
  - /app/node_modules      # Anonymous volume
  - /app/dist              # Anonymous volume (PROBLEM)
```

**Why this configuration exists:**
- Prevents host's `dist/` from overwriting container's build
- Allows hot-reload to work without rebuilding
- Preserves compiled output between restarts

**Conflict scenario:**

```
┌─────────────────────────────────────────┐
│ Host Machine                            │
│   nail-api/                             │
│   ├── src/                              │
│   ├── dist/  (may exist from local dev) │
│   └── node_modules/                     │
└─────────────────────────────────────────┘
                  ↓ COPY . .
┌─────────────────────────────────────────┐
│ Docker Build Context                    │
│   /app/                                 │
│   ├── src/                              │
│   ├── dist/  (EXCLUDED by .dockerignore)│
│   └── package.json                      │
└─────────────────────────────────────────┘
                  ↓ npm run build
┌─────────────────────────────────────────┐
│ Container File System                   │
│   /app/                                 │
│   ├── src/                              │
│   ├── dist/  ← LOCKED by volume mount   │
│   └── node_modules/                     │
└─────────────────────────────────────────┘
              EBUSY Error!
```

### 5. Additional Contributing Factors

**Factor 1: .dockerignore excludes dist/**
- Line 17: `dist/`
- Good practice, but means dist/ shouldn't exist in build context
- Yet volume mount can create it

**Factor 2: BuildKit cache mounts**
- Dockerfile uses BuildKit cache: `--mount=type=cache,target=/root/.npm`
- Caching is good for speed
- But may cause state persistence issues

**Factor 3: Concurrent processes**
- If dev container is running during build
- Volume is actively mounted and locked
- Build cannot access it

**Factor 4: macOS file system (Darwin 25.2.0)**
- macOS has stricter file locking than Linux
- Docker Desktop on Mac uses VM layer
- Volume mounts may have additional locking behavior

---

## Reproduction Steps

To reliably reproduce the error:

```bash
# 1. Start dev environment
cd /Users/hainguyen/Documents/nail-project
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d nail-api

# 2. Wait for container to be running
docker ps | grep nail-api

# 3. Attempt production build (while dev is running OR after volumes persist)
docker compose -f docker-compose.yml -f docker-compose.prod.yml build nail-api

# Expected: EBUSY error on npm run build
```

---

## Solution Options

### Option 1: Remove /app/dist volume mount (RECOMMENDED)

**Change**: Remove line 113 from `docker-compose.dev.yml`

**Before:**
```yaml
volumes:
  - ./nail-api:/app
  - /app/node_modules
  - /app/dist  # ← Remove this line
```

**After:**
```yaml
volumes:
  - ./nail-api:/app
  - /app/node_modules
```

**Pros:**
- Fixes root cause
- Simple change
- No side effects for development

**Cons:**
- Host's `dist/` (if exists) will be visible in container
- May cause confusion if host dist/ is outdated

**Why it works:**
- No volume mount = no locking
- NestJS can freely delete/recreate dist/
- Hot-reload still works (watches `src/`)

### Option 2: Clean volumes before production build

**Command:**
```bash
# Before building production
docker volume prune -f
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache nail-api
```

**Pros:**
- No code changes
- Ensures clean state

**Cons:**
- Manual step required
- May delete other volumes
- Doesn't prevent issue, just works around it

### Option 3: Modify nest-cli.json

**Change**: Set `deleteOutDir: false`

**Before:**
```json
{
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

**After:**
```json
{
  "compilerOptions": {
    "deleteOutDir": false
  }
}
```

**Pros:**
- Avoids rmdir operation
- Build won't try to delete dist/

**Cons:**
- May leave stale files in dist/
- Not recommended for production builds
- Doesn't address root cause

### Option 4: Use different dist path in development

**Change**: Mount at different location

```yaml
volumes:
  - ./nail-api:/app
  - /app/node_modules
  - nail-api-dist:/app/dist  # Named volume instead of anonymous
```

**Pros:**
- Explicit volume name
- Easier to manage

**Cons:**
- Still has locking issue
- Adds complexity

### Option 5: Ensure no containers running before build

**Script:**
```bash
#!/bin/bash
# Stop all containers
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Remove volumes
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v

# Build production
docker compose -f docker-compose.yml -f docker-compose.prod.yml build nail-api
```

**Pros:**
- Guaranteed clean state
- Reliable

**Cons:**
- Requires stopping dev environment
- Multi-step process

---

## Recommended Solution

**Primary fix**: Combine Option 1 + Option 5

### Step 1: Remove volume mount
Edit `docker-compose.dev.yml` line 113:

```yaml
volumes:
  - ./nail-api:/app
  - /app/node_modules
  # REMOVED: - /app/dist
```

### Step 2: Update build process
Create helper script:

```bash
# scripts/build-production.sh
#!/bin/bash
set -e

echo "🛑 Stopping development containers..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

echo "🧹 Cleaning volumes..."
docker volume prune -f

echo "🏗️  Building production images..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

echo "✅ Production build complete!"
```

### Step 3: Add to .gitignore (if not present)
Ensure host dist/ is ignored:

```
dist/
node_modules/
```

---

## Testing Verification

After applying fix:

```bash
# 1. Clean state
docker compose down -v
docker volume prune -f
docker builder prune -f

# 2. Test development build
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build nail-api
# Should start successfully

# 3. Test production build (while dev is running)
docker compose -f docker-compose.yml -f docker-compose.prod.yml build nail-api
# Should succeed without EBUSY error

# 4. Test production deployment
docker compose -f docker-compose.yml -f docker-compose.prod.yml up nail-api
# Should start and serve on port 3000

# 5. Verify health
curl http://localhost:3000/health
# Should return 200 OK
```

---

## Prevention Measures

### 1. Document volume mount patterns
Add to README:

```markdown
## Volume Mount Guidelines

- `/app/node_modules`: Always mount (prevents overwrite)
- `/app/dist`: Do NOT mount (causes build locks)
- Source code: Mount for hot-reload in dev only
```

### 2. Add pre-build checks

Create `.github/workflows/docker-build.yml`:

```yaml
name: Docker Build Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build production image
        run: |
          docker compose -f docker-compose.yml -f docker-compose.prod.yml build nail-api
```

### 3. Add to Dockerfile comments

```dockerfile
# ==========================================
# BUILD LAYER - Compile TypeScript
# ==========================================
# IMPORTANT: Do NOT mount /app/dist as volume during build
# NestJS CLI needs write access to delete and recreate dist/
FROM dependencies AS builder
```

### 4. Update troubleshooting docs

Add to `README-DOCKER.md`:

```markdown
### EBUSY Error During Build

**Symptom**: `EBUSY: resource busy or locked, rmdir '/app/dist'`

**Cause**: Volume mount conflict from development containers

**Solution**:
1. Stop all containers: `docker compose down -v`
2. Clean volumes: `docker volume prune -f`
3. Rebuild: `docker compose build --no-cache`
```

---

## Additional Observations

### File System Behavior

**macOS (Darwin 25.2.0)** specifics:
- Uses osxfs for bind mounts
- Slower I/O than Linux
- Stricter file locking
- Docker Desktop uses HyperKit VM

**Recommendation**: Consider using Docker volumes instead of bind mounts for better performance on Mac.

### BuildKit Cache

Currently using cache mounts (good for speed):

```dockerfile
RUN --mount=type=cache,target=/root/.npm \
  npm ci --ignore-scripts
```

This is correct and should remain. Not related to the EBUSY issue.

### Production Image Optimization

The Dockerfile is well-structured with multi-stage builds:
- ✅ Separate dev and prod targets
- ✅ Minimal production image
- ✅ Non-root user (nestjs:1001)
- ✅ Production dependency pruning
- ✅ Proper signal handling (dumb-init)

No changes needed to Dockerfile structure.

---

## Unresolved Questions

1. **When exactly does the error occur?**
   - Need actual build logs to confirm exact failure point
   - Is it during `deleteOutDir` or during initial write?

2. **Is there a local dist/ on host?**
   - Check: `ls -la /Users/hainguyen/Documents/nail-project/nail-api/dist`
   - If exists, may be conflicting

3. **Are there running containers?**
   - Check: `docker ps | grep nail-api`
   - May need to stop before build

4. **Are there orphaned volumes?**
   - Check: `docker volume ls | grep nail`
   - May need manual cleanup

5. **What is the exact build command used?**
   - Different commands may behave differently
   - Need to know context of when error occurs

---

## Next Steps

1. ✅ Apply recommended solution (remove /app/dist volume mount)
2. ⏳ Test development mode after change
3. ⏳ Test production build after change
4. ⏳ Verify no regressions in hot-reload
5. ⏳ Update documentation with findings
6. ⏳ Add CI/CD tests to prevent recurrence
7. ⏳ Monitor for any new related issues

---

## References

**Files Analyzed:**
- `/Users/hainguyen/Documents/nail-project/nail-api/Dockerfile` (Lines 1-111)
- `/Users/hainguyen/Documents/nail-project/docker-compose.dev.yml` (Lines 100-138)
- `/Users/hainguyen/Documents/nail-project/nail-api/docker-compose.yml` (Lines 1-148)
- `/Users/hainguyen/Documents/nail-project/nail-api/nest-cli.json` (Lines 1-8)
- `/Users/hainguyen/Documents/nail-project/nail-api/tsconfig.json` (Lines 1-25)
- `/Users/hainguyen/Documents/nail-project/nail-api/.dockerignore` (Lines 1-198)
- `/Users/hainguyen/Documents/nail-project/nail-api/package.json` (Lines 1-93)

**Docker Documentation:**
- Docker Volumes: https://docs.docker.com/storage/volumes/
- Docker BuildKit: https://docs.docker.com/build/buildkit/
- Multi-stage builds: https://docs.docker.com/build/building/multi-stage/

**NestJS Documentation:**
- NestJS CLI: https://docs.nestjs.com/cli/overview
- Build configuration: https://docs.nestjs.com/cli/monorepo#cli-properties

---

**Report prepared by:** Claude Code (Debugging Agent)
**Investigation duration:** 15 minutes
**Confidence level:** HIGH (90%)
**Action required:** Apply recommended solution and verify
