# Nginx Optimization Implementation Checklist

**Target**: React SPA in Docker container
**Current Status**: B+ (Good foundation, needs optimization)
**Goal Status**: A (Production-ready)
**Effort**: ~2-3 hours total

---

## Phase 1: Immediate Wins (5 minutes)

```nginx
# DIFF: Add these security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com" always;
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;

# CHANGE: Improve referrer policy
- add_header Referrer-Policy "no-referrer-when-downgrade" always;
+ add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**Risk**: None - purely additive security enhancements
**Testing**: `curl -I http://localhost/` - verify headers present

---

## Phase 2: Performance Quick Wins (15 minutes)

### 2.1 Gzip Compression Level
```nginx
# CHANGE: Add compression level
gzip on;
gzip_vary on;
gzip_min_length 512;  # CHANGE: 1024 → 512
gzip_comp_level 6;    # ADD: Default is 1 (too low)
gzip_types ...
```

**Impact**: 10-15% smaller transfers, ~2ms CPU overhead
**Testing**:
```bash
curl -I -H "Accept-Encoding: gzip" http://localhost/app.js
# Check gzip vs uncompressed size
```

### 2.2 Static Asset Headers Enhancement
```nginx
# CHANGE: Add Vary header for compression caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";  # ADD
}
```

**Impact**: Proper CDN caching of compressed variants
**Risk**: None

### 2.3 API Proxy Fix
```nginx
# CHANGE: Add trailing slash to location and X-Forwarded-Proto
location /api/ {  # CHANGE: /api → /api/
    proxy_pass http://api:3000;
    ...
    proxy_set_header X-Forwarded-Proto $scheme;  # ADD

    # ADD: Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

**Impact**: Fixes routing bugs, prevents HTTPS redirect loops
**Testing**:
```bash
curl http://localhost/api/health
# Should reach backend /health not //health
```

---

## Phase 3: Global Configuration (20 minutes)

Add complete nginx.conf structure (if missing):

```nginx
user nginx;
worker_processes 1;  # CRITICAL: Set for Docker container
worker_rlimit_nofile 65535;
error_log /dev/stderr warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    # CRITICAL: Log to stdout for Docker
    access_log /dev/stdout main;
    error_log /dev/stderr warn;

    # Performance tuning
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20m;

    # Gzip configuration
    gzip on;
    gzip_vary on;
    gzip_min_length 512;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json
               application/font-woff application/font-woff2
               application/x-font-ttf application/vnd.ms-fontobject
               image/svg+xml;

    # Brotli (if available in nginx:alpine)
    # brotli on;
    # brotli_comp_level 4;
    # brotli_types text/plain text/css text/xml text/javascript
    #              application/x-javascript application/xml+rss
    #              application/javascript application/json
    #              image/svg+xml;

    server {
        # ... existing config ...
    }
}
```

**Risk**: Medium (structural change) - test thoroughly
**Testing**: `nginx -t` - syntax check

---

## Phase 4: Error Page Handling (15 minutes)

```nginx
# ADD to server block
error_page 404 /index.html;  # SPA routing
error_page 500 502 503 504 /50x.html;

location = /50x.html {
    root /usr/share/nginx/html;
    access_log off;
    internal;  # Only accessible via error_page directive
}

# Ensure custom 500 page exists
# src/public/50x.html or similar
```

**Impact**: Users see SPA UI for 404s instead of nginx error page
**Testing**:
```bash
curl http://localhost/nonexistent-page
# Should return index.html, not nginx 404
```

---

## Phase 5: Container Enhancements (30 minutes)

### 5.1 Add Healthcheck to Dockerfile

```dockerfile
# ADD to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/health || exit 1
```

**Impact**: Docker/Kubernetes can detect healthy container
**Testing**: `docker inspect <container> | grep Health`

### 5.2 Optimize Worker Processes

```nginx
# In nginx.conf - set based on container CPU limit
worker_processes 1;  # If 1 CPU limit
# OR
worker_processes 2;  # If 2 CPU limit
```

**Impact**: 2-5x throughput on CPU-constrained containers
**How to determine**:
```bash
# In container
grep -c ^processor /proc/cpuinfo
# Use this count in worker_processes
```

---

## Phase 6: Optional - Brotli Support (20 minutes)

Check if nginx:alpine has brotli compiled:

```bash
docker run nginx:alpine nginx -V 2>&1 | grep -i brotli
# If output shows brotli module, you can use it
```

If available, add to http block:

```nginx
brotli on;
brotli_comp_level 4;
brotli_types text/plain text/css text/xml text/javascript
             application/x-javascript application/xml+rss
             application/javascript application/json
             image/svg+xml;
```

**Impact**: 20-26% better compression than gzip alone
**Note**: Only if pre-compressed assets available

---

## Testing Checklist

### Security Headers
```bash
curl -I http://localhost/ | grep -E "Strict-Transport|Content-Security|X-Frame"
# Expected output:
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# Content-Security-Policy: default-src 'self'...
# X-Frame-Options: SAMEORIGIN
```

### Cache Headers
```bash
# index.html should NOT cache
curl -I http://localhost/index.html | grep Cache-Control
# Expected: Cache-Control: no-cache, no-store, must-revalidate

# Static assets should cache 1 year
curl -I http://localhost/app.abc123.js | grep Cache-Control
# Expected: Cache-Control: public, immutable
```

### Compression
```bash
# Check gzip compression
curl -I -H "Accept-Encoding: gzip" http://localhost/app.js | grep encoding
# Should show: Content-Encoding: gzip
```

### Health Check
```bash
curl http://localhost/health
# Expected: healthy
```

### API Proxy
```bash
curl http://localhost/api/health
# Should reach backend, not 404
```

### Logging
```bash
docker logs <container>
# Should see access logs (not /var/log file)
```

---

## Implementation Order

### Week 1: Stability (2 hours)
1. ✅ Phase 1: Security headers (5 min)
2. ✅ Phase 2: Performance tuning (15 min)
3. ✅ Phase 3: Global config (20 min)
4. 🧪 Test thoroughly in staging

### Week 2: Features (1 hour)
5. ✅ Phase 4: Error handling (15 min)
6. ✅ Phase 5.1: Healthcheck (10 min)
7. 🧪 Test in staging + production

### Week 3: Optimization (30 min)
8. ✅ Phase 5.2: Worker processes (10 min)
9. ✅ Phase 6: Brotli (optional, 20 min)
10. 🧪 Load test and benchmark

---

## Rollback Plan

If issues occur:

1. **Config syntax error**:
   ```bash
   docker run -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine nginx -t
   # Fix syntax before deploying
   ```

2. **Performance regression**:
   - Revert to previous docker image
   - No data loss (state-less service)

3. **Security header issue**:
   - Temporarily remove offending header
   - Debug in staging

4. **Routing broken** (try_files):
   - Revert location blocks to previous version
   - Rebuild with explicit paths

---

## Success Metrics

Track these after deployment:

| Metric | Before | Target |
|--------|--------|--------|
| JS bundle size | 209KB (gzip) | 161KB (brotli) |
| Time to interactive | ~3s | ~2s |
| Security headers | 4/10 | 9/10 |
| Cache hit rate (static) | 90% | 99% |
| Error rate | 0.1% | 0.01% |
| Container latency p95 | 150ms | 80ms |

---

## Files to Create/Modify

### New Files
```
plans/20251227-2028-docker-optimization/
├── nginx.conf (updated)
├── Dockerfile (updated)
└── 50x.html (new error page)
```

### Modified Files
```
├── nginx.conf
│   ├── Add global config (if missing)
│   ├── Add security headers
│   ├── Fix gzip_comp_level
│   ├── Fix API proxy
│   ├── Add error pages
│   └── Add performance directives
├── Dockerfile
│   └── Add HEALTHCHECK
└── src/public/50x.html (new - custom error page)
```

---

## Post-Deployment Verification

### 1. Immediate (1 minute)
```bash
curl -I http://localhost/
# Check all security headers present
```

### 2. Functional (5 minutes)
```bash
# Test SPA routing
curl http://localhost/about/page
# Should return index.html

# Test API proxy
curl http://localhost/api/users
# Should reach backend
```

### 3. Performance (15 minutes)
```bash
# Load test
ab -n 1000 -c 10 http://localhost/
# Should see improvement in throughput
```

### 4. Container (10 minutes)
```bash
# Docker healthcheck
docker ps | grep app
# Should show "healthy"

# Logs in container
docker logs app | head -20
# Should see access logs
```

---

## Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| CSP too strict | Resources blocked | Check browser console, adjust CSP directives |
| Brotli not available | Nginx won't start | Remove brotli config, use gzip only |
| Health check fails | Container keeps restarting | Check /health endpoint returns 200 |
| API proxy 404 | Backend requests fail | Check trailing slash in location /api/ |
| Logging missing | Can't debug | Ensure access_log /dev/stdout |
| Config syntax error | Container won't start | Run `nginx -t` before deploying |

---

## References

- Full Research: `researcher-03-nginx-optimization.md`
- Current Analysis: `current-nginx-analysis.md`
- Nginx Docs: https://nginx.org/en/docs/

---

**Last Updated**: 2025-12-27
**Status**: Ready for implementation
**Effort Estimate**: 2-3 hours
**Risk Level**: Low-Medium (mostly additive, good rollback plan)
