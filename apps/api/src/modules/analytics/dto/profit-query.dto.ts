import { IsDateString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum GroupBy {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class ProfitQueryDto {
  @ApiProperty({
    description: 'Start date for profit report (ISO 8601 format)',
    example: '2026-02-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'End date for profit report (ISO 8601 format)',
    example: '2026-02-28',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Group chart data by day, week, or month',
    enum: GroupBy,
    example: GroupBy.DAY,
    default: GroupBy.DAY,
  })
  @IsOptional()
  @IsEnum(GroupBy)
  groupBy?: GroupBy = GroupBy.DAY;
}

export { GroupBy };
