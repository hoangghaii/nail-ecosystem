# Docker Guide - Pink Nail Salon Website

Complete guide for building, running, and deploying the Pink Nail Salon website using Docker.

## Table of Contents

- [Quick Start](#quick-start)
- [Dockerfile Architecture](#dockerfile-architecture)
- [Docker Compose Environments](#docker-compose-environments)
- [Common Commands](#common-commands)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)
- [Security](#security)

---

## Quick Start

### Development Environment

```bash
# Build and run development container
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Access the application
open http://localhost:5173
```

### Production Environment

```bash
# Build and run production container
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Access the application
open http://localhost
```

---

## Dockerfile Architecture

Our Dockerfile uses a **multi-stage build** pattern with 4 stages:

### 1. Base Stage
```dockerfile
FROM node:24.12.0-alpine AS base
```
- Shared foundation for all stages
- Alpine Linux (~5MB) for minimal size
- Installs dumb-init for proper signal handling
- Copies package files for dependency installation

### 2. Development Stage
```dockerfile
FROM base AS development
```
- Full Node.js environment with hot reload
- Installs ALL dependencies (including devDependencies)
- Runs as non-root user (`viteuser`)
- Exposes port 5173 for Vite dev server
- Supports source code volume mounting

### 3. Builder Stage
```dockerfile
FROM base AS builder
```
- Builds production-ready static assets
- Installs only production dependencies (`--omit=dev`)
- Uses BuildKit cache mounts for faster rebuilds
- Removes unnecessary files after build
- **Final output:** `/app/dist` directory

### 4. Production Stage
```dockerfile
FROM nginx:1.27.3-alpine AS production
```
- Lightweight Nginx Alpine (~40MB total)
- Copies only built static files from builder
- Runs as non-root user (`nginx-user`)
- Includes health check endpoint
- Production-optimized nginx configuration

### Build Optimizations

**Layer Caching Strategy:**
1. Copy `package.json` + `package-lock.json` first
2. Install dependencies (cached unless package files change)
3. Copy source code
4. Build application

**BuildKit Cache Mounts:**
```dockerfile
RUN --mount=type=cache,target=/root/.npm npm ci
```
- Caches npm downloads across builds
- Reduces rebuild time by 50-70%

**Image Size Targets:**
- Development: ~800MB (includes Node.js + all deps)
- Production: ~20-40MB (only Nginx + static files)

---

## Docker Compose Environments

### File Structure

```
docker-compose.yml        # Base configuration (shared settings)
docker-compose.dev.yml    # Development overrides
docker-compose.prod.yml   # Production overrides
```

### Development (`docker-compose.dev.yml`)

**Features:**
- Hot reload with volume mounting
- Interactive terminal (stdin_open, tty)
- Exposes port 5173
- File watching with CHOKIDAR_USEPOLLING
- Health check on Vite server

**Usage:**
```bash
# Start development environment
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Rebuild and start
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Stop and remove containers
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# View logs
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
```

### Production (`docker-compose.prod.yml`)

**Features:**
- Resource limits (0.5 CPU, 256MB RAM)
- Automatic restarts with backoff
- Log rotation (10MB max, 3 files)
- Health checks on nginx
- Version tagging support

**Usage:**
```bash
# Start production environment
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Build with version tag
VERSION=1.0.0 docker compose -f docker-compose.yml -f docker-compose.prod.yml build

# Scale replicas (Docker Swarm mode)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale client=2

# Stop production environment
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

---

## Common Commands

### Building Images

```bash
# Build development image
docker build --target development -t nail-client:dev .

# Build production image
docker build --target production -t nail-client:prod .

# Build with BuildKit (faster, recommended)
DOCKER_BUILDKIT=1 docker build --target production -t nail-client:prod .

# Build with version tag
docker build --target production -t nail-client:1.0.0 .

# Build without cache (clean build)
docker build --no-cache --target production -t nail-client:prod .
```

### Running Containers

```bash
# Run development container with volume mount
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules nail-client:dev

# Run production container
docker run -p 80:80 nail-client:prod

# Run in detached mode (background)
docker run -d -p 80:80 --name nail-client nail-client:prod

# Run with custom environment variables
docker run -p 80:80 -e NODE_ENV=production nail-client:prod
```

### Container Management

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop container
docker stop nail-client

# Remove container
docker rm nail-client

# View container logs
docker logs -f nail-client

# Execute command in running container
docker exec -it nail-client sh

# Inspect container
docker inspect nail-client
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi nail-client:dev

# Remove unused images
docker image prune

# Remove all unused images
docker image prune -a

# View image layers
docker history nail-client:prod

# Export image
docker save nail-client:prod > nail-client.tar

# Import image
docker load < nail-client.tar
```

### Docker Compose Commands

```bash
# Start services
docker compose up

# Start in detached mode
docker compose up -d

# Rebuild images
docker compose build

# Rebuild and start
docker compose up --build

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f client

# Execute command in service
docker compose exec client sh

# List running services
docker compose ps

# Restart service
docker compose restart client
```

---

## Best Practices

### 1. Use BuildKit

Enable BuildKit for faster builds and better caching:

```bash
# Enable BuildKit for single build
DOCKER_BUILDKIT=1 docker build .

# Enable BuildKit globally
export DOCKER_BUILDKIT=1
echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc  # or ~/.zshrc
```

### 2. Leverage .dockerignore

The `.dockerignore` file excludes unnecessary files from build context:

```
node_modules/
dist/
.git/
.env*
*.log
*.md
README.md
```

**Why?** Reduces build context size and speeds up builds.

### 3. Version Your Images

Use semantic versioning for production images:

```bash
# Build with version
docker build -t nail-client:1.0.0 .
docker build -t nail-client:latest .

# Tag existing image
docker tag nail-client:1.0.0 nail-client:latest
```

### 4. Health Checks

Our Dockerfile includes health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
```

Check container health:
```bash
docker ps  # Shows health status
docker inspect nail-client | grep -A 10 Health
```

### 5. Resource Limits

Prevent containers from consuming all system resources:

```yaml
deploy:
  resources:
    limits:
      cpus: '0.50'
      memory: 256M
    reservations:
      cpus: '0.25'
      memory: 128M
```

### 6. Non-Root User

All stages run as non-root users for security:

```dockerfile
# Development stage
USER viteuser

# Production stage
USER nginx-user
```

### 7. Log Management

Configure log rotation to prevent disk space issues:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
    compress: "true"
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs nail-client

# Check with Docker Compose
docker compose logs client

# Inspect container
docker inspect nail-client

# Check health status
docker ps
```

### Health Check Failing

```bash
# Test health endpoint manually
docker exec nail-client wget -O- http://localhost/health

# Check nginx logs
docker exec nail-client cat /var/log/nginx/error.log
```

### Build Errors

```bash
# Clean build (no cache)
docker build --no-cache -t nail-client:prod .

# Check Docker version
docker --version

# Ensure BuildKit is enabled
DOCKER_BUILDKIT=1 docker build .
```

### Permission Issues

```bash
# Check user in container
docker exec nail-client whoami

# Check file permissions
docker exec nail-client ls -la /usr/share/nginx/html

# Fix ownership (if needed)
docker exec -u root nail-client chown -R nginx-user:nginx-user /usr/share/nginx/html
```

### Volume Mount Issues (Development)

```bash
# Remove old volumes
docker compose down -v

# Rebuild and recreate
docker compose up --build --force-recreate

# Check volume mounts
docker inspect nail-client-dev | grep -A 20 Mounts
```

### Network Issues

```bash
# List networks
docker network ls

# Inspect network
docker network inspect nail-network

# Remove unused networks
docker network prune
```

---

## Production Deployment

### Build for Production

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Build production image with version tag
VERSION=1.0.0 docker build --target production -t nail-client:$VERSION .

# Tag as latest
docker tag nail-client:$VERSION nail-client:latest
```

### Run Production Container

```bash
# Run with Docker Compose (recommended)
VERSION=1.0.0 docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Or run directly
docker run -d \
  --name nail-client \
  -p 80:80 \
  --restart=always \
  --memory="256m" \
  --cpus="0.5" \
  nail-client:1.0.0
```

### Deploy to Docker Registry

```bash
# Login to Docker Hub
docker login

# Tag image for registry
docker tag nail-client:1.0.0 yourusername/nail-client:1.0.0
docker tag nail-client:1.0.0 yourusername/nail-client:latest

# Push to registry
docker push yourusername/nail-client:1.0.0
docker push yourusername/nail-client:latest

# Pull on production server
docker pull yourusername/nail-client:1.0.0
docker run -d -p 80:80 yourusername/nail-client:1.0.0
```

### Docker Swarm Deployment

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml nail-stack

# List services
docker service ls

# Scale service
docker service scale nail-stack_client=3

# Update service
docker service update --image nail-client:2.0.0 nail-stack_client

# Remove stack
docker stack rm nail-stack
```

### Environment Variables

Create `.env` file for production:

```env
VERSION=1.0.0
NODE_ENV=production
```

Use in docker-compose:
```bash
docker compose --env-file .env -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Security

### Security Best Practices Implemented

1. **Non-Root User**
   - Development: runs as `viteuser` (UID 1001)
   - Production: runs as `nginx-user` (UID 1001)

2. **Minimal Base Images**
   - Alpine Linux (~5MB) instead of full Debian (~80MB)
   - Reduces attack surface

3. **Multi-Stage Builds**
   - Build tools excluded from production image
   - Only static files in final image

4. **Explicit Image Versions**
   - `node:24.12.0-alpine` instead of `node:latest`
   - `nginx:1.27.3-alpine` instead of `nginx:latest`

5. **Nginx Security Headers**
   - See `nginx.conf` for complete security headers
   - X-Frame-Options, X-Content-Type-Options, etc.

6. **Health Checks**
   - Ensures containers are healthy
   - Automatic restart if unhealthy

### Security Scanning

```bash
# Scan image for vulnerabilities (Trivy)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image nail-client:prod

# Scan with Snyk
snyk container test nail-client:prod
```

### Update Base Images

Regularly update base images:

```bash
# Pull latest Alpine images
docker pull node:24.12.0-alpine
docker pull nginx:1.27.3-alpine

# Rebuild
docker build --no-cache -t nail-client:prod .
```

---

## Additional Resources

### Official Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Best Practices Guides
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)

### Security Resources
- [Docker Security](https://docs.docker.com/engine/security/)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

---

## Support

For issues or questions:
1. Check logs: `docker logs nail-client` or `docker compose logs`
2. Review [Troubleshooting](#troubleshooting) section
3. Check Docker and Docker Compose versions
4. Ensure BuildKit is enabled

**Minimum Requirements:**
- Docker: 20.10+
- Docker Compose: 2.0+
- BuildKit: Enabled (recommended)
