# Phase 1: Preparation

**Estimated Time**: 1-2 hours
**Risk Level**: LOW
**Rollback**: Easy - no code changes yet

---

## Objectives

1. Install pnpm package manager
2. Create backup/branch for rollback
3. Verify current system works
4. Document current state

---

## Steps

### 1.1 Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm@latest

# Verify installation
pnpm --version  # Should be 8.x or 9.x
```

**Why pnpm**: Better for monorepos, faster installs, efficient disk usage

**Alternative**: Can use npm/yarn workspaces if preferred

---

### 1.2 Create Backup Branch

```bash
cd /Users/hainguyen/Documents/nail-project

# Create backup branch from current state
git checkout -b backup/pre-turborepo-migration
git push origin backup/pre-turborepo-migration

# Create working branch
git checkout master
git checkout -b feat/turborepo-migration
```

---

### 1.3 Verify Current System

```bash
# Test development mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Verify in browser:
# - http://localhost:5173 (client)
# - http://localhost:5174 (admin)
# - http://localhost:3000/health (api)

# Stop services
docker compose down

# Test production build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify production
# - http://localhost/ (client via nginx)
# - http://localhost/admin (admin via nginx)
# - http://localhost/api/health (api via nginx)

# Stop services
docker compose down
```

---

### 1.4 Document Current Dependencies

```bash
# Save current package-lock files
cp nail-client/package-lock.json nail-client/package-lock.json.backup
cp nail-admin/package-lock.json nail-admin/package-lock.json.backup
cp nail-api/package-lock.json nail-api/package-lock.json.backup

# Document installed versions
node -v > .migration-baseline.txt
npm -v >> .migration-baseline.txt
docker --version >> .migration-baseline.txt
```

---

### 1.5 Create Root package.json

```bash
# In project root
touch package.json
touch pnpm-workspace.yaml
touch .npmrc
```

---

## Deliverables

- [x] pnpm installed
- [x] Backup branch created
- [x] Current system verified working
- [x] Baseline documented
- [x] Root package files created

---

## Validation Checklist

- [ ] `pnpm --version` shows 8.x or 9.x
- [ ] Backup branch exists: `git branch --list backup/pre-turborepo-migration`
- [ ] Working branch exists: `git branch --list feat/turborepo-migration`
- [ ] Dev mode verified working
- [ ] Prod mode verified working
- [ ] Backup package-lock files exist

---

## Rollback Strategy

If issues arise:
```bash
git checkout master
git branch -D feat/turborepo-migration
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

**Risk**: MINIMAL - No code changes in this phase
