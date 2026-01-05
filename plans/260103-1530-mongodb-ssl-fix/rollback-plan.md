# Rollback Plan

**Plan:** MongoDB SSL/TLS Connection Fix
**Version:** 1.0
**Date:** 2026-01-03

---

## When to Rollback

Rollback immediately if:
- ❌ Still getting SSL/TLS errors after all fixes applied
- ❌ New critical errors introduced
- ❌ Database operations failing
- ❌ Container won't start
- ❌ Performance degraded significantly (>50% slower)
- ❌ All tests fail after 3 attempts

**Do NOT rollback if:**
- ✅ Minor warnings in logs (not errors)
- ✅ One test fails but others pass (debug first)
- ✅ Slightly slower startup (acceptable if stable)

---

## Rollback Steps

### Step 1: Revert Code Changes

```bash
# Navigate to project root
cd /Users/hainguyen/Documents/nail-project

# Stop all services
docker compose down

# Revert Dockerfile
git checkout apps/api/Dockerfile

# Revert database config
git checkout apps/api/src/config/database.config.ts

# Revert app module
git checkout apps/api/src/app.module.ts

# Verify reverted
git status
# Should show: nothing to commit, working tree clean
```

---

### Step 2: Rebuild Docker Image

```bash
# Clean Docker cache
docker builder prune -a
# Type 'y' to confirm

# Rebuild API without cache
docker compose build nail-api --no-cache

# Verify build completes
# Expected: "Successfully built ..."
```

---

### Step 3: Restart Services

```bash
# Start all services (dev mode)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Check container status
docker compose ps

# Expected: nail-api status = "Up" or "Up (healthy)"
```

---

### Step 4: Verify Rollback

```bash
# 1. Check Node version (should be back to 24.12.0)
docker run --rm nail-api node --version
# Expected: v24.12.0

# 2. Check API logs
docker compose logs nail-api

# 3. Test health endpoint (may fail due to original issue)
curl http://localhost:3000/health

# 4. Verify old configuration active
docker exec nail-api cat /app/dist/config/database.config.js
# Should be simple version (no TLS config)
```

---

### Step 5: Document Rollback

Create rollback report:

```bash
# Create rollback report file
cat > /Users/hainguyen/Documents/nail-project/plans/260103-1530-mongodb-ssl-fix/ROLLBACK-REPORT.md << 'EOF'
# Rollback Report

**Date:** $(date)
**Rollback Reason:** [FILL IN REASON]

## What Was Rolled Back

- apps/api/Dockerfile (Node 20.18.2 → 24.12.0)
- apps/api/src/config/database.config.ts (TLS config removed)
- apps/api/src/app.module.ts (Event handlers removed)

## Current Status

- [ ] Services running
- [ ] API accessible (may have original SSL error)
- [ ] No new errors introduced

## Issues After Rollback

[DESCRIBE ANY ISSUES]

## Next Steps

1. Investigate why fix failed
2. Review error logs
3. Try alternative solution
4. Escalate if needed
EOF
```

---

## Alternative Solutions (If Rollback Needed)

### Alternative 1: Use MongoDB Connection String Options

If Node.js downgrade doesn't work, try adding TLS options to connection string:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=false
```

### Alternative 2: Use Managed MongoDB Cluster (M10+)

MongoDB Atlas M10+ clusters have better OpenSSL 3.x compatibility:

1. Upgrade Atlas cluster: M0/M2/M5 → M10
2. Update connection string
3. Can use Node.js 24.x

**Note:** M10 clusters are paid (~$0.08/hr)

### Alternative 3: Use Local MongoDB

For development, bypass Atlas entirely:

```bash
# Run MongoDB locally
docker run -d --name mongo -p 27017:27017 mongo:7

# Update .env
MONGODB_URI=mongodb://localhost:27017/nail-salon
```

### Alternative 4: Downgrade MongoDB Driver

If Node.js 24 required, try older Mongoose version:

```bash
# In apps/api/
npm install mongoose@7.6.0
```

---

## Testing After Rollback

```bash
# 1. Verify services start
docker compose ps

# 2. Check for new errors
docker compose logs nail-api | grep -E "(ERROR|error)"

# 3. Verify no breaking changes
curl http://localhost:3000/health
```

---

## Escalation Path

If rollback fails or doesn't resolve issues:

1. **Document all error messages**
   ```bash
   docker compose logs nail-api > /tmp/api-logs.txt
   ```

2. **Capture environment state**
   ```bash
   docker compose config > /tmp/docker-config.yml
   docker images > /tmp/docker-images.txt
   ```

3. **Contact team:**
   - Provide error logs
   - Describe steps taken
   - Share rollback report

4. **Emergency fix:**
   - Comment out MongoDB connection in `app.module.ts`
   - Run API in degraded mode (no DB)
   - Fix connection offline

---

## Recovery After Rollback

Once rolled back and stable:

1. **Analyze failure:**
   - Review error logs
   - Identify root cause
   - Document findings

2. **Plan alternative approach:**
   - Try Alternative Solutions above
   - Research MongoDB driver updates
   - Consider infrastructure changes

3. **Test in isolation:**
   - Test fix locally first
   - Verify on staging environment
   - Roll out gradually

4. **Monitor closely:**
   - Watch logs for 1 hour
   - Check health metrics
   - Validate database operations

---

## Rollback Verification Checklist

- [ ] All code reverted to previous state
- [ ] Docker images rebuilt
- [ ] Services running
- [ ] No NEW errors introduced
- [ ] System stable for 10+ minutes
- [ ] Rollback documented
- [ ] Team notified

---

## Prevention for Next Attempt

1. **Test in isolated environment first:**
   ```bash
   # Create test container
   docker run -it --rm node:20.18.2-alpine sh

   # Test MongoDB connection
   npm install mongoose
   # Write test script
   ```

2. **Incremental changes:**
   - Apply Dockerfile change only
   - Test
   - Then apply config changes
   - Test again

3. **Backup before changes:**
   ```bash
   # Create backup branch
   git checkout -b backup/before-mongodb-fix
   git push origin backup/before-mongodb-fix
   ```

4. **Have staging environment:**
   - Test on staging first
   - Validate for 24 hours
   - Then deploy to production

---

## Emergency Contacts

**If critical production issue:**
- Document all errors
- Contact team immediately
- Provide this rollback report
- Share all logs

**Files to include:**
- `/tmp/api-logs.txt`
- `/tmp/docker-config.yml`
- `ROLLBACK-REPORT.md`
- Screenshot of errors (if applicable)
