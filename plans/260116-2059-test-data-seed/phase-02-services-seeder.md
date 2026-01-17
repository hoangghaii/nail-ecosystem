# Phase 2: Services Seeder

**Duration**: 20 minutes
**Dependencies**: Phase 1 (utilities)

---

## Overview

Create realistic nail service data (18 services across 5 categories). Services are foundation for Bookings references.

---

## Service Categories

1. **Manicure** (5 services) - Classic, Gel, French, Deluxe, Express
2. **Pedicure** (5 services) - Classic, Gel, Spa Deluxe, Express, Hot Stone
3. **Nail Art** (3 services) - Custom, Ombre, 3D Design
4. **Extensions** (4 services) - Acrylic Full/Fill, Dip Powder, Gel
5. **Spa** (2 services) - Paraffin Wax, Hand & Foot Massage

---

## Files to Create

### 1. Services Data

**File**: `apps/api/src/seeds/data/services.data.ts`

```typescript
export const servicesData = [
  // Manicure (5 services)
  {
    name: 'Classic Manicure',
    description: 'Traditional manicure with nail shaping, cuticle care, hand massage, and polish application',
    category: 'manicure',
    price: 25,
    duration: 30,
    featured: true,
    isActive: true,
    sortIndex: 0,
  },
  {
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish with LED curing for 2-3 weeks of chip-free shine',
    category: 'manicure',
    price: 40,
    duration: 45,
    featured: true,
    isActive: true,
    sortIndex: 1,
  },
  {
    name: 'French Manicure',
    description: 'Classic French tips with natural pink base and white tips for timeless elegance',
    category: 'manicure',
    price: 35,
    duration: 40,
    featured: false,
    isActive: true,
    sortIndex: 2,
  },
  {
    name: 'Deluxe Manicure with Spa',
    description: 'Premium manicure with exfoliating scrub, hydrating mask, and extended massage',
    category: 'manicure',
    price: 50,
    duration: 60,
    featured: false,
    isActive: true,
    sortIndex: 3,
  },
  {
    name: 'Express Manicure',
    description: 'Quick nail shaping and polish for on-the-go beauty',
    category: 'manicure',
    price: 20,
    duration: 20,
    featured: false,
    isActive: true,
    sortIndex: 4,
  },

  // Pedicure (5 services)
  {
    name: 'Classic Pedicure',
    description: 'Traditional pedicure with nail trimming, callus removal, and polish',
    category: 'pedicure',
    price: 35,
    duration: 45,
    featured: true,
    isActive: true,
    sortIndex: 5,
  },
  {
    name: 'Gel Pedicure',
    description: 'Long-lasting gel polish pedicure with LED curing for lasting shine',
    category: 'pedicure',
    price: 50,
    duration: 60,
    featured: true,
    isActive: true,
    sortIndex: 6,
  },
  {
    name: 'Spa Pedicure Deluxe',
    description: 'Luxury spa pedicure with sugar scrub, mud mask, hot towel wrap, and extended massage',
    category: 'pedicure',
    price: 65,
    duration: 75,
    featured: true,
    isActive: true,
    sortIndex: 7,
  },
  {
    name: 'Express Pedicure',
    description: 'Quick pedicure with nail care and polish application',
    category: 'pedicure',
    price: 30,
    duration: 30,
    featured: false,
    isActive: true,
    sortIndex: 8,
  },
  {
    name: 'Hot Stone Pedicure',
    description: 'Therapeutic pedicure with heated stones for deep relaxation and improved circulation',
    category: 'pedicure',
    price: 75,
    duration: 90,
    featured: false,
    isActive: true,
    sortIndex: 9,
  },

  // Nail Art (3 services)
  {
    name: 'Custom Nail Art',
    description: 'Personalized nail art designs created by our expert technicians',
    category: 'nail-art',
    price: 60,
    duration: 60,
    featured: true,
    isActive: true,
    sortIndex: 10,
  },
  {
    name: 'Ombre Nails',
    description: 'Trendy gradient color blend from light to dark for stunning visual effect',
    category: 'nail-art',
    price: 55,
    duration: 50,
    featured: false,
    isActive: true,
    sortIndex: 11,
  },
  {
    name: '3D Nail Design',
    description: 'Intricate 3D designs with gems, rhinestones, and sculptured elements',
    category: 'nail-art',
    price: 80,
    duration: 90,
    featured: false,
    isActive: true,
    sortIndex: 12,
  },

  // Extensions (4 services)
  {
    name: 'Acrylic Full Set',
    description: 'Complete acrylic nail extensions for length and strength',
    category: 'extensions',
    price: 70,
    duration: 90,
    featured: true,
    isActive: true,
    sortIndex: 13,
  },
  {
    name: 'Acrylic Fill',
    description: 'Acrylic fill to maintain your existing acrylic nails',
    category: 'extensions',
    price: 45,
    duration: 60,
    featured: false,
    isActive: true,
    sortIndex: 14,
  },
  {
    name: 'Dip Powder Full Set',
    description: 'Durable dip powder nails with vitamin-enriched formula',
    category: 'extensions',
    price: 65,
    duration: 75,
    featured: false,
    isActive: true,
    sortIndex: 15,
  },
  {
    name: 'Gel Extension',
    description: 'Natural-looking gel extensions for elegant length',
    category: 'extensions',
    price: 80,
    duration: 90,
    featured: false,
    isActive: true,
    sortIndex: 16,
  },

  // Spa (2 services)
  {
    name: 'Paraffin Wax Treatment',
    description: 'Moisturizing paraffin wax treatment for soft, hydrated hands and feet',
    category: 'spa',
    price: 15,
    duration: 20,
    featured: false,
    isActive: true,
    sortIndex: 17,
  },
  {
    name: 'Hand & Foot Massage',
    description: 'Relaxing therapeutic massage for hands and feet',
    category: 'spa',
    price: 25,
    duration: 30,
    featured: false,
    isActive: true,
    sortIndex: 18,
  },
];
```

---

### 2. Services Seeder

**File**: `apps/api/src/seeds/seeders/services.seeder.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from '../../modules/services/schemas/service.schema';
import { servicesData } from '../data/services.data';

@Injectable()
export class ServicesSeeder {
  private readonly logger = new Logger(ServicesSeeder.name);

  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}

  async seed(): Promise<Service[]> {
    this.logger.log('Seeding services...');

    // Check if services already exist
    const existingCount = await this.serviceModel.countDocuments();
    if (existingCount > 0) {
      this.logger.warn(`⚠️  ${existingCount} services already exist. Skipping seed.`);
      this.logger.log('   Use --drop flag to reset data.');
      const existing = await this.serviceModel.find().exec();
      return existing;
    }

    const services = await this.serviceModel.insertMany(servicesData);

    this.logger.log(`✅ Created ${services.length} services`);
    return services;
  }
}
```

---

### 3. Update Seed Module

**File**: `apps/api/src/seeds/seed.module.ts` (update)

```typescript
import { ServicesSeeder } from './seeders/services.seeder';

@Module({
  // ... existing imports
  providers: [ServicesSeeder],
  exports: [ServicesSeeder],
})
export class SeedModule {}
```

---

### 4. Update Main Seed Script

**File**: `apps/api/src/seeds/seed-test-data.ts` (update)

```typescript
import { ServicesSeeder } from './seeders/services.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Get seeders
    const servicesSeeder = app.select(SeedModule).get(ServicesSeeder);

    // Check for --drop flag
    const shouldDrop = process.argv.includes('--drop');
    if (shouldDrop) {
      logger.warn('⚠️  Dropping existing test data collections...');
      await dropCollections();
      logger.log('✅ Collections dropped');
    }

    logger.log('🌱 Starting seed process...\n');

    // Seed services
    const services = await servicesSeeder.seed();

    logger.log('\n🎉 Test data seeded successfully!');
    logger.log(`\n📊 Summary:`);
    logger.log(`   - Services: ${services.length}`);
    logger.log(`   - TOTAL: ${services.length} records\n`);

  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}
```

---

## Testing

```bash
cd apps/api
npm run seed:test

# Expected output:
# 🌱 Starting seed process...
#
# Seeding services...
# ✅ Created 18 services
#
# 🎉 Test data seeded successfully!
# 📊 Summary:
#    - Services: 18
#    - TOTAL: 18 records
```

---

## Success Criteria

- [ ] 18 services created across 5 categories
- [ ] All required fields populated
- [ ] Featured services properly marked (6 featured)
- [ ] Sort index sequential (0-17)
- [ ] Prices realistic ($15-$80 range)
- [ ] Durations realistic (20-90 minutes)
- [ ] Skip seeding if services already exist
