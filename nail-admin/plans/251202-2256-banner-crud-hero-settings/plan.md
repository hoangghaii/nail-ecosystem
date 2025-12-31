# Banner CRUD with Hero Settings - Implementation Plan

**Plan ID**: 251202-2256-banner-crud-hero-settings
**Created**: 2025-12-02
**Updated**: 2025-12-03 (All Phases Complete)
**Status**: 🟢 COMPLETE - Staging Ready
**Priority**: P0 (Critical - First major CRUD feature)

## Overview

Implement complete banner management system with hero display settings for nail salon admin dashboard. Enables management of hero section content (image/video banners) with flexible display modes (single image, video, or carousel).

## Context

- **Project**: Pink Nail Admin Dashboard (React 19 + TypeScript)
- **Design System**: shadcn/ui blue theme (professional, not warm)
- **Architecture**: Dual-mode (Mock localStorage + API-ready)
- **Storage**: Firebase Storage for media uploads
- **Validation**: React Hook Form + Zod
- **Related Project**: `/Users/hainguyen/Documents/nail-project/nail-client` (shares types)

## Key Goals

1. Full CRUD for hero banners (create/read/update/delete)
2. Image + video upload via Firebase Storage
3. Drag-drop reordering with sortIndex
4. Global hero display settings (Image/Video/Carousel modes)
5. Primary banner selection for single-display modes
6. Type-safe dual-mode service layer

## Architecture Decisions

- **Banner Type Extension**: Add `videoUrl`, `ctaText`, `ctaLink`, `sortIndex`, `isPrimary` fields
- **Hero Settings**: Store in localStorage key `nail_admin_hero_settings` with type `{ mode: 'image' | 'video' | 'carousel' }`
- **Reordering**: HTML5 Drag API (lightweight, no external deps for Phase 1)
- **Video Support**: MP4/WebM only, max 50MB, same upload flow as images
- **Primary Logic**: Auto-set first banner as primary if none exist, enforce single primary per type

## Implementation Phases

### Phase 1: Types and Service Layer

**File**: [phase-01-types-and-service.md](./phase-01-types-and-service.md)
**Estimate**: 2-3 hours
**Status**: ✅ Complete

- ✅ Update Banner type with new fields
- ✅ Create banners.service.ts with dual-mode CRUD
- ✅ Create heroSettings.service.ts
- ✅ Add Zod schemas for validation

### Phase 2: Shared Components

**File**: [phase-02-shared-components.md](./phase-02-shared-components.md)
**Estimate**: 4-5 hours
**Status**: ✅ Complete

- ✅ DataTable component (TanStack Table v8)
- ✅ Dialog/Modal component (Radix UI)
- ✅ ImageUpload component with Firebase
- ✅ VideoUpload component
- ✅ StatusBadge component

### Phase 3: Banner CRUD Page

**File**: [phase-03-banner-crud-page.md](./phase-03-banner-crud-page.md)
**Estimate**: 5-6 hours
**Status**: ✅ Complete

- ✅ BannersPage with data table
- ✅ Create/Edit banner modals
- ✅ Delete confirmation dialog
- ✅ Drag-drop reordering
- ✅ Active/Primary toggles

### Phase 4: Hero Settings Component

**File**: [phase-04-hero-settings.md](./phase-04-hero-settings.md)
**Estimate**: 2-3 hours
**Status**: ✅ Complete

- ✅ Hero Settings card with radio buttons
- ✅ Display mode logic (Image/Video/Carousel)
- ✅ Primary banner preview
- ✅ Settings persistence

### Phase 5: Testing & Validation

**File**: [phase-05-testing-validation.md](./phase-05-testing-validation.md)
**Report**: [251203-code-review-report.md](./reports/251203-code-review-report.md)
**Estimate**: 2-3 hours
**Status**: ✅ Complete (Code Review Approved)

- ✅ Type checking (verbatimModuleSyntax compliance - 0 errors)
- ✅ Build verification (passes with bundle size warning)
- ✅ Code review completed (8.5/10 rating, 0 critical issues)
- ✅ Mock data seeding
- ✅ Error handling validation

## Success Criteria

- ✅ All CRUD operations work in mock mode
- ✅ Image + video uploads to Firebase Storage
- ✅ Drag-drop reordering persists sortIndex
- ✅ Hero settings toggle affects banner display
- ✅ Primary banner logic enforced correctly
- ✅ No TypeScript errors (verbatimModuleSyntax compliant)
- ✅ Forms validate with Zod (file types, sizes, required fields)
- 🟡 Responsive UI on mobile/tablet/desktop (needs manual testing)

## Risk Assessment

**High Risk**:

- Video upload file size (50MB limit may hit Firebase quotas)
- Drag-drop UX on mobile (HTML5 API less reliable)

**Medium Risk**:

- Primary banner auto-selection logic (edge cases)
- Type compatibility with client project (must sync)

**Low Risk**:

- Mock data persistence (localStorage stable)
- Firebase integration (service already exists)

## Dependencies

- ✅ Firebase Storage configured
- ✅ shadcn/ui components (button, input, card)
- ⏳ DataTable component (Phase 2)
- ⏳ Dialog component (Phase 2)
- ⏳ Upload components (Phase 2)

## Code Review Summary

**Review Date**: 2025-12-03
**Rating**: 8.5/10 (Excellent)
**Status**: ✅ APPROVED FOR STAGING

**Findings**:

- Critical Issues: 0
- High Priority: 0
- Medium Priority: 4 (upload cleanup, pagination, auto-save debounce, server-side validation)
- Low Priority: 7 (cosmetic improvements)
- TypeScript Compliance: 100% (verbatimModuleSyntax pass)
- Build Status: PASS (bundle size warning acceptable)

**Full Report**: [reports/251203-code-review-report.md](./reports/251203-code-review-report.md)

## Next Steps

1. ✅ **COMPLETED**: All implementation phases (Phase 1-5)
2. ✅ **COMPLETED**: Code review and type checking (8.5/10 rating)
3. ✅ **COMPLETED**: Code quality validation (0 critical/high issues)
4. ⏳ **TODO**: Deploy to staging environment
5. ⏳ **TODO**: Fix medium-priority items (M2, M4) in next sprint
6. ⏳ **TODO**: Coordinate with client project for type compatibility
7. ⏳ **TODO**: Document API endpoints for backend team
8. ⏳ **TODO**: Begin Services CRUD implementation (Phase 2 of roadmap)
