# Phase 4 Masonry Layout - Manual Testing Guide

**For**: Developer/QA executing browser tests
**Test URL**: http://localhost:5173/gallery
**Estimated Time**: 15-20 minutes

---

## Pre-Test Setup

```bash
# 1. Start dev server
npm run dev --workspace=client

# 2. Wait for server ready message
# ✓ Ready in XXXms

# 3. Open browser
open http://localhost:5173/gallery
```

---

## Test 1: Desktop Layout (>1024px)

**Browser Window**: 1440px width (full screen on MacBook Pro 14")

### Visual Checks
- [ ] Gallery shows **3 columns** of cards
- [ ] Cards have **different heights** (not uniform grid)
- [ ] Gap between cards: **24px** (generous spacing)
- [ ] Cards aligned at top (masonry flow, not centered)
- [ ] No horizontal scroll bar

### Expected Layout
```
Desktop (1440px):
┌─────┐ ┌─────┐ ┌─────┐
│ A   │ │ B   │ │ C   │
│     │ └─────┘ │     │
└─────┘ ┌─────┐ │     │
┌─────┐ │ D   │ └─────┘
│ E   │ │     │ ┌─────┐
└─────┘ └─────┘ │ F   │
                └─────┘
```

### Interaction Tests
1. **Hover Card**
   - [ ] Border changes from gold → pink
   - [ ] Image zooms slightly (105% scale)
   - [ ] Overlay appears: "Nhấn để xem"
   - [ ] Transition smooth (300ms)

2. **Click Image**
   - [ ] Lightbox opens
   - [ ] Correct image shown
   - [ ] Can navigate next/previous
   - [ ] ESC closes lightbox

3. **Click "Đặt Lịch Ngay"**
   - [ ] Navigates to `/booking`
   - [ ] Service pre-selected (check URL state)
   - [ ] Gallery item data passed

4. **Filter Categories**
   - [ ] Click "Nail Art" → shows only nail art items
   - [ ] Cards re-flow smoothly (no flash)
   - [ ] Maintains 3 columns
   - [ ] Click "All" → shows all items

---

## Test 2: Tablet Layout (640-1024px)

**Browser Window**: Resize to 768px width (iPad Mini portrait)

### Visual Checks
- [ ] Gallery shows **2 columns** of cards
- [ ] Gap between cards: **16px** (medium spacing)
- [ ] Cards still variable heights
- [ ] Touch targets adequate (buttons ≥44px)

### Expected Layout
```
Tablet (768px):
┌─────┐ ┌─────┐
│ A   │ │ B   │
│     │ └─────┘
└─────┘ ┌─────┐
┌─────┐ │ C   │
│ D   │ │     │
└─────┘ └─────┘
```

### Interaction Tests
- [ ] All desktop interactions work
- [ ] Hover effects trigger
- [ ] Filter buttons large enough for touch

---

## Test 3: Mobile Layout (<640px)

**Browser Window**: Resize to 375px width (iPhone SE)

### Visual Checks
- [ ] Gallery shows **2 columns** of cards
- [ ] Gap between cards: **12px** (compact)
- [ ] Each card ~165px wide (readable)
- [ ] Text not truncated (titles/descriptions visible)
- [ ] Price/duration badges visible

### Expected Layout
```
Mobile (375px):
┌────┐ ┌────┐
│ A  │ │ B  │
│    │ └────┘
└────┘ ┌────┐
┌────┐ │ C  │
│ D  │ │    │
└────┘ └────┘
```

### Critical Checks
- [ ] No horizontal scroll (content fits)
- [ ] Touch targets ≥44px (buttons, filter)
- [ ] Smooth scroll (60fps, no jank)
- [ ] Images load progressively (lazy loading)

---

## Test 4: Responsive Transitions

**Test**: Verify smooth column changes at breakpoints

### Procedure
1. Start at 1440px (3 cols)
2. Slowly resize window narrower
3. Watch for column change at **1024px** (3→2 cols)
4. Continue resizing
5. Watch for gap change at **640px** (16px→12px)

### Expected Behavior
- [ ] Columns re-flow smoothly (no jump)
- [ ] Cards redistribute evenly
- [ ] No layout shift (cards don't "pop")
- [ ] Transition feels natural

---

## Test 5: Performance

**Tools**: Chrome DevTools → Performance tab

### Procedure
1. **Initial Load**
   - Open DevTools → Performance
   - Reload page (Cmd+R)
   - Stop recording after page load

   **Check**:
   - [ ] Layout Shift (CLS) <0.1 (green in metrics)
   - [ ] First Contentful Paint (FCP) <1.5s
   - [ ] No long tasks (yellow/red blocks) >50ms

2. **Filter Change**
   - Start recording
   - Click filter category
   - Wait for items to load
   - Stop recording

   **Check**:
   - [ ] No layout shift during transition
   - [ ] Total duration <500ms
   - [ ] 60fps maintained (no dropped frames)

3. **Scroll Performance**
   - Start recording
   - Scroll entire gallery
   - Stop recording

   **Check**:
   - [ ] Constant 60fps (green line in FPS chart)
   - [ ] No jank (red spikes)
   - [ ] Images lazy load as scroll approaches

---

## Test 6: Accessibility

### Keyboard Navigation
1. **Tab Through Gallery**
   - Press Tab repeatedly
   - [ ] Focus indicators visible
   - [ ] Tab order logical (left→right, top→bottom)
   - [ ] Can reach all interactive elements

2. **Activate with Keyboard**
   - Tab to card image
   - Press Enter
   - [ ] Lightbox opens
   - Press ESC
   - [ ] Lightbox closes

3. **Filter with Keyboard**
   - Tab to filter button
   - Press Space/Enter
   - [ ] Filter activates
   - [ ] Focus indicator moves

### Screen Reader (VoiceOver/NVDA)
1. Enable screen reader
2. Navigate gallery
   - [ ] Announces image titles
   - [ ] Announces button labels
   - [ ] Announces loading state ("Loading gallery item")
   - [ ] No orphaned text

---

## Test 7: Edge Cases

### Empty Gallery
1. Select category with 0 items
   - [ ] Shows "Không tìm thấy mục nào" message
   - [ ] No error in console

### Slow Network
1. DevTools → Network → Throttle to Slow 3G
2. Reload gallery
   - [ ] Skeletons show while loading
   - [ ] Images lazy load
   - [ ] No broken images
   - [ ] Placeholders visible

### Error Handling
1. Stop API server (to simulate network error)
2. Reload gallery
   - [ ] Shows error message "Không thể tải thư viện"
   - [ ] Retry button appears
   - [ ] Click retry → attempts reload

---

## Test 8: Visual Quality

### Desktop (1440px)
**Compare with Pinterest**:
- [ ] Feels like high-end portfolio (not corporate grid)
- [ ] Variable heights create organic flow
- [ ] Cards balanced (no one column much longer)
- [ ] Gold borders give premium feel
- [ ] Hover effects subtle but noticeable

### Mobile (375px)
**Compare with Instagram**:
- [ ] 2-column readable (text not squished)
- [ ] Touch-friendly spacing
- [ ] Scroll feels smooth (like native app)
- [ ] Images high quality (not pixelated)

---

## Known Issues to Verify

### Issue #1: Skeleton Height Mismatch
**What to look for**: When page first loads, cards may "jump" slightly when skeletons replaced with actual cards.

**Test**:
1. Hard reload (Cmd+Shift+R)
2. Watch gallery as images load
3. Notice if cards resize after appearing

**Expected**: Minor shift (acceptable)
**Unacceptable**: Large jumps (>50px)

---

## Console Checks

**Open DevTools → Console**

### Should See (OK)
- React DevTools warnings (dev mode only)
- TanStack Query cache updates

### Should NOT See (Issues)
- ❌ "Cannot read property of undefined"
- ❌ "Failed to fetch"
- ❌ "Hydration mismatch"
- ❌ 404 errors for images

---

## Browser Compatibility

**Test in**:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

**Critical**: Safari/Mobile Safari (primary user base)

---

## Pass Criteria

**Minimum to approve**:
- ✅ All 3 breakpoints work (3→2→2 cols)
- ✅ Hover/click interactions functional
- ✅ Filter transitions smooth
- ✅ No console errors
- ✅ Mobile readable (375px)

**Optional nice-to-have**:
- CLS <0.1 (minor shift acceptable)
- 60fps scroll on all devices
- Perfect skeleton matching

---

## Reporting Issues

**If you find bugs, note**:
1. Browser/device
2. Screen width (px)
3. Steps to reproduce
4. Screenshot/video
5. Console errors

**Example**:
```
Browser: Chrome 120
Width: 375px
Issue: Cards overlap at 320px width
Console: No errors
Screenshot: attached
```

---

**Estimated Test Time**: 15-20 min (all tests)
**Critical Tests Only**: 5-10 min (Tests 1-3)

**Start Testing**: `npm run dev --workspace=client`
