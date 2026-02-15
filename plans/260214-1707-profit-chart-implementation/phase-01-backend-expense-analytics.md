# Phase 1: Backend - Expense & Analytics Modules

**Date**: 2026-02-14
**Duration**: 1.5 days
**Priority**: High (Foundation)
**Status**: Pending

---

## Context

**Parent Plan**: `./plan.md`
**Dependencies**: None
**Blocked By**: None
**Blocks**: Phase 2, Phase 3, Phase 4

**Related Research**:
- `./research/researcher-02-expense-analytics-api.md` (Decimal128, aggregation patterns)
- `./scout/scout-01-api-patterns.md` (NestJS module structure)

---

## Overview

Create two NestJS modules: **Expenses** (CRUD) and **Analytics** (profit calculations). Use MongoDB Decimal128 for currency precision, implement pagination/filtering patterns from existing modules, add proper indexes for performance.

---

## Key Insights from Research

1. **Decimal128 Mandatory**: Research-02 shows Decimal128 prevents floating-point errors (0.1 + 0.2 = 0.3)
2. **Aggregation Pipeline**: Use MongoDB aggregation for date range filtering (research-02)
3. **Index Strategy**: Compound index on `date + category` for filter performance (research-02)
4. **Scout Patterns**: Replicate bookings module structure exactly (scout-01)

---

## Requirements

### Functional Requirements
- FR1: CRUD operations for expenses (Create, Read, Update, Delete)
- FR2: Expense filtering by category, date range
- FR3: Pagination (default 20/page, max 100)
- FR4: Analytics endpoint: revenue, expenses, profit by date range
- FR5: Chart data grouped by day/week/month
- FR6: Admin-only access (JWT guards)

### Non-Functional Requirements
- NFR1: API response time <500ms (use indexes)
- NFR2: Currency precision to 2 decimals (Decimal128)
- NFR3: Query optimization (aggregation pipeline)
- NFR4: Follows existing NestJS patterns (scout-01)

---

## Architecture

### Expense Schema (Mongoose)

```typescript
// apps/api/src/modules/expenses/schemas/expense.schema.ts
@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true, type: 'Decimal128' })
  amount: Types.Decimal128;  // NOT number! Prevents precision loss

  @Prop({ required: true, enum: ['supplies', 'materials', 'utilities', 'other'] })
  category: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, default: 'USD' })
  currency: string;
}

export type ExpenseDocument = HydratedDocument<Expense>;
export const ExpenseSchema = SchemaFactory.createForClass(Expense);

// Indexes for query performance (research-02)
ExpenseSchema.index({ date: -1, category: 1 });
ExpenseSchema.index({ date: -1 }); // For date range queries
```

**Critical**: `amount` uses Decimal128, NOT number. API receives strings ("125.50"), converts to Decimal128.

### Analytics Calculation Logic

```typescript
// apps/api/src/modules/analytics/analytics.service.ts
async getProfitReport(startDate: Date, endDate: Date, groupBy: 'day' | 'week' | 'month') {
  // Revenue: Sum of completed bookings
  const revenue = await this.bookingModel.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate }, status: 'completed' } },
    { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
    { $unwind: '$service' },
    { $group: {
        _id: null,
        total: { $sum: '$service.price' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Expenses: Sum of all expenses
  const expenses = await this.expenseModel.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    { $group: {
        _id: null,
        total: { $sum: { $toDecimal: '$amount' } },
        count: { $sum: 1 }
      }
    }
  ]);

  // Chart data grouped by date
  const chartData = await this.generateChartData(startDate, endDate, groupBy);

  return {
    revenue: revenue[0]?.total || 0,
    expenses: expenses[0]?.total || 0,
    profit: (revenue[0]?.total || 0) - (expenses[0]?.total || 0),
    bookingsCount: revenue[0]?.count || 0,
    expensesCount: expenses[0]?.count || 0,
    chartData,
  };
}
```

**Note**: Aggregation runs server-side (fast), Decimal128 requires `$toDecimal` operator.

---

## Related Code Files

### Files to Create

**Expense Module**:
- `/apps/api/src/modules/expenses/expenses.module.ts`
- `/apps/api/src/modules/expenses/expenses.controller.ts`
- `/apps/api/src/modules/expenses/expenses.service.ts`
- `/apps/api/src/modules/expenses/schemas/expense.schema.ts`
- `/apps/api/src/modules/expenses/dto/create-expense.dto.ts`
- `/apps/api/src/modules/expenses/dto/update-expense.dto.ts`
- `/apps/api/src/modules/expenses/dto/query-expenses.dto.ts`

**Analytics Module**:
- `/apps/api/src/modules/analytics/analytics.module.ts`
- `/apps/api/src/modules/analytics/analytics.controller.ts`
- `/apps/api/src/modules/analytics/analytics.service.ts`
- `/apps/api/src/modules/analytics/dto/profit-query.dto.ts`

**Tests** (Optional):
- `/apps/api/src/modules/expenses/expenses.service.spec.ts`
- `/apps/api/src/modules/analytics/analytics.service.spec.ts`

### Files to Modify

- `/apps/api/src/app.module.ts` (register ExpensesModule, AnalyticsModule)

### Files to Reference (Scout-01 Patterns)

- `/apps/api/src/modules/bookings/bookings.module.ts` (module pattern)
- `/apps/api/src/modules/bookings/bookings.controller.ts` (controller pattern)
- `/apps/api/src/modules/bookings/bookings.service.ts` (service pattern, pagination)
- `/apps/api/src/modules/bookings/schemas/booking.schema.ts` (schema pattern)
- `/apps/api/src/modules/bookings/dto/query-bookings.dto.ts` (query DTO pattern)

---

## Implementation Steps

### Step 1: Expense Module Setup (4 hours)

**1.1 Create Expense Schema**
```bash
mkdir -p /apps/api/src/modules/expenses/schemas
touch /apps/api/src/modules/expenses/schemas/expense.schema.ts
```

**1.2 Implement Schema** (Reference: scout-01, booking.schema.ts)
- Use `@Schema({ timestamps: true })` decorator
- `amount`: `type: 'Decimal128'`, required
- `category`: enum `['supplies', 'materials', 'utilities', 'other']`
- `date`: `type: Date`, required
- `description`: optional string
- `currency`: string, default 'USD'
- Add indexes: `{ date: -1, category: 1 }`, `{ date: -1 }`

**1.3 Create DTOs**
```bash
mkdir -p /apps/api/src/modules/expenses/dto
touch /apps/api/src/modules/expenses/dto/create-expense.dto.ts
touch /apps/api/src/modules/expenses/dto/update-expense.dto.ts
touch /apps/api/src/modules/expenses/dto/query-expenses.dto.ts
```

**CreateExpenseDto** (Reference: research-02 validation):
```typescript
export class CreateExpenseDto {
  @IsISO8601() date: string;
  @IsEnum(['supplies', 'materials', 'utilities', 'other']) category: string;
  @IsNumberString() @Matches(/^\d+(\.\d{1,2})?$/) amount: string; // String input!
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Length(3, 3) currency?: string;
}
```

**QueryExpensesDto** (Reference: scout-01, query-bookings.dto.ts):
```typescript
export enum ExpenseSortField {
  DATE = 'date',
  AMOUNT = 'amount',
  CREATED_AT = 'createdAt',
}

export class QueryExpensesDto {
  @IsOptional() @IsISO8601() startDate?: string;
  @IsOptional() @IsISO8601() endDate?: string;
  @IsOptional() @IsEnum(['supplies', 'materials', 'utilities', 'other']) category?: string;
  @Type(() => Number) @Min(1) page?: number = 1;
  @Type(() => Number) @Min(1) @Max(100) limit?: number = 20;
  @IsOptional() @IsEnum(ExpenseSortField) sortBy?: ExpenseSortField = ExpenseSortField.DATE;
  @IsOptional() @IsEnum(['asc', 'desc']) sortOrder?: 'asc' | 'desc' = 'desc';
}
```

**1.4 Create Service** (Reference: scout-01, bookings.service.ts)
- Inject `@InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>`
- `create()`: Convert amount string to Decimal128 via `new Types.Decimal128(dto.amount)`
- `findAll()`: Implement pagination, filtering (date range, category), sorting
- `findOne()`: Validate ObjectId, throw NotFoundException if not found
- `update()`: Use `findByIdAndUpdate()`, convert amount to Decimal128
- `delete()`: Use `findByIdAndDelete()`

**Critical**: Always validate ObjectId with `Types.ObjectId.isValid(id)` (scout-01 pattern).

**1.5 Create Controller** (Reference: scout-01, bookings.controller.ts)
```typescript
@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create expense' })
  async create(@Body() dto: CreateExpenseDto) { }

  @Get()
  @ApiBearerAuth('JWT-auth')
  async findAll(@Query() query: QueryExpensesDto) { }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  async findOne(@Param('id') id: string) { }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  async update(@Param('id') id: string, @Body() dto: UpdateExpenseDto) { }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  async remove(@Param('id') id: string) { }
}
```

**1.6 Create Module**
```typescript
@Module({
  imports: [MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService], // Export for AnalyticsModule
})
export class ExpensesModule {}
```

**1.7 Register in AppModule**
```typescript
// apps/api/src/app.module.ts
imports: [
  // ... existing modules
  ExpensesModule,
]
```

### Step 2: Analytics Module Setup (4 hours)

**2.1 Create Analytics Module Structure**
```bash
mkdir -p /apps/api/src/modules/analytics/dto
touch /apps/api/src/modules/analytics/analytics.module.ts
touch /apps/api/src/modules/analytics/analytics.controller.ts
touch /apps/api/src/modules/analytics/analytics.service.ts
touch /apps/api/src/modules/analytics/dto/profit-query.dto.ts
```

**2.2 Create ProfitQueryDto**
```typescript
export class ProfitQueryDto {
  @IsISO8601() startDate: string;
  @IsISO8601() endDate: string;
  @IsOptional() @IsEnum(['day', 'week', 'month']) groupBy?: 'day' | 'week' | 'month' = 'day';
}
```

**2.3 Implement AnalyticsService**
- Inject `ExpenseModel`, `BookingModel`, `ServiceModel`
- `getProfitReport()`: Aggregation pipeline (research-02)
  - Revenue: Sum service prices for completed bookings in date range
  - Expenses: Sum expense amounts (convert Decimal128 to number)
  - Profit: revenue - expenses
  - Chart data: Group by day/week/month
- `generateChartData()`: Private method for daily/weekly/monthly grouping

**Revenue Aggregation** (with $lookup for service prices):
```typescript
const revenue = await this.bookingModel.aggregate([
  { $match: { date: { $gte: startDate, $lte: endDate }, status: 'completed' } },
  { $lookup: {
      from: 'services',
      localField: 'serviceId',
      foreignField: '_id',
      as: 'service'
    }
  },
  { $unwind: '$service' },
  { $group: {
      _id: null,
      total: { $sum: '$service.price' },
      count: { $sum: 1 }
    }
  }
]);
```

**Chart Data Grouping** (example for daily):
```typescript
const chartData = await this.bookingModel.aggregate([
  { $match: { date: { $gte: startDate, $lte: endDate }, status: 'completed' } },
  { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
  { $unwind: '$service' },
  { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
      revenue: { $sum: '$service.price' }
    }
  },
  { $sort: { _id: 1 } }
]);

// Merge with expense data by date
const expenseData = await this.expenseModel.aggregate([...]);
// Combine revenue + expense data into chartData array
```

**2.4 Create Controller**
```typescript
@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  @Get('profit')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get profit report' })
  async getProfitReport(@Query() query: ProfitQueryDto) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    return this.analyticsService.getProfitReport(startDate, endDate, query.groupBy);
  }
}
```

**2.5 Create Module**
```typescript
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
```

**2.6 Register in AppModule**

### Step 3: Testing & Validation (4 hours)

**3.1 Manual API Testing** (Postman/cURL)
- POST /expenses (create with valid/invalid data)
- GET /expenses?category=supplies&startDate=2026-02-01&endDate=2026-02-28
- PATCH /expenses/:id (update amount)
- DELETE /expenses/:id
- GET /analytics/profit?startDate=2026-02-01&endDate=2026-02-28&groupBy=day

**3.2 Validation Tests**
- Amount string format: "125.50" ✅, 125.50 ❌, "abc" ❌
- Date validation: ISO 8601 strings only
- Category enum: valid values only
- Pagination: page=1-N, limit=1-100
- ObjectId validation

**3.3 Performance Testing**
- Create 1000+ expense records (seed script)
- Verify index usage: `explain()` in MongoDB
- Response time <500ms for analytics endpoint

**3.4 Edge Cases**
- No expenses in date range → return zeros
- No bookings in date range → return zeros
- Invalid date range (end < start) → validation error
- Decimal precision: Test amounts like "0.01", "999999.99"

---

## Todo Checklist

### Expense Module
- [ ] Create expense schema with Decimal128 amount
- [ ] Add indexes: `{ date: -1, category: 1 }`, `{ date: -1 }`
- [ ] Create DTOs: CreateExpenseDto, UpdateExpenseDto, QueryExpensesDto
- [ ] Implement ExpenseService with pagination/filtering
- [ ] Implement ExpenseController with Swagger decorators
- [ ] Create ExpenseModule and register in AppModule
- [ ] Test CRUD operations via Postman

### Analytics Module
- [ ] Create ProfitQueryDto with date range validation
- [ ] Implement AnalyticsService with aggregation pipelines
- [ ] Implement revenue aggregation (completed bookings + service lookup)
- [ ] Implement expense aggregation (sum amounts)
- [ ] Implement chart data generation (daily/weekly/monthly grouping)
- [ ] Create AnalyticsController
- [ ] Create AnalyticsModule and register in AppModule
- [ ] Test profit endpoint with various date ranges

### Testing & Validation
- [ ] Manual API testing (all endpoints)
- [ ] Validate Decimal128 precision (no floating-point errors)
- [ ] Test pagination (page/limit)
- [ ] Test filtering (category, date range)
- [ ] Test sorting (date, amount)
- [ ] Verify index usage with MongoDB explain
- [ ] Test edge cases (empty data, invalid inputs)
- [ ] Performance check: response time <500ms

---

## Success Criteria

- [ ] All expense CRUD endpoints operational
- [ ] Analytics endpoint returns accurate profit data
- [ ] Currency precision to 2 decimals (Decimal128)
- [ ] Pagination works (default 20, max 100)
- [ ] Filters work (category, date range)
- [ ] Response time <500ms for analytics
- [ ] No TypeScript errors (`npm run type-check` from API)
- [ ] Swagger docs auto-generated
- [ ] Follows scout-01 patterns exactly

---

## Risk Assessment

**Risk 1**: Decimal128 serialization to frontend
- **Impact**: Medium (JSON serialization converts to string)
- **Mitigation**: Frontend expects strings, converts to number for display

**Risk 2**: Aggregation pipeline complexity
- **Impact**: Low (well-documented pattern in research-02)
- **Mitigation**: Test with real data, use indexes

**Risk 3**: Service price lookup (bookings don't store price)
- **Impact**: High (service price may change over time)
- **Mitigation**: Acceptable for MVP; can denormalize later if needed

---

## Security Considerations

- **Auth**: All endpoints require JWT (`@ApiBearerAuth`)
- **Input Validation**: class-validator on all DTOs
- **ObjectId Validation**: Prevent injection attacks
- **Rate Limiting**: Already configured in AppModule
- **Decimal Precision**: Prevent floating-point exploits

---

## Next Steps

After Phase 1 completion:
1. Create shared types in Phase 2
2. Verify API endpoints with Postman
3. Document API changes in `docs/api-endpoints.md`
4. Begin frontend integration (Phase 3)

---

**Last Updated**: 2026-02-14
**Status**: Ready for Implementation
