# Phase 10: Homepage Polish

**Date**: Weeks 19-20 (2026-06-20 to 2026-07-03)
**Priority**: High (P1)
**Status**: Implementation Ready
**Review**: Pending

---

## Context Links

- **Parent Plan**: [plan.md](./plan.md)
- **Dependencies**: [Phase 09: Confetti & Success States](./phase-09-confetti-success-states.md)
- **Research**: [researcher-01-design-patterns.md](./research/researcher-01-design-patterns.md)
- **Blueprint**: [UI-upgrade.md](/Users/hainguyen/Documents/nail-project/requirements/UI-upgrade.md) - Hero, Lookbook, About sections
- **Next Phase**: [phase-11-contact-page-redesign.md](./phase-11-contact-page-redesign.md)

---

## Key Insights

**Blueprint Requirements**:
- Hero: "Nơi bộ móng trở thành tác phẩm" with serif font
- Lookbook Highlight: 6 featured items in asymmetric grid
- About: Brand story "Chúng tôi không chỉ đắp móng..."
- Spacing: 100px+ between sections (premium feel)

**Design Patterns**:
- Typography: Playfair Display for headings (high-fashion feel)
- Section spacing: 6rem-8rem (96px-128px)
- Hero CTA: "Khám Phá Lookbook" with glow effect
- Staggered animations for visual interest

---

## Requirements

**Sections to Update**:
1. Hero Section - Typography + CTA styling
2. Lookbook Highlight - New section showing 6 featured gallery items
3. About Section - Brand story + features list
4. Service Highlight - Apply new typography (existing section)

**Design Specs**:
- Hero title: font-serif, text-5xl-7xl, font-bold
- Section spacing: space-y-24 md:space-y-32 (96px-128px)
- Lookbook grid: 2 cols mobile, 3 cols desktop, first item spans 2x2
- About: Two-column layout (image + content)

---

## Architecture

**Approach**: Update existing HomePage.tsx sections, create new LookbookHighlight component

**Animation Strategy**: Motion stagger for Lookbook items (0.1s delay between)

---

## Related Code Files

**Files to Modify**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/pages/HomePage.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/home/HeroSection.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/home/AboutSection.tsx`
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/home/ServiceHighlight.tsx`

**Files to Create**:
- `/Users/hainguyen/Documents/nail-project/apps/client/src/components/home/LookbookHighlight.tsx`

---

## Implementation Steps

1. **Update Hero Section**
   - Open `apps/client/src/components/home/HeroSection.tsx`
   - Apply Playfair Display to main heading:
     ```tsx
     <motion.h1
       className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-center"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6 }}
     >
       Nơi Bộ Móng Trở Thành Tác Phẩm
     </motion.h1>

     <motion.p
       className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, delay: 0.2 }}
     >
       Nail art studio cao cấp - Nơi sự sáng tạo gặp gỡ nghệ thuật
     </motion.p>

     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, delay: 0.4 }}
     >
       <Button
         size="lg"
         className="rounded-[16px] shadow-glow hover:scale-105 transition-transform"
         onClick={() => navigate('/gallery')}
       >
         Khám Phá Lookbook
       </Button>
     </motion.div>
     ```

2. **Create Lookbook Highlight Section**
   - Create `apps/client/src/components/home/LookbookHighlight.tsx`:
     ```tsx
     import { motion } from 'motion/react';
     import { useNavigate } from 'react-router-dom';
     import { ArrowRight } from 'lucide-react';
     import { cn } from '@repo/utils/cn';
     import { Button } from '@/components/ui/button';

     export function LookbookHighlight() {
       const navigate = useNavigate();
       // Fetch 6 featured gallery items
       const { data: gallery = [] } = useGallery({ featured: true, limit: 6 });

       return (
         <section className="py-24 bg-background">
           <div className="container mx-auto px-4">
             <div className="text-center mb-12">
               <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
                 Bộ Sưu Tập Mới Nhất
               </h2>
               <p className="font-sans text-lg text-muted-foreground">
                 Những mẫu móng nghệ thuật được yêu thích nhất
               </p>
             </div>

             {/* Asymmetric Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
               {gallery.map((item, index) => (
                 <motion.div
                   key={item._id}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.1 }}
                   onClick={() => navigate('/gallery')}
                   className={cn(
                     "relative overflow-hidden rounded-[20px] group cursor-pointer",
                     index === 0 && "md:col-span-2 md:row-span-2" // First item larger
                   )}
                 >
                   <img
                     src={item.imageUrl}
                     alt={item.title}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 </motion.div>
               ))}
             </div>

             <div className="text-center">
               <Button
                 variant="outline"
                 size="lg"
                 className="rounded-[16px] group"
                 onClick={() => navigate('/gallery')}
               >
                 Xem Toàn Bộ Lookbook
                 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
             </div>
           </div>
         </section>
       );
     }
     ```

3. **Update About Section**
   - Open `apps/client/src/components/home/AboutSection.tsx`
   - Apply new typography and layout:
     ```tsx
     <section className="py-24 bg-secondary/30">
       <div className="container mx-auto px-4">
         <div className="grid md:grid-cols-2 gap-12 items-center">
           <div className="relative">
             <img
               src="/about-image.jpg"
               alt="Pink Nail Art Studio"
               className="rounded-[24px] shadow-soft-lg"
             />
           </div>

           <div className="space-y-6">
             <h2 className="font-serif text-4xl md:text-5xl font-semibold">
               Chúng Tôi Không Chỉ Đắp Móng,<br />
               Chúng Tôi Tạo Ra Sự Tự Tin
             </h2>

             <p className="font-sans text-lg text-muted-foreground leading-relaxed">
               Tại Pink Nail Art Studio, mỗi bộ móng là một tác phẩm nghệ thuật được
               chăm chút tỉ mỉ bởi những nghệ nhân tài hoa.
             </p>

             <ul className="space-y-4">
               {[
                 { title: 'Nguyên Liệu Cao Cấp', desc: 'Sơn và phụ kiện nhập khẩu' },
                 { title: 'Kỹ Thuật Vẽ Tay', desc: 'Nghệ nhân 5+ năm kinh nghiệm' },
                 { title: 'Vệ Sinh Chuẩn Y Khoa', desc: 'Dụng cụ sát trùng sau mỗi khách' },
               ].map((feature) => (
                 <li key={feature.title} className="flex items-start gap-3">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                     <Check className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                     <h4 className="font-sans font-semibold mb-1">{feature.title}</h4>
                     <p className="text-sm text-muted-foreground">{feature.desc}</p>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </div>
     </section>
     ```

4. **Update Section Spacing**
   - Open `apps/client/src/pages/HomePage.tsx`
   - Apply consistent spacing between sections:
     ```tsx
     <div className="space-y-24 md:space-y-32">
       <HeroSection />
       <LookbookHighlight />
       <AboutSection />
       <ServiceHighlight />
     </div>
     ```

5. **Update Service Highlight Typography**
   - Apply font-serif to service section headings
   - Ensure consistent card styling

6. **Test Responsive Layout**
   - Test at 375px (mobile)
   - Test at 768px (tablet)
   - Test at 1440px (desktop)
   - Verify spacing feels premium (not cramped)

7. **Test Animations**
   - Verify stagger effect on Lookbook items
   - Check smooth scroll behavior
   - Test whileInView triggers correctly

---

## Todo List

- [ ] Update Hero title to font-serif
- [ ] Add Motion animations to Hero elements
- [ ] Update Hero CTA button styling (glow effect)
- [ ] Create LookbookHighlight component
- [ ] Fetch 6 featured gallery items
- [ ] Implement asymmetric grid (first item 2x2)
- [ ] Add stagger animations to Lookbook items
- [ ] Update About section typography
- [ ] Add features list with checkmarks
- [ ] Update section spacing (space-y-24 md:space-y-32)
- [ ] Test responsive layout (375px, 768px, 1440px)
- [ ] Verify 100px+ spacing between sections
- [ ] Test stagger animations
- [ ] Test CTA buttons navigate correctly
- [ ] Verify images lazy load
- [ ] Test on mobile (sections stack gracefully)

---

## Success Criteria

**Technical**:
- [ ] All sections render without errors
- [ ] Animations smooth (60fps)
- [ ] Images lazy load below fold
- [ ] Navigation works correctly

**Design**:
- [ ] Typography matches spec (Playfair Display headings)
- [ ] Spacing feels premium (100px+ between sections)
- [ ] Lookbook grid asymmetric (first item larger)
- [ ] About section two-column on desktop

**UX**:
- [ ] Homepage feels premium and inviting
- [ ] Clear visual hierarchy
- [ ] CTAs drive traffic to gallery/booking
- [ ] Page load time <2s

---

## Risk Assessment

**Low Risk**:
- Updates to existing sections (no breaking changes)

**Mitigation**:
- Test each section independently
- Verify no layout shift (CLS <0.1)

---

## Security Considerations

**N/A** - Homepage UI has no security implications

---

## Next Steps

After completion:
1. Verify homepage drives traffic to gallery
2. Proceed to [Phase 11: Contact Page Redesign](./phase-11-contact-page-redesign.md)
3. Apply design system to Contact page

---

**Phase Status**: Ready for Implementation
**Estimated Effort**: 2 weeks
**Blocking**: Phase 09 completion required
