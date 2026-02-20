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
import { NailShapesService } from './nail-shapes.service';

@ApiTags('Nail Shapes')
@Controller('nail-shapes')
export class NailShapesController {
  constructor(private readonly service: NailShapesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all nail shapes (public)' })
  @ApiResponse({ status: 200, description: 'Nail shapes retrieved' })
  async findAll(@Query() query: QueryNailOptionDto) {
    return this.service.findAll(query);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a nail shape (Admin)' })
  @ApiResponse({ status: 201, description: 'Nail shape created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Value already exists' })
  async create(@Body() dto: CreateNailOptionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a nail shape (Admin)' })
  @ApiResponse({ status: 200, description: 'Nail shape updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateNailOptionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a nail shape (Admin)' })
  @ApiResponse({ status: 204, description: 'Nail shape deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
