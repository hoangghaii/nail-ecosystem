# Phase 01 — Analysis & Prep

**Parent plan**: [plan.md](./plan.md)
**Related docs**: `/Users/hainguyen/Documents/nail-project/CLAUDE.md`, `/Users/hainguyen/Documents/nail-project/docs/code-standards.md`

---

## Overview

- **Date**: 2026-02-20
- **Priority**: High (blocker for all other phases)
- **Status**: pending
- **Description**: Inventory everything that must change before touching files. No file edits in this phase — analysis only.

---

## Key Insights

- Root `package.json` has `"packageManager": "npm@11.7.0"` — must be updated to `"pnpm@10.30.0"`
- Root `package.json` has `"workspaces": ["apps/*","packages/*","tooling/*"]` — must be removed (pnpm uses `pnpm-workspace.yaml`)
- `.gitignore` has `!package-lock.json` (explicitly un-ignores it) AND `pnpm-lock.yaml` (ignores pnpm lockfile) — both must flip
- No `.npmrc` exists at root — must create
- No CI files in `.github/workflows/` — no CI changes needed
- No `npm` commands in docker-compose files (only in Dockerfiles)
- pnpm version to pin: **10.30.0**

---

## Inventory: package-lock.json Files to Delete

| File | Action |
|------|--------|
| `/Users/hainguyen/Documents/nail-project/package-lock.json` | delete |
| `/Users/hainguyen/Documents/nail-project/apps/client/package-lock.json` | delete |
| `/Users/hainguyen/Documents/nail-project/apps/admin/package-lock.json` | delete |
| `/Users/hainguyen/Documents/nail-project/apps/api/package-lock.json` | delete |

Note: `/Users/hainguyen/Documents/nail-project/.claude/skills/chrome-devtools/scripts/package-lock.json` — do NOT delete (belongs to skill tooling, not the monorepo workspace).

---

## Inventory: @repo/* Dependencies Using `"*"` → `"workspace:*"`

### apps/client/package.json
```json
"dependencies": {
  "@repo/types": "*",   // → "workspace:*"
  "@repo/utils": "*"    // → "workspace:*"
},
"devDependencies": {
  "@repo/eslint-config": "*",     // → "workspace:*"
  "@repo/prettier-config": "*",   // → "workspace:*"
  "@repo/tailwind-config": "*",   // → "workspace:*"
  "@repo/typescript-config": "*"  // → "workspace:*"
}
```

### apps/admin/package.json
```json
"dependencies": {
  "@repo/types": "*",   // → "workspace:*"
  "@repo/utils": "*"    // → "workspace:*"
},
"devDependencies": {
  "@repo/eslint-config": "*",     // → "workspace:*"
  "@repo/prettier-config": "*",   // → "workspace:*"
  "@repo/tailwind-config": "*",   // → "workspace:*"
  "@repo/typescript-config": "*"  // → "workspace:*"
}
```

### apps/api/package.json
```json
"dependencies": {
  "@repo/types": "*"   // → "workspace:*"
},
"devDependencies": {
  "@repo/eslint-config": "*",    // → "workspace:*"
  "@repo/prettier-config": "*",  // → "workspace:*"
  "@repo/typescript-config": "*" // → "workspace:*"
}
```

### packages/types/package.json
```json
"devDependencies": {
  "@repo/typescript-config": "*"  // → "workspace:*"
}
```

### packages/utils/package.json
```json
"devDependencies": {
  "@repo/typescript-config": "*"  // → "workspace:*"
}
```

**Total**: 14 `"*"` references across 5 package.json files — all become `"workspace:*"`.

---

## .npmrc Settings Required

pnpm in a Turborepo monorepo needs specific hoisting to allow Turborepo and tools like ESLint to resolve shared configs:

```ini
# Hoist all packages (needed for Turborepo + ESLint config resolution)
public-hoist-pattern[]=*

# Ensure shamefully-hoist is OFF (keeps isolation, public-hoist-pattern handles the rest)
shamefully-hoist=false

# Store pnpm packages in node_modules (not virtual store) for compatibility
node-linker=hoisted
```

**Decision rationale**:
- `shamefully-hoist=true` would hoist everything to root like npm — defeats pnpm isolation benefit
- `public-hoist-pattern[]=*` hoists only public (non-scoped or explicitly listed) packages — sufficient for Turborepo
- `node-linker=hoisted` is the safest for monorepos with Turborepo and tools expecting flat node_modules

---

## packageManager Field

Root `package.json` must add:
```json
"packageManager": "pnpm@10.30.0"
```

This enables corepack to auto-install the correct pnpm version and prevents accidental `npm install` usage.

---

## engines Field Update

Root `package.json` `engines` block:
```json
"engines": {
  "node": ">=20.0.0",
  "pnpm": ">=10.0.0"
}
```

Remove `"npm": ">=9.0.0"` — replace with `"pnpm": ">=10.0.0"`.

---

## Requirements

- pnpm 10.30.0 installed locally: `corepack enable && corepack use pnpm@10.30.0`
- Node.js >= 20.0.0 (already required)
- All app devs must run `corepack enable` once

---

## Related Code Files

- `/Users/hainguyen/Documents/nail-project/package.json` — inspect only
- `/Users/hainguyen/Documents/nail-project/.gitignore` — inspect only
- All `apps/*/package.json` and `packages/*/package.json` — inspect only

---

## Todo Checklist

- [ ] Verify pnpm 10.30.0 is latest stable (confirmed 2026-02-20)
- [ ] Confirm all 14 `"*"` `@repo/*` references identified
- [ ] Confirm 4 `package-lock.json` files identified for deletion
- [ ] Confirm no `.npmrc` exists at root
- [ ] Confirm no CI files affected
- [ ] Confirm no `npm` in docker-compose files (only in Dockerfiles)
- [ ] Confirm husky behavior with pnpm (see Unresolved Questions in plan.md)

---

## Success Criteria

- Complete inventory of all files requiring changes
- `.npmrc` settings documented and justified
- No surprises in Phase 02

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| husky `prepare` not triggered by pnpm | Medium | pnpm has `prepare` lifecycle support since v7; verify `.husky/` already committed |
| ESLint config resolution breaks with pnpm hoisting | Low | `public-hoist-pattern[]=*` covers this |
| NestJS CLI (`nest build`) fails inside Docker | Low | `node-linker=hoisted` keeps flat node_modules |

---

## Next Steps

Proceed to [phase-02-pnpm-workspace-setup.md](./phase-02-pnpm-workspace-setup.md)
