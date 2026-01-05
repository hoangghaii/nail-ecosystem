# Phase 4: Documentation Updates

**Priority:** MEDIUM
**Effort:** 5 minutes
**Status:** ⏳ Pending

---

## Overview

Update project documentation to reflect Node.js downgrade and MongoDB TLS configuration improvements.

---

## Documentation Files to Update

### 1. README.md
### 2. docs/deployment-guide.md
### 3. docs/troubleshooting.md (create if not exists)

---

## File 1: README.md

**File:** `/Users/hainguyen/Documents/nail-project/README.md`

**Section:** "Prerequisites"

**Current (Lines 54-58):**
```markdown
### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Docker + Docker Compose (for containerized deployment)
```

**Add after line 58:**
```markdown

**Important:** This project uses **Node.js 20.18.2** in Docker containers due to MongoDB Atlas compatibility requirements. Node.js 24.x with OpenSSL 3.x is not compatible with MongoDB Atlas shared clusters (M0/M2/M5).
```

---

## File 2: Deployment Guide

**File:** `/Users/hainguyen/Documents/nail-project/docs/deployment-guide.md`

**Add new section:** "MongoDB Connection Configuration"

**Location:** After "Environment Configuration" section

**Content:**
```markdown
## MongoDB Connection Configuration

### SSL/TLS Requirements

The API uses explicit TLS configuration for secure MongoDB Atlas connections:

- **TLS enabled by default** - Required for MongoDB Atlas
- **Certificate validation enabled** - Rejects invalid certificates
- **Hostname validation enabled** - Prevents MITM attacks
- **Auto-retry enabled** - Handles transient connection failures

### Connection Timeouts

Default timeouts configured for reliability:

| Setting | Value | Purpose |
|---------|-------|---------|
| Server Selection Timeout | 10s | Fail fast if MongoDB unavailable |
| Connect Timeout | 10s | Initial connection attempt |
| Socket Timeout | 45s | Ongoing operation timeout |
| Heartbeat Frequency | 10s | Connection health monitoring |

### Node.js Version Requirement

**Critical:** API container uses Node.js 20.18.2 (not 24.x) due to MongoDB Atlas compatibility:

- **Node 20.18.2** → OpenSSL 1.1.1 → ✅ Compatible with Atlas
- **Node 24.x** → OpenSSL 3.x → ❌ SSL handshake failures

**Do not upgrade to Node.js 24.x** until MongoDB driver fully supports OpenSSL 3.x.

### Troubleshooting Connection Issues

If MongoDB connection fails:

1. **Verify MongoDB URI format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Check MongoDB Atlas IP whitelist:**
   - Add `0.0.0.0/0` for testing
   - Add specific IPs for production

3. **Verify credentials:**
   - Username/password correct
   - User exists in Atlas
   - User has correct permissions (readWrite)

4. **Check logs for SSL errors:**
   ```bash
   docker compose logs nail-api | grep -i "ssl"
   ```

5. **Verify Node.js version in container:**
   ```bash
   docker run --rm nail-api node --version
   # Should output: v20.18.2
   ```

### Connection Lifecycle Events

The API logs MongoDB connection events:

- `✅ MongoDB connected successfully` - Initial connection
- `🔄 MongoDB reconnected` - Automatic reconnection
- `⚠️  MongoDB disconnected` - Connection lost
- `❌ MongoDB connection error:` - Connection failure

Monitor these logs to diagnose connection issues.
```

---

## File 3: Troubleshooting Guide

**File:** `/Users/hainguyen/Documents/nail-project/docs/troubleshooting.md`

**Create new file if doesn't exist**

**Content:**
```markdown
# Troubleshooting Guide

## MongoDB Connection Issues

### SSL/TLS Handshake Failures

**Symptom:**
```
MongoServerError: SSL routines::unexpected eof while reading
```

**Root Cause:**
Node.js 24.x with OpenSSL 3.x incompatible with MongoDB Atlas shared clusters.

**Solution:**
Verify API container uses Node.js 20.18.2:

```bash
docker run --rm nail-api node --version
# Expected: v20.18.2

docker run --rm nail-api node -p "process.versions.openssl"
# Expected: 1.1.1x (NOT 3.x.x)
```

If version wrong, rebuild with no cache:
```bash
docker compose build nail-api --no-cache
```

---

### Connection Timeout

**Symptom:**
```
MongoServerSelectionError: Server selection timed out after 10000 ms
```

**Possible Causes:**
1. Invalid MongoDB URI
2. MongoDB Atlas IP whitelist blocking connection
3. Network connectivity issues
4. Invalid credentials

**Diagnostics:**

```bash
# 1. Check MongoDB URI format
cat apps/api/.env | grep MONGODB_URI
# Should be: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# 2. Test DNS resolution
docker run --rm nail-api nslookup your-cluster.mongodb.net

# 3. Test network connectivity
docker run --rm nail-api ping -c 3 8.8.8.8

# 4. Check MongoDB Atlas dashboard
# - Verify IP whitelist includes your IP (or 0.0.0.0/0)
# - Verify database user exists with correct permissions
```

**Solutions:**

1. **Fix MongoDB URI:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Update IP whitelist in MongoDB Atlas:**
   - Navigate to Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (testing) or specific IPs (production)

3. **Verify credentials:**
   - Check Database Access in Atlas
   - Ensure user has `readWrite` role
   - Reset password if needed

---

### Authentication Failed

**Symptom:**
```
MongoServerError: Authentication failed
```

**Solution:**

1. Verify credentials in `.env`:
   ```bash
   cat apps/api/.env | grep MONGODB_URI
   ```

2. Check database user in MongoDB Atlas:
   - Go to Database Access
   - Verify username exists
   - Verify password is correct
   - Check user has permissions for target database

3. Reset password in Atlas:
   - Edit user → Reset password
   - Update `.env` with new password
   - Restart API container

---

## Docker Build Issues

### Build Fails to Pull Node Image

**Symptom:**
```
failed to pull node:20.18.2-alpine: image not found
```

**Solution:**

```bash
# Manually pull image
docker pull node:20.18.2-alpine

# Verify image exists
docker images | grep node

# Rebuild
docker compose build nail-api
```

---

### Build Cache Issues

**Symptom:**
Changes not reflected in built image

**Solution:**

```bash
# Clean Docker build cache
docker builder prune -a

# Rebuild without cache
docker compose build nail-api --no-cache
```

---

## Health Check Failures

### Health Endpoint Returns 503

**Symptom:**
```bash
curl http://localhost:3000/health
# Returns: 503 Service Unavailable
```

**Diagnostics:**

```bash
# Check API logs
docker compose logs nail-api

# Check if MongoDB connected
docker compose logs nail-api | grep "MongoDB connected"
```

**Solution:**

1. Verify MongoDB connection (see above)
2. Check Redis connection if enabled
3. Restart API container:
   ```bash
   docker compose restart nail-api
   ```

---

## Performance Issues

### Slow Database Queries

**Diagnostics:**

```bash
# Monitor query times in logs
docker compose logs nail-api | grep -i "query"

# Check connection pool size
# In apps/api/src/config/database.config.ts
# maxPoolSize should be 10-20 for production
```

**Solution:**

1. Increase connection pool size:
   ```env
   MONGODB_MAX_POOL_SIZE=20
   ```

2. Add database indexes (if needed)

3. Review query patterns for optimization

---

## Common Fixes

### Quick Restart

```bash
# Restart specific service
docker compose restart nail-api

# Restart all services
docker compose restart
```

### Complete Rebuild

```bash
# Stop all services
docker compose down

# Clean build cache
docker builder prune -a

# Rebuild from scratch
docker compose build --no-cache

# Start services
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### View Detailed Logs

```bash
# All logs
docker compose logs -f

# API logs only
docker compose logs -f nail-api

# Filter for errors
docker compose logs -f nail-api | grep -E "(ERROR|error|Error)"

# Filter for MongoDB events
docker compose logs -f nail-api | grep -i mongodb
```

### Check Service Health

```bash
# All container statuses
docker compose ps

# Detailed API status
docker inspect nail-api

# Health check endpoint
curl http://localhost:3000/health
```

---

## Getting Help

If issues persist:

1. Check logs for error details
2. Verify environment variables
3. Test with minimal configuration
4. Review recent changes
5. Contact development team with:
   - Error messages
   - Log output
   - Steps to reproduce
```

---

## Implementation Steps

1. **Update README.md:**
   - Add Node.js version note after Prerequisites section
   - Save file

2. **Update deployment-guide.md:**
   - Add "MongoDB Connection Configuration" section
   - Save file

3. **Create/Update troubleshooting.md:**
   - Create new file if doesn't exist
   - Add comprehensive troubleshooting guide
   - Save file

4. **Verify changes:**
   ```bash
   # Check files updated
   git status

   # Review changes
   git diff README.md
   git diff docs/deployment-guide.md
   git diff docs/troubleshooting.md
   ```

---

## Documentation Checklist

- [ ] README.md updated with Node.js version note
- [ ] deployment-guide.md has MongoDB configuration section
- [ ] troubleshooting.md created/updated with SSL/TLS fixes
- [ ] All code examples tested
- [ ] Markdown formatting validated
- [ ] Links working (if any)

---

## Success Criteria

✅ README.md documents Node.js version requirement
✅ Deployment guide has MongoDB TLS section
✅ Troubleshooting guide covers common issues
✅ All documentation accurate and tested

---

## Next Steps

After documentation complete:
- Commit all changes
- Create pull request (if applicable)
- Deploy to production
- Monitor for 24-48 hours
- Update runbook with any new issues
