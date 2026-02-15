# Expense Tracking & Financial Analytics API Research
**Context**: NestJS + MongoDB for nail salon profit analytics | **Date**: 2026-02-14

---

## 1. OPTIMAL MONGODB SCHEMA (Decimal128)

```javascript
// Expense Schema - Use Decimal128 for precision
{
  _id: ObjectId,
  date: Date,
  category: "supplies" | "utilities" | "labor",
  amount: { val: NumberDecimal("150.50"), ccode: "USD" },
  vendor: String,
  createdAt: Date
}

// Booking Schema (Revenue)
{
  _id: ObjectId,
  date: Date,
  price: { val: NumberDecimal("85.00"), ccode: "USD" },
  finalPrice: { val: NumberDecimal("85.00"), ccode: "USD" }, // After discounts
  status: "completed" | "cancelled",
  createdAt: Date
}
```

**Why**: Decimal128 eliminates floating-point errors (0.1 + 0.2 ≠ 0.3). Currency as subdoc ensures amount+code pairing.

---

## 2. AGGREGATION PIPELINE FOR DATE RANGES

```javascript
// Profit Report (NestJS Service)
async getProfitReport(startDate: Date, endDate: Date) {
  const expenses = await this.expenseModel.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    { $group: {
        _id: "$category",
        total: { $sum: "$amount.val" },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);

  const revenue = await this.bookingModel.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate }, status: "completed" } },
    { $group: {
        _id: null,
        total: { $sum: "$finalPrice.val" },
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    revenue: revenue[0]?.total || 0,
    expenses: expenses.reduce((sum, e) => sum + e.total, 0),
    profit: revenue[0]?.total - expenses.reduce((sum, e) => sum + e.total, 0)
  };
}
```

**Performance**: Aggregation runs server-side. Filter by date first (uses index).

---

## 3. CRITICAL INDEXES

```javascript
expenseSchema.index({ date: 1 });
expenseSchema.index({ date: -1, category: 1 }); // Range + grouping
bookingSchema.index({ date: 1, status: 1 });     // Revenue queries
```

Prevents full collection scans on large datasets.

---

## 4. REST API ENDPOINTS

```typescript
@Get('/analytics/profit')
async getProfitReport(
  @Query('startDate') startDate: string,
  @Query('endDate') endDate: string
)

@Get('/expenses')
async listExpenses(
  @Query('startDate') startDate: string,
  @Query('endDate') endDate: string,
  @Query('category') category?: string,
  @Query('limit') limit: number = 50
)

@Post('/expenses')
async createExpense(@Body() dto: CreateExpenseDto)
```

**Best Practices**: Query params for filtering (cacheable), pagination, ISO 8601 dates.

---

## 5. VALIDATION FOR FINANCIAL DATA

```typescript
class CreateExpenseDto {
  @IsISO8601() date: string;
  @IsEnum(['supplies', 'utilities', 'labor']) category: string;
  @IsDecimal({ decimal_digits: '2' }) @Min(0) amount: string;
  @Length(3, 3) currency: string;
}

// Custom Pipe: Convert string to Decimal128 (no rounding on parse)
@Injectable()
export class DecimalPipe implements PipeTransform {
  transform(value: string) {
    return new Decimal128(value);
  }
}
```

**Rules**: Input amounts as strings. Validate 2 decimals. Category enum. Enforce min=0.

---

## 6. PROFIT CALCULATION

```typescript
async calculateProfit(startDate: Date, endDate: Date) {
  const revenue = await this.bookingModel.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate }, status: "completed" } },
    { $group: { _id: null, total: { $sum: "$finalPrice.val" } } }
  ]);

  const expenses = await this.expenseModel.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: "$amount.val" } } }
  ]);

  const profit = revenue[0]?.total - expenses[0]?.total;
  return { revenue, expenses, profit, margin: (profit / revenue * 100).toString() };
}
```

All math server-side. Transmission uses string serialization (no precision loss).

---

## 7. HANDLING DISCOUNTS & REFUNDS

```typescript
{
  price: Decimal128("100.00"),           // Original
  discount: Decimal128("15.00"),         // Applied discount
  finalPrice: Decimal128("85.00"),       // Price after discount
  refund: Decimal128("0.00"),            // Refunds
  recognizedRevenue: Decimal128("85.00") // For profit calculation
}
```

Store original + adjustments separately for audit trail.

---

## KEY DECISIONS

| Issue | Solution |
|-------|----------|
| **Precision** | Decimal128 (not float/double) |
| **Currency** | Subdoc: `{val, ccode}` |
| **Performance** | Date index + server-side aggregation |
| **Validation** | class-validator DTO, min/max rules |
| **Formula** | Profit = Sum(finalPrice) - Sum(amount) |
| **API** | Query params, ISO dates, pagination |

---

## SOURCES
- [MongoDB Model Monetary Data](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/)
- [Aggregation Pipeline Optimization](https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/)
- [REST API Query Parameter Performance](https://www.lonti.com/blog/optimizing-rest-api-performance-with-query-parameters-for-data-filtering)
- [Bookings vs Revenue Accounting](https://revvana.com/resources/blog/bookings-vs-revenue-top-mistakes-companies-make-when-tracking-these-metrics/)
