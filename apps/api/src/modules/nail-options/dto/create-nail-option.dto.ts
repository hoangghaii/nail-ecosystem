import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNailOptionDto {
  @ApiProperty({ example: 'almond', description: 'URL-safe slug value (a-z, 0-9, hyphens only)' })
  @Matches(/^[a-z0-9-]+$/, { message: 'value must be a lowercase URL-safe slug (a-z, 0-9, -)' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: 'Almond', description: 'English label' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 'Móng Hạnh Nhân', description: 'Vietnamese label' })
  @IsString()
  @IsNotEmpty()
  labelVi: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  sortIndex?: number;
}
