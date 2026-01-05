# Phase 1: Node.js Downgrade

**Priority:** CRITICAL
**Effort:** 5 minutes
**Status:** ⏳ Pending

---

## Context

Node.js 24.12.0 ships with OpenSSL 3.x which has breaking changes in SSL/TLS handling incompatible with MongoDB Atlas shared clusters (M0/M2/M5).

Node.js 20.18.2 uses OpenSSL 1.1.1 which is fully compatible.

---

## File Changes

### File: `apps/api/Dockerfile`

**Lines to Change:**
- Line 4: `FROM node:24.12.0-alpine AS base`
- Line 84: `FROM node:24.12.0-alpine AS production`

**Change To:**
- Line 4: `FROM node:20.18.2-alpine AS base`
- Line 84: `FROM node:20.18.2-alpine AS production`

---

## Exact Changes

### Change 1: Base Image

**Location:** Line 4

**OLD:**
```dockerfile
FROM node:24.12.0-alpine AS base
```

**NEW:**
```dockerfile
FROM node:20.18.2-alpine AS base
```

---

### Change 2: Production Image

**Location:** Line 84

**OLD:**
```dockerfile
FROM node:24.12.0-alpine AS production
```

**NEW:**
```dockerfile
FROM node:20.18.2-alpine AS production
```

---

## Why Node.js 20.18.2?

- **LTS Release:** Active Long-Term Support until April 2026
- **OpenSSL 1.1.1:** Fully compatible with MongoDB Atlas
- **Stability:** Widely tested in production
- **Alpine Variant:** Maintains small image size (~50MB)

---

## Implementation Steps

1. Open `apps/api/Dockerfile`
2. Replace line 4: `node:24.12.0-alpine` → `node:20.18.2-alpine`
3. Replace line 84: `node:24.12.0-alpine` → `node:20.18.2-alpine`
4. Save file

---

## Verification Commands

```bash
# 1. Verify Dockerfile changes
grep "FROM node:" /Users/hainguyen/Documents/nail-project/apps/api/Dockerfile

# Expected output:
# FROM node:20.18.2-alpine AS base
# FROM node:20.18.2-alpine AS production

# 2. Rebuild API image
cd /Users/hainguyen/Documents/nail-project
docker compose build nail-api --no-cache

# 3. Check Node version in built image
docker run --rm nail-api node --version
# Expected: v20.18.2

# 4. Check OpenSSL version
docker run --rm nail-api node -p "process.versions.openssl"
# Expected: 1.1.1x (not 3.x)
```

---

## Success Criteria

✅ Dockerfile updated with Node.js 20.18.2
✅ Image builds successfully
✅ Node version confirmed as v20.18.2
✅ OpenSSL version is 1.1.1x (NOT 3.x)

---

## Rollback Plan

If issues occur:

```bash
# Revert Dockerfile changes
git checkout apps/api/Dockerfile

# Rebuild with original image
docker compose build nail-api --no-cache
```

---

## Testing Checklist

- [ ] Dockerfile contains `node:20.18.2-alpine` on line 4
- [ ] Dockerfile contains `node:20.18.2-alpine` on line 84
- [ ] Docker build completes without errors
- [ ] Node version is v20.18.2
- [ ] OpenSSL version is 1.1.1x

---

## Next Steps

After successful verification:
- Proceed to [Phase 2: Mongoose Configuration](./phase-02-mongoose-config.md)
