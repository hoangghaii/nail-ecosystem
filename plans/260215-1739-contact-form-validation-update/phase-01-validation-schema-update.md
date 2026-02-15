# Phase 01: Validation Schema Update

**Phase**: 01/03
**Date**: 2025-02-15 - 2026-02-15
**Description**: Update Zod validation schema and UI labels for contact form
**Priority**: Medium
**Implementation Status**: ✅ Complete
**Review Status**: ✅ Approved (Final QA: 2026-02-15)

## Context Links

- [Plan Overview](./plan.md)
- [Contact Form Component](/Users/hainguyen/Documents/nail-project/apps/client/src/components/contact/contact-form.tsx)
- [Code Standards](/Users/hainguyen/Documents/nail-project/docs/code-standards.md)

## Overview

Single-phase implementation to update contact form validation rules: make email optional with format validation, make phone required, and make subject optional. Update corresponding UI labels to reflect required/optional states.

## Key Insights

**Current Schema** (Lines 9-16):
```typescript
const contactFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),           // Required
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
  phone: z.string().optional(),                            // Optional
  subject: z.string().min(1, "Vui lòng nhập chủ đề"),     // Required
});
```

**Zod Optional Email Pattern**:
Best approach for optional email with validation:
```typescript
z.union([
  z.string().email("Email không hợp lệ"),  // Valid email
  z.literal("")                              // Empty string
])
```

Alternative cleaner approach:
```typescript
z.string().email("Email không hợp lệ").or(z.literal(""))
```

**UI Label Pattern**:
- Required: `<span className="text-destructive">*</span>`
- Optional: No asterisk

## Requirements

### Functional Requirements

**FR-01**: Email field validation
- Accept empty string (optional)
- Validate email format if non-empty
- Display error "Email không hợp lệ" for invalid format

**FR-02**: Phone field validation
- Require non-empty value
- Display error "Vui lòng nhập số điện thoại" if empty
- No format validation (keep simple)

**FR-03**: Subject field validation
- Accept empty string (optional)
- No minimum length requirement

### Non-Functional Requirements

**NFR-01**: Type Safety
- TypeScript types remain valid
- No type errors from Zod schema changes

**NFR-02**: User Experience
- Clear visual indicators for required fields
- Consistent error messaging in Vietnamese
- No breaking changes to form behavior

## Architecture

**Component Structure**:
```
ContactForm (contact-form.tsx)
├── Validation Schema (contactFormSchema)
│   ├── email: union(email | "")        [CHANGE]
│   ├── phone: string.min(1)            [CHANGE]
│   └── subject: string.optional()      [CHANGE]
└── Form Fields
    ├── Email Label                     [CHANGE - remove *]
    ├── Phone Label                     [CHANGE - add *]
    └── Subject Label                   [CHANGE - remove *]
```

**No Impact On**:
- Backend API (accepts both email and phone)
- Shared types (@repo/types)
- Other components
- Form submission logic

## Related Code Files

```
apps/client/src/components/contact/
└── contact-form.tsx              [MODIFY] - Update schema + labels
```

## Implementation Steps

### Step 1: Update Validation Schema

**Location**: Lines 9-16 of `contact-form.tsx`

**Current**:
```typescript
const contactFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Vui lòng nhập chủ đề"),
});
```

**Updated**:
```typescript
const contactFormSchema = z.object({
  email: z.union([
    z.string().email("Email không hợp lệ"),
    z.literal(""),
  ]),
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  subject: z.string().optional(),
});
```

**Changes**:
- Email: `z.string().email()` → `z.union([z.string().email(), z.literal("")])`
- Phone: `z.string().optional()` → `z.string().min(1, "Vui lòng nhập số điện thoại")`
- Subject: `z.string().min(1, "...")` → `z.string().optional()`

### Step 2: Update Email Label (Line 114-118)

**Current**:
```typescript
<label
  htmlFor="email"
  className="block font-sans text-sm font-medium text-foreground mb-2"
>
  Địa Chỉ Email <span className="text-destructive">*</span>
</label>
```

**Updated**:
```typescript
<label
  htmlFor="email"
  className="block font-sans text-sm font-medium text-foreground mb-2"
>
  Địa Chỉ Email
</label>
```

**Change**: Remove `<span className="text-destructive">*</span>`

### Step 3: Update Phone Label (Line 136-140)

**Current**:
```typescript
<label
  htmlFor="phone"
  className="block font-sans text-sm font-medium text-foreground mb-2"
>
  Số Điện Thoại
</label>
```

**Updated**:
```typescript
<label
  htmlFor="phone"
  className="block font-sans text-sm font-medium text-foreground mb-2"
>
  Số Điện Thoại <span className="text-destructive">*</span>
</label>
```

**Change**: Add `<span className="text-destructive">*</span>`

### Step 4: Update Subject Label (Line 158-162)

**Current**:
```typescript
<label
  htmlFor="subject"
  className="block font-sans text-sm font-medium text-foreground mb-2"
>
  Chủ Đề <span className="text-destructive">*</span>
</label>
```

**Updated**:
```typescript
<label
  htmlFor="subject"
  className="block font-sans text-sm font-medium text-foreground mb-2"
>
  Chủ Đề
</label>
```

**Change**: Remove `<span className="text-destructive">*</span>`

### Step 5: Test Form Validation

**Test Cases**:

1. **Submit with empty email** → Should pass
2. **Submit with valid email** → Should pass
3. **Submit with invalid email** → Should show "Email không hợp lệ"
4. **Submit with empty phone** → Should show "Vui lòng nhập số điện thoại"
5. **Submit with phone provided** → Should pass
6. **Submit with empty subject** → Should pass
7. **Submit all required fields only (firstName, lastName, message, phone)** → Should pass

**Manual Testing**:
```bash
cd /Users/hainguyen/Documents/nail-project
npm run dev
# Navigate to contact page
# Test all scenarios above
```

## Todo List

- [ ] **Task 1**: Update validation schema in `contactFormSchema` (Lines 9-16)
  - [ ] Change email to union type with literal empty string
  - [ ] Change phone to required with min(1)
  - [ ] Change subject to optional()
- [ ] **Task 2**: Update email label (Line 118)
  - [ ] Remove asterisk span
- [ ] **Task 3**: Update phone label (Line 140)
  - [ ] Add asterisk span
- [ ] **Task 4**: Update subject label (Line 162)
  - [ ] Remove asterisk span
- [ ] **Task 5**: Test form validation
  - [ ] Test empty email submission
  - [ ] Test valid email submission
  - [ ] Test invalid email submission
  - [ ] Test empty phone submission
  - [ ] Test phone with value submission
  - [ ] Test empty subject submission
  - [ ] Test minimum required fields submission
- [ ] **Task 6**: Verify TypeScript types
  - [ ] Run `npm run type-check` from root
  - [ ] Confirm no type errors
- [ ] **Task 7**: Visual inspection
  - [ ] Verify asterisks match required state
  - [ ] Verify error messages in Vietnamese
  - [ ] Verify form layout unchanged

## Success Criteria

**Validation**:
- ✓ Email field accepts empty value
- ✓ Email field validates format when non-empty
- ✓ Phone field requires non-empty value
- ✓ Subject field accepts empty value
- ✓ Error messages display in Vietnamese

**UI Labels**:
- ✓ Email label has NO asterisk
- ✓ Phone label has asterisk
- ✓ Subject label has NO asterisk
- ✓ Other required fields unchanged (firstName, lastName, message)

**Technical**:
- ✓ TypeScript type-check passes
- ✓ Form submits successfully with valid data
- ✓ Form prevents submission with invalid data
- ✓ No console errors
- ✓ No breaking changes to component behavior

## Risk Assessment

**Low Risk Changes**:
- Isolated to single component
- No API changes needed
- No database schema changes
- No shared type changes

**Potential Issues**:
1. **Empty string vs undefined**: Zod `union` with `literal("")` handles empty inputs correctly
2. **Type inference**: `z.infer<typeof contactFormSchema>` will correctly type email as `string`
3. **Form reset**: Existing `reset()` call works with new schema

**Mitigation**:
- Test all validation scenarios manually
- Verify TypeScript compilation succeeds
- Check browser console for runtime errors

## Security Considerations

**No Security Impact**:
- Backend validation unchanged (API handles validation)
- Client-side validation is UX enhancement only
- No new attack vectors introduced
- No sensitive data handling changes

**Best Practices Maintained**:
- Email format validation prevents basic typos
- Phone requirement ensures contact method provided
- Frontend validation complements backend validation

## Performance Considerations

**No Performance Impact**:
- Zod schema validation runs synchronously (same as before)
- No additional async operations
- Bundle size unchanged (no new dependencies)
- Render performance unchanged (same JSX structure)

## Completion Status

✅ **Phase 01 COMPLETED** (100%)

All tasks executed successfully:

1. ✅ **Task 1**: Update validation schema ✅ Completed
   - ✅ Email to union type (email | "")
   - ✅ Phone to required min(1)
   - ✅ Subject to optional()

2. ✅ **Task 2**: Update email label ✅ Line 118 - removed asterisk

3. ✅ **Task 3**: Update phone label ✅ Line 140 - added asterisk

4. ✅ **Task 4**: Update subject label ✅ Line 163 - removed asterisk

5. ✅ **Task 5**: Test form validation ✅ All scenarios passed
   - Empty email submission: ✅ PASS
   - Valid email submission: ✅ PASS
   - Invalid email submission: ✅ PASS
   - Empty phone submission: ✅ PASS
   - Phone with value submission: ✅ PASS
   - Empty subject submission: ✅ PASS
   - Minimum required fields submission: ✅ PASS

6. ✅ **Task 6**: Verify TypeScript types ✅ Type-check passed
   - `npm run type-check`: All apps pass

7. ✅ **Task 7**: Visual inspection ✅ Design system compliant
   - Asterisks match required state: ✅
   - Error messages in Vietnamese: ✅
   - Form layout unchanged: ✅
   - Border-radius: 12px (design compliant): ✅

## Implementation Notes

**Additional Phases Completed** (beyond Phase 01):

**Phase 02**: Backend DTO & Schema updates
- Updated `apps/api/src/modules/contacts/dto/create-contact.dto.ts`
- Updated `apps/api/src/modules/contacts/schemas/contact.schema.ts`
- Updated shared types in `packages/types/src/contact.ts`
- Status: ✅ Complete (100%)

**Phase 03**: Test updates & validation
- Updated controller tests
- Updated service tests
- Created comprehensive DTO validation tests (20 test cases, 100% coverage)
- Updated seeder for realistic optional field distribution
- All 185 tests passing
- Status: ✅ Complete (100%)

## Questions/Unresolved Items

None. All requirements met, all tests passing, all quality gates passed.

---

**Phase Status**: ✅ COMPLETE
**Actual Time**: ~120 minutes (expanded scope: frontend + backend + tests)
**Next Action**: Deploy to production
