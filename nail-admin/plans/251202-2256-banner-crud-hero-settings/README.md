# Banner CRUD with Hero Settings - Implementation Plan

**Plan Directory**: `/Users/hainguyen/Documents/nail-project/nail-admin/plans/251202-2256-banner-crud-hero-settings/`
**Created**: 2025-12-02
**Status**: 🟡 Planning Complete, Ready for Implementation
**Estimated Duration**: 15-20 hours (5 phases)

---

## Quick Links

- **Overview**: [plan.md](./plan.md)
- **Phase 1**: [Types and Service Layer](./phase-01-types-and-service.md) (2-3 hours)
- **Phase 2**: [Shared Components](./phase-02-shared-components.md) (4-5 hours)
- **Phase 3**: [Banner CRUD Page](./phase-03-banner-crud-page.md) (5-6 hours)
- **Phase 4**: [Hero Settings Component](./phase-04-hero-settings.md) (2-3 hours)
- **Phase 5**: [Testing & Validation](./phase-05-testing-validation.md) (2-3 hours)

---

## Feature Summary

**What**: Complete banner management system for nail salon admin dashboard

**Why**: Enable admins to manage hero section content (image/video banners) with flexible display modes

**How**: Full CRUD operations + Firebase uploads + drag-drop reordering + global hero display settings

---

## Key Capabilities

✅ **Create** banners with image + optional video
✅ **Read** banners in sortable data table
✅ **Update** banners with inline editing
✅ **Delete** banners with confirmation
✅ **Reorder** banners via drag-and-drop
✅ **Upload** images (max 5MB) and videos (max 50MB) to Firebase Storage
✅ **Toggle** active/inactive status
✅ **Set** primary banner for single-display modes
✅ **Configure** hero display mode (Image/Video/Carousel)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│ BannersPage                                             │
│ ┌───────────────────────────────────────────────────┐   │
│ │ HeroSettingsCard (Radio: Image/Video/Carousel)    │   │
│ └───────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────┐   │
│ │ DataTable (TanStack Table)                        │   │
│ │ - Drag handle | Image | Title | Status | Actions  │   │
│ └───────────────────────────────────────────────────┘   │
│ ┌───────────────────────────────────────────────────┐   │
│ │ BannerFormModal (Create/Edit)                     │   │
│ │ - ImageUpload + VideoUpload components            │   │
│ └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
          ┌───────────────────────────────┐
          │ Services (Dual-mode)          │
          │ - bannersService              │
          │ - heroSettingsService         │
          │ - imageUploadService          │
          └───────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
  ┌───────────────┐             ┌───────────────┐
  │ localStorage  │             │ Firebase      │
  │ (Mock API)    │             │ Storage       │
  └───────────────┘             └───────────────┘
```

---

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.9
- **UI**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table v8
- **Uploads**: Firebase Storage
- **Storage**: localStorage (mock) + API-ready
- **Notifications**: Sonner

---

## File Structure

```
src/
├── types/
│   ├── banner.types.ts           [MODIFY] Add videoUrl, ctaText, ctaLink, sortIndex, isPrimary
│   └── heroSettings.types.ts     [CREATE]  HeroSettings type
├── services/
│   ├── banners.service.ts        [CREATE]  Dual-mode CRUD service
│   ├── heroSettings.service.ts   [CREATE]  Display mode service
│   └── imageUpload.service.ts    [MODIFY] Add uploadVideo method
├── components/
│   ├── ui/
│   │   └── dialog.tsx            [CREATE]  Radix Dialog wrapper
│   ├── shared/
│   │   ├── DataTable.tsx         [CREATE]  TanStack Table component
│   │   ├── ImageUpload.tsx       [CREATE]  Image upload with preview
│   │   ├── VideoUpload.tsx       [CREATE]  Video upload with preview
│   │   └── StatusBadge.tsx       [CREATE]  Status badge component
│   └── banners/
│       ├── BannerFormModal.tsx   [CREATE]  Create/edit modal
│       ├── DeleteBannerDialog.tsx[CREATE]  Delete confirmation
│       └── HeroSettingsCard.tsx  [CREATE]  Display mode settings
├── pages/
│   └── BannersPage.tsx           [CREATE]  Main CRUD page
├── data/
│   ├── mockBanners.ts            [CREATE]  Sample banner data
│   └── mockData.ts               [MODIFY] Initialization logic
└── App.tsx                       [MODIFY] Add /banners route
```

**Total Files**: 6 new + 4 modified = 10 components + 3 services + 2 types

---

## Implementation Sequence

### Phase 1: Foundation (2-3 hours)

- Update Banner type with new fields
- Create banners.service.ts with dual-mode CRUD
- Create heroSettings.service.ts
- Add video upload to imageUpload.service.ts
- **Deliverable**: Type-safe service layer ready

### Phase 2: Components (4-5 hours)

- Create Dialog, DataTable, StatusBadge components
- Create ImageUpload and VideoUpload components
- **Deliverable**: Reusable UI components ready

### Phase 3: CRUD Page (5-6 hours)

- Create BannersPage with data table
- Create BannerFormModal for create/edit
- Create DeleteBannerDialog
- Implement drag-drop reordering
- **Deliverable**: Full banner management UI

### Phase 4: Hero Settings (2-3 hours)

- Create HeroSettingsCard component
- Integrate into BannersPage
- Add primary banner preview
- **Deliverable**: Display mode configuration

### Phase 5: Testing (2-3 hours)

- Type checking (verbatimModuleSyntax)
- Manual testing (CRUD, uploads, validation)
- Mock data seeding
- **Deliverable**: Production-ready feature

---

## Success Metrics

**Functional**:

- ✅ All CRUD operations work in mock mode
- ✅ Image + video uploads to Firebase Storage
- ✅ Drag-drop reordering persists correctly
- ✅ Hero settings toggle affects display
- ✅ Primary banner logic enforced

**Technical**:

- ✅ 0 TypeScript errors (verbatimModuleSyntax compliant)
- ✅ Forms validate with Zod (file types, sizes)
- ✅ API-ready (dual-mode pattern)
- ✅ Responsive UI (mobile/tablet/desktop)

**Quality**:

- ✅ Error handling with user-friendly messages
- ✅ Loading states (progress, skeletons)
- ✅ Empty states for first-time users
- ✅ Accessible (keyboard navigation, ARIA)

---

## Risk Mitigation

| Risk                           | Severity | Mitigation                                            |
| ------------------------------ | -------- | ----------------------------------------------------- |
| Video upload file size (50MB)  | High     | Document Firebase quota limits, add compression guide |
| Drag-drop mobile UX            | High     | Test on real devices, provide alternative reorder UI  |
| Type compatibility with client | Medium   | Coordinate Banner type sync, document changes         |
| Primary banner auto-selection  | Medium   | Add edge case tests, fallback logic                   |
| Mock data persistence          | Low      | localStorage stable, add clear data debug tool        |

---

## API Migration Readiness

**Mock Mode** (`VITE_USE_MOCK_API=true`):

- Data in localStorage with `nail_admin_` prefix
- Simulates network operations

**Real API Mode** (`VITE_USE_MOCK_API=false`):

- Expected endpoints:
  - `GET /api/banners` - List all banners
  - `POST /api/banners` - Create banner
  - `PATCH /api/banners/:id` - Update banner
  - `DELETE /api/banners/:id` - Delete banner
  - `POST /api/banners/reorder` - Reorder banners
  - `POST /api/banners/:id/set-primary` - Set primary
  - `GET /api/hero-settings` - Get display mode
  - `PUT /api/hero-settings` - Update display mode

**No frontend code changes needed to switch!**

---

## Dependencies

**Existing**:

- ✅ Firebase Storage configured
- ✅ shadcn/ui components (button, input, card)
- ✅ Dual-mode service pattern established

**New** (from plan):

- TanStack Table: `@tanstack/react-table`
- Radix Dialog: `@radix-ui/react-dialog`

Install:

```bash
npm install @tanstack/react-table @radix-ui/react-dialog
```

---

## Client Project Integration

**Shared Types** (must sync):

- `Banner` type with new fields (videoUrl, ctaText, ctaLink, sortIndex, isPrimary)

**Client Needs**:

1. Fetch hero settings: `GET /api/hero-settings`
2. Fetch banners: `GET /api/banners?active=true`
3. Render hero based on mode:
   - `image`: Show primary banner's imageUrl
   - `video`: Show primary banner's videoUrl
   - `carousel`: Show all active banners in slider

**Client Location**: `/Users/hainguyen/Documents/nail-project/nail-client`

---

## Next Actions

1. **Review Plan**: Read all phase files, ask questions
2. **Set Up Environment**: Ensure `.env` has `VITE_USE_MOCK_API=true`
3. **Install Dependencies**: `npm install @tanstack/react-table @radix-ui/react-dialog`
4. **Start Phase 1**: Update types and create services
5. **Progress Tracking**: Mark phases complete in `plan.md`

---

## Questions & Clarifications

**Unresolved Questions**:

1. Firebase Storage quota limits for video uploads?
2. Should we add video compression on upload?
3. Client project timeline for hero settings integration?
4. Need drag-drop library or HTML5 API sufficient?

**Assumptions**:

- Mock data is sufficient for MVP (no real backend yet)
- Firebase credentials are configured in `.env`
- Client project will fetch banner data via API (future)

---

## Documentation

**For Developers**:

- Each phase file has detailed code examples
- All components follow shadcn/ui patterns
- Service layer uses established dual-mode pattern

**For Testers**:

- Phase 5 includes comprehensive testing checklist
- Mock data seed for realistic testing scenarios

**For Stakeholders**:

- Feature demo available after Phase 3
- Production deployment after Phase 5

---

**Plan Status**: ✅ Ready for implementation
**Last Updated**: 2025-12-02
**Contact**: See CLAUDE.md for workflows and protocols
