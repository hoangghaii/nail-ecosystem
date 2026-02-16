import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from '../expenses/schemas/expense.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
import { GroupBy } from './dto/profit-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  async getProfitReport(
    startDate: Date,
    endDate: Date,
    groupBy: GroupBy = GroupBy.DAY,
  ) {
    // Revenue: Sum of service prices for completed bookings
    const revenueResult = await this.bookingModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: 'completed',
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service',
        },
      },
      { $unwind: '$service' },
      {
        $group: {
          _id: null,
          total: { $sum: '$service.price' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Expenses: Sum of all expenses (convert Decimal128 to number)
    const expenseResult = await this.expenseModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: '$amount' } }, // Convert Decimal128 to number
          count: { $sum: 1 },
        },
      },
    ]);

    const revenue = revenueResult[0]?.total || 0;
    const expenses = expenseResult[0]?.total || 0;
    const profit = revenue - expenses;
    const bookingsCount = revenueResult[0]?.count || 0;
    const expensesCount = expenseResult[0]?.count || 0;

    // Generate chart data
    const chartData = await this.generateChartData(startDate, endDate, groupBy);

    return {
      revenue,
      expenses,
      profit,
      bookingsCount,
      expensesCount,
      chartData,
    };
  }

  private async generateChartData(
    startDate: Date,
    endDate: Date,
    groupBy: GroupBy,
  ) {
    // Determine date format based on groupBy
    let dateFormat: string;
    switch (groupBy) {
      case GroupBy.DAY:
        dateFormat = '%Y-%m-%d';
        break;
      case GroupBy.WEEK:
        dateFormat = '%Y-W%U'; // Year-Week format
        break;
      case GroupBy.MONTH:
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    // Revenue by date
    const revenueData = await this.bookingModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          status: 'completed',
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service',
        },
      },
      { $unwind: '$service' },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$date' } },
          revenue: { $sum: '$service.price' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Expenses by date
    const expenseData = await this.expenseModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$date' } },
          expenses: { $sum: { $toDouble: '$amount' } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge revenue and expense data
    const dataMap = new Map<string, { revenue: number; expenses: number }>();

    revenueData.forEach((item) => {
      dataMap.set(item._id, {
        revenue: item.revenue,
        expenses: 0,
      });
    });

    expenseData.forEach((item) => {
      const existing = dataMap.get(item._id);
      if (existing) {
        existing.expenses = item.expenses;
      } else {
        dataMap.set(item._id, {
          revenue: 0,
          expenses: item.expenses,
        });
      }
    });

    // Convert map to chart data array
    const chartData = Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.revenue - data.expenses,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return chartData;
  }
}
