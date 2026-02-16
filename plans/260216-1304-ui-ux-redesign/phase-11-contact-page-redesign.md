# Phase 11: Contact Page Redesign

**Date**: Weeks 21-22 (2026-07-04 to 2026-07-17)
**Priority**: Medium (P2)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 10: Homepage Polish](./phase-10-homepage-polish.md)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md) - Line icons, pill button, map styling
- **Next Phase**: [phase-12-final-polish-performance.md](./phase-12-final-polish-performance.md)

---

## Key Insights

**Blueprint Requirements**:
- Line icons (thin stroke) for contact info (MapPin, Phone, Mail, Clock)
- Real-time open/closed status indicator
- Submit button as pill shape (rounded-full)
- Google Map with muted/retro styling (harmonize with brand colors)

**Design Philosophy**:
- Clean, minimal contact info layout
- Form fields use updated Input component (from Phase 02)
- Map visually cohesive with dusty rose theme

---

## Requirements

**Contact Info Section**:
- Icons: lucide-react line icons (strokeWidth: 1.5)
- Icon containers: rounded-full bg-primary/10
- Real-time status: "Đang Mở Cửa" or "Đã Đóng Cửa" based on business hours

**Contact Form**:
- Submit button: pill variant (rounded-full)
- Input fields: already updated in Phase 02
- Validation and error states

**Google Map** (if integrated):
- Custom styling: muted/retro theme
- Colors: cream background, dusty rose roads/water
- Simplified UI (minimal controls)

---

## Architecture

**Approach**: Update ContactPage components with new design system

**Real-time Status**: Calculate based on current time + business hours config

**Map Styling**: Custom Google Maps styles matching brand palette

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/ContactPage.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/contact/ContactForm.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/contact/ContactInfo.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/contact/GoogleMap.tsx` (if exists)

**Utilities**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/utils/business-hours.ts` (create)

---

## Implementation Steps

1. **Update ContactInfo Component**
   - Open `apps/client/src/components/contact/ContactInfo.tsx`
   - Replace icons with line icons:
     ```tsx
     import { MapPin, Phone, Mail, Clock } from 'lucide-react';

     <div className="space-y-6">
       {/* Address */}
       <div className="flex items-start gap-4">
         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
           <MapPin className="w-5 h-5 text-primary" strokeWidth={1.5} />
         </div>
         <div>
           <h4 className="font-sans font-semibold mb-1">Địa Chỉ</h4>
           <p className="text-sm text-muted-foreground">{businessInfo.address}</p>
         </div>
       </div>

       {/* Phone */}
       <div className="flex items-start gap-4">
         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
           <Phone className="w-5 h-5 text-primary" strokeWidth={1.5} />
         </div>
         <div>
           <h4 className="font-sans font-semibold mb-1">Điện Thoại</h4>
           <p className="text-sm text-muted-foreground">{businessInfo.phone}</p>
         </div>
       </div>

       {/* Email */}
       <div className="flex items-start gap-4">
         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
           <Mail className="w-5 h-5 text-primary" strokeWidth={1.5} />
         </div>
         <div>
           <h4 className="font-sans font-semibold mb-1">Email</h4>
           <p className="text-sm text-muted-foreground">{businessInfo.email}</p>
         </div>
       </div>
     </div>
     ```

2. **Add Real-Time Open/Closed Status**
   - Create `apps/client/src/utils/business-hours.ts`:
     ```typescript
     export function isBusinessOpen(): boolean {
       const now = new Date();
       const hours = now.getHours();
       const day = now.getDay();

       // Closed on Sundays (0)
       if (day === 0) return false;

       // Open 9 AM - 8 PM (Mon-Sat)
       return hours >= 9 && hours < 20;
     }

     export function getBusinessStatus(): {
       isOpen: boolean;
       message: string;
     } {
       const isOpen = isBusinessOpen();
       return {
         isOpen,
         message: isOpen ? 'Đang Mở Cửa' : 'Đã Đóng Cửa',
       };
     }
     ```

   - Add status indicator to ContactInfo:
     ```tsx
     import { getBusinessStatus } from '@/utils/business-hours';

     const { isOpen, message } = getBusinessStatus();

     {/* Hours with status */}
     <div className="flex items-start gap-4">
       <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
         <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
       </div>
       <div>
         <h4 className="font-sans font-semibold mb-1">Giờ Mở Cửa</h4>
         <p className="text-sm text-muted-foreground">9:00 AM - 8:00 PM</p>
         <span className={cn(
           "inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium",
           isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
         )}>
           {message}
         </span>
       </div>
     </div>
     ```

3. **Update Contact Form Submit Button**
   - Open `apps/client/src/components/contact/ContactForm.tsx`
   - Update button to pill variant:
     ```tsx
     <Button
       type="submit"
       size="lg"
       variant="pill"
       className="w-full md:w-auto"
       disabled={isSubmitting}
     >
       {isSubmitting ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}
     </Button>
     ```

4. **Add Google Map Custom Styling** (if map exists)
   - Create map styles config:
     ```typescript
     const mapStyles = [
       {
         featureType: 'all',
         elementType: 'geometry',
         stylers: [{ color: '#FDF8F5' }], // Cream background
       },
       {
         featureType: 'road',
         elementType: 'geometry',
         stylers: [
           { color: '#D1948B' }, // Dusty rose
           { lightness: 60 },
         ],
       },
       {
         featureType: 'water',
         elementType: 'geometry',
         stylers: [
           { color: '#D1948B' },
           { lightness: 80 },
         ],
       },
       {
         featureType: 'poi',
         elementType: 'labels',
         stylers: [{ visibility: 'off' }], // Hide POI labels
       },
       {
         featureType: 'transit',
         stylers: [{ visibility: 'off' }],
       },
     ];
     ```

   - Apply to GoogleMap component:
     ```tsx
     <GoogleMap
       options={{
         styles: mapStyles,
         disableDefaultUI: true,
         zoomControl: true,
         gestureHandling: 'cooperative',
       }}
       center={businessLocation}
       zoom={15}
     />
     ```

5. **Test Form Submission**
   - Fill out contact form
   - Verify validation works
   - Submit form
   - Check API request sent correctly

6. **Test Real-Time Status**
   - Test during business hours (9 AM - 8 PM)
   - Verify "Đang Mở Cửa" shown
   - Test outside hours
   - Verify "Đã Đóng Cửa" shown

7. **Test Mobile Layout**
   - Form fields stack vertically
   - Icons and text align correctly
   - Map responsive (if exists)

---

## Todo List

- [ ] Update ContactInfo with line icons (lucide-react)
- [ ] Add rounded-full containers for icons (bg-primary/10)
- [ ] Set icon strokeWidth to 1.5
- [ ] Create business-hours.ts utility
- [ ] Implement isBusinessOpen function
- [ ] Add real-time status indicator
- [ ] Test status during business hours (9 AM - 8 PM)
- [ ] Test status outside hours
- [ ] Update submit button to pill variant
- [ ] Verify Input components use Phase 02 styles
- [ ] Add Google Map custom styling (if map exists)
- [ ] Test form validation
- [ ] Test form submission
- [ ] Test mobile layout (stacked, responsive)
- [ ] Verify icon alignment on all screen sizes

---

## Success Criteria

**Technical**:
- [ ] Icons render correctly at all sizes
- [ ] Real-time status updates correctly by time
- [ ] Form submission works (API integration)
- [ ] Map loads without errors (if exists)

**Design**:
- [ ] Icons thin, minimalist (strokeWidth 1.5)
- [ ] Icon containers rounded, subtle background
- [ ] Submit button pill-shaped (rounded-full)
- [ ] Map harmonious with brand colors (if exists)

**UX**:
- [ ] Contact page cohesive with rest of site
- [ ] Form UX smooth, error-free
- [ ] Business hours accurate
- [ ] Mobile: form fields thumb-friendly

---

## Risk Assessment

**Low Risk**:
- Simple UI updates to existing components
- Business hours calculation straightforward

**Medium Risk** (if map styling):
- Google Maps API key required
- Custom styles may not render on all map types

**Mitigation**:
- Test map with various zoom levels
- Verify API key configured in .env

---

## Security Considerations

**Form Validation**:
- Client-side validation exists (Yup schema)
- Backend validation required (API already handles this)

**API Key**:
- Google Maps API key should be in .env
- Restrict API key to specific domains (production)

---

## Next Steps

After completion:
1. Verify all pages use consistent design system
2. Proceed to [Phase 12: Final Polish & Performance](./phase-12-final-polish-performance.md)
3. Cross-browser testing, performance optimization, accessibility audit

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 10 completion required
