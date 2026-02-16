import { IsOptional, IsDateString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

enum ExpenseSortField {
  DATE = 'date',
  AMOUNT = 'amount',
  CREATED_AT = 'createdAt',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

enum ExpenseCategory {
  SUPPLIES = 'supplies',
  MATERIALS = 'materials',
  UTILITIES = 'utilities',
  OTHER = 'other',
}

export class QueryExpensesDto {
  @ApiPropertyOptional({
    description: 'Filter by start date (ISO 8601 format)',
    example: '2026-02-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date (ISO 8601 format)',
    example: '2026-02-28',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by expense category',
    enum: ExpenseCategory,
    example: ExpenseCategory.SUPPLIES,
  })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ExpenseSortField,
    example: ExpenseSortField.DATE,
    default: ExpenseSortField.DATE,
  })
  @IsOptional()
  @IsEnum(ExpenseSortField)
  sortBy?: ExpenseSortField = ExpenseSortField.DATE;

  @ApiPropertyOptional({
    description: 'Sort order (ascending or descending)',
    enum: SortOrder,
    example: SortOrder.DESC,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

export { ExpenseSortField, SortOrder, ExpenseCategory };
