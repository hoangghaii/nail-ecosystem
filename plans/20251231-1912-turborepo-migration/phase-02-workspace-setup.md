# Phase 2: Workspace Setup

**Estimated Time**: 2-3 hours
**Risk Level**: LOW
**Rollback**: Easy - git reset

---

## Objectives

1. Configure pnpm workspace
2. Install Turborepo
3. Create root-level configuration
4. Verify workspace recognition

---

## Steps

### 2.1 Create pnpm-workspace.yaml

```yaml
# /pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

---

### 2.2 Create Root package.json

```json
{
  "name": "pink-nail-salon",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*",
    "tooling/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "clean": "turbo clean",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\""
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "prettier": "^3.7.3"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@9.15.0"
}
```

---

### 2.3 Create .npmrc

```ini
# Workspace protocol for internal packages
link-workspace-packages=true

# Strict peer dependencies
strict-peer-dependencies=false

# Hoist pattern
shamefully-hoist=true

# Public registry
registry=https://registry.npmjs.org/
```

---

### 2.4 Install Turborepo

```bash
cd /Users/hainguyen/Documents/nail-project

# Install root dependencies
pnpm install

# Verify turbo is available
pnpm turbo --version
```

---

### 2.5 Create turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

### 2.6 Create Directory Structure

```bash
# Create directories (don't move files yet)
mkdir -p apps
mkdir -p packages/types
mkdir -p packages/ui
mkdir -p packages/utils
mkdir -p packages/typescript-config
mkdir -p packages/eslint-config
mkdir -p packages/tailwind-config
mkdir -p tooling/prettier-config
```

---

### 2.7 Update .gitignore

```bash
# Add to root .gitignore
cat >> .gitignore <<EOF

# Turborepo
.turbo
dist
build

# pnpm
.pnpm-store

EOF
```

---

## Deliverables

- [x] pnpm-workspace.yaml created
- [x] Root package.json configured
- [x] .npmrc configured
- [x] Turborepo installed
- [x] turbo.json created
- [x] Directory structure created
- [x] .gitignore updated

---

## Validation Checklist

- [ ] `pnpm turbo --version` works
- [ ] Root package.json has turbo dependency
- [ ] Directories exist: apps/, packages/, tooling/
- [ ] pnpm-workspace.yaml defines correct globs

---

## Rollback Strategy

```bash
# Remove workspace files
git checkout .
git clean -fd

# Or reset to previous commit
git reset --hard HEAD~1
```

**Risk**: LOW - Only added config files, no code moved
