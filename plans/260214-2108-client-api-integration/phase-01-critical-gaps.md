# Phase 1: Critical Gaps

**Phase**: 1/5
**Date**: 2026-02-14
**Duration**: 0.5 day
**Priority**: P1 (Critical)
**Status**: ✅ Complete (Code Ready - Runtime Pending MongoDB Fix)

---

## Context

**Dependencies**: None (standalone fixes)
**Blocked By**: None
**Blocks**: Phase 2 (need working base before adding polish)

**Problem**: HomePage ServicesOverview uses mock data despite `useServices()` hook existing. ContactPage form non-functional (no API integration). Users cannot submit contact forms.

---

## Overview

Fix broken functionality blocking users. Two critical fixes:

1. **HomePage ServicesOverview** - 5 min fix (swap mock data to API)
2. **ContactPage Form** - 45 min implementation (full form integration)

**Why Critical**: ContactPage form non-functional = users cannot contact salon. HomePage shows stale data = poor UX.

---

## Key Insights from Research

**From researcher-01**:
- `useServices({ featured: true })` hook already exists
- `getFeaturedServices()` mock data used in ServicesOverview
- ContactPage has NO contacts service, NO React Hook Form, form is pure HTML
- Backend endpoint `POST /contacts` exists but unused

**From researcher-02**:
- Admin uses React Hook Form + Zod + mutation hooks pattern
- Client needs customer-friendly inline errors (NO toasts)
- Query invalidation after mutation success
- Retry 1 for mutations (customer experience)

---

## Requirements

### Functional Requirements

**FR-1.1**: HomePage ServicesOverview displays live services from API
**FR-1.2**: ServicesOverview shows loading skeleton while fetching
**FR-1.3**: ContactPage form validates input (name, email, phone, message)
**FR-1.4**: ContactPage form submits to `POST /contacts` API
**FR-1.5**: ContactPage shows success message after submission
**FR-1.6**: ContactPage shows inline error if submission fails
**FR-1.7**: ContactPage clears form after successful submission

### Non-Functional Requirements

**NFR-1.1**: ServicesOverview fix takes <10 mins (minimal code change)
**NFR-1.2**: ContactPage form accessible (keyboard nav, ARIA labels)
**NFR-1.3**: ContactPage form mobile-friendly (touch targets 44px+)
**NFR-1.4**: Form validation follows client design (border-based, NO shadows)

---

## Architecture

### Data Flow

**ServicesOverview**:
```
HomePage → useServices({ featured: true, limit: 3 })
  ↓
servicesService.getAll({ featured: true, limit: 3 })
  ↓
GET /services?featured=true&isActive=true&limit=3
  ↓
TanStack Query cache (5min staleTime)
  ↓
Render ServiceCard components
```

**ContactPage Form**:
```
User fills form → React Hook Form validation (Zod schema)
  ↓
onSubmit → useContactMutation()
  ↓
contactsService.create(data)
  ↓
POST /contacts
  ↓
Success: Show success message, clear form
Error: Show inline error with retry button
```

### Component Structure

**ServicesOverview** (modify):
- Remove `getFeaturedServices()` import
- Add `useServices()` hook
- Add loading state check
- Render existing ServiceCard components

**ContactPage** (major changes):
- Add React Hook Form setup
- Add Zod validation schema
- Create contacts service file
- Create `useContactMutation` hook
- Add success/error states UI
- Keep existing BusinessInfo display

---

## Related Code Files

### Files to Modify

**Priority 1** (ServicesOverview - 5 min fix):
- `/apps/client/src/components/home/ServicesOverview.tsx` - Swap mock to API

**Priority 1** (ContactPage - 45 min implementation):
- `/apps/client/src/pages/ContactPage.tsx` - Add form integration
- `/apps/client/src/services/contacts.service.ts` - **CREATE NEW**
- `/apps/client/src/hooks/api/useContacts.ts` - **CREATE NEW**

### Files Already Working (reference)

- `/apps/client/src/hooks/api/useServices.ts` - Services hook pattern
- `/apps/client/src/services/services.service.ts` - Service layer pattern
- `/apps/admin/src/pages/ContactPage.tsx` - Admin form pattern (reference)

### Shared Types

- `@repo/types/contact` - Contact type definition (use for form validation)

---

## Implementation Steps

### Step 1: Fix HomePage ServicesOverview (5 mins)

**File**: `/apps/client/src/components/home/ServicesOverview.tsx`

1. Remove mock data import: `import { getFeaturedServices } from '@/data/services'`
2. Add services hook import: `import { useServices } from '@/hooks/api/useServices'`
3. Replace line 31: `const featuredServices = getFeaturedServices()`
4. Add hook call: `const { data: featuredServices = [], isLoading } = useServices({ featured: true, isActive: true, limit: 3 })`
5. Add loading state: `if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 bg-muted/50 rounded-md animate-pulse" />)}</div>`
6. Test: Navigate to homepage, verify services load from API

### Step 2: Create Contacts Service (10 mins)

**File**: `/apps/client/src/services/contacts.service.ts` (NEW)

1. Create file with service class structure
2. Import Contact type from `@repo/types/contact`
3. Create ContactFormData type (omit _id, status, timestamps)
4. Implement `create(data: ContactFormData)` method
5. Export service instance
6. Follow pattern from `/apps/client/src/services/services.service.ts`

**Code Template**:
```typescript
import type { Contact } from '@repo/types/contact';
import { apiClient } from '@/lib/apiClient';

export type ContactFormData = Omit<Contact, '_id' | 'status' | 'createdAt' | 'updatedAt'>;

export class ContactsService {
  async create(data: ContactFormData): Promise<Contact> {
    return apiClient.post<Contact>('/contacts', data);
  }
}

export const contactsService = new ContactsService();
```

### Step 3: Create useContactMutation Hook (10 mins)

**File**: `/apps/client/src/hooks/api/useContacts.ts` (NEW)

1. Create file with mutation hook
2. Import `useMutation` from TanStack Query
3. Import `contactsService` and `ContactFormData` type
4. Create `useContactMutation()` hook
5. Return mutation with `mutationFn: (data) => contactsService.create(data)`
6. No invalidation needed (no contact list in client)
7. Follow pattern from admin but remove toast notifications

**Code Template**:
```typescript
import { useMutation } from '@tanstack/react-query';
import { contactsService, type ContactFormData } from '@/services/contacts.service';

export function useContactMutation() {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactsService.create(data),
  });
}
```

### Step 4: Add Zod Validation Schema (5 mins)

**File**: `/apps/client/src/pages/ContactPage.tsx`

1. Import zod and zodResolver
2. Create contactFormSchema with validation rules:
   - name: string, min 2 chars, required
   - email: string, email format, required
   - phone: string, min 10 chars, required
   - message: string, min 10 chars, required
3. Create ContactFormValues type from schema
4. Place schema at top of file (before component)

**Code Template**:
```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;
```

### Step 5: Integrate React Hook Form (10 mins)

**File**: `/apps/client/src/pages/ContactPage.tsx`

1. Import useForm from react-hook-form
2. Import useContactMutation hook
3. Initialize form: `const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) })`
4. Initialize mutation: `const { mutate, isPending, isSuccess, isError, error } = useContactMutation()`
5. Create onSubmit handler: `const onSubmit = (data: ContactFormValues) => mutate(data, { onSuccess: () => reset() })`
6. Replace form HTML with controlled inputs
7. Add error displays below each input field
8. Add success message display
9. Add error message display
10. Disable submit button while pending

### Step 6: Update Form UI (10 mins)

**File**: `/apps/client/src/pages/ContactPage.tsx`

1. Replace plain inputs with registered inputs:
   - `<input {...register('name')} />`
   - `<input {...register('email')} />`
   - `<input {...register('phone')} />`
   - `<textarea {...register('message')} />`
2. Add error messages below each field:
   ```tsx
   {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
   ```
3. Add success message after form (if isSuccess):
   ```tsx
   {isSuccess && (
     <div className="p-4 border border-border bg-background rounded-md">
       <p className="text-foreground">Thank you! We'll get back to you soon.</p>
     </div>
   )}
   ```
4. Add error message (if isError):
   ```tsx
   {isError && (
     <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md">
       <p className="text-sm text-destructive">
         Failed to send message. Please try again.
       </p>
     </div>
   )}
   ```
5. Update submit button:
   ```tsx
   <button disabled={isPending}>
     {isPending ? 'Sending...' : 'Send Message'}
   </button>
   ```

---

## Todo Checklist

### ServicesOverview Fix
- [ ] Remove `getFeaturedServices()` import
- [ ] Add `useServices()` hook
- [ ] Add loading skeleton
- [ ] Test homepage loads services from API
- [ ] Verify only 3 services shown

### Contacts Service
- [ ] Create `/apps/client/src/services/contacts.service.ts`
- [ ] Import Contact type from `@repo/types/contact`
- [ ] Create ContactFormData type
- [ ] Implement `create()` method
- [ ] Export service instance

### useContactMutation Hook
- [ ] Create `/apps/client/src/hooks/api/useContacts.ts`
- [ ] Import useMutation from TanStack Query
- [ ] Create useContactMutation hook
- [ ] Export hook

### ContactPage Form Integration
- [ ] Import zod and zodResolver
- [ ] Create contactFormSchema
- [ ] Import useForm and useContactMutation
- [ ] Initialize form with resolver
- [ ] Initialize mutation
- [ ] Create onSubmit handler
- [ ] Replace plain inputs with registered inputs
- [ ] Add error messages below fields
- [ ] Add success message
- [ ] Add error message
- [ ] Update submit button (disabled state)

### Testing
- [ ] Test ServicesOverview on homepage
- [ ] Test ContactPage form validation (empty fields)
- [ ] Test ContactPage form validation (invalid email)
- [ ] Test ContactPage form submission success
- [ ] Test ContactPage form submission error (disconnect API)
- [ ] Verify form clears after success
- [ ] Test mobile responsiveness
- [ ] Test keyboard navigation

---

## Success Criteria

**ServicesOverview**:
- ✅ Shows live services from API (not mock data)
- ✅ Shows loading skeleton while fetching
- ✅ Only 3 services displayed
- ✅ Featured services only

**ContactPage Form**:
- ✅ Form validates all fields (name, email, phone, message)
- ✅ Form submits to POST /contacts API
- ✅ Success message shows after submission
- ✅ Form clears after successful submission
- ✅ Inline error shows if submission fails
- ✅ Validation errors show below fields
- ✅ Submit button disabled while pending
- ✅ Mobile-friendly (touch targets, responsive)

**Code Quality**:
- ✅ Follows client design system (border-based, NO shadows)
- ✅ Uses shared types from @repo/types
- ✅ Follows admin patterns (service layer, mutation hooks)
- ✅ No console errors
- ✅ TypeScript strict mode passes

---

## Risk Assessment

**Low Risk**:
- ServicesOverview fix (trivial code change, hook already exists)
- Contacts service creation (follows existing pattern)

**Medium Risk**:
- ContactPage form integration (multiple moving parts)
- Form validation edge cases (email format, phone format)

**Mitigation**:
- Test form validation thoroughly before moving to Phase 2
- Use zod schemas matching backend validation
- Add retry logic for network failures
- Test on mobile devices

---

## Security Considerations

**Input Validation**:
- Client-side validation with Zod (user experience)
- Backend validation required (never trust client)
- No sensitive data in contact form (safe to submit)

**API Security**:
- POST /contacts endpoint public (no auth required)
- Rate limiting on backend prevents spam
- No file uploads (low risk)

**XSS Prevention**:
- React escapes all user input by default
- No dangerouslySetInnerHTML used
- Form data sanitized by backend

---

## Next Steps

**After Phase 1**:
1. Move to Phase 2: Loading & Error States
2. Create skeleton loaders for all pages
3. Implement error boundaries
4. Add retry logic for failed requests

**Dependencies for Phase 2**:
- Phase 1 must be complete (working base)
- All forms functional before adding polish
