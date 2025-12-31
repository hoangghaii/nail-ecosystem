# @repo/ui

**Status**: Intentionally Empty

## Why This Package is Empty

After analyzing both client and admin applications during the Turborepo migration, we determined that **UI components should NOT be shared** between the two apps.

## Design System Constraints

Per the project's `CLAUDE.md` requirements, the client and admin have **fundamentally different design systems**:

### Client (Customer-facing)
- **Theme**: Warm, cozy, feminine, organic
- **Colors**: Soft neutrals (beige, cream, warm grays)
- **Design**: Border-based with **NO shadows**, organic shapes
- **Animations**: Motion (Framer Motion)

### Admin (Dashboard)
- **Theme**: Professional, clean, modern
- **Colors**: Blue theme (shadcn/ui default)
- **Design**: Glassmorphism **WITH shadows**
- **Animations**: Simple CSS transitions

## Component Analysis

### Shadcn/ui Components (Duplicated Intentionally)
Both apps have the following components with **different styling**:
- `button`, `card`, `dialog`, `input`, `label`, `select`, `textarea`

**Decision**: Keep separate. Each app needs its own styled implementation.

### Truly Shareable Components
After thorough analysis, only **3 items** were identified as shareable:

1. **useDebounce hook** → Moved to `@repo/utils/hooks` ✅
2. **DataTable component** → Admin-only, client doesn't use tables
3. **StatusBadge component** → Admin-only, client doesn't use status badges

## Shared Code Location

**Utilities & Hooks**: Use `@repo/utils`
- `@repo/utils/cn` - className utility
- `@repo/utils/hooks` - React hooks (useDebounce)
- `@repo/utils/format` - Formatting utilities

**Type Definitions**: Use `@repo/types`
- Shared types for service, gallery, booking, auth

## Architecture Decision

**Keep UI components separate** to maintain:
1. ✅ Independent design systems
2. ✅ App-specific styling flexibility
3. ✅ Clear separation of concerns
4. ✅ No forced coupling between different design languages

## Future Considerations

If client ever needs:
- **DataTable**: Copy from admin and restyle for client design system
- **StatusBadge**: Copy from admin and restyle for client design system
- **New shared component**: Evaluate if it's truly design-agnostic (like hooks/utilities)

**General Rule**: Only share components that have **zero visual styling** (utilities, hooks, headless components).

---

**Last Updated**: 2025-12-31
**Decision**: Intentionally empty to preserve design system independence
