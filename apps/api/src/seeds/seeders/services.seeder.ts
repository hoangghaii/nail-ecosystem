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
      this.logger.log(
        `ℹ️  Services already exist (${existingCount} found). Skipping...`,
      );
      return await this.serviceModel.find().exec();
    }

    const services = await this.serviceModel.insertMany(servicesData);

    this.logger.log(`✅ Created ${services.length} services`);
    return services;
  }
}
