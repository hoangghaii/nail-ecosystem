# Phase 4: Update ContactPage & Footer Components

**Plan**: 260116-2009-integrate-business-info-api
**Phase**: 4 of 7
**Effort**: 1.5 hours

---

## Objective

Replace mock data with live API integration in ContactPage and Footer components.

---

## Tasks

### 1. Update Imports

**File**: `apps/client/src/pages/ContactPage.tsx`

**Remove**:

```typescript
import { contactInfo, businessHours } from "@/data/businessInfo";
```

**Add**:

```typescript
import { useBusinessInfo } from "@/hooks/useBusinessInfo";
import { transformBusinessInfo } from "@/utils/businessInfo";
```

### 2. Add API Data Fetching

**Location**: Inside `ContactPage` component (after `useContactPage()`)

```typescript
export function ContactPage() {
  useContactPage();

  // Fetch business info from API
  const { data: businessInfoData, isLoading, error } = useBusinessInfo();

  // Transform data for display
  const displayData = businessInfoData
    ? transformBusinessInfo(businessInfoData)
    : null;

  const contactInfo = displayData?.contactInfo;
  const businessHours = displayData?.businessHours;

  // ... rest of component
}
```

### 3. Add Loading State

**Location**: Before main return statement

```typescript
if (isLoading) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="font-sans text-base text-muted-foreground">
              Đang tải thông tin...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Add Error State

**Location**: After loading state

```typescript
if (error || !displayData) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="font-sans text-lg text-foreground mb-2">
              Không thể tải thông tin liên hệ
            </p>
            <p className="font-sans text-sm text-muted-foreground">
              Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 5. Update Address Rendering

**Location**: Address section (around line 76-82)

**Replace**:

```typescript
<address className="font-sans text-base text-foreground not-italic">
  {contactInfo.address.street}
  <br />
  {contactInfo.address.city}, {contactInfo.address.state}{" "}
  {contactInfo.address.zip}
</address>
```

**With**:

```typescript
<address className="font-sans text-base text-foreground not-italic">
  {contactInfo.address.street && (
    <>
      {contactInfo.address.street}
      <br />
    </>
  )}
  {contactInfo.address.city && contactInfo.address.state && contactInfo.address.zip ? (
    <>
      {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}
    </>
  ) : (
    contactInfo.address.full
  )}
</address>
```

### 6. Verify Business Hours Rendering

**Location**: Business hours section (around line 95-107)

Current implementation should work as-is since data structure matches:

```typescript
{businessHours.map((schedule) => (
  <div key={schedule.day} className="flex justify-between gap-4 font-sans text-sm text-foreground">
    <span>{schedule.day}</span>
    <span className="text-muted-foreground">
      {schedule.closed ? "Đóng Cửa" : `${schedule.open} - ${schedule.close}`}
    </span>
  </div>
))}
```

---

## Part B: Footer Component

### 7. Update Footer Imports

**File**: `apps/client/src/components/layout/Footer.tsx`

**Remove**:

```typescript
import { contactInfo, businessHours } from "@/data/businessInfo";
```

**Add**:

```typescript
import { useBusinessInfo } from "@/hooks/useBusinessInfo";
import { transformBusinessInfo } from "@/utils/businessInfo";
```

### 8. Add API Data Fetching to Footer

**Location**: Inside `Footer` component

```typescript
export function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch business info from API
  const { data: businessInfoData } = useBusinessInfo();

  // Transform data for display
  const displayData = businessInfoData
    ? transformBusinessInfo(businessInfoData)
    : null;

  const contactInfo = displayData?.contactInfo;
  const businessHours = displayData?.businessHours;

  // Fallback to empty values if data not loaded yet
  if (!displayData) {
    return null; // or render skeleton
  }

  return (
    <footer className="bg-primary text-primary-foreground rounded-t-[32px] mt-20">
      {/* ... existing JSX ... */}
    </footer>
  );
}
```

### 9. Update Footer Address Rendering

**Location**: Address section (lines 85-90)

**Replace**:

```typescript
<address className="text-sm not-italic">
  {contactInfo.address.street}
  <br />
  {contactInfo.address.city}, {contactInfo.address.state}{" "}
  {contactInfo.address.zip}
</address>
```

**With**:

```typescript
<address className="text-sm not-italic">
  {contactInfo.address.street && (
    <>
      {contactInfo.address.street}
      <br />
    </>
  )}
  {contactInfo.address.city && contactInfo.address.state && contactInfo.address.zip ? (
    <>
      {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zip}
    </>
  ) : (
    contactInfo.address.full
  )}
</address>
```

### 10. Update Footer Business Hours Display

**Location**: Hours section (lines 94-99)

**Current** (simplified hours display):

```typescript
<p className="mt-1 text-sm opacity-90">
  {businessHours.find((h) => !h.closed)?.open} -{" "}
  {businessHours.find((h) => !h.closed)?.close}
</p>
<p className="text-sm opacity-90">Thứ 2 - Thứ 7</p>
```

**Note**: This displays first open day's hours. Current implementation works as-is since data structure matches after transformation. No changes needed.

---

## Validation

### ContactPage

- [ ] Component renders without errors
- [ ] Loading spinner shows while fetching
- [ ] Error message shows if API fails
- [ ] Phone displays and `tel:` link works
- [ ] Email displays and `mailto:` link works
- [ ] Address displays with proper formatting
- [ ] Business hours show correct times in 12-hour format
- [ ] Closed days show "Đóng Cửa"
- [ ] Data persists after refresh (React Query cache)

### Footer

- [ ] Footer renders without errors
- [ ] Phone displays and `tel:` link works
- [ ] Email displays and `mailto:` link works
- [ ] Address displays correctly
- [ ] Business hours show correctly
- [ ] Footer handles loading state gracefully (returns null or skeleton)

### Both Components

- [ ] No TypeScript errors
- [ ] No console errors
- [ ] React Query caches data (Footer reuses ContactPage's query)

---

## Notes

- Loading/error states follow client app design patterns
- Vietnamese text matches existing UI
- Graceful fallback for address parsing
- React Query handles caching automatically
- Footer shares same query cache as ContactPage (same queryKey)
- Footer shows simplified hours (first open day), ContactPage shows full schedule
