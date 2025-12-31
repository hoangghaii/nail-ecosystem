# Context Optimization Implementation Checklist

**Date**: 2025-12-31
**Status**: Ready for implementation
**Estimated Total Savings**: 7,796 tokens (15.7% reduction)

---

## ✅ Priority 1: IMMEDIATE (5-10 minutes)

### [ ] 1.1 Delete Duplicate Workflow Files

**Impact**: -6,096 tokens (75% workflow duplication eliminated)
**Risk**: LOW (all files identical, no data loss)

```bash
# Backup first (optional)
tar -czf workflow-backup-$(date +%y%m%d).tar.gz \
  nail-admin/.claude/workflows/ \
  nail-api/.claude/workflows/ \
  nail-client/.claude/workflows/

# Delete duplicates
rm -rf nail-admin/.claude/workflows/
rm -rf nail-api/.claude/workflows/
rm -rf nail-client/.claude/workflows/

# Verify canonical copies remain
ls -la .claude/workflows/
# Should show: development-rules.md, orchestration-protocol.md,
#              primary-workflow.md, documentation-management.md
```

**Validation**:
```bash
# Should find only 4 workflow files (canonical set)
find . -name "*.md" -path "*/.claude/workflows/*" | wc -l
# Expected: 4 (was 16)
```

---

### [ ] 1.2 Update .gitignore

```bash
# Add to .gitignore to prevent re-creation
echo "" >> .gitignore
echo "# Prevent workflow duplication - use root .claude/workflows only" >> .gitignore
echo "nail-*/.claude/workflows/" >> .gitignore
```

---

### [ ] 1.3 Create Missing Documentation Files

**Impact**: Prevents "file not found" errors, enables progressive disclosure
**Risk**: NONE

```bash
# Create placeholder files
touch docs/code-standards.md
touch docs/system-architecture.md
touch docs/shared-types.md
touch docs/api-endpoints.md
touch docs/design-guidelines.md
touch docs/deployment-guide.md
touch docs/project-roadmap.md
```

---

## 📋 Priority 2: HIGH IMPACT (30-60 minutes)

### [ ] 2.1 Extract Shared Types to Documentation

**Impact**: Reduced lost-in-middle risk (types currently at middle 38-54%)
**Risk**: LOW (just moving content)

**Steps**:
1. Create `docs/shared-types.md`
2. Extract shared type definitions from root CLAUDE.md (lines ~250-350)
3. Add critical summary at top of root CLAUDE.md
4. Replace detailed section with: "See ./docs/shared-types.md"

**Content to extract**:
- Service types (Service, ServiceCategory)
- Gallery types (GalleryItem, GalleryCategory)
- Booking types (Booking, BookingStatus, CustomerInfo)
- Critical constraint note about cross-project compatibility

---

### [ ] 2.2 Compress Root CLAUDE.md

**Impact**: -1,700 tokens (32% reduction)
**Risk**: LOW (preserving all info, just more concise)

**Sub-tasks**:

#### [ ] 2.2a Replace ASCII Architecture Diagram
```markdown
# Before (31 lines, ~500 tokens):
┌─────────────────────────────────────────────────────────────┐
│                    PINK NAIL SALON ECOSYSTEM                │
...

# After (4 lines, ~80 tokens):
**Architecture**:
- Frontend: nail-client (5173) + nail-admin (5174)
- Backend: nail-api (3000) → MongoDB Atlas + Redis Cloud + Cloudinary
- Production: Nginx reverse proxy (/ → client, /admin → admin, /api → API)
```

#### [ ] 2.2b Compress Environment Config Examples
```markdown
# Before (50+ lines of .env examples)
# After:
**Environment Setup**: See `.env.example` files in each project:
- nail-client/.env.example - Client configuration
- nail-admin/.env.example - Admin configuration
- nail-api/.env.example - API configuration (requires MongoDB, Redis, Cloudinary credentials)
```

#### [ ] 2.2c Compress Docker Command Section
```markdown
# Before (30+ lines of commands)
# After:
**Docker Commands**: See README-DOCKER.md for full reference.

Quick start:
- Dev: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`
- Prod: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
- Logs: `docker compose logs -f [service]`
```

---

### [ ] 2.3 Extract API Endpoints to Documentation

**Impact**: ~400 tokens reduction from CLAUDE.md
**Risk**: NONE

1. Create `docs/api-endpoints.md`
2. Move API endpoint reference from CLAUDE.md
3. Add OpenAPI/Swagger reference if available
4. Keep 1-line summary in CLAUDE.md

---

### [ ] 2.4 Extract System Architecture to Documentation

**Impact**: ~500 tokens reduction
**Risk**: NONE

1. Create `docs/system-architecture.md`
2. Move detailed architecture diagrams and explanations
3. Include production architecture details
4. Keep high-level summary in CLAUDE.md

---

## 🔧 Priority 3: OPTIMIZATION (1-2 hours)

### [ ] 3.1 Analyze Admin/Root CLAUDE.md Overlap

**Impact**: ~1,500-2,000 token potential savings
**Risk**: MEDIUM (requires careful analysis)

**Analysis steps**:
```bash
# Compare sections
diff -u CLAUDE.md nail-admin/CLAUDE.md > admin-overlap-analysis.txt

# Look for duplicated content
comm -12 <(sort CLAUDE.md) <(sort nail-admin/CLAUDE.md)
```

**Deduplication strategy**:
1. Identify common sections
2. Extract to shared docs
3. Reference from both files
4. Keep project-specific details only

---

### [ ] 3.2 Implement Context Budget Monitoring

**Impact**: Proactive degradation prevention
**Risk**: NONE

**Setup**:
```bash
# Create monitoring script
cat > .claude/scripts/check-context-budget.sh << 'EOF'
#!/bin/bash
python .claude/skills/context-engineering/scripts/context_analyzer.py budget \
  --system 34000 \
  --tools 1500 \
  --docs 5000 \
  --history 10000

echo ""
echo "Current context usage:"
wc -l CLAUDE.md nail-*/CLAUDE.md .claude/workflows/*.md | tail -1
EOF

chmod +x .claude/scripts/check-context-budget.sh

# Add to pre-commit hook (optional)
```

---

### [ ] 3.3 Create Progressive Disclosure Index

**Impact**: Better context navigation
**Risk**: NONE

Create `docs/README.md`:
```markdown
# Pink Nail Salon Documentation Index

## Quick Reference
- [Code Standards](./code-standards.md) - Coding conventions and style guide
- [Shared Types](./shared-types.md) - **CRITICAL** - Cross-project type definitions
- [API Endpoints](./api-endpoints.md) - REST API reference

## Architecture
- [System Architecture](./system-architecture.md) - Infrastructure and components
- [Design Guidelines](./design-guidelines.md) - UI/UX design systems

## Operations
- [Deployment Guide](./deployment-guide.md) - Production deployment procedures
- [Project Roadmap](./project-roadmap.md) - Feature planning and milestones

## Reports
- [Context Engineering Analysis](./reports/context-engineering-analysis.md)
```

---

## 📊 Validation & Testing

### [ ] Post-Implementation Validation

**After each priority level, verify**:

```bash
# 1. Check token count reduction
wc -l CLAUDE.md nail-*/CLAUDE.md .claude/workflows/*.md
# Target: <800 total lines (from 1,340)

# 2. Verify no duplicate workflows
find . -name "*.md" -path "*/.claude/workflows/*"
# Should show only 4 files in root .claude/workflows/

# 3. Check for broken references
grep -r "\.claude/workflows" nail-*/CLAUDE.md
# Should reference root .claude/workflows, not local copies

# 4. Verify all referenced docs exist
for doc in code-standards system-architecture shared-types api-endpoints \
           design-guidelines deployment-guide project-roadmap; do
  [ -f "docs/$doc.md" ] && echo "✅ $doc.md" || echo "❌ $doc.md MISSING"
done

# 5. Test agent context loading
# Launch Claude Code and verify no "file not found" errors
```

---

## 📈 Success Metrics

Track improvements:

| Metric | Before | Target | Actual |
|--------|--------|--------|--------|
| Total CLAUDE.md lines | 1,340 | <800 | ___ |
| Workflow files | 16 | 4 | ___ |
| Token usage (est.) | 49.5K | <42K | ___ |
| Duplication % | 75% | 0% | ___ |
| Missing docs | 7 | 0 | ___ |
| Context health | - | >0.85 | ___ |

---

## 🚨 Rollback Plan

If issues arise:

```bash
# Restore from backup
tar -xzf workflow-backup-YYMMDD.tar.gz

# Or restore from git
git checkout HEAD -- nail-admin/.claude/workflows/
git checkout HEAD -- nail-api/.claude/workflows/
git checkout HEAD -- nail-client/.claude/workflows/
```

---

## 📝 Sign-Off

- [ ] Priority 1 complete - Duplicate workflows removed
- [ ] Priority 2 complete - Documentation extracted and compressed
- [ ] Priority 3 complete - Monitoring and optimization in place
- [ ] Validation passed - All checks green
- [ ] Metrics tracked - Success criteria met
- [ ] Documentation updated - Changes reflected in root CLAUDE.md

**Completed by**: _______________
**Date**: _______________
**Final token reduction**: _______________ tokens (___%)
