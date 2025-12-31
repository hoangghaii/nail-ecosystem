# Phase 7: Verification & Cleanup

**Estimated Time**: 2-3 hours
**Risk Level**: LOW
**Rollback**: N/A - verification only

---

## Objectives

1. Verify all functionality works
2. Run build/lint/type-check
3. Clean up old files
4. Update documentation
5. Commit changes

---

## Steps

### 7.1 Full Build Test

```bash
# Clean build
pnpm turbo clean
pnpm turbo build

# Should build all apps + packages
# Verify outputs:
# - apps/client/dist
# - apps/admin/dist
# - apps/api/dist
# - packages/types/dist (if compiled)
```

---

### 7.2 Lint & Type-Check

```bash
# Run all checks
pnpm turbo lint
pnpm turbo type-check

# Should pass with no errors
```

---

### 7.3 Test Turbo Caching

```bash
# Build once
pnpm turbo build

# Build again - should use cache
pnpm turbo build

# Output should show "cache hit" for all tasks
```

---

### 7.4 Test Affected Builds

```bash
# Make change to @repo/types
echo "// test" >> packages/types/src/service.ts

# Build - should only rebuild affected apps
pnpm turbo build

# Should rebuild: types, client, admin (api might skip if doesn't use types)
```

---

### 7.5 Cleanup Old Files

```bash
# Remove old lockfiles (if exist)
rm -f nail-*/package-lock.json

# Remove old node_modules (if exist)
rm -rf nail-*/node_modules

# Remove backup package-lock files
rm -f apps/*/package-lock.json.backup
```

---

### 7.6 Update Documentation

**Update README.md**:
- Change setup instructions to pnpm
- Update directory structure
- Add Turborepo commands

**Update CLAUDE.md**:
- Update project structure section
- Add workspace package information
- Update development workflow

**Create/Update README-TURBOREPO.md**:
- Document monorepo structure
- Explain shared packages
- List common commands
- Troubleshooting guide

---

### 7.7 Verify Git Hooks

```bash
# Test husky hooks still work
git add .
git commit -m "test: verify hooks"

# Should run lint-staged, prettier, etc.
```

---

### 7.8 Final Integration Tests

**Manual Testing Checklist**:
- [ ] Client: Browse pages, test booking flow
- [ ] Admin: Login, create service, upload gallery image
- [ ] API: Health check, auth endpoints, CRUD operations
- [ ] Cross-cutting: Verify types are shared, no duplication

**Development Workflow Test**:
```bash
# Start all apps
pnpm dev

# Make changes to each app, verify hot-reload
# Make change to @repo/types, verify both client and admin reload
```

---

### 7.9 Performance Comparison

**Before (estimate from baseline)**:
- Initial build time: ~X minutes
- Rebuild time: ~X minutes
- Install time: ~X minutes

**After (measure)**:
```bash
time pnpm install    # Note time
time pnpm turbo build  # Note time
time pnpm turbo build  # Note cache hit time
```

Document improvements.

---

## Deliverables

- [x] All builds pass
- [x] All lints pass
- [x] All type-checks pass
- [x] Turbo caching works
- [x] Old files cleaned up
- [x] Documentation updated
- [x] Git hooks working
- [x] Integration tests pass
- [x] Performance benchmarked

---

## Validation Checklist

- [ ] `pnpm turbo build` succeeds
- [ ] `pnpm turbo lint` succeeds
- [ ] `pnpm turbo type-check` succeeds
- [ ] Cache hit on second build
- [ ] README.md updated
- [ ] CLAUDE.md updated
- [ ] All manual tests pass
- [ ] No duplicate types exist
- [ ] Hot-reload works in dev mode

---

## Success Criteria

✅ All apps build successfully
✅ No type duplication
✅ Turbo caching functional
✅ Docker dev mode works
✅ Docker prod mode works
✅ Documentation updated
✅ Git hooks preserved
✅ Performance improved or maintained
