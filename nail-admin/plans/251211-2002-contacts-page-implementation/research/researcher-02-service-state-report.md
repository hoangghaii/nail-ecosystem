# Service Layer & State Management Patterns Research

**Date**: 2025-12-11 | **Author**: Research Agent | **Status**: Complete

---

## Executive Summary

Analyzed `bookingsService.ts`, `bannersService.ts`, and their respective Zustand stores to extract patterns for ContactsPage implementation. Core pattern: **dual-mode service layer** (mock/real API) + **immutable state updates** via Zustand.

---

## 1. Service Layer Patterns

### 1.1 Dual-Mode Architecture

**Config-driven switching** via `VITE_USE_MOCK_API` env var:

```typescript
class ContactsService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async getAll(): Promise<Contact[]> {
    if (this.useMockApi) {
      // Read from Zustand store
      return useContactsStore.getState().contacts;
    }
    // Real API fallback
    const response = await fetch("/api/contacts");
    if (!response.ok) throw new Error("Failed to fetch contacts");
    return response.json();
  }
}

export const contactsService = new ContactsService();
```

### 1.2 CRUD Operations Pattern

**Standard naming & structure**:

- `getAll()` - Returns all records (sorted if needed)
- `getById(id)` - Returns single record or null
- `create(data)` - Omit `id`, `createdAt`, `updatedAt` from input
- `update(id, data)` - Partial updates with generated `updatedAt`
- `delete(id)` - No return value
- Domain-specific methods: `updateStatus()`, `getByStatus()`, etc.

**Create pattern** (generates timestamps/IDs):

```typescript
async create(data: Omit<Contact, "id" | "createdAt" | "updatedAt">): Promise<Contact> {
  if (this.useMockApi) {
    const newContact: Contact = {
      ...data,
      createdAt: new Date(),
      id: `contact_${Date.now()}`, // Timestamp-based ID
      updatedAt: new Date(),
    };
    useContactsStore.getState().addContact(newContact);
    return newContact;
  }
  // Real API...
}
```

**Update pattern** (always updates `updatedAt`):

```typescript
async update(id: string, data: Partial<Contact>): Promise<Contact> {
  if (this.useMockApi) {
    const existing = useContactsStore.getState().contacts.find(c => c.id === id);
    if (!existing) throw new Error("Contact not found");

    const updated: Contact = { ...existing, ...data, updatedAt: new Date() };
    useContactsStore.getState().updateContact(id, data);
    return updated;
  }
  // Real API...
}
```

### 1.3 Error Handling

**Pattern**: Throw on fetch failure, null fallback for 404s:

```typescript
async getById(id: string): Promise<Contact | null> {
  if (this.useMockApi) {
    return useContactsStore.getState().contacts.find(c => c.id === id) || null;
  }

  const response = await fetch(`/api/contacts/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch contact");
  }
  return response.json();
}
```

### 1.4 localStorage Naming Convention

**Format**: `nail_admin_[resource]` (e.g., `nail_admin_contacts`)

Used via `storage.service.ts` wrapper with `.get()`, `.set()`, `.remove()` methods.

---

## 2. Zustand Store Patterns

### 2.1 Store Type Definition

**Immutable state + alphabetically sorted actions**:

```typescript
type ContactsState = {
  // State
  contacts: Contact[];
  isInitialized: boolean;

  // Actions (alphabetical order)
  addContact: (contact: Contact) => void;
  deleteContact: (id: string) => void;
  initializeContacts: () => void;
  setContacts: (contacts: Contact[]) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
};
```

### 2.2 Initialization Pattern

**Guard against double-initialization**:

```typescript
export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],

  initializeContacts: () => {
    if (!get().isInitialized) {
      set({ contacts: MOCK_CONTACTS, isInitialized: true });
    }
  },

  isInitialized: false,

  // ... actions
}));
```

**Usage in App.tsx**:

```typescript
useEffect(() => {
  useContactsStore.getState().initializeContacts();
}, []);
```

### 2.3 Immutable Updates Pattern

**Always spread state & items** (never mutate):

```typescript
// Add
addContact: (contact) => {
  set((state) => ({
    contacts: [...state.contacts, contact],
  }));
},

// Update
updateContact: (id, data) => {
  set((state) => ({
    contacts: state.contacts.map((contact) =>
      contact.id === id ? { ...contact, ...data } : contact,
    ),
  }));
},

// Delete
deleteContact: (id) => {
  set((state) => ({
    contacts: state.contacts.filter((contact) => contact.id !== id),
  }));
},
```

### 2.4 Getter Pattern

**Use `getState()` in services, hooks for components**:

```typescript
// Service layer (direct state access)
useContactsStore.getState().contacts;

// Component (reactive hooks)
const { contacts, addContact } = useContactsStore();
// or selective
const contacts = useContactsStore((state) => state.contacts);
```

---

## 3. Mock Data Generation Patterns

### 3.1 Structure & Conventions

**Realistic data spread**:

```typescript
export const MOCK_CONTACTS: Contact[] = [
  {
    id: "contact_1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    subject: "Booking Inquiry",
    message: "Interested in manicure services",
    status: "new", // Distributed across statuses
    notes: "", // Admin-only field
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Spread over time
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  // ... more entries
];
```

### 3.2 Date Distribution Pattern

**Spread data across past/present/future**:

```typescript
// Past (completed)
date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago

// Today
date: new Date(),

// Future
date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days ahead
```

### 3.3 Status Distribution

**Realistic mix** of all possible statuses:

For Contacts: mix of "new", "in-progress", "resolved", "archived"

For realistic testing, distribute across statuses with time context (new contacts clustered recent, resolved distributed older).

### 3.4 Realistic Content

**Use coherent narratives**:

```typescript
{
  firstName: "Emma",
  lastName: "Davis",
  subject: "Wedding Nails Inquiry",
  message: "Looking for special nail art for wedding day",
  notes: "Client wants metallic gold accents",  // Admin context
  status: "in-progress",
}
```

---

## 4. Type System Integration

### 4.1 Contact Type (Admin-Only)

**Expected structure** (not shared with client):

```typescript
// src/types/contact.types.ts
export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string; // Inquiry topic
  message: string; // Customer message
  status: ContactStatus; // new | in-progress | resolved | archived
  notes: string; // Admin-only internal notes
  createdAt: Date;
  updatedAt: Date;
};

export type ContactStatus = "new" | "in-progress" | "resolved" | "archived";
```

### 4.2 Type Safety Requirements

**verbatimModuleSyntax=true** (TypeScript config):

```typescript
// ✅ Correct (type-only import)
import type { Contact, ContactStatus } from "@/types/contact.types";

// ❌ Wrong (causes build error)
import { Contact, ContactStatus } from "@/types/contact.types";
```

---

## 5. Service-Store Integration Flow

**Data flow**: Service → Store → Component

```
ContactsPage
  ↓ useEffect
  ↓ contactsService.getAll()
  ├─ Mock mode: reads from useContactsStore.getState().contacts
  └─ Real API: fetch("/api/contacts")
  ↓ Returns Promise<Contact[]>
  ↓ useEffect: setLoading(false), update UI
  ↓ useContactsStore().contacts (hook for reactivity)
  ↓ Render DataTable
```

**Mutation pattern**:

```
User clicks "Delete"
  ↓ ContactsPage: await contactsService.delete(id)
  ├─ Mock: useContactsStore.getState().deleteContact(id)
  └─ Real API: fetch DELETE request
  ↓ Service returns void
  ↓ Component refresh: const contacts = useContactsStore(state => state.contacts)
  ↓ UI auto-updates (Zustand reactivity)
```

---

## 6. Key Conventions Summary

| Aspect               | Pattern                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Service Class**    | Export singleton instance (e.g., `export const contactsService = new ContactsService()`) |
| **Mock API Check**   | `import.meta.env.VITE_USE_MOCK_API === "true"`                                           |
| **ID Generation**    | `id_${Date.now()}` or UUID (if available)                                                |
| **Timestamps**       | Always `new Date()` (no timezone manipulation)                                           |
| **Store Actions**    | Alphabetical order, immutable spreads                                                    |
| **Error Handling**   | Throw on real failures, null for 404 getById                                             |
| **localStorage Key** | `nail_admin_contacts` via storage.service                                                |
| **Mock Data Export** | `export const MOCK_CONTACTS: Contact[]`                                                  |
| **Status Fields**    | Distributed across all possible values                                                   |

---

## 7. File Structure Template

```
src/
├── services/
│   └── contacts.service.ts        # CRUD + domain methods
├── store/
│   └── contactsStore.ts           # Zustand state (isInitialized guard)
├── types/
│   └── contact.types.ts           # Contact, ContactStatus types
├── data/
│   └── mockContacts.ts            # MOCK_CONTACTS export
└── pages/
    └── ContactsPage.tsx           # DataTable + modals
```

---

## Unresolved Questions

1. **Status Options**: Confirm if Contacts statuses are "new", "in-progress", "resolved", "archived" or different set
2. **Admin Notes Field**: Confirm "notes" is admin-only and not exposed to client-facing API
3. **Bulk Operations**: Should contacts support bulk delete/status update? (Check BookingsPage for pattern)
4. **Search/Filter**: Any special search fields (e.g., search by name vs. email)?

---

**Next Step**: Create ContactsPage implementation using these patterns.
