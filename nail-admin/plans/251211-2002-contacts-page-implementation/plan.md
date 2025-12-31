# ContactsPage Implementation Plan

**Created**: 2025-12-11
**Status**: Ready for Implementation
**Estimated Effort**: 8-10 hours

---

## Overview

Implement ContactsPage with two main sections:

1. **Business Contact Information Management** - Admin edits business info displayed on client website
2. **Customer Messages Management** - View/manage messages from client "Send Us a Message" form

---

## Principles

- **YAGNI**: No over-engineering; single business info record, no unnecessary CRUD
- **KISS**: Inline editing for business info, Dialog (not Sheet) for message details
- **DRY**: Reuse DataTable, StatusBadge, validation patterns from existing pages

---

## Implementation Phases

### Phase 1: Types and Interfaces

- Define BusinessInfo type (phone, email, address, business hours)
- Validate Contact type (existing) matches requirements
- Create Zod schemas for validation

**Files**: `src/types/businessInfo.types.ts`
**Duration**: 30 min
**Dependencies**: None

---

### Phase 2: Mock Data Generation

- Generate 15-20 realistic contact messages (distributed across statuses)
- Create single business info record matching client site data
- Time-distribute contacts (recent=NEW, older=RESPONDED/ARCHIVED)

**Files**: `src/data/mockContacts.ts`, `src/data/mockBusinessInfo.ts`
**Duration**: 45 min
**Dependencies**: Phase 1

---

### Phase 3: Service Layer

- `contactsService`: getAll, getById, updateStatus, updateAdminNotes
- `businessInfoService`: get, update (singleton pattern)
- Dual-mode architecture (mock/real API)

**Files**: `src/services/contacts.service.ts`, `src/services/businessInfo.service.ts`
**Duration**: 1 hour
**Dependencies**: Phase 2

---

### Phase 4: State Management

- `contactsStore`: Zustand store with contacts state, isInitialized guard
- `businessInfoStore`: Zustand store with single record state
- Immutable update patterns

**Files**: `src/store/contactsStore.ts`, `src/store/businessInfoStore.ts`
**Duration**: 45 min
**Dependencies**: Phase 3

---

### Phase 5: Business Info Form Component

- Inline editing with react-hook-form + Zod validation
- Phone, email, address fields
- Business hours editor (7 days, open/close times, closed checkbox)
- Save/Cancel buttons with toast notifications

**Files**: `src/components/contacts/BusinessInfoForm.tsx`
**Duration**: 2 hours
**Dependencies**: Phase 4

---

### Phase 6: Customer Messages Components

- StatusFilter component (NEW, READ, RESPONDED, ARCHIVED)
- DataTable with columns: Date, Customer, Email, Phone, Subject, Status
- ContactDetailsModal (Dialog) with status dropdown, admin notes textarea
- StatusBadge styling (NEW=blue, READ=gray, RESPONDED=green, ARCHIVED=muted)

**Files**: `src/components/contacts/StatusFilter.tsx`, `src/components/contacts/ContactDetailsModal.tsx`
**Duration**: 2.5 hours
**Dependencies**: Phase 4

---

### Phase 7: Page Integration

- ContactsPage assembly with two Card sections
- Search with useDebounce (name, email, subject, message)
- Row click handler → open ContactDetailsModal
- Add route to App.tsx, Sidebar navigation

**Files**: `src/pages/ContactsPage.tsx`, `src/App.tsx`, `src/components/layout/Sidebar.tsx`
**Duration**: 1.5 hours
**Dependencies**: Phase 5, Phase 6

---

### Phase 8: Testing & Validation

- Test all validation rules (phone format, email, time range)
- Verify status change updates respondedAt timestamp
- Test search/filter combinations
- Verify localStorage persistence
- Mobile responsiveness check

**Duration**: 1 hour
**Dependencies**: Phase 7

---

## Progress Tracker

| Phase                         | Status         | Completion |
| ----------------------------- | -------------- | ---------- |
| Phase 1: Types & Interfaces   | ⬜ Not Started | 0%         |
| Phase 2: Mock Data            | ⬜ Not Started | 0%         |
| Phase 3: Service Layer        | ⬜ Not Started | 0%         |
| Phase 4: State Management     | ⬜ Not Started | 0%         |
| Phase 5: Business Info Form   | ⬜ Not Started | 0%         |
| Phase 6: Customer Messages UI | ⬜ Not Started | 0%         |
| Phase 7: Page Integration     | ⬜ Not Started | 0%         |
| Phase 8: Testing & Validation | ⬜ Not Started | 0%         |

---

## Success Criteria

- [ ] Business info editable inline with validation
- [ ] Contacts table shows messages with status filter
- [ ] Search works across customer name, email, subject, message
- [ ] Status change to RESPONDED updates respondedAt
- [ ] Admin notes save successfully
- [ ] Mobile responsive design
- [ ] No TypeScript errors (verbatimModuleSyntax compliance)
- [ ] localStorage keys: `nail_admin_contacts`, `nail_admin_business_info`

---

## Risk Assessment

**Low Risk**:

- Types, service layer, store patterns (well-established)
- DataTable reuse from existing pages

**Medium Risk**:

- Business hours time validation (open < close)
- Phone format validation (US format flexible)
- Inline editing UX for business info

**Mitigation**:

- Use time string comparison for validation
- Liberal phone regex (allow multiple formats)
- Clear Edit/Cancel buttons for inline editing state
