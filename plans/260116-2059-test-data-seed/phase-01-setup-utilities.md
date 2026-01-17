# Phase 1: Setup & Utilities

**Duration**: 30 minutes
**Dependencies**: None

---

## Overview

Create seed script infrastructure and data generation utilities for realistic Vietnamese nail salon test data.

---

## Files to Create

### 1. Main Seed Script

**File**: `apps/api/src/seeds/seed-test-data.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';

const logger = new Logger('SeedTestData');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Check for --drop flag
    const shouldDrop = process.argv.includes('--drop');

    if (shouldDrop) {
      logger.warn('⚠️  Dropping existing test data collections...');
      await dropCollections();
    }

    // Seed in dependency order
    logger.log('🌱 Starting seed process...\n');

    // Steps will be added in later phases

    logger.log('\n🎉 Test data seeded successfully!');
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

async function dropCollections() {
  const collections = [
    'services',
    'gallerycategories',
    'galleries',
    'bookings',
    'contacts',
    'banners'
  ];

  for (const collection of collections) {
    try {
      await mongoose.connection.db.dropCollection(collection);
      logger.log(`   ✓ Dropped ${collection}`);
    } catch (error) {
      // Collection doesn't exist, ignore
    }
  }
}

bootstrap();
```

---

### 2. Data Generators Utility

**File**: `apps/api/src/seeds/utils/data-generators.ts`

```typescript
/**
 * Random selection helper
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Random date within range
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

/**
 * Vietnamese name data
 */
const FIRST_NAMES = {
  female: [
    'Linh', 'Mai', 'Hương', 'Ngọc', 'Lan', 'Thu', 'Hà', 'Trang', 'Anh', 'Phương',
    'Thảo', 'My', 'Hạnh', 'Nhung', 'Diệu', 'Kim', 'Loan', 'Quỳnh', 'Thanh', 'Trinh',
    'Hồng', 'Hoa', 'Hằng', 'Tâm', 'Yến', 'Xuân', 'Thu', 'Đông', 'Hạ', 'Bảo'
  ],
  male: [
    'Minh', 'Nam', 'Hùng', 'Tuấn', 'Dũng', 'Long', 'Hải', 'Khoa', 'Quang', 'Phúc',
    'Tài', 'Bình', 'Cường', 'Đức', 'Hoàng', 'Khánh', 'Sơn', 'Thành', 'Trung', 'Vinh',
    'An', 'Huy', 'Tâm', 'Nhân', 'Thiện', 'Tân', 'Toàn', 'Vũ', 'Đạt', 'Kiên'
  ],
};

const LAST_NAMES = [
  'Nguyễn', 'Nguyễn', 'Nguyễn', 'Nguyễn', // 40% Nguyễn
  'Trần', 'Trần',                           // 12% Trần
  'Lê',                                     // 10% Lê
  'Phạm',                                   // 8% Phạm
  'Hoàng',                                  // 7% Hoàng
  'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý' // 23% others
];

/**
 * Generate Vietnamese name (mostly female for nail salon context)
 */
export function generateVietnameseName() {
  const isFemale = Math.random() > 0.15; // 85% female customers
  const firstName = randomItem(
    isFemale ? FIRST_NAMES.female : FIRST_NAMES.male
  );
  const lastName = randomItem(LAST_NAMES);

  return { firstName, lastName };
}

/**
 * Generate Vietnamese phone number
 * Format: (0|+84)(3|5|7|8|9)XXXXXXXX
 */
export function generateVietnamesePhone(): string {
  const prefixes = ['090', '091', '093', '097', '098', '032', '033', '034', '035', '070', '079', '077', '076', '078', '089', '088', '083', '084', '085', '081', '082', '086', '087'];
  const prefix = randomItem(prefixes);
  const suffix = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0');

  // 30% use +84 format, 70% use 0 format
  if (Math.random() > 0.7) {
    return `+84${prefix.substring(1)}${suffix}`;
  }
  return `${prefix}${suffix}`;
}

/**
 * Generate email from name
 */
export function generateEmail(firstName: string, lastName: string): string {
  const domains = [
    'gmail.com', 'gmail.com', 'gmail.com', 'gmail.com', 'gmail.com', // 50%
    'yahoo.com', 'yahoo.com',                                         // 20%
    'outlook.com', 'outlook.com',                                     // 15%
    'icloud.com',                                                     // 10%
    'hotmail.com',                                                    // 5%
  ];

  const cleanFirst = firstName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z]/g, '');

  const cleanLast = lastName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');

  const domain = randomItem(domains);

  // Variations: firstname.lastname, firstnamelastname, lastname.firstname
  const patterns = [
    `${cleanFirst}.${cleanLast}`,
    `${cleanFirst}${cleanLast}`,
    `${cleanLast}.${cleanFirst}`,
    `${cleanFirst}.${cleanLast}${Math.floor(Math.random() * 99)}`,
  ];

  return `${randomItem(patterns)}@${domain}`;
}

/**
 * Weighted random selection
 */
export function weightedRandom<T>(
  items: Array<{ item: T; weight: number }>
): T {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { item, weight } of items) {
    if (random < weight) return item;
    random -= weight;
  }

  return items[0].item;
}

/**
 * San Francisco Bay Area addresses
 */
export const SF_BAY_ADDRESSES = [
  '123 Beauty Lane, San Francisco, CA 94102',
  '456 Nail Art Avenue, Oakland, CA 94612',
  '789 Spa Boulevard, San Jose, CA 95113',
  '321 Salon Street, Berkeley, CA 94704',
  '654 Pedicure Drive, Palo Alto, CA 94301',
  '987 Manicure Way, Fremont, CA 94536',
  '147 Polish Plaza, Hayward, CA 94541',
  '258 Glam Court, Sunnyvale, CA 94086',
  '369 Style Circle, Mountain View, CA 94043',
  '741 Chic Lane, Redwood City, CA 94063',
  '852 Beauty Boulevard, Daly City, CA 94014',
  '963 Nail Street, San Mateo, CA 94401',
  '159 Spa Avenue, Milpitas, CA 95035',
  '357 Salon Court, Union City, CA 94587',
  '486 Polish Way, San Leandro, CA 94577',
];
```

---

### 3. Seed Module

**File**: `apps/api/src/seeds/seed.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from '../modules/services/schemas/service.schema';
import { GalleryCategory, GalleryCategorySchema } from '../modules/gallery-category/schemas/gallery-category.schema';
import { Gallery, GallerySchema } from '../modules/gallery/schemas/gallery.schema';
import { Booking, BookingSchema } from '../modules/bookings/schemas/booking.schema';
import { Contact, ContactSchema } from '../modules/contacts/schemas/contact.schema';
import { Banner, BannerSchema } from '../modules/banners/schemas/banner.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: GalleryCategory.name, schema: GalleryCategorySchema },
      { name: Gallery.name, schema: GallerySchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Contact.name, schema: ContactSchema },
      { name: Banner.name, schema: BannerSchema },
    ]),
  ],
  providers: [],
  exports: [],
})
export class SeedModule {}
```

---

### 4. Package.json Scripts

**File**: `apps/api/package.json` (add scripts)

```json
{
  "scripts": {
    "seed:test": "ts-node -r tsconfig-paths/register src/seeds/seed-test-data.ts",
    "seed:test:drop": "ts-node -r tsconfig-paths/register src/seeds/seed-test-data.ts --drop"
  }
}
```

---

## Testing

```bash
# Test script execution (no seeding yet, just infrastructure)
cd apps/api
npm run seed:test

# Should output:
# 🌱 Starting seed process...
# 🎉 Test data seeded successfully!
```

---

## Success Criteria

- [ ] Seed script runs without errors
- [ ] `--drop` flag properly drops collections
- [ ] Data generators produce realistic Vietnamese data
- [ ] Email generator handles diacritics correctly
- [ ] Phone numbers match Vietnamese format
- [ ] Random helpers work correctly
