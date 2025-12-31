# Phase 4: Move Apps to Workspace

**Estimated Time**: 2-3 hours
**Risk Level**: MEDIUM
**Rollback**: Medium - git reset or restore from backup

---

## Objectives

1. Move nail-client → apps/client
2. Move nail-admin → apps/admin
3. Move nail-api → apps/api
4. Update package.json in each app
5. Install workspace dependencies

---

## Steps

### 4.1 Move Directories

```bash
cd /Users/hainguyen/Documents/nail-project

# Move apps
mv nail-client apps/client
mv nail-admin apps/admin
mv nail-api apps/api
```

---

### 4.2 Update apps/client/package.json

**Changes**:
```json
{
  "name": "client",
  "version": "0.0.0",
  "dependencies": {
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
    // ... keep existing dependencies
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@repo/prettier-config": "workspace:*",
    "@repo/tailwind-config": "workspace:*",
    // ... keep existing devDependencies
  }
}
```

---

### 4.3 Update apps/admin/package.json

**Changes**:
```json
{
  "name": "admin",
  "version": "0.0.0",
  "dependencies": {
    "@repo/types": "workspace:*",
    "@repo/utils": "workspace:*",
    // ... keep existing dependencies
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@repo/prettier-config": "workspace:*",
    "@repo/tailwind-config": "workspace:*",
    // ... keep existing devDependencies
  }
}
```

---

### 4.4 Update apps/api/package.json

**Changes**:
```json
{
  "name": "api",
  "version": "0.0.1",
  "dependencies": {
    "@repo/types": "workspace:*",
    // ... keep existing dependencies
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@repo/prettier-config": "workspace:*",
    // ... keep existing devDependencies
  }
}
```

---

### 4.5 Update TypeScript Configs

**apps/client/tsconfig.json**:
```json
{
  "extends": "@repo/typescript-config/react.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**apps/admin/tsconfig.json**: Same as client

**apps/api/tsconfig.json**:
```json
{
  "extends": "@repo/typescript-config/nestjs.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test"]
}
```

---

### 4.6 Update ESLint Configs

**apps/client/eslint.config.js**:
```javascript
import reactConfig from '@repo/eslint-config/react';

export default reactConfig;
```

**apps/admin/eslint.config.js**: Same as client

**apps/api/.eslintrc.js** (or migrate to flat config):
```javascript
const nestjsConfig = require('@repo/eslint-config/nestjs');

module.exports = nestjsConfig;
```

---

### 4.7 Update Prettier Configs

**apps/client/.prettierrc.js**:
```javascript
module.exports = require('@repo/prettier-config');
```

**apps/admin/.prettierrc.js**: Same
**apps/api/.prettierrc.js**: Same

---

### 4.8 Install Dependencies

```bash
cd /Users/hainguyen/Documents/nail-project

# Remove old node_modules and lockfiles
rm -rf apps/*/node_modules
rm -rf apps/*/package-lock.json

# Install with pnpm workspace
pnpm install
```

---

## Deliverables

- [x] Apps moved to apps/ directory
- [x] package.json updated with workspace: dependencies
- [x] TypeScript configs extend @repo/typescript-config
- [x] ESLint configs use @repo/eslint-config
- [x] Prettier configs use @repo/prettier-config
- [x] Dependencies installed

---

## Validation Checklist

- [ ] `pnpm install` completes successfully
- [ ] Directory structure matches: apps/client, apps/admin, apps/api
- [ ] No build errors: `pnpm turbo type-check`
- [ ] Workspace dependencies resolved in node_modules

---

## Rollback Strategy

```bash
# Move apps back
mv apps/client nail-client
mv apps/admin nail-admin
mv apps/api nail-api

# Restore original package.json files from backup branch
git checkout backup/pre-turborepo-migration -- nail-client/package.json
git checkout backup/pre-turborepo-migration -- nail-admin/package.json
git checkout backup/pre-turborepo-migration -- nail-api/package.json

# Reinstall with npm
cd nail-client && npm install
cd ../nail-admin && npm install
cd ../nail-api && npm install
```

**Risk**: MEDIUM - File moves, but can be reversed
