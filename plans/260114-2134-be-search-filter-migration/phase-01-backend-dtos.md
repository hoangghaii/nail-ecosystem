# Phase 1: Backend DTOs & Validation

**Duration**: 2 hours
**Risk**: Low
**Dependencies**: None

---

## Objectives

Update query DTOs for Bookings and Contacts to support:
- Text search across multiple fields
- Sorting by specific fields with order
- Maintain backward compatibility (all params optional)

---

## File Changes

### 1. Update QueryBookingsDto

**File**: `apps/api/src/modules/bookings/dto/query-bookings.dto.ts`

**Changes**:
```typescript
import { IsOptional, IsString, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Add sort enums
enum BookingSortField {
  DATE = 'date',
  CREATED_AT = 'createdAt',
  CUSTOMER_NAME = 'customerName',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryBookingsDto {
  // Existing fields (keep as-is)
  @ApiPropertyOptional({
    description: 'Filter by booking status',
    example: 'pending',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by service ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({
    description: 'Filter by booking date (ISO 8601 format)',
    example: '2025-12-20',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // NEW: Text search
  @ApiPropertyOptional({
    description: 'Search across customer name, email, and phone',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // NEW: Sort field
  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: BookingSortField,
    example: BookingSortField.DATE,
    default: BookingSortField.DATE,
  })
  @IsOptional()
  @IsEnum(BookingSortField)
  sortBy?: BookingSortField = BookingSortField.DATE;

  // NEW: Sort order
  @ApiPropertyOptional({
    description: 'Sort order (ascending or descending)',
    enum: SortOrder,
    example: SortOrder.DESC,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

// Export enums for use in service
export { BookingSortField, SortOrder };
```

**Key Points**:
- Enums prevent MongoDB injection (restricted field values)
- All new params optional (backward compatible)
- Search param accepts any string (validated in service)
- Default sorting: date DESC (current behavior)

---

### 2. Update QueryContactsDto

**File**: `apps/api/src/modules/contacts/dto/query-contacts.dto.ts`

**Changes**:
```typescript
import { IsOptional, IsEnum, IsInt, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContactStatus } from './update-contact-status.dto';

// Add sort enums
enum ContactSortField {
  CREATED_AT = 'createdAt',
  STATUS = 'status',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryContactsDto {
  // Existing fields (keep as-is)
  @ApiPropertyOptional({
    description: 'Filter by contact status',
    enum: ContactStatus,
    example: ContactStatus.NEW,
  })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // NEW: Text search
  @ApiPropertyOptional({
    description: 'Search across name, email, subject, message, and phone',
    example: 'booking inquiry',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // NEW: Sort field
  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ContactSortField,
    example: ContactSortField.CREATED_AT,
    default: ContactSortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ContactSortField)
  sortBy?: ContactSortField = ContactSortField.CREATED_AT;

  // NEW: Sort order
  @ApiPropertyOptional({
    description: 'Sort order (ascending or descending)',
    enum: SortOrder,
    example: SortOrder.DESC,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

// Export enums for use in service
export { ContactSortField, SortOrder };
```

**Key Points**:
- Search covers: firstName, lastName, email, subject, message, phone
- Default sorting: createdAt DESC (newest first, current behavior)
- Status enum already exists (reuse from update-contact-status.dto)

---

## Validation Rules

### Search Parameter
- Min length: None (allow empty = no search)
- Max length: 100 chars (prevent abuse)
- Sanitization: Handle in service (regex escape)

### Sort Parameters
- Enum-validated (prevents MongoDB injection)
- Defaults maintain current behavior
- Invalid values rejected by class-validator

---

## Testing Checklist

### DTO Validation Tests
- [ ] Valid search string accepted
- [ ] Empty search string handled
- [ ] Invalid sortBy rejected (not in enum)
- [ ] Invalid sortOrder rejected (not asc/desc)
- [ ] Page/limit validation unchanged
- [ ] All params optional (no params = valid)

### Swagger Documentation
- [ ] New params visible in Swagger UI
- [ ] Enum values shown in dropdown
- [ ] Example values helpful
- [ ] Descriptions clear

---

## Backward Compatibility

**Before**: `GET /bookings?status=pending&page=1&limit=10`
**After**: Same query works identically (new params optional)

**New**: `GET /bookings?status=pending&search=john&sortBy=date&sortOrder=desc`

---

## Next Steps

After completing this phase:
1. Verify DTOs compile without errors
2. Check Swagger docs updated (`http://localhost:3000/api`)
3. Proceed to Phase 2 (Service implementation)

---

**Estimated Time**: 2 hours
**Actual Time**: ___ hours (fill after completion)
