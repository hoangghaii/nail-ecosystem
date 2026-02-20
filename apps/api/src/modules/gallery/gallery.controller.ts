import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { QueryGalleryDto } from './dto/query-gallery.dto';
import { UploadGalleryDto } from './dto/upload-gallery.dto';
import { StorageService } from '../storage/storage.service';
import { Public } from '../auth/decorators/public.decorator';
import { galleryUploadSchema } from './gallery.swagger';

const imageFilePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
  ],
});

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly storageService: StorageService,
  ) {}

  @Post('upload')
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload gallery image with file (DEPRECATED)', deprecated: true })
  @ApiBody({ schema: galleryUploadSchema })
  @ApiResponse({ status: 201, description: 'Gallery item created with uploaded image' })
  @ApiResponse({ status: 400, description: 'Invalid input data or file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async upload(
    @UploadedFile(imageFilePipe) file: Express.Multer.File,
    @Body() dto: UploadGalleryDto,
  ) {
    const imageUrl = await this.storageService.uploadFile(file, 'gallery');
    return this.galleryService.create({ ...dto, imageUrl });
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create gallery item with image upload' })
  @ApiBody({ schema: galleryUploadSchema })
  @ApiResponse({ status: 201, description: 'Gallery item successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data or file' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @UploadedFile(imageFilePipe) file: Express.Multer.File,
    @Body() dto: UploadGalleryDto,
  ) {
    const imageUrl = await this.storageService.uploadFile(file, 'gallery');
    return this.galleryService.create({ ...dto, imageUrl });
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all gallery items with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Gallery items retrieved successfully' })
  async findAll(@Query() query: QueryGalleryDto) {
    return this.galleryService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a gallery item by ID' })
  @ApiResponse({ status: 200, description: 'Gallery item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async findOne(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a gallery item by ID' })
  @ApiResponse({ status: 200, description: 'Gallery item successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateGalleryDto) {
    return this.galleryService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a gallery item by ID' })
  @ApiResponse({ status: 204, description: 'Gallery item successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
