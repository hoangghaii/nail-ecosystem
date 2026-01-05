# MongoDB SSL/TLS Connection Fix - Implementation Plan

**Plan ID:** `260103-1530-mongodb-ssl-fix`
**Created:** 2026-01-03
**Status:** Ready for Implementation
**Priority:** CRITICAL - Production Blocker

---

## Quick Summary

**Problem:** Node.js 24.12.0 (OpenSSL 3.x) incompatible with MongoDB Atlas shared clusters → SSL handshake failures

**Solution:** Downgrade to Node.js 20.18.2 (OpenSSL 1.1.1) + add explicit TLS configuration

**Effort:** ~35 minutes implementation + testing

**Impact:** Zero downtime if applied correctly, complete fix for MongoDB connection issues

---

## Plan Structure

```
260103-1530-mongodb-ssl-fix/
├── README.md (this file)              # Overview & quick start
├── plan.md                            # High-level plan with all phases
├── phase-01-nodejs-downgrade.md       # Node.js 20.18.2 Dockerfile changes
├── phase-02-mongoose-config.md        # TLS config & connection handling
├── phase-03-testing.md                # Comprehensive test suite
├── phase-04-documentation.md          # Docs updates
└── rollback-plan.md                   # Emergency rollback procedures
```

---

## Quick Start

### Prerequisites
- MongoDB Atlas credentials in `apps/api/.env`
- Docker installed and running
- Git working directory clean (or commit current work)

### Execute Plan

```bash
# 1. Read the overview plan
cat /Users/hainguyen/Documents/nail-project/plans/260103-1530-mongodb-ssl-fix/plan.md

# 2. Execute Phase 1 (Node.js downgrade)
# Follow: phase-01-nodejs-downgrade.md

# 3. Execute Phase 2 (Mongoose config)
# Follow: phase-02-mongoose-config.md

# 4. Execute Phase 3 (Testing)
# Follow: phase-03-testing.md

# 5. Execute Phase 4 (Documentation)
# Follow: phase-04-documentation.md

# 6. If issues occur, execute rollback
# Follow: rollback-plan.md
```

---

## What Gets Changed

### Files Modified (3)
1. `apps/api/Dockerfile` - Node.js 24.12.0 → 20.18.2
2. `apps/api/src/config/database.config.ts` - Add TLS options
3. `apps/api/src/app.module.ts` - Add connection event handlers

### Documentation Updated (3)
1. `README.md` - Node.js version requirement note
2. `docs/deployment-guide.md` - MongoDB TLS section
3. `docs/troubleshooting.md` - SSL/TLS troubleshooting (new file)

---

## Key Changes

### 1. Dockerfile (2 lines)
```diff
- FROM node:24.12.0-alpine AS base
+ FROM node:20.18.2-alpine AS base

- FROM node:24.12.0-alpine AS production
+ FROM node:20.18.2-alpine AS production
```

### 2. Database Config (adds TLS options)
```typescript
// Before: 6 lines
export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
}));

// After: 25 lines (adds TLS, retry, timeout configs)
```

### 3. App Module (adds event handlers)
```typescript
// Before: Simple config passthrough
MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('database.uri'),
    maxPoolSize: configService.get<number>('database.maxPoolSize'),
  }),
}),

// After: Full TLS config + connection lifecycle logging
```

---

## Timeline

| Phase | Task | Effort |
|-------|------|--------|
| 1 | Node.js downgrade | 5 min |
| 2 | Mongoose config | 15 min |
| 3 | Testing & verification | 10 min |
| 4 | Documentation | 5 min |
| **Total** | | **35 min** |

Add 25 minutes buffer for troubleshooting → **Total: 1 hour**

---

## Success Criteria

✅ API container starts successfully
✅ MongoDB connection established
✅ Health endpoint returns 200
✅ No SSL/TLS errors in logs
✅ Existing functionality works (auth, CRUD operations)
✅ Container survives restart
✅ System stable for 5+ minutes

---

## Risk Assessment

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|
| Node 20 incompatibility | Low | 5% | Node 20 = LTS, well-tested |
| Connection still fails | Medium | 10% | Rollback plan ready |
| Breaking changes | Low | 5% | No API changes, only infra |
| Performance regression | Low | 5% | Monitor post-deployment |

---

## Rollback Plan

If fix fails, rollback takes **5 minutes:**

```bash
git checkout apps/api/Dockerfile apps/api/src/config/ apps/api/src/app.module.ts
docker compose build nail-api --no-cache
docker compose restart nail-api
```

See `rollback-plan.md` for detailed steps.

---

## Testing Strategy

6 comprehensive tests:
1. Docker build verification
2. Node.js version check
3. MongoDB connection test
4. Health check test
5. Database operations test
6. Connection lifecycle test

All tests documented in `phase-03-testing.md`.

---

## Post-Implementation

After successful deployment:
- Monitor logs for 24 hours
- Track connection stability
- Monitor performance metrics
- Document any issues in troubleshooting.md

---

## Questions?

**Why Node 20.18.2 specifically?**
- Active LTS until April 2026
- OpenSSL 1.1.1 (not 3.x)
- Production-proven stability
- Smallest compatible version

**Why not fix OpenSSL 3.x compatibility?**
- MongoDB driver issue, not ours
- Waiting for upstream fix
- Node 20 LTS still supported
- Downgrade is safest solution

**Can we use Node 24 later?**
Yes, when MongoDB driver adds full OpenSSL 3.x support (monitor release notes).

**What if downgrade doesn't work?**
See `rollback-plan.md` → Alternative Solutions section.

---

## Files Reference

| File | Purpose | LOC |
|------|---------|-----|
| plan.md | High-level overview | 80 |
| phase-01-nodejs-downgrade.md | Dockerfile changes | 120 |
| phase-02-mongoose-config.md | Config updates | 236 |
| phase-03-testing.md | Test procedures | 373 |
| phase-04-documentation.md | Docs updates | 478 |
| rollback-plan.md | Emergency rollback | 310 |

**Total:** ~1,600 lines comprehensive documentation

---

## Next Steps

1. Review `plan.md` for overview
2. Execute phases sequentially (01 → 04)
3. Test thoroughly (phase 03)
4. Monitor for 24 hours
5. Mark plan complete

**Start here:** `phase-01-nodejs-downgrade.md`
