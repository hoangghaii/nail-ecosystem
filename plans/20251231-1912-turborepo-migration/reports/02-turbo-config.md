# Turbo.json Configuration

**Date**: 2025-12-31

---

## Root turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"],
      "env": [
        "NODE_ENV",
        "VITE_API_BASE_URL",
        "MONGODB_URI",
        "REDIS_HOST",
        "CLOUDINARY_CLOUD_NAME"
      ]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "test/**"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## Task Explanations

### build
- **dependsOn**: `^build` - Build dependencies first
- **outputs**: Cached artifacts (dist/, build/)
- **env**: Environment variables that affect build
- **Usage**: `turbo build` - Builds all packages in dependency order

### dev
- **cache**: false - Development shouldn't cache
- **persistent**: true - Keeps dev servers running
- **Usage**: `turbo dev` - Starts all dev servers in parallel

### lint
- **dependsOn**: `^build` - Lint after dependencies built
- **Usage**: `turbo lint` - Runs ESLint across workspace

### test
- **dependsOn**: `^build` - Test after dependencies built
- **outputs**: Coverage reports
- **inputs**: Only re-run if src/ or test/ changes
- **Usage**: `turbo test` - Runs all tests

### type-check
- **dependsOn**: `^build` - Type-check after dependencies built
- **Usage**: `turbo type-check` - TypeScript validation

### clean
- **cache**: false - Always execute
- **Usage**: `turbo clean` - Remove build artifacts

---

## Package-Specific Overrides

### apps/client/package.json
```json
{
  "name": "client",
  "scripts": {
    "dev": "vite --port 5173",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

### apps/admin/package.json
```json
{
  "name": "admin",
  "scripts": {
    "dev": "vite --port 5174",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

### apps/api/package.json
```json
{
  "name": "api",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "type-check": "tsc --noEmit"
  }
}
```

### packages/types/package.json
```json
{
  "name": "@repo/types",
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Common Commands

```bash
# Development - All apps in parallel
turbo dev

# Development - Specific app
turbo dev --filter=client

# Build everything
turbo build

# Build specific app + dependencies
turbo build --filter=admin...

# Lint all
turbo lint

# Type-check all
turbo type-check

# Clean all build artifacts
turbo clean

# Run with cache disabled (debugging)
turbo build --force

# Dry run (see what would execute)
turbo build --dry-run
```

---

## Remote Caching (Future)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "remoteCache": {
    "signature": true
  }
}
```

**Setup**:
```bash
turbo login
turbo link
```

**CI/CD**:
```bash
docker build --build-arg TURBO_TOKEN="xxx" --build-arg TURBO_TEAM="yyy"
```
