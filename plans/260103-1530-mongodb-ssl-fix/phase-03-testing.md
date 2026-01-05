# Phase 3: Testing & Verification

**Priority:** CRITICAL
**Effort:** 10 minutes
**Status:** ⏳ Pending

---

## Overview

Comprehensive testing to verify MongoDB SSL/TLS connection fix works correctly.

---

## Prerequisites

Before testing:
- ✅ Phase 1 completed (Node.js 20.18.2)
- ✅ Phase 2 completed (Mongoose TLS config)
- ✅ MongoDB Atlas credentials in `.env`
- ✅ Docker running

---

## Test Suite

### Test 1: Docker Build Verification

**Purpose:** Ensure Docker image builds successfully with Node 20.18.2

**Commands:**
```bash
cd /Users/hainguyen/Documents/nail-project

# Clean build (no cache)
docker compose build nail-api --no-cache

# Expected: Build completes without errors
```

**Success Criteria:**
- Build completes in 2-5 minutes
- No errors in build output
- Image size ~200-300MB

---

### Test 2: Node.js Version Verification

**Purpose:** Confirm Node.js 20.18.2 and OpenSSL 1.1.1 installed

**Commands:**
```bash
# Check Node version
docker run --rm nail-api node --version
# Expected output: v20.18.2

# Check OpenSSL version
docker run --rm nail-api node -p "process.versions.openssl"
# Expected output: 1.1.1x (NOT 3.x.x)

# Check all versions
docker run --rm nail-api node -p "process.versions"
```

**Success Criteria:**
- Node version: v20.18.2
- OpenSSL version: 1.1.1x
- No version mismatches

---

### Test 3: MongoDB Connection Test

**Purpose:** Verify API connects to MongoDB Atlas successfully

**Prerequisites:**
```bash
# Ensure .env file exists with MongoDB URI
cat /Users/hainguyen/Documents/nail-project/apps/api/.env | grep MONGODB_URI
# Should show: MONGODB_URI=mongodb+srv://...
```

**Commands:**
```bash
# Start API container with dev config
docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-api

# Watch logs for connection success
docker compose logs -f nail-api
```

**Expected Log Output:**
```
🔌 Connecting to MongoDB: mongodb+srv://***:***@cluster.mongodb.net/...
✅ MongoDB connected successfully
[Nest] INFO [InstanceLoader] MongooseModule dependencies initialized
```

**Success Criteria:**
- ✅ "MongoDB connected successfully" appears in logs
- ❌ NO "SSL routines::unexpected eof" errors
- ❌ NO "MongoServerError" errors
- ✅ Container stays running (doesn't crash)

---

### Test 4: Health Check Test

**Purpose:** Verify API health endpoint responds correctly

**Commands:**
```bash
# Start API (if not running)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d nail-api

# Wait 10 seconds for startup
sleep 10

# Test health endpoint
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","info":{"database":{"status":"up"},...}}
```

**Success Criteria:**
- HTTP 200 response
- `"status":"ok"` in response
- `"database":{"status":"up"}` in response

---

### Test 5: Database Operations Test

**Purpose:** Verify CRUD operations work correctly

**Commands:**
```bash
# Test authentication endpoint (creates DB connection)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpass"}'

# Expected: 401 Unauthorized (proves DB connection works)
# If connection failed, would get 500 Internal Server Error
```

**Alternative Test (if you have valid credentials):**
```bash
# Register a test user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test-'$(date +%s)'@example.com",
    "password":"TestPass123!",
    "name":"Test User"
  }'

# Expected: 201 Created with user data
```

**Success Criteria:**
- Endpoints respond (not 500 errors)
- Database queries execute
- No SSL/TLS errors in logs

---

### Test 6: Connection Lifecycle Test

**Purpose:** Verify connection survives restarts and reconnects

**Commands:**
```bash
# 1. Start API
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d nail-api

# 2. Verify connected
docker compose logs nail-api | grep "MongoDB connected"

# 3. Restart container
docker compose restart nail-api

# 4. Watch reconnection
docker compose logs -f nail-api | grep -E "MongoDB (connected|reconnected)"

# Expected: See "MongoDB reconnected" or "MongoDB connected successfully"
```

**Success Criteria:**
- Container restarts successfully
- Reconnects to MongoDB automatically
- No connection errors

---

## Full Integration Test

**Purpose:** Test complete system with all services

**Commands:**
```bash
# 1. Stop all services
docker compose down

# 2. Start all services (dev mode)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 3. Check all container statuses
docker compose ps

# Expected output:
# NAME         IMAGE              STATUS         PORTS
# nail-api     ...                Up (healthy)   3000/tcp
# nail-admin   ...                Up             5174/tcp
# nail-client  ...                Up             5173/tcp

# 4. Test API health
curl http://localhost:3000/health

# 5. Test Admin (should load login page)
curl http://localhost:5174

# 6. Test Client (should load homepage)
curl http://localhost:5173
```

**Success Criteria:**
- All containers running
- API healthy
- Admin accessible
- Client accessible
- No errors in any logs

---

## Monitoring Commands

**Real-time log monitoring:**
```bash
# All services
docker compose logs -f

# API only
docker compose logs -f nail-api

# Filter for errors
docker compose logs -f nail-api | grep -E "(ERROR|error|Error)"

# Filter for MongoDB events
docker compose logs -f nail-api | grep -i mongodb
```

---

## Common Issues & Solutions

### Issue 1: Still Getting SSL Errors

**Symptom:** `SSL routines::unexpected eof`

**Diagnostics:**
```bash
# Verify Node version
docker run --rm nail-api node --version
# Must be: v20.18.2

# Verify OpenSSL version
docker run --rm nail-api node -p "process.versions.openssl"
# Must be: 1.1.1x (NOT 3.x.x)
```

**Solution:**
- Rebuild with `--no-cache`
- Verify Dockerfile changes saved
- Check Docker using correct Dockerfile

### Issue 2: Connection Timeout

**Symptom:** `Server selection timed out`

**Diagnostics:**
```bash
# Check MongoDB URI format
echo $MONGODB_URI
# Should be: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Test DNS resolution
docker run --rm nail-api nslookup cluster.mongodb.net

# Test network connectivity
docker run --rm nail-api wget -O- https://cloud.mongodb.com
```

**Solution:**
- Verify MongoDB URI correct
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)
- Verify network connectivity

### Issue 3: Authentication Failed

**Symptom:** `Authentication failed`

**Diagnostics:**
```bash
# Verify credentials in .env
cat apps/api/.env | grep MONGODB_URI
```

**Solution:**
- Check username/password correct
- Verify database user exists in Atlas
- Check user has correct permissions

---

## Test Results Checklist

- [ ] Docker build completes successfully
- [ ] Node version is v20.18.2
- [ ] OpenSSL version is 1.1.1x
- [ ] MongoDB connection succeeds
- [ ] No SSL/TLS errors in logs
- [ ] Health endpoint returns 200
- [ ] Database operations work
- [ ] Container survives restart
- [ ] All services start together

---

## Rollback Criteria

**Rollback if:**
- Still getting SSL/TLS errors after all fixes
- New errors introduced
- Performance significantly degraded
- Tests fail after 3 attempts

**Rollback Steps:**
```bash
# 1. Revert code changes
git checkout apps/api/Dockerfile
git checkout apps/api/src/config/database.config.ts
git checkout apps/api/src/app.module.ts

# 2. Rebuild
docker compose build nail-api --no-cache

# 3. Restart
docker compose restart nail-api
```

---

## Success Criteria Summary

✅ All 6 tests pass
✅ No SSL/TLS errors
✅ MongoDB connection stable
✅ Health check passes
✅ Database operations work
✅ System runs for 5+ minutes without errors

---

## Next Steps

After all tests pass:
- Proceed to [Phase 4: Documentation](./phase-04-documentation.md)
- Deploy to production
- Monitor for 24 hours
