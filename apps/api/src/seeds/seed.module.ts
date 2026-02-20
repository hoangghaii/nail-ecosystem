import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Service,
  ServiceSchema,
} from '../modules/services/schemas/service.schema';
import {
  GalleryCategory,
  GalleryCategorySchema,
} from '../modules/gallery-category/schemas/gallery-category.schema';
import {
  Gallery,
  GallerySchema,
} from '../modules/gallery/schemas/gallery.schema';
import {
  NailShape,
  NailShapeSchema,
} from '../modules/nail-options/schemas/nail-shape.schema';
import {
  NailStyle,
  NailStyleSchema,
} from '../modules/nail-options/schemas/nail-style.schema';
import {
  Booking,
  BookingSchema,
} from '../modules/bookings/schemas/booking.schema';
import {
  Contact,
  ContactSchema,
} from '../modules/contacts/schemas/contact.schema';
import { Banner, BannerSchema } from '../modules/banners/schemas/banner.schema';

import { ServicesSeeder } from './seeders/services.seeder';
import { GallerySeeder } from './seeders/gallery.seeder';
import { BookingsSeeder } from './seeders/bookings.seeder';
import { ContactsSeeder } from './seeders/contacts.seeder';
import { BannersSeeder } from './seeders/banners.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: GalleryCategory.name, schema: GalleryCategorySchema },
      { name: Gallery.name, schema: GallerySchema },
      { name: NailShape.name, schema: NailShapeSchema },
      { name: NailStyle.name, schema: NailStyleSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Contact.name, schema: ContactSchema },
      { name: Banner.name, schema: BannerSchema },
    ]),
  ],
  providers: [
    ServicesSeeder,
    GallerySeeder,
    BookingsSeeder,
    ContactsSeeder,
    BannersSeeder,
  ],
  exports: [
    ServicesSeeder,
    GallerySeeder,
    BookingsSeeder,
    ContactsSeeder,
    BannersSeeder,
  ],
})
export class SeedModule {}
