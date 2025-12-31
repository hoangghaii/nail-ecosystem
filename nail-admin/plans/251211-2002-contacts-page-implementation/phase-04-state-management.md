# Phase 4: State Management

**Duration**: 45 minutes
**Dependencies**: Phase 3 (Service Layer)
**Risk**: Low

---

## Objectives

1. Implement contactsStore with Zustand
2. Implement businessInfoStore with singleton pattern
3. Follow immutable update patterns

---

## Store 1: Contacts Store

**File**: `src/store/contactsStore.ts`

```typescript
import { create } from "zustand";

import type { Contact } from "@/types/contact.types";

import { MOCK_CONTACTS } from "@/data/mockContacts";

type ContactsState = {
  contacts: Contact[];
  initializeContacts: () => void;
  isInitialized: boolean;
  setContacts: (contacts: Contact[]) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
};

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],

  initializeContacts: () => {
    if (!get().isInitialized) {
      set({ contacts: MOCK_CONTACTS, isInitialized: true });
    }
  },

  isInitialized: false,

  setContacts: (contacts) => {
    set({ contacts });
  },

  updateContact: (id, data) => {
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...data } : contact,
      ),
    }));
  },
}));
```

**Notes**:

- Actions alphabetically sorted (per code standards)
- `isInitialized` guard prevents duplicate initialization
- Immutable updates via spread operator
- No delete operation (contacts are archived, not deleted)

---

## Store 2: Business Info Store

**File**: `src/store/businessInfoStore.ts`

```typescript
import { create } from "zustand";

import type { BusinessInfo } from "@/types/businessInfo.types";

import { MOCK_BUSINESS_INFO } from "@/data/mockBusinessInfo";

type BusinessInfoState = {
  businessInfo: BusinessInfo | null;
  initializeBusinessInfo: () => void;
  isInitialized: boolean;
  setBusinessInfo: (businessInfo: BusinessInfo) => void;
};

export const useBusinessInfoStore = create<BusinessInfoState>((set, get) => ({
  businessInfo: null,

  initializeBusinessInfo: () => {
    if (!get().isInitialized) {
      set({ businessInfo: MOCK_BUSINESS_INFO, isInitialized: true });
    }
  },

  isInitialized: false,

  setBusinessInfo: (businessInfo) => {
    set({ businessInfo });
  },
}));
```

**Notes**:

- Singleton pattern: `businessInfo` is single record (not array)
- `setBusinessInfo` replaces entire record (no partial updates at store level)
- Service layer handles partial updates and merges with existing data

---

## Store Initialization Pattern

### App-Level Initialization

**File**: `src/App.tsx` (modify existing useEffect)

```typescript
import { useContactsStore } from "@/store/contactsStore";
import { useBusinessInfoStore } from "@/store/businessInfoStore";

function App() {
  useEffect(() => {
    // Existing initializations
    useAuthStore.getState().initializeAuth();
    useBannersStore.getState().initializeBanners();
    useHeroSettingsStore.getState().initializeHeroSettings();
    useBookingsStore.getState().initializeBookings();
    useGalleryStore.getState().initializeGallery();

    // Add these new lines
    useContactsStore.getState().initializeContacts();
    useBusinessInfoStore.getState().initializeBusinessInfo();
  }, []);

  // ... rest of App component
}
```

**Why App-level?**

- Ensures data available before any page loads
- Prevents "flash of empty state" on page navigation
- Matches pattern from existing stores (banners, bookings, gallery)

---

## Store Usage in Components

### Pattern 1: Selective State (Optimized)

```typescript
// In ContactsPage
const contacts = useContactsStore((state) => state.contacts);

// Only re-renders when contacts array changes
```

### Pattern 2: Multiple Values

```typescript
// In ContactsPage
const { contacts, updateContact } = useContactsStore();

// Re-renders when either contacts or updateContact changes
// (updateContact is stable, so effectively only re-renders on contacts change)
```

### Pattern 3: Direct State Access (Services Only)

```typescript
// In contactsService
const contacts = useContactsStore.getState().contacts;

// No hook subscription - for read-only operations in services
```

---

## Immutable Update Patterns

### Update Contact (Map Pattern)

```typescript
updateContact: (id, data) => {
  set((state) => ({
    contacts: state.contacts.map((contact) =>
      contact.id === id ? { ...contact, ...data } : contact,
    ),
  }));
};
```

**Why this pattern?**

- Creates new array reference (triggers React re-renders)
- Spreads existing contact + new data (immutable merge)
- Returns unchanged contacts as-is (preserves references)

---

### Set Contacts (Replace Pattern)

```typescript
setContacts: (contacts) => {
  set({ contacts });
};
```

**When to use?**

- After loading from service (full replacement)
- Refresh operations
- Real API responses

---

### Set Business Info (Singleton Replace)

```typescript
setBusinessInfo: (businessInfo) => {
  set({ businessInfo });
};
```

**Why replace entire record?**

- Business info is small (no performance concern)
- Service layer merges partial updates before calling store
- Simpler than partial update logic at store level

---

## State Flow Diagram

```
App.tsx (mount)
  ↓
  initializeContacts() / initializeBusinessInfo()
  ↓
  Store populated with MOCK_CONTACTS / MOCK_BUSINESS_INFO
  ↓
  isInitialized = true (guard prevents re-init)
  ↓
ContactsPage (mount)
  ↓
  useContactsStore((state) => state.contacts) - hook subscription
  ↓
  User clicks "Update Status"
  ↓
  contactsService.updateStatus(id, status)
  ↓
  Service calls: useContactsStore.getState().updateContact(id, { status })
  ↓
  Store updates contacts array (immutably)
  ↓
  ContactsPage re-renders (hook detects state change)
  ↓
  UI reflects new status
```

---

## Testing Store Initialization

### Test Scenario 1: Guard Prevents Double Init

```typescript
// Simulate double initialization
useContactsStore.getState().initializeContacts();
useContactsStore.getState().initializeContacts(); // Should be no-op

const contacts = useContactsStore.getState().contacts;
expect(contacts.length).toBe(20); // Not 40
```

---

### Test Scenario 2: Update Contact

```typescript
// Update status
useContactsStore.getState().updateContact("contact_001", {
  status: "read",
});

const contact = useContactsStore
  .getState()
  .contacts.find((c) => c.id === "contact_001");

expect(contact?.status).toBe("read");
```

---

### Test Scenario 3: Business Info Update

```typescript
// Update phone
useBusinessInfoStore.getState().setBusinessInfo({
  ...MOCK_BUSINESS_INFO,
  phone: "(555) 999-8888",
});

const info = useBusinessInfoStore.getState().businessInfo;
expect(info?.phone).toBe("(555) 999-8888");
```

---

## localStorage Integration (Optional)

**Note**: Current implementation uses in-memory state only. For persistence across browser sessions, add localStorage sync:

```typescript
// Example: Persist contacts to localStorage on change
export const useContactsStore = create<ContactsState>((set, get) => ({
  // ... existing state

  updateContact: (id, data) => {
    set((state) => {
      const newContacts = state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...data } : contact,
      );

      // Persist to localStorage
      localStorage.setItem("nail_admin_contacts", JSON.stringify(newContacts));

      return { contacts: newContacts };
    });
  },
}));
```

**Trade-off**: Adds localStorage I/O overhead. Use only if persistence needed (not required for initial implementation).

---

## Type Safety Checklist

- [ ] All imports use `type` keyword for types (verbatimModuleSyntax)
- [ ] Store actions return void (no unexpected return values)
- [ ] State updates use immutable patterns (no direct mutations)
- [ ] Partial updates typed correctly (Partial<Contact>)

---

## Files to Create

1. `src/store/contactsStore.ts` - Contacts state management
2. `src/store/businessInfoStore.ts` - Business info state management

---

## Files to Modify

1. `src/App.tsx` - Add store initialization calls

---

## Integration Points

**Services → Store**:

- `contactsService` calls `useContactsStore.getState().updateContact()`
- `businessInfoService` calls `useBusinessInfoStore.getState().setBusinessInfo()`

**Components → Store**:

- `ContactsPage` uses `useContactsStore((state) => state.contacts)` hook
- `BusinessInfoForm` uses `useBusinessInfoStore((state) => state.businessInfo)` hook

---

## Common Pitfalls

### ❌ Pitfall 1: Using Hooks in Services

```typescript
// Wrong - hooks can't be called outside React components
const contacts = useContactsStore((state) => state.contacts);
```

**Fix**: Use `getState()` in services

```typescript
const contacts = useContactsStore.getState().contacts;
```

---

### ❌ Pitfall 2: Mutating State Directly

```typescript
// Wrong - mutates state directly
updateContact: (id, data) => {
  const contact = get().contacts.find((c) => c.id === id);
  contact.status = data.status; // ❌ Direct mutation
};
```

**Fix**: Use immutable patterns

```typescript
updateContact: (id, data) => {
  set((state) => ({
    contacts: state.contacts.map((contact) =>
      contact.id === id ? { ...contact, ...data } : contact,
    ),
  }));
};
```

---

### ❌ Pitfall 3: Forgetting isInitialized Guard

```typescript
// Wrong - no guard, will re-initialize on every call
initializeContacts: () => {
  set({ contacts: MOCK_CONTACTS });
};
```

**Fix**: Add guard check

```typescript
initializeContacts: () => {
  if (!get().isInitialized) {
    set({ contacts: MOCK_CONTACTS, isInitialized: true });
  }
};
```

---

## Next Phase

**Phase 5: Business Info Form Component** - Build UI that consumes businessInfoStore
