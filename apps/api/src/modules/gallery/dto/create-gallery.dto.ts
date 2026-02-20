import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({
    description: 'Image URL for the gallery item',
    example: 'https://example.com/images/nail-art-sample.jpg',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Title of the gallery item',
    example: 'Summer Floral Design',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the gallery item',
    example: 'Beautiful floral nail art design perfect for summer',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price for this design',
    example: '$45',
  })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'Duration for this design',
    example: '60 minutes',
  })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiPropertyOptional({
    description: 'Whether the gallery item is featured',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the gallery item is active and visible',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort index for ordering gallery items',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  sortIndex?: number;

  @ApiPropertyOptional({
    description: 'Nail shape value for filtering (references NailShape.value)',
    example: 'almond',
  })
  @IsString()
  @IsOptional()
  nailShape?: string;

  @ApiPropertyOptional({
    description: 'Nail style value for filtering (references NailStyle.value)',
    example: '3d',
  })
  @IsString()
  @IsOptional()
  style?: string;
}
