import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeedModule } from './seed.module';
import { ServicesSeeder } from './seeders/services.seeder';
import { GallerySeeder } from './seeders/gallery.seeder';
import { BookingsSeeder } from './seeders/bookings.seeder';
import { ContactsSeeder } from './seeders/contacts.seeder';
import { BannersSeeder } from './seeders/banners.seeder';
import * as mongoose from 'mongoose';

const logger = new Logger('SeedTestData');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Get seeders
    const servicesSeeder = app.select(SeedModule).get(ServicesSeeder);
    const gallerySeeder = app.select(SeedModule).get(GallerySeeder);
    const bookingsSeeder = app.select(SeedModule).get(BookingsSeeder);
    const contactsSeeder = app.select(SeedModule).get(ContactsSeeder);
    const bannersSeeder = app.select(SeedModule).get(BannersSeeder);

    // Check for --drop flag
    const shouldDrop = process.argv.includes('--drop');

    if (shouldDrop) {
      logger.warn('⚠️  Dropping existing test data collections...');
      await dropCollections();
      logger.log('✅ Collections dropped');
    }

    // Seed in dependency order
    logger.log('🌱 Starting seed process...\n');

    const services = await servicesSeeder.seed();
    const categories = await gallerySeeder.seedCategories();
    const gallery = await gallerySeeder.seedGalleryItems(categories);
    const bookings = await bookingsSeeder.seed(40);
    const contacts = await contactsSeeder.seed(40);
    const banners = await bannersSeeder.seed(25);

    logger.log('\n🎉 All test data seeded successfully!');
    logger.log(`\n📊 Summary:`);
    logger.log(`   - Services: ${services.length}`);
    logger.log(`   - Gallery Categories: ${categories.length}`);
    logger.log(`   - Gallery Items: ${gallery.length}`);
    logger.log(`   - Bookings: ${bookings.length}`);
    logger.log(`   - Contacts: ${contacts.length}`);
    logger.log(`   - Banners: ${banners.length}`);
    logger.log(
      `   - TOTAL: ${services.length + categories.length + gallery.length + bookings.length + contacts.length + banners.length} records\n`,
    );
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
    'banners',
  ];

  for (const collection of collections) {
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropCollection(collection);
        logger.log(`   ✓ Dropped ${collection}`);
      }
    } catch (error) {
      // Collection doesn't exist, ignore
    }
  }
}

bootstrap();
