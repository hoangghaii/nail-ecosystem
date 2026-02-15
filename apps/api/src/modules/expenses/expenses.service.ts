import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import {
  QueryExpensesDto,
  ExpenseSortField,
  SortOrder,
} from './dto/query-expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = new this.expenseModel({
      date: new Date(createExpenseDto.date),
      category: createExpenseDto.category,
      amount: new Types.Decimal128(createExpenseDto.amount), // Convert string to Decimal128
      description: createExpenseDto.description,
      currency: createExpenseDto.currency || 'USD',
    });

    return expense.save();
  }

  async findAll(query: QueryExpensesDto) {
    const {
      startDate,
      endDate,
      category,
      sortBy = ExpenseSortField.DATE,
      sortOrder = SortOrder.DESC,
      page = 1,
      limit = 20,
    } = query;

    const filter: any = {};

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Dynamic sorting
    const sort: any = {};
    switch (sortBy) {
      case ExpenseSortField.DATE:
        sort.date = sortOrder === SortOrder.DESC ? -1 : 1;
        break;
      case ExpenseSortField.AMOUNT:
        sort.amount = sortOrder === SortOrder.DESC ? -1 : 1;
        break;
      case ExpenseSortField.CREATED_AT:
        sort.createdAt = sortOrder === SortOrder.DESC ? -1 : 1;
        break;
      default:
        sort.date = -1; // Default to date DESC
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.expenseModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.expenseModel.countDocuments(filter),
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

  async findOne(id: string): Promise<Expense> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const expense = await this.expenseModel.findById(id).exec();

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const updateData: any = {};

    if (updateExpenseDto.date) {
      updateData.date = new Date(updateExpenseDto.date);
    }
    if (updateExpenseDto.category) {
      updateData.category = updateExpenseDto.category;
    }
    if (updateExpenseDto.amount) {
      updateData.amount = new Types.Decimal128(updateExpenseDto.amount); // Convert string to Decimal128
    }
    if (updateExpenseDto.description !== undefined) {
      updateData.description = updateExpenseDto.description;
    }
    if (updateExpenseDto.currency) {
      updateData.currency = updateExpenseDto.currency;
    }

    const expense = await this.expenseModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid expense ID');
    }

    const result = await this.expenseModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
}
