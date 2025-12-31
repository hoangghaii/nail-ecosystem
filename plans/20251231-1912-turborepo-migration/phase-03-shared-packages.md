# Phase 3: Create Shared Packages

**Estimated Time**: 4-6 hours
**Risk Level**: LOW-MEDIUM
**Rollback**: Easy - delete packages/ directory

---

## Objectives

Create shared packages BEFORE moving apps:
1. @repo/typescript-config
2. @repo/prettier-config
3. @repo/eslint-config
4. @repo/types
5. @repo/utils
6. @repo/tailwind-config

---

## 3.1 @repo/typescript-config

### Create Files

```bash
cd packages/typescript-config
```

**package.json**:
```json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "private": true,
  "files": ["base.json", "react.json", "nestjs.json"]
}
```

**base.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "verbatimModuleSyntax": true
  }
}
```

**react.json**:
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "target": "ES2020",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

**nestjs.json**:
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2021"],
    "module": "commonjs",
    "target": "ES2021",
    "moduleResolution": "node",
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "./dist",
    "incremental": true
  }
}
```

---

## 3.2 @repo/prettier-config

```bash
cd tooling/prettier-config
```

**package.json**:
```json
{
  "name": "@repo/prettier-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.js"
}
```

**index.js**:
```javascript
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  plugins: ['prettier-plugin-tailwindcss']
};
```

---

## 3.3 @repo/eslint-config

```bash
cd packages/eslint-config
```

**package.json**:
```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "files": ["react.js", "nestjs.js"],
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "eslint": "^9.39.1",
    "typescript-eslint": "^8.46.4"
  }
}
```

**react.js**: Copy from nail-client/eslint.config.js
**nestjs.js**: Copy from nail-api/eslint.config.js (if exists)

---

## 3.4 @repo/types

```bash
cd packages/types
```

**package.json**:
```json
{
  "name": "@repo/types",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./service": "./src/service.ts",
    "./gallery": "./src/gallery.ts",
    "./booking": "./src/booking.ts",
    "./auth": "./src/auth.ts"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "~5.9.3"
  }
}
```

**tsconfig.json**:
```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**src/service.ts**: Copy from nail-client/src/types/service.types.ts
**src/gallery.ts**: Copy from nail-client/src/types/gallery.types.ts
**src/booking.ts**: Copy from nail-client/src/types/booking.types.ts
**src/auth.ts**: Copy from nail-admin/src/types/auth.types.ts
**src/index.ts**:
```typescript
export * from './service';
export * from './gallery';
export * from './booking';
export * from './auth';
```

---

## 3.5 @repo/utils

```bash
cd packages/utils
```

**package.json**:
```json
{
  "name": "@repo/utils",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./cn": "./src/cn.ts",
    "./format": "./src/format.ts"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "~5.9.3"
  }
}
```

**src/cn.ts**: Copy from nail-client/src/lib/utils.ts (cn function)
**src/format.ts**: Add formatting utilities
**src/index.ts**:
```typescript
export { cn } from './cn';
export * from './format';
```

---

## 3.6 @repo/tailwind-config

```bash
cd packages/tailwind-config
```

**package.json**:
```json
{
  "name": "@repo/tailwind-config",
  "version": "0.0.0",
  "private": true,
  "files": ["base.js", "client-theme.js", "admin-theme.js"],
  "devDependencies": {
    "tailwindcss": "^4.1.17"
  }
}
```

**base.js**: Extract common config from both apps
**client-theme.js**: Client-specific theme
**admin-theme.js**: Admin-specific theme

---

## Install Dependencies

```bash
cd /Users/hainguyen/Documents/nail-project

# Install all package dependencies
pnpm install
```

---

## Deliverables

- [x] @repo/typescript-config package created
- [x] @repo/prettier-config package created
- [x] @repo/eslint-config package created
- [x] @repo/types package created (eliminates duplication!)
- [x] @repo/utils package created
- [x] @repo/tailwind-config package created
- [x] All dependencies installed

---

## Validation Checklist

- [ ] `pnpm install` completes without errors
- [ ] All packages have package.json
- [ ] TypeScript configs are valid JSON
- [ ] Types package exports work: check src/index.ts

---

## Rollback Strategy

```bash
# Delete packages directory
rm -rf packages/
rm -rf tooling/

# Reinstall root
pnpm install
```

**Risk**: MEDIUM - Creating new code, but apps not yet affected
