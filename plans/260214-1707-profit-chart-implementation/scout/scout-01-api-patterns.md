# Scout Report: NestJS API Module Patterns

Based on analysis of Pink Nail Salon API structure for building new modules (expense & analytics).

## 1. MODULE STRUCTURE

**File Organization** (per module):
```
modules/[moduleName]/
├── [moduleName].module.ts     # Module definition
├── [moduleName].controller.ts # API endpoints
├── [moduleName].service.ts    # Business logic
├── schemas/
│   └── [entity].schema.ts      # Mongoose model + Document type
└── dto/
    ├── create-[entity].dto.ts  # Create validation
    ├── update-[entity].dto.ts  # Update validation
    └── query-[entity].dto.ts   # Query/filter validation
```

**Example**: `/apps/api/src/modules/bookings/`

## 2. MODULE PATTERN

```typescript
// bookings.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],  // Export for use by other modules
})
export class BookingsModule {}
```

**Key Points**:
- Import MongooseModule with schema registration
- Export service if other modules depend on it
- Single controller + service per module

## 3. SCHEMA PATTERNS

Location: `/apps/api/src/modules/bookings/schemas/booking.schema.ts`

```typescript
@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Service' })
  serviceId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' })
  status: string;
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);

// Add indexes for query performance
BookingSchema.index({ serviceId: 1, date: 1 });
BookingSchema.index({ status: 1, date: -1 });
```

**Critical Patterns**:
- Use `timestamps: true` for createdAt/updatedAt
- Always define `Document` type: `export type EntityDocument = HydratedDocument<Entity>`
- Add compound indexes for common filter combinations
- Reference relationships with `type: Types.ObjectId, ref: 'RefModel'`

## 4. DTO VALIDATION PATTERNS

Location: `/apps/api/src/modules/bookings/dto/`

**Create DTO** (`create-booking.dto.ts`):
```typescript
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: '...', example: '...' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiPropertyOptional({ description: '...' })
  @IsString()
  @IsOptional()
  notes?: string;
}
```

**Query DTO** (`query-bookings.dto.ts`):
```typescript
export enum BookingSortField {
  DATE = 'date',
  CREATED_AT = 'createdAt',
}

export class QueryBookingsDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(BookingSortField)
  sortBy?: BookingSortField = BookingSortField.DATE;
}
```

**Key Patterns**:
- Use `class-validator` decorators for validation
- Use `class-transformer` `@Type()` for type coercion
- Add Swagger decorators (`@ApiProperty`, `@ApiPropertyOptional`)
- Enums for sort fields (prevents injection attacks)
- Pagination defaults: page=1, limit=10, max=100

## 5. CONTROLLER PATTERNS

Location: `/apps/api/src/modules/bookings/bookings.controller.ts`

```typescript
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Public()  // Available without auth
  @ApiOperation({ summary: 'Create booking' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')  // Requires auth
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: QueryBookingsDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth('JWT-auth')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto);
  }
}
```

**Patterns**:
- Use `@ApiTags()` for OpenAPI grouping
- Use `@Public()` decorator for public endpoints
- Use `@ApiBearerAuth('JWT-auth')` for protected endpoints
- Standard CRUD: POST (create), GET (list), GET :id (detail), PATCH (update)

## 6. SERVICE PATTERNS

Location: `/apps/api/src/modules/bookings/bookings.service.ts`

```typescript
@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Validate ObjectId
    if (!Types.ObjectId.isValid(createBookingDto.serviceId)) {
      throw new BadRequestException('Invalid service ID');
    }

    const booking = new this.bookingModel({...dto});
    return booking.save();
  }

  async findAll(query: QueryBookingsDto) {
    const { page = 1, limit = 10, sortBy, sortOrder, search } = query;
    const filter: any = {};

    // Add filters
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { 'customerInfo.firstName': new RegExp(escapedSearch, 'i') },
      ];
    }

    // Dynamic sorting
    const sort: any = {};
    switch (sortBy) {
      case 'date':
        sort.date = sortOrder === 'desc' ? -1 : 1;
        break;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.bookingModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
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
      throw new BadRequestException('Invalid ID');
    }

    const booking = await this.bookingModel.findById(id).populate('serviceId').exec();
    if (!booking) throw new NotFoundException('Not found');
    return booking;
  }
}
```

**Key Patterns**:
- Always validate ObjectId with `Types.ObjectId.isValid(id)`
- Use `Promise.all()` for parallel queries (count + find)
- Return paginated results: `{ data, pagination: { total, page, limit, totalPages } }`
- Escape regex patterns to prevent ReDoS attacks
- Use populate() for relationship loading

## 7. APP MODULE REGISTRATION

Location: `/apps/api/src/app.module.ts`

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({...}),
    MongooseModule.forRootAsync({...}),
    ThrottlerModule.forRootAsync({...}),
    AuthModule,
    ServicesModule,
    BookingsModule,      // Add new modules here
    GalleryModule,
    // Add ExpenseModule, AnalyticsModule, etc.
  ],
  providers: [
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
```

## 8. CRITICAL PATTERNS TO REPLICATE

For **Expense** & **Analytics** modules:

1. **Pagination**: Always include `page`, `limit` (max 100), return `pagination` object
2. **Filtering**: Support multiple filters with safe sorting enums
3. **Indexing**: Add compound indexes for filter + sort combinations
4. **Error Handling**: Use NestJS exceptions (BadRequest, NotFound, Conflict)
5. **Timestamps**: Always use `timestamps: true` in schemas
6. **Validation**: Use class-validator + class-transformer for all DTOs
7. **Security**: Validate ObjectId, escape regex, use enums for sort fields
8. **Relationships**: Use `populate()` for references, validate foreign keys exist
9. **Swagger**: Add `@ApiProperty`, `@ApiOperation`, `@ApiResponse` decorators
10. **Module Exports**: Export services for dependency injection in other modules

---

**Files Referenced**:
- `/apps/api/src/modules/bookings/bookings.module.ts`
- `/apps/api/src/modules/bookings/bookings.controller.ts`
- `/apps/api/src/modules/bookings/bookings.service.ts`
- `/apps/api/src/modules/bookings/schemas/booking.schema.ts`
- `/apps/api/src/modules/bookings/dto/create-booking.dto.ts`
- `/apps/api/src/modules/bookings/dto/query-bookings.dto.ts`
- `/apps/api/src/app.module.ts`
