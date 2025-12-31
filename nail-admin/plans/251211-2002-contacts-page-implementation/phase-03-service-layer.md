# Phase 3: Service Layer

**Duration**: 1 hour
**Dependencies**: Phase 2 (Mock Data)
**Risk**: Low

---

## Objectives

1. Implement contactsService with CRUD operations
2. Implement businessInfoService with singleton pattern
3. Follow dual-mode architecture (mock/real API)

---

## Service 1: Contacts Service

**File**: `src/services/contacts.service.ts`

```typescript
import type { Contact, ContactStatus } from "@/types/contact.types";
import { useContactsStore } from "@/store/contactsStore";

class ContactsService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  /**
   * Get all contacts, sorted by createdAt descending (newest first)
   */
  async getAll(): Promise<Contact[]> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      return [...contacts].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }

    const response = await fetch("/api/contacts");
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }
    return response.json();
  }

  /**
   * Get contacts filtered by status
   */
  async getByStatus(status: ContactStatus): Promise<Contact[]> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      return contacts
        .filter((contact) => contact.status === status)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const response = await fetch(`/api/contacts?status=${status}`);
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }
    return response.json();
  }

  /**
   * Get single contact by ID
   */
  async getById(id: string): Promise<Contact | null> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      return contacts.find((contact) => contact.id === id) || null;
    }

    const response = await fetch(`/api/contacts/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch contact");
    }
    return response.json();
  }

  /**
   * Update contact status
   * If status is RESPONDED, sets respondedAt timestamp
   */
  async updateStatus(id: string, status: ContactStatus): Promise<Contact> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      const existing = contacts.find((contact) => contact.id === id);
      if (!existing) {
        throw new Error("Contact not found");
      }

      const updateData: Partial<Contact> = { status };

      // Set respondedAt when status changes to RESPONDED
      if (status === "responded" && !existing.respondedAt) {
        updateData.respondedAt = new Date();
      }

      useContactsStore.getState().updateContact(id, updateData);

      return { ...existing, ...updateData };
    }

    const response = await fetch(`/api/contacts/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update contact status");
    }
    return response.json();
  }

  /**
   * Update admin notes for a contact
   */
  async updateAdminNotes(id: string, adminNotes: string): Promise<Contact> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      const existing = contacts.find((contact) => contact.id === id);
      if (!existing) {
        throw new Error("Contact not found");
      }

      useContactsStore.getState().updateContact(id, { adminNotes });

      return { ...existing, adminNotes };
    }

    const response = await fetch(`/api/contacts/${id}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes }),
    });

    if (!response.ok) {
      throw new Error("Failed to update admin notes");
    }
    return response.json();
  }

  /**
   * Update both status and admin notes in single call
   * Optimized for ContactDetailsModal form submission
   */
  async update(
    id: string,
    data: { status: ContactStatus; adminNotes: string },
  ): Promise<Contact> {
    if (this.useMockApi) {
      const contacts = useContactsStore.getState().contacts;
      const existing = contacts.find((contact) => contact.id === id);
      if (!existing) {
        throw new Error("Contact not found");
      }

      const updateData: Partial<Contact> = {
        status: data.status,
        adminNotes: data.adminNotes,
      };

      // Set respondedAt when status changes to RESPONDED
      if (data.status === "responded" && !existing.respondedAt) {
        updateData.respondedAt = new Date();
      }

      useContactsStore.getState().updateContact(id, updateData);

      return { ...existing, ...updateData };
    }

    const response = await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update contact");
    }
    return response.json();
  }

  /**
   * Get status counts for filter badges
   */
  async getStatusCounts(): Promise<Record<ContactStatus | "all", number>> {
    const contacts = await this.getAll();

    const counts: Record<ContactStatus | "all", number> = {
      all: contacts.length,
      new: 0,
      read: 0,
      responded: 0,
      archived: 0,
    };

    contacts.forEach((contact) => {
      counts[contact.status]++;
    });

    return counts;
  }
}

export const contactsService = new ContactsService();
```

---

## Service 2: Business Info Service

**File**: `src/services/businessInfo.service.ts`

```typescript
import type { BusinessInfo } from "@/types/businessInfo.types";
import { useBusinessInfoStore } from "@/store/businessInfoStore";

class BusinessInfoService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  /**
   * Get business info (singleton record)
   * Always returns single record or null
   */
  async get(): Promise<BusinessInfo | null> {
    if (this.useMockApi) {
      return useBusinessInfoStore.getState().businessInfo;
    }

    const response = await fetch("/api/business-info");
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch business info");
    }
    return response.json();
  }

  /**
   * Update business info
   * Updates singleton record and sets updatedAt timestamp
   */
  async update(data: Partial<BusinessInfo>): Promise<BusinessInfo> {
    if (this.useMockApi) {
      const existing = useBusinessInfoStore.getState().businessInfo;
      if (!existing) {
        throw new Error("Business info not found");
      }

      const updated: BusinessInfo = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };

      useBusinessInfoStore.getState().setBusinessInfo(updated);

      return updated;
    }

    const response = await fetch("/api/business-info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update business info");
    }
    return response.json();
  }
}

export const businessInfoService = new BusinessInfoService();
```

---

## Service Layer Patterns

### Pattern 1: Dual-Mode Check

```typescript
private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";
```

**Usage**:

- Set `VITE_USE_MOCK_API=true` in `.env` for mock mode
- Set `VITE_USE_MOCK_API=false` for real API mode

---

### Pattern 2: Mock Mode Data Access

```typescript
// Read from store
const contacts = useContactsStore.getState().contacts;

// Write to store
useContactsStore.getState().updateContact(id, data);
```

**Notes**:

- Use `getState()` in services (not hooks)
- Store mutations trigger component re-renders

---

### Pattern 3: Error Handling

```typescript
if (!response.ok) {
  if (response.status === 404) return null; // Graceful 404 handling
  throw new Error("Failed to fetch..."); // Other errors throw
}
```

---

### Pattern 4: Timestamp Management

```typescript
// Set respondedAt when status becomes RESPONDED
if (status === "responded" && !existing.respondedAt) {
  updateData.respondedAt = new Date();
}
```

**Rule**: Only set respondedAt once (first time status changes to RESPONDED)

---

## API Endpoint Mapping

When `VITE_USE_MOCK_API=false`, services expect these endpoints:

| Method | Endpoint                        | Purpose                         |
| ------ | ------------------------------- | ------------------------------- |
| GET    | `/api/contacts`                 | Get all contacts                |
| GET    | `/api/contacts?status={status}` | Get contacts by status          |
| GET    | `/api/contacts/{id}`            | Get single contact              |
| PATCH  | `/api/contacts/{id}`            | Update contact (status + notes) |
| PATCH  | `/api/contacts/{id}/status`     | Update status only              |
| PATCH  | `/api/contacts/{id}/notes`      | Update notes only               |
| GET    | `/api/business-info`            | Get business info               |
| PUT    | `/api/business-info`            | Update business info            |

---

## Service Testing Checklist

### ContactsService Tests

- [ ] `getAll()` returns contacts sorted by date descending
- [ ] `getByStatus()` filters correctly
- [ ] `getById()` returns contact or null
- [ ] `updateStatus("responded")` sets respondedAt
- [ ] `updateStatus()` doesn't overwrite existing respondedAt
- [ ] `updateAdminNotes()` updates notes field
- [ ] `update()` updates both status and notes
- [ ] `getStatusCounts()` returns correct counts

### BusinessInfoService Tests

- [ ] `get()` returns singleton record
- [ ] `update()` sets updatedAt timestamp
- [ ] `update()` preserves id field
- [ ] Partial updates work (only changed fields)

---

## Integration with Store

**Service → Store Flow**:

```
User action (UI)
  ↓
Component calls service method
  ↓
Service (mock mode): reads/writes to store via getState()
  ↓
Store updates state (immutably)
  ↓
Component re-renders (hook subscription)
```

**Example**:

```typescript
// In ContactsPage component
const handleUpdateStatus = async (id: string, status: ContactStatus) => {
  await contactsService.updateStatus(id, status);
  // No manual store update needed - service already did it
  // Component re-renders automatically via useContactsStore hook
};
```

---

## Files to Create

1. `src/services/contacts.service.ts` - Contact CRUD operations
2. `src/services/businessInfo.service.ts` - Business info singleton service

---

## Files to Reference

1. `src/store/contactsStore.ts` (Phase 4) - Store interface
2. `src/store/businessInfoStore.ts` (Phase 4) - Store interface

---

## Security Considerations

- **Admin Notes**: Private field, never exposed to client-facing API
- **Email/Phone**: Contact information stored securely, no PII leaks
- **Status Changes**: Audit trail via respondedAt timestamp
- **Validation**: Happens at form level (Phase 1), services trust validated data

---

## Performance Optimizations

1. **Sorting at Service Level**: Pre-sort contacts by date (newest first)
2. **Status Filter Method**: Dedicated method for filtered queries
3. **Batch Updates**: Single `update()` method for status + notes
4. **Singleton Pattern**: BusinessInfo doesn't need array operations

---

## Next Phase

**Phase 4: State Management** - Implement Zustand stores consumed by these services
