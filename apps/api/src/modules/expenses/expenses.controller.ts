import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryExpensesDto } from './dto/query-expenses.dto';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all expenses with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of expenses retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: QueryExpensesDto) {
    return this.expensesService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense details retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({
    status: 200,
    description: 'Expense successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async remove(@Param('id') id: string) {
    await this.expensesService.remove(id);
    return { message: 'Expense successfully deleted' };
  }
}
