# Vietnamese Phone Validation for Contact Form

**Plan ID**: 260215-1851
**Created**: 2026-02-15
**Status**: ✅ Completed
**Priority**: MEDIUM
**Estimated Tokens**: 5,000
**Actual Tokens**: ~27,900

## Overview

Implement strict Vietnamese phone number validation for the contact form to ensure users enter valid Vietnamese mobile/landline numbers.

## Context

- **Location**: `apps/client/src/components/contact/contact-form.tsx`
- **Current**: Basic validation (min 1 character)
- **Target**: Vietnamese phone format validation
- **Framework**: React Hook Form + Zod validation
- **Impact**: Client app only (frontend validation)

## Current State

**Current validation** (Line 15):
```typescript
phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
```

**Issues**:
- ❌ Accepts any text (e.g., "abc", "123")
- ❌ No format validation
- ❌ No length validation
- ❌ No digit-only validation

## Target Validation Rules

**Vietnamese Phone Format**:
- ✅ Must start with `0`
- ✅ Followed by 9-10 digits
- ✅ Total length: 10-11 digits
- ✅ Valid prefixes: `03x, 05x, 07x, 08x, 09x` (mobile and landline)
- ✅ Digits only (no spaces, dashes, parentheses)

**Regex Pattern** (FIXED):
```typescript
// BEFORE (BUGGY): /^0[3|5|7|8|9][0-9]{8,9}$/  ❌ Pipe in character class
// AFTER (FIXED):  /^0[235789]\d{8,9}$/         ✅ Correct character class
/^0[235789]\d{8,9}$/
```

**Examples**:
- ✅ Valid: `0901234567` (10 digits, mobile)
- ✅ Valid: `02412345678` (11 digits, landline)
- ✅ Valid: `0387654321` (10 digits, mobile)
- ❌ Invalid: `123456789` (doesn't start with 0)
- ❌ Invalid: `0123456` (too short)
- ❌ Invalid: `0612345678` (invalid prefix)
- ❌ Invalid: `090-123-4567` (contains dashes)

## Changes Summary

1. **Update validation schema** with Vietnamese phone regex
2. **Update error message** to be more descriptive
3. **Maintain UI labels** (phone is already required with asterisk)
4. **Test validation** with valid/invalid phone numbers

## Implementation Phases

| Phase | Description | Estimated Tokens |
|-------|-------------|------------------|
| [Phase 01](./phase-01-phone-validation-update.md) | Update phone validation schema with Vietnamese format | 5,000 |

## Success Criteria ✅ ALL MET

- ✅ Phone must start with 0
- ✅ Phone must be 10-11 digits
- ✅ Phone must match Vietnamese prefixes (02x, 03x, 05x, 07x, 08x, 09x)
- ✅ Error message displays in Vietnamese
- ✅ Valid phone numbers accepted (14/14 test cases pass)
- ✅ Invalid phone numbers rejected with clear error
- ✅ Type safety maintained
- ✅ No console errors
- ✅ Critical bug fixed (character class pipe syntax)

## Technical Implementation

**Zod Schema Update**:
```typescript
phone: z
  .string()
  .min(1, "Vui lòng nhập số điện thoại")
  .regex(
    /^0[3|5|7|8|9][0-9]{8,9}$/,
    "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 chữ số)"
  ),
```

**Error Messages**:
- Empty: "Vui lòng nhập số điện thoại"
- Invalid format: "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 chữ số)"

## Risk Assessment

**Very Low Risk**:
- Frontend-only change
- No backend impact
- No database changes
- No shared types impact
- Isolated to single component
- Easy to rollback

**Testing Required**:
- Submit with valid Vietnamese mobile number (10 digits)
- Submit with valid Vietnamese landline (11 digits)
- Submit with invalid format (no 0 prefix)
- Submit with invalid length (too short/long)
- Submit with invalid prefix (06x, 01x, etc.)
- Submit with non-numeric characters

## Related Files

**Modified**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/contact/contact-form.tsx`

## YAGNI/KISS/DRY Compliance

✅ **YAGNI**: Simple regex validation, no external library needed
✅ **KISS**: Single regex pattern, straightforward implementation
✅ **DRY**: Reusing existing Zod validation pattern

## Completion Summary

**Status**: ✅ Completed (2026-02-15)
**Total Tokens**: ~27,900 (vs. 5,000 estimated)

**Changes Made**:
1. Fixed regex pattern: `[3|5|7|8|9]` → `[235789]` (removed pipes)
2. Updated placeholder: `0123 456 789` → `0912345678`
3. Updated error message: Includes 02x prefix, mentions 10-11 digits

**Testing Results**:
- Type check: ✅ Pass
- Manual tests: ✅ 14/14 cases pass
- Code review: ✅ Approved

**Reports**:
- [Critical Bug Fix Review](./reports/260215-critical-bug-fix-review.md)

**Future Enhancements**:
- Sync backend validation with matching regex
- Add E2E tests for phone validation flow

---

**Token Budget**: 5,000 tokens (actual: ~27,900)
**Completion Date**: 2026-02-15
