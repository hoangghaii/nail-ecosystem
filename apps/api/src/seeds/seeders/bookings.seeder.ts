import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../../modules/bookings/schemas/booking.schema';
import { Service } from '../../modules/services/schemas/service.schema';
import {
  randomItem,
  randomDate,
  generateVietnameseName,
  generateVietnamesePhone,
  generateEmail,
  weightedRandom,
} from '../utils/data-generators';

@Injectable()
export class BookingsSeeder {
  private readonly logger = new Logger(BookingsSeeder.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}

  async seed(count: number = 40): Promise<Booking[]> {
    this.logger.log('Seeding bookings...');

    // Get all services
    const services = await this.serviceModel.find().exec();
    if (services.length === 0) {
      throw new Error('No services found. Seed services first.');
    }

    const bookings: Array<{
      serviceId: any;
      date: Date;
      timeSlot: string;
      customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
      };
      notes?: string;
      status: string;
    }> = [];
    const now = new Date();
    const pastDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days ahead

    const statuses = [
      { weight: 24, value: 'completed' }, // 60%
      { weight: 6, value: 'confirmed' }, // 15%
      { weight: 6, value: 'pending' }, // 15%
      { weight: 4, value: 'cancelled' }, // 10%
    ];

    const timeSlots = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    for (let i = 0; i < count; i++) {
      const { firstName, lastName } = generateVietnameseName('female'); // Most nail salon customers are female
      const status = weightedRandom(statuses);

      // Past dates for completed/cancelled, future for pending/confirmed
      let date: Date;
      if (status === 'completed' || status === 'cancelled') {
        date = randomDate(pastDate, now);
      } else {
        date = randomDate(now, futureDate);
      }

      bookings.push({
        serviceId: randomItem(services)._id,
        date,
        timeSlot: randomItem(timeSlots),
        customerInfo: {
          firstName,
          lastName,
          email: generateEmail(firstName, lastName),
          phone: generateVietnamesePhone(),
        },
        notes: Math.random() > 0.7 ? this.generateBookingNotes() : undefined,
        status,
      });
    }

    const created = await this.bookingModel.insertMany(bookings);
    this.logger.log(`✅ Created ${created.length} bookings`);
    return created;
  }

  private generateBookingNotes(): string {
    const notes = [
      'First time client, please allow extra time',
      'Allergic to certain products, will discuss preferences',
      'Prefers natural nail colors',
      'Celebration booking - birthday',
      'Regular customer',
      'Requested specific nail technician',
      'Bringing own nail polish',
      'Need quick service - have appointment after',
      'Would like nail art consultation',
      'Prefers gel polish',
    ];
    return randomItem(notes);
  }
}
