import {
  IsBoolean,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryGalleryDto {
  @ApiPropertyOptional({
    description: 'Filter by nail shape value',
    example: 'almond',
  })
  @IsOptional()
  @IsString()
  nailShape?: string;

  @ApiPropertyOptional({
    description: 'Filter by nail style value',
    example: '3d',
  })
  @IsOptional()
  @IsString()
  nailStyle?: string;

  @ApiPropertyOptional({
    description: 'Filter by featured gallery items',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by active gallery items',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search across title, description, and price',
    example: 'french',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
}
