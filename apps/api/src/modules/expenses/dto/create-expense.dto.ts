import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum ExpenseCategory {
  SUPPLIES = 'supplies',
  MATERIALS = 'materials',
  UTILITIES = 'utilities',
  OTHER = 'other',
}

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Expense date in ISO 8601 format',
    example: '2026-02-14',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Expense category',
    enum: ExpenseCategory,
    example: ExpenseCategory.SUPPLIES,
  })
  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Expense amount as string (e.g., "125.50")',
    example: '125.50',
    pattern: '^\\d+(\\.\\d{1,2})?$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'Amount must be a valid number with up to 2 decimal places',
  })
  amount: string; // String to prevent precision loss, converted to Decimal128

  @ApiPropertyOptional({
    description: 'Expense description',
    example: 'Nail polish supplies from supplier XYZ',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  @Length(3, 3)
  currency?: string;
}

export { ExpenseCategory };
