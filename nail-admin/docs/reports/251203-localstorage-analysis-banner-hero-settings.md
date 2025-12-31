# localStorage Analysis: Banner & Hero Settings Management

**Report Date**: 2025-12-03
**Project**: Pink Nail Admin Dashboard
**Scope**: localStorage usage for banners and hero settings features

---

## Executive Summary

All localStorage operations for banner and hero settings management centralized through `StorageService` class with `nail_admin_` prefix. Implementation follows dual-mode architecture (mock API vs real API) controlled by `VITE_USE_MOCK_API` env variable.

**Key Findings**:

- 5 primary files using localStorage for banners/hero settings
- 2 localStorage keys for feature data: `banners`, `hero_settings`
- 1 initialization flag: `mock_data_initialized`
- All access through storage service abstraction layer
- Auth also uses localStorage (separate concern: `auth_token`, `auth_user`)

---

## 1. Core Storage Infrastructure

### 1.1 StorageService (`src/services/storage.service.ts`)

**Purpose**: Central localStorage abstraction layer

**localStorage Operations**:

- Line 6: `localStorage.setItem(this.prefix + key, serialized)` - Write operation
- Line 10: `localStorage.getItem(this.prefix + key)` - Read operation
- Line 20: `localStorage.removeItem(this.prefix + key)` - Delete operation
- Line 24-26: Iterate all localStorage keys for bulk clear

**Key Prefix**: `nail_admin_`

**Public Methods**:

- `set<T>(key: string, value: T)`: Stores JSON-serialized data
- `get<T>(key: string, defaultValue: T)`: Retrieves parsed data with fallback
- `remove(key: string)`: Deletes single key
- `clear()`: Removes all keys with `nail_admin_` prefix

**Data Structure**: All data JSON-serialized before storage

---

## 2. Banner Management

### 2.1 BannersService (`src/services/banners.service.ts`)

**localStorage Key**: `"banners"`

**Data Structure**:

```typescript
Banner[] = [
  {
    id: string,           // e.g., "banner_1731628800000"
    title: string,        // Banner title
    type: "image" | "video",
    imageUrl: string,     // Firebase Storage URL or mock URL
    videoUrl?: string,    // Optional video URL
    sortIndex: number,    // Display order (0-based)
    active: boolean,      // Visibility status
    isPrimary: boolean,   // Primary banner flag (only one should be true)
    createdAt: Date,
    updatedAt: Date
  }
]
```

**localStorage Access Points**:

1. **getAll()** - Line 11
   - `storage.get<Banner[]>(this.STORAGE_KEY, [])`
   - Retrieves all banners, sorts by sortIndex

2. **getById(id)** - Line 22
   - `storage.get<Banner[]>(this.STORAGE_KEY, [])`
   - Finds specific banner by ID

3. **create(data)** - Lines 38, 46
   - `storage.get<Banner[]>(this.STORAGE_KEY, [])` - Read existing
   - Generates ID: `banner_${Date.now()}`
   - `storage.set(this.STORAGE_KEY, banners)` - Write updated array

4. **update(id, data)** - Lines 64, 74
   - `storage.get<Banner[]>(this.STORAGE_KEY, [])` - Read
   - Updates timestamps: `updatedAt: new Date()`
   - `storage.set(this.STORAGE_KEY, banners)` - Write

5. **delete(id)** - Lines 89, 91
   - `storage.get<Banner[]>(this.STORAGE_KEY, [])`
   - `storage.set(this.STORAGE_KEY, filtered)` - Writes filtered array

6. **setPrimary(id)** - Lines 109, 117
   - `storage.get<Banner[]>(this.STORAGE_KEY, [])`
   - Sets `isPrimary: true` for selected, `false` for others
   - `storage.set(this.STORAGE_KEY, updatedBanners)`

7. **reorder(bannerIds)** - Lines 133, 144
   - `storage.get<Banner[]>(this.STORAGE_KEY, [])`
   - Updates sortIndex based on array order
   - `storage.set(this.STORAGE_KEY, reorderedBanners)`

**Usage Pattern**: Read entire array → Modify in-memory → Write entire array

---

### 2.2 Mock Banners Data (`src/data/mockBanners.ts`)

**Purpose**: Initial seed data for banners

**Structure**: 5 mock banners

- 1 primary image banner (active)
- 2 secondary image banners (1 active, 1 inactive)
- 2 video banners (1 active, 1 inactive)

**Not stored directly** - Used by initialization function

---

## 3. Hero Settings Management

### 3.1 HeroSettingsService (`src/services/heroSettings.service.ts`)

**localStorage Key**: `"hero_settings"`

**Data Structure**:

```typescript
HeroSettings = {
  displayMode: "image" | "video" | "carousel",
  carouselInterval: number, // milliseconds (default: 5000)
  showControls: boolean, // Show carousel navigation
  updatedAt: Date,
};
```

**Default Settings** (Line 9-14):

```typescript
{
  displayMode: "carousel",
  carouselInterval: 5000,
  showControls: true,
  updatedAt: new Date()
}
```

**localStorage Access Points**:

1. **getSettings()** - Line 18
   - `storage.get<HeroSettings>(this.STORAGE_KEY, this.DEFAULT_SETTINGS)`
   - Returns stored settings or defaults

2. **updateSettings(data)** - Lines 28-29, 39
   - `storage.get<HeroSettings>(this.STORAGE_KEY, this.DEFAULT_SETTINGS)` - Read current
   - Merges partial update with existing settings
   - Updates timestamp: `updatedAt: new Date()`
   - `storage.set(this.STORAGE_KEY, updatedSettings)` - Write

3. **resetSettings()** - Line 53
   - Calls `updateSettings(this.DEFAULT_SETTINGS)`
   - Overwrites with defaults

**Usage Pattern**: Read → Merge update → Write (partial update support)

---

## 4. Data Initialization

### 4.1 Mock Data Initializer (`src/data/initializeMockData.ts`)

**localStorage Keys Used**:

1. `"mock_data_initialized"` (boolean flag)
2. `"banners"` (Banner array)
3. `"hero_settings"` (HeroSettings object)

**Operations**:

- Line 5: `storage.get<boolean>("mock_data_initialized", false)` - Check if already initialized
- Line 8: `storage.set("banners", MOCK_BANNERS)` - Seed 5 mock banners
- Line 10-15: `storage.set("hero_settings", {...})` - Seed default hero settings
- Line 17: `storage.set("mock_data_initialized", true)` - Set flag to prevent re-initialization

**Trigger**: Called from `main.tsx` line 8-10 when `VITE_USE_MOCK_API === "true"`

**One-Time Operation**: Flag prevents duplicate initialization on page reload

---

## 5. Component Usage

### 5.1 BannersPage (`src/pages/BannersPage.tsx`)

**Service Calls** (indirect localStorage access):

- Line 64: `bannersService.getAll()` - Load all banners
- Line 76: `heroSettingsService.getSettings()` - Load display mode
- Line 105: `bannersService.setPrimary(banner.id)` - Update primary banner
- Line 116: `bannersService.toggleActive(banner.id)` - Toggle active status
- Line 149: `bannersService.reorder(bannerIds)` - Save drag-drop order

**localStorage Flow**: Component → Service → StorageService → localStorage

---

### 5.2 HeroSettingsCard (`src/components/banners/HeroSettingsCard.tsx`)

**Service Calls**:

- Line 75: `heroSettingsService.getSettings()` - Load settings
- Line 76: `bannersService.getPrimary()` - Load primary banner for preview
- Line 99: `heroSettingsService.updateSettings({...})` - Auto-save on change
- Line 126: `heroSettingsService.resetSettings()` - Reset to defaults

**Auto-Save Mechanism** (Lines 115-122):

- Watches form fields
- Triggers save on any change
- Debounced through React Hook Form

---

### 5.3 BannerFormModal (`src/components/banners/BannerFormModal.tsx`)

**Service Calls**:

- Line 107: `bannersService.update(banner.id, {...})` - Update existing banner
- Line 116-121: `bannersService.getAll()` + `bannersService.create({...})` - Create new banner

**SortIndex Calculation** (Lines 116-119):

- Reads all banners to find max sortIndex
- Assigns new banner to end of list

---

### 5.4 DeleteBannerDialog (`src/components/banners/DeleteBannerDialog.tsx`)

**Service Calls**:

- Line 37: `bannersService.delete(banner.id)` - Remove banner from localStorage

---

## 6. Related localStorage Usage (Auth)

### 6.1 AuthStore (`src/store/authStore.ts`)

**localStorage Keys** (separate from banners/hero):

- `"auth_token"` - JWT token
- `"auth_user"` - User object

**Not directly related to banner/hero settings** but uses same StorageService infrastructure

---

## 7. Environment Configuration

**Environment Variable**: `VITE_USE_MOCK_API`

**Values**:

- `"true"` → Use localStorage (mock API)
- `"false"` → Use real API endpoints

**Dual-Mode Pattern**: All services check this flag and switch between localStorage and fetch calls

---

## 8. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Entry                       │
│                    (src/main.tsx)                            │
│                                                               │
│  if VITE_USE_MOCK_API === "true":                           │
│    initializeMockData() ──────────────┐                     │
└───────────────────────────────────────┼──────────────────────┘
                                        │
                                        ▼
                            ┌─────────────────────┐
                            │ storage.get/set     │
                            │ Check initialized   │
                            │ flag                │
                            └─────────┬───────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌─────────────────────┐           ┌─────────────────────┐
        │ localStorage key:   │           │ localStorage key:   │
        │ "nail_admin_        │           │ "nail_admin_        │
        │  banners"           │           │  hero_settings"     │
        │                     │           │                     │
        │ [5 mock banners]    │           │ {displayMode: ...}  │
        └─────────┬───────────┘           └─────────┬───────────┘
                  │                                 │
        ┌─────────▼─────────┐           ┌─────────▼─────────┐
        │ BannersService    │           │ HeroSettingsService│
        │ - getAll()        │           │ - getSettings()    │
        │ - create()        │           │ - updateSettings() │
        │ - update()        │           │ - resetSettings()  │
        │ - delete()        │           └─────────┬───────────┘
        │ - setPrimary()    │                     │
        │ - reorder()       │                     │
        └─────────┬─────────┘                     │
                  │                               │
        ┌─────────┴─────────────────────────────┴─────────┐
        │                                                   │
        ▼                                                   ▼
┌──────────────────┐                        ┌──────────────────────┐
│ BannersPage      │                        │ HeroSettingsCard     │
│ - loadBanners()  │                        │ - loadData()         │
│ - CRUD ops       │                        │ - saveSettings()     │
└──────────────────┘                        │ - auto-save watch    │
        │                                    └──────────────────────┘
        │
        ├──► BannerFormModal (create/edit)
        └──► DeleteBannerDialog (delete)
```

---

## 9. Summary Table

| File                      | localStorage Keys                                   | Operations                      | Lines                                              |
| ------------------------- | --------------------------------------------------- | ------------------------------- | -------------------------------------------------- |
| `storage.service.ts`      | All keys (via prefix)                               | get, set, remove, clear         | 6, 10, 20, 24-26                                   |
| `banners.service.ts`      | `banners`                                           | get (7x), set (5x)              | 11, 22, 38, 46, 64, 74, 89, 91, 109, 117, 133, 144 |
| `heroSettings.service.ts` | `hero_settings`                                     | get (2x), set (1x)              | 18, 28-29, 39                                      |
| `initializeMockData.ts`   | `mock_data_initialized`, `banners`, `hero_settings` | get (1x), set (3x)              | 5, 8, 10-15, 17                                    |
| `authStore.ts`            | `auth_token`, `auth_user`                           | get (2x), set (2x), remove (2x) | 18-19, 27-28, 33-34                                |

---

## 10. localStorage Keys Reference

### Banner/Hero Settings Keys:

1. **`nail_admin_banners`** - Array of Banner objects (CRUD operations)
2. **`nail_admin_hero_settings`** - HeroSettings object (display configuration)
3. **`nail_admin_mock_data_initialized`** - Boolean flag (one-time setup)

### Auth Keys (not banner-related):

4. **`nail_admin_auth_token`** - JWT token string
5. **`nail_admin_auth_user`** - User object

---

## 11. Unresolved Questions

None. Analysis complete.

---

## Recommendations for Backend Migration

When migrating to real API:

1. **Keep StorageService** - Change VITE_USE_MOCK_API to "false"
2. **Service layer ready** - All services have real API code paths
3. **Expected API endpoints**:
   - `GET /api/banners` - List all
   - `POST /api/banners` - Create
   - `PATCH /api/banners/:id` - Update
   - `DELETE /api/banners/:id` - Delete
   - `POST /api/banners/:id/set-primary` - Set primary
   - `POST /api/banners/reorder` - Reorder
   - `GET /api/hero-settings` - Get settings
   - `PUT /api/hero-settings` - Update settings
4. **No frontend code changes needed** - Dual-mode architecture handles switch
5. **Consider keeping mock mode** - Useful for development/testing

---

**Report Generated**: 2025-12-03
**Analyst**: System Investigation Agent
