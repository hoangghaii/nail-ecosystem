# 🐳 Docker Setup Guide - Pink Nail Salon

Complete Docker setup for running all 3 projects (client, admin, API) with development hot-reload and production-ready nginx reverse proxy.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Environment Variables](#environment-variables)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Docker**: v20.10+
- **Docker Compose**: v2.0+
- **Git**: Latest

Verify installation:
```bash
docker --version
docker compose version
```

---

## Quick Start

### 1. Clone and Setup

```bash
cd nail-project

# Copy environment files
cp nail-client/.env.example nail-client/.env
cp nail-admin/.env.example nail-admin/.env
cp nail-api/.env.example nail-api/.env

# Edit .env files with your credentials (MongoDB, Redis, Cloudinary, JWT secrets)
nano nail-api/.env
```

### 2. Run Development Mode

```bash
# Start all services with hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or in detached mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Watch logs
docker compose logs -f
```

**Access:**
- Client: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:3000

### 3. Run Production Mode

```bash
# Build and start with nginx reverse proxy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f nginx
```

**Access:**
- Client: http://localhost/
- Admin: http://localhost/admin
- API: http://localhost/api

---

## Architecture

### Development Mode
```
┌─────────────────────────────────────────────┐
│  HOST MACHINE                               │
│  ├─ localhost:5173 → nail-client (Vite)    │
│  ├─ localhost:5174 → nail-admin (Vite)     │
│  └─ localhost:3000 → nail-api (NestJS)     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Docker Network: nail-network               │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ nail-client  │  │ nail-admin   │        │
│  │ (React dev)  │  │ (React dev)  │        │
│  │ Port: 5173   │  │ Port: 5174   │        │
│  └──────────────┘  └──────────────┘        │
│                                             │
│         ┌────────────────────┐              │
│         │ nail-api           │              │
│         │ (NestJS dev)       │              │
│         │ Port: 3000         │              │
│         └────────────────────┘              │
│                  ↓                          │
│    External Cloud Services:                │
│    - MongoDB Atlas                         │
│    - Redis Cloud                           │
│    - Cloudinary                            │
└─────────────────────────────────────────────┘
```

### Production Mode
```
┌─────────────────────────────────────────────┐
│  Nginx Reverse Proxy (Port 80)             │
│  ├─ /       → nail-client                  │
│  ├─ /admin  → nail-admin                   │
│  └─ /api    → nail-api                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Internal Docker Network                    │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │ nail-client  │  │ nail-admin   │        │
│  │ (nginx:80)   │  │ (nginx:81)   │        │
│  └──────────────┘  └──────────────┘        │
│                                             │
│         ┌────────────────────┐              │
│         │ nail-api           │              │
│         │ (Node.js:3000)     │              │
│         └────────────────────┘              │
└─────────────────────────────────────────────┘
```

---

## Development Mode

**Features:**
- ✅ Hot-reload for all projects
- ✅ Volume mounts (code changes reflect immediately)
- ✅ Direct port access for debugging
- ✅ Interactive terminal support

### Start Services

```bash
# Start all (attached - see logs)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Start all (detached - background)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Start specific service
docker compose -f docker-compose.yml -f docker-compose.dev.yml up nail-client

# Rebuild and start (after Dockerfile changes)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Stop Services

```bash
# Stop all
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Stop and remove volumes
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f nail-api

# Last 100 lines
docker compose logs --tail=100 -f
```

### Access Container Shell

```bash
# Nail Client
docker exec -it nail-client sh

# Nail Admin
docker exec -it nail-admin sh

# Nail API
docker exec -it nail-api sh
```

---

## Production Mode

**Features:**
- ✅ Optimized builds (smaller images)
- ✅ Nginx reverse proxy
- ✅ Resource limits
- ✅ Health checks
- ✅ Logging configuration

### Start Services

```bash
# Build and start
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Without rebuilding
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Stop Services

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

### Scale Services (Optional)

```bash
# Scale API to 2 instances
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale nail-api=2
```

---

## Environment Variables

### Nail Client (.env)

```env
VITE_API_BASE_URL=http://localhost:3000  # Dev
# VITE_API_BASE_URL=/api                 # Prod (nginx proxy)
```

### Nail Admin (.env)

```env
VITE_USE_MOCK_API=true                   # Use mock localStorage data
VITE_API_BASE_URL=http://localhost:3000  # Dev
# VITE_API_BASE_URL=/api                 # Prod (nginx proxy)
```

### Nail API (.env)

```env
NODE_ENV=development
PORT=3000

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nail-salon

# Redis (Redis Cloud)
REDIS_HOST=redis-xxxxx.cloud.redislabs.com
REDIS_PORT=12345
REDIS_PASSWORD=your-password

# JWT Secrets
JWT_ACCESS_SECRET=your-64-char-secret
JWT_REFRESH_SECRET=your-64-char-secret

# CORS
FRONTEND_CLIENT_URL=http://localhost:5173
FRONTEND_ADMIN_URL=http://localhost:5174

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Common Commands

### Build Images

```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml build

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml build

# Specific service
docker compose build nail-api
```

### Check Status

```bash
# List running containers
docker compose ps

# Check health
docker compose ps | grep "healthy"
```

### Clean Up

```bash
# Remove stopped containers
docker compose down

# Remove images
docker compose down --rmi all

# Remove volumes (WARNING: deletes node_modules)
docker compose down -v

# Full cleanup
docker system prune -a --volumes
```

### Restart Service

```bash
# Restart specific service
docker compose restart nail-api

# Restart all
docker compose restart
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5173
lsof -i :5173
# Or
netstat -an | grep 5173

# Kill process
kill -9 <PID>
```

### Hot-Reload Not Working

Check `CHOKIDAR_USEPOLLING=true` is set in docker-compose.dev.yml

### Build Fails

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker compose build --no-cache
```

### Container Exits Immediately

```bash
# Check logs
docker compose logs nail-api

# Check container status
docker ps -a
```

### Network Issues

```bash
# Recreate network
docker compose down
docker network prune
docker compose up
```

### Permission Denied (Linux)

```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Database Connection Failed

- Verify MongoDB URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure Redis credentials are correct

---

## Advanced Usage

### Using Different Env Files

```bash
# Use custom env file
docker compose --env-file .env.staging up
```

### Override Configuration

```bash
# Create docker-compose.override.yml (auto-loaded)
# Add custom config that won't be committed
```

### Debugging

```bash
# Run command in container
docker exec nail-api npm run test

# Check environment variables
docker exec nail-api env

# Check disk usage
docker system df
```

---

## Production Deployment

### Deploy to Server

```bash
# On your server
git clone <repo-url>
cd nail-project

# Setup environment
cp nail-api/.env.example nail-api/.env
nano nail-api/.env  # Add production credentials

# Start production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check status
docker compose ps
docker compose logs -f nginx
```

### Update Deployment

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Check logs
docker compose logs -f
```

---

## Notes

- **Development**: Direct port access for easy debugging
- **Production**: Single entry point via nginx (port 80)
- **Hot-reload**: Enabled via volume mounts + CHOKIDAR_USEPOLLING
- **Health checks**: Ensure services are ready before nginx starts
- **Resource limits**: Prevent runaway containers
- **Logging**: Rotate logs automatically (10MB × 3 files)

---

## Support

Issues? Check:
1. Docker daemon running: `docker info`
2. Disk space: `docker system df`
3. Logs: `docker compose logs`
4. Environment variables: `docker exec <container> env`

For more help, check individual project READMEs:
- `nail-client/README.md`
- `nail-admin/README.md`
- `nail-api/README.md`
