import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreateNailOptionDto } from './dto/create-nail-option.dto';
import { QueryNailOptionDto } from './dto/query-nail-option.dto';
import { UpdateNailOptionDto } from './dto/update-nail-option.dto';
import { NailStylesService } from './nail-styles.service';

@ApiTags('Nail Styles')
@Controller('nail-styles')
export class NailStylesController {
  constructor(private readonly service: NailStylesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all nail styles (public)' })
  @ApiResponse({ status: 200, description: 'Nail styles retrieved' })
  async findAll(@Query() query: QueryNailOptionDto) {
    return this.service.findAll(query);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a nail style (Admin)' })
  @ApiResponse({ status: 201, description: 'Nail style created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Value already exists' })
  async create(@Body() dto: CreateNailOptionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a nail style (Admin)' })
  @ApiResponse({ status: 200, description: 'Nail style updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateNailOptionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a nail style (Admin)' })
  @ApiResponse({ status: 204, description: 'Nail style deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
