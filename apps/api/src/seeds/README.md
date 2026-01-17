# Test Data Seeding

Comprehensive test data seeding for Pink Nail Salon database.

## Overview

Seeds realistic Vietnamese nail salon data across 5 collections:
- **Services** (19 records) - Nail services with categories, pricing
- **Gallery Categories** (6 records) - Photo gallery categories
- **Gallery Items** (39 records) - Nail art photos with category refs
- **Bookings** (40 records) - Customer appointments with various statuses
- **Contacts** (40 records) - Contact form submissions
- **Banners** (25 records) - Homepage hero banners (22 images, 3 videos)

**Total:** ~169 records

## Quick Start

```bash
# Seed test data (safe - skips existing)
npm run seed:test

# Re-seed (drops collections first)
npm run seed:test:drop
```

## Features

### Data Quality
- Realistic Vietnamese names (40+ first names, 13 last names)
- Valid Vietnamese phone format: `(090|091|093|097|098|032|033|034)XXXXXXX`
- Temporal distribution (past 90 days + future 30 days)
- Status distribution matching real usage patterns
- Proper foreign key relationships

### Idempotent Design
- Safe to run multiple times
- Skips seeding if data exists
- Use `--drop` flag for clean re-seed

### Dependency-Aware
Seeds in correct order:
1. Services → Bookings (requires Services)
2. Gallery Categories → Gallery (requires Categories)
3. Contacts, Banners (independent)

## Data Breakdown

### Services (19 records)
- Manicure (5): Classic, Gel, French, Deluxe, Express
- Pedicure (5): Classic, Gel, Spa Deluxe, Express, Hot Stone
- Nail Art (3): Custom, Ombre, 3D
- Extensions (4): Acrylic Full/Fill, Dip Powder, Gel
- Spa (2): Paraffin Wax, Hand & Foot Massage

### Gallery Categories (6 records)
- Manicure, Pedicure, Nail Art, Extensions
- Special Occasions, Seasonal Collections

### Bookings (40 records)
- Status: 60% completed, 15% confirmed, 15% pending, 10% cancelled
- Date range: Last 90 days (past) + next 30 days (future)
- Time slots: 09:00-18:00
- All reference existing Services

### Contacts (40 records)
- Status: 20% new, 25% read, 40% responded, 15% archived
- Categories: booking (30%), service (25%), pricing (20%), complaints (15%), general (10%)
- 70% include phone numbers
- Responded/archived include admin notes

### Banners (25 records)
- 90% image banners, 10% video banners
- 80% active, 20% inactive
- 1 primary banner
- Placeholder images (picsum.photos)

## Scripts Overview

### Main Script
`src/seeds/seed-test-data.ts` - Entry point, orchestrates seeding

### Seeders
- `seeders/services.seeder.ts` - Services data
- `seeders/gallery.seeder.ts` - Categories & gallery items
- `seeders/bookings.seeder.ts` - Appointment bookings
- `seeders/contacts.seeder.ts` - Contact form messages
- `seeders/banners.seeder.ts` - Homepage banners

### Utilities
- `utils/data-generators.ts` - Vietnamese names, phones, emails, random helpers

### Data
- `data/services.data.ts` - 19 service definitions
- `data/gallery-categories.data.ts` - 6 category definitions

## Usage Examples

```bash
# First time seed
npm run seed:test

# Output:
# 🌱 Starting seed process...
# ✅ Created 19 services
# ✅ Created 6 gallery categories
# ✅ Created 39 gallery items
# ✅ Created 40 bookings
# ✅ Created 40 contacts
# ✅ Created 25 banners
# 🎉 All test data seeded successfully!

# Re-run (safe - skips existing)
npm run seed:test
# ℹ️  Services already exist (19 found). Skipping...
# ℹ️  Gallery categories already exist (6 found). Skipping...

# Clean re-seed
npm run seed:test:drop
# ⚠️  Dropping existing test data collections...
# ✓ Dropped services
# ✓ Dropped gallerycategories
# ...
```

## Implementation Details

### Vietnamese Name Generation
- 40+ first names (male/female)
- 13 last names with realistic distribution (Nguyễn 40%, Trần 12%, etc.)
- Proper diacritic handling for emails

### Phone Numbers
Format: `0[90|91|93|97|98|32|33|34]XXXXXXX`
- All major Vietnamese mobile prefixes
- 10 digits total

### Dates
- Bookings: 70% past (completed/cancelled), 30% future (pending/confirmed)
- Contacts: Last 60 days only

### Status Distribution
Weighted random selection matching real patterns:
- Completed bookings: 60%
- Confirmed: 15%
- Pending: 15%
- Cancelled: 10%

## Troubleshooting

**Duplicate key errors:**
```bash
# Solution: Use --drop flag
npm run seed:test:drop
```

**MongoDB not running:**
```bash
# Check containers
docker ps

# Start if needed
docker compose up -d
```

**Missing collections after seed:**
```bash
# Verify in logs
npm run seed:test 2>&1 | grep "Created"
```

## Future Enhancements

1. **Real Images** - Replace picsum.photos with Cloudinary URLs
2. **Incremental Seeding** - Seed specific collections only
3. **CSV Import** - Load data from CSV files
4. **Production Seed** - Separate production vs test data

## Notes

- All data is test data with placeholder images
- Vietnamese names use proper UTF-8 encoding
- Email addresses generated from names (normalized)
- Safe to run in development/staging environments
- NOT intended for production use
