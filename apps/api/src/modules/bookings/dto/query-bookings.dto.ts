import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Sort enums for type safety and MongoDB injection prevention
enum BookingSortField {
  DATE = 'date',
  CREATED_AT = 'createdAt',
  CUSTOMER_NAME = 'customerName',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryBookingsDto {
  @ApiPropertyOptional({
    description: 'Filter by booking status',
    example: 'pending',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by service ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({
    description: 'Filter by booking date (ISO 8601 format)',
    example: '2025-12-20',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

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
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search across customer name, email, and phone',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: BookingSortField,
    example: BookingSortField.DATE,
    default: BookingSortField.DATE,
  })
  @IsOptional()
  @IsEnum(BookingSortField)
  sortBy?: BookingSortField = BookingSortField.DATE;

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

// Export enums for use in service
export { BookingSortField, SortOrder };
