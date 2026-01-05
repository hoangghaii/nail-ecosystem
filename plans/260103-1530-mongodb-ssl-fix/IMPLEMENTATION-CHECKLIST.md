# Implementation Checklist

**Plan:** MongoDB SSL/TLS Connection Fix
**Date:** 2026-01-03
**Implementer:** _______________

---

## Pre-Implementation

- [ ] Read entire `plan.md`
- [ ] Read all phase files (01-04)
- [ ] Review `rollback-plan.md`
- [ ] MongoDB Atlas credentials ready
- [ ] Docker installed and running
- [ ] Current work committed or backed up
- [ ] `.env` file backed up

---

## Phase 1: Node.js Downgrade

### File Changes
- [ ] Open `apps/api/Dockerfile`
- [ ] Change line 4: `node:24.12.0-alpine` → `node:20.18.2-alpine`
- [ ] Change line 84: `node:24.12.0-alpine` → `node:20.18.2-alpine`
- [ ] Save file

### Verification
- [ ] `grep "FROM node:" apps/api/Dockerfile` shows 20.18.2
- [ ] `docker compose build nail-api --no-cache` succeeds
- [ ] `docker run --rm nail-api node --version` outputs v20.18.2
- [ ] `docker run --rm nail-api node -p "process.versions.openssl"` outputs 1.1.1x

**Phase 1 Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

## Phase 2: Mongoose Configuration

### File 1: Database Config
- [ ] Open `apps/api/src/config/database.config.ts`
- [ ] Replace content with new TLS configuration (25 lines)
- [ ] Save file

### File 2: App Module
- [ ] Open `apps/api/src/app.module.ts`
- [ ] Locate `MongooseModule.forRootAsync` block (lines 51-57)
- [ ] Replace with new configuration (includes event handlers)
- [ ] Save file

### Verification
- [ ] `npx turbo type-check --filter=api` passes
- [ ] `npx turbo build --filter=api` succeeds
- [ ] No TypeScript errors

**Phase 2 Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

## Phase 3: Testing

### Test 1: Build Verification
- [ ] `docker compose build nail-api --no-cache` completes
- [ ] Build time: 2-5 minutes
- [ ] No errors in output
- [ ] Image size: 200-300MB

### Test 2: Version Verification
- [ ] Node version: v20.18.2
- [ ] OpenSSL version: 1.1.1x (NOT 3.x)

### Test 3: Connection Test
- [ ] `docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-api`
- [ ] Logs show: "✅ MongoDB connected successfully"
- [ ] NO "SSL routines::unexpected eof" errors
- [ ] Container stays running (doesn't crash)

### Test 4: Health Check
- [ ] `curl http://localhost:3000/health` returns 200
- [ ] Response contains `"status":"ok"`
- [ ] Response contains `"database":{"status":"up"}`

### Test 5: Database Operations
- [ ] Auth endpoints respond (not 500 errors)
- [ ] Test login returns 401 (proves DB connection works)
- [ ] No SSL errors in logs

### Test 6: Connection Lifecycle
- [ ] `docker compose restart nail-api` succeeds
- [ ] Logs show reconnection
- [ ] No connection errors

### Integration Test
- [ ] All services start: `docker compose ps` shows all "Up"
- [ ] API health check passes
- [ ] Admin accessible (port 5174)
- [ ] Client accessible (port 5173)
- [ ] System runs 5+ minutes without errors

**Phase 3 Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

## Phase 4: Documentation

### README.md
- [ ] Add Node.js version note after Prerequisites section
- [ ] Note explains 20.18.2 requirement
- [ ] Save file

### docs/deployment-guide.md
- [ ] Add "MongoDB Connection Configuration" section
- [ ] Section covers TLS, timeouts, troubleshooting
- [ ] Save file

### docs/troubleshooting.md
- [ ] Create new file (if doesn't exist)
- [ ] Add comprehensive troubleshooting guide
- [ ] Cover SSL/TLS errors, timeouts, auth failures
- [ ] Save file

### Verification
- [ ] `git status` shows changes
- [ ] All markdown formatting valid
- [ ] Code examples tested

**Phase 4 Status:** ⬜ Not Started | ⏳ In Progress | ✅ Complete

---

## Post-Implementation

### Immediate (0-1 hour)
- [ ] All services running
- [ ] No errors in logs
- [ ] Health checks passing
- [ ] Database operations working

### Short-term (1-24 hours)
- [ ] Monitor logs for errors
- [ ] Track connection stability
- [ ] Verify no performance regression
- [ ] Document any issues

### Long-term (24+ hours)
- [ ] System stable
- [ ] No SSL/TLS errors
- [ ] Performance metrics normal
- [ ] Mark plan as complete

---

## Rollback Checklist (if needed)

- [ ] Stop all services
- [ ] `git checkout` revert files
- [ ] Clean Docker cache
- [ ] Rebuild: `docker compose build nail-api --no-cache`
- [ ] Restart services
- [ ] Verify old version running
- [ ] Create rollback report
- [ ] Investigate failure
- [ ] Try alternative solutions

---

## Sign-Off

### Phase Completion

| Phase | Completed | Date | Signature |
|-------|-----------|------|-----------|
| 1 - Node.js Downgrade | ⬜ | _____ | _________ |
| 2 - Mongoose Config | ⬜ | _____ | _________ |
| 3 - Testing | ⬜ | _____ | _________ |
| 4 - Documentation | ⬜ | _____ | _________ |

### Final Approval

- [ ] All phases complete
- [ ] All tests passed
- [ ] Documentation updated
- [ ] System stable 24+ hours
- [ ] No outstanding issues

**Implementation Complete:** _________ (Signature) | Date: _________

---

## Notes

Use this space to document issues, decisions, or observations:

```
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
```
