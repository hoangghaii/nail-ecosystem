import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { QueryBookingsDto, BookingSortField, SortOrder } from './dto/query-bookings.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    if (!Types.ObjectId.isValid(createBookingDto.serviceId)) {
      throw new BadRequestException('Invalid service ID');
    }

    const bookingDate = new Date(createBookingDto.date);

    await this.validateTimeSlot(bookingDate, createBookingDto.timeSlot);

    const booking = new this.bookingModel({
      serviceId: new Types.ObjectId(createBookingDto.serviceId),
      date: bookingDate,
      timeSlot: createBookingDto.timeSlot,
      customerInfo: createBookingDto.customerInfo,
      notes: createBookingDto.notes,
      status: 'pending',
    });

    return booking.save();
  }

  async findAll(query: QueryBookingsDto) {
    const {
      status,
      serviceId,
      date,
      search,
      sortBy = BookingSortField.DATE,
      sortOrder = SortOrder.DESC,
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    // Existing filters
    if (status) filter.status = status;
    if (serviceId) {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new BadRequestException('Invalid service ID');
      }
      filter.serviceId = new Types.ObjectId(serviceId);
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    // Text search implementation
    if (search && search.trim()) {
      // Escape special regex characters to prevent ReDoS attacks
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i'); // case-insensitive

      filter.$or = [
        { 'customerInfo.firstName': searchRegex },
        { 'customerInfo.lastName': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex },
      ];
    }

    // Dynamic sorting
    const sort: any = {};
    switch (sortBy) {
      case BookingSortField.DATE:
        sort.date = sortOrder === SortOrder.DESC ? -1 : 1;
        sort.timeSlot = sortOrder === SortOrder.DESC ? -1 : 1; // Secondary sort
        break;
      case BookingSortField.CREATED_AT:
        sort.createdAt = sortOrder === SortOrder.DESC ? -1 : 1;
        break;
      case BookingSortField.CUSTOMER_NAME:
        // Sort by lastName, then firstName
        sort['customerInfo.lastName'] = sortOrder === SortOrder.DESC ? -1 : 1;
        sort['customerInfo.firstName'] = sortOrder === SortOrder.DESC ? -1 : 1;
        break;
      default:
        // Fallback to date DESC (current behavior)
        sort.date = -1;
        sort.timeSlot = -1;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.bookingModel
        .find(filter)
        .populate('serviceId', 'name duration price')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.bookingModel.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const booking = await this.bookingModel
      .findById(id)
      .populate('serviceId', 'name duration price')
      .exec();

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid booking ID');
    }

    const booking = await this.bookingModel
      .findByIdAndUpdate(id, { status: updateStatusDto.status }, { new: true })
      .populate('serviceId', 'name duration price')
      .exec();

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  private async validateTimeSlot(date: Date, timeSlot: string): Promise<void> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const existingBooking = await this.bookingModel.findOne({
      date: { $gte: startDate, $lte: endDate },
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      throw new ConflictException(
        'This time slot is already booked. Please choose another time.',
      );
    }
  }
}
