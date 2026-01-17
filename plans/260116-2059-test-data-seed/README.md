# Test Data Seed Plan - Quick Reference

**Plan ID**: 260116-2059-test-data-seed
**Status**: Ready for Implementation
**Estimated Duration**: 2-3 hours

---

## Quick Start

```bash
# Read main plan
cat plans/260116-2059-test-data-seed/plan.md

# Implement phases in order
# Phase 1: Setup & utilities (30 min)
# Phase 2: Services seeder (20 min)
# Phase 3: Gallery seeder (30 min)
# Phase 4: Bookings seeder (30 min)
# Phase 5: Contacts seeder (25 min)
# Phase 6: Banners seeder (20 min)
# Phase 7: Integration & CLI (25 min)
# Phase 8: API verification (20 min)

# After implementation - Usage
cd apps/api
npm run seed:test         # Seed all data
npm run seed:test:drop    # Drop & re-seed
npm run seed:verify       # Verify via API
```

---

## Scope Summary

Generate realistic test data for 5 features:

1. **Services** (18 records) - Nail services across 5 categories
2. **Gallery Categories** (6-8 records) - Photo categories
3. **Gallery Items** (30-50 records) - Nail art photos
4. **Bookings** (30-50 records) - Customer appointments
5. **Contacts** (30-50 records) - Contact form messages
6. **Banners** (20-30 records) - Hero banners (image/video)

**Total**: ~150-200 realistic records

---

## Key Features

- **Realistic Vietnamese data**: Names, phones, addresses
- **Dual approach**: MongoDB seed + API verification
- **Idempotent**: Use `--drop` flag to reset
- **Fast**: <10 seconds full seed
- **Dependencies respected**: Services → Bookings, Categories → Gallery

---

## File Structure

```
plans/260116-2059-test-data-seed/
├── README.md                      # This file
├── plan.md                        # Complete implementation plan
├── phase-01-setup-utilities.md   # Infrastructure & helpers
└── phase-02-services-seeder.md   # Services data seeder
```

---

## Success Criteria

- [ ] 150-200 total records seeded
- [ ] Vietnamese names/phones/addresses realistic
- [ ] Temporal distribution (past 90 days, future 30 days)
- [ ] Status distributions match specs
- [ ] Dependencies respected (no orphaned refs)
- [ ] API verification passes
- [ ] Execution time <10 seconds
- [ ] Idempotent with `--drop` flag

---

## Quick Reference

**User Requirements**:
- Features: Gallery, Bookings, Contacts, Banners
- Data quality: Realistic Vietnamese salon data
- Method: MongoDB seed + API verification

**Implementation Phases**:
1. Setup & utilities → Data generators, helpers
2. Services → Foundation for Bookings
3. Gallery → Categories + Items
4. Bookings → Customer appointments
5. Contacts → Form submissions
6. Banners → Hero images/videos
7. Integration → Module + CLI
8. Verification → API checks

---

**Next**: Read `plan.md` for complete implementation details
