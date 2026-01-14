import { IsOptional, IsEnum, IsInt, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContactStatus } from './update-contact-status.dto';

// Sort enums for type safety and MongoDB injection prevention
enum ContactSortField {
  CREATED_AT = 'createdAt',
  STATUS = 'status',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryContactsDto {
  @ApiPropertyOptional({
    description: 'Filter by contact status',
    enum: ContactStatus,
    example: ContactStatus.NEW,
  })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
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
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search across name, email, subject, message, and phone',
    example: 'booking inquiry',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ContactSortField,
    example: ContactSortField.CREATED_AT,
    default: ContactSortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ContactSortField)
  sortBy?: ContactSortField = ContactSortField.CREATED_AT;

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
export { ContactSortField, SortOrder };
