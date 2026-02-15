import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ProfitQueryDto } from './dto/profit-query.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('profit')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get profit analytics report' })
  @ApiResponse({
    status: 200,
    description: 'Profit report retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid date range' })
  async getProfitReport(@Query() query: ProfitQueryDto) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    return this.analyticsService.getProfitReport(
      startDate,
      endDate,
      query.groupBy,
    );
  }
}
