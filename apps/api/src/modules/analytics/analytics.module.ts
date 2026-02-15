import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Expense, ExpenseSchema } from '../expenses/schemas/expense.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Expense.name, schema: ExpenseSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
