# Phase 3-4: Gallery & Services API

**Objective**: Consolidate Gallery (2→1) and Services (2→1) endpoints
**Estimated Time**: 2-3 hours
**Dependencies**: Phase 2 complete
**Note**: Similar implementation, grouped together

---

## Phase 3: Gallery Module

### Current State
**2 Endpoints**:
- `POST /gallery/upload` - File upload
- `POST /gallery` - With URL

**Schema**: `imageUrl` only (no video)

### Target State
**1 Endpoint**:
- `POST /gallery` - Image (required), multipart/form-data only

### Files to Modify
```
apps/api/src/modules/gallery/gallery.controller.ts
apps/api/src/modules/gallery/dto/upload-gallery.dto.ts
```

### Implementation

**File**: `gallery.controller.ts`

```typescript
@Post()
@ApiBearerAuth('JWT-auth')
@UseInterceptors(FileInterceptor('image'))
@ApiConsumes('multipart/form-data')
@ApiOperation({ summary: 'Create gallery item with image upload' })
@ApiBody({
  schema: {
    type: 'object',
    required: ['image', 'title', 'price', 'duration'],
    properties: {
      image: {
        type: 'string',
        format: 'binary',
        description: 'Gallery image (max 10MB, jpg/jpeg/png/webp)',
      },
      title: { type: 'string' },
      description: { type: 'string' },
      categoryId: { type: 'string' },
      price: { type: 'string' },
      duration: { type: 'string' },
      featured: { type: 'boolean' },
      isActive: { type: 'boolean' },
      sortIndex: { type: 'number' },
    },
  },
})
async create(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
      ],
    }),
  )
  file: Express.Multer.File,
  @Body() uploadGalleryDto: UploadGalleryDto,
) {
  const imageUrl = await this.storageService.uploadFile(file, 'gallery');
  return this.galleryService.create({ ...uploadGalleryDto, imageUrl });
}

// Deprecate old endpoint
@Post('upload')
@ApiDeprecated('Use POST /gallery instead')
async upload(...) {
  // Keep existing implementation
}
```

### Testing

**cURL Test**:
```bash
curl -X POST http://localhost:3000/gallery \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "title=Summer Design" \
  -F "price=$45" \
  -F "duration=60 minutes"
```

**Integration Tests**:
```typescript
describe('POST /gallery', () => {
  it('should create gallery item with image');
  it('should reject without image');
  it('should reject oversized image');
  it('should reject invalid file type');
  it('should return 401 without auth');
});
```

### Acceptance Criteria
- [ ] `POST /gallery` accepts image file
- [ ] Image validation: max 10MB, jpg/jpeg/png/webp
- [ ] Image uploaded to storage
- [ ] Gallery item created with imageUrl
- [ ] Old `/upload` deprecated but functional
- [ ] Tests pass
- [ ] Swagger docs updated

---

## Phase 4: Services Module

### Current State
**2 Endpoints**:
- `POST /services/upload` - File upload
- `POST /services` - With URL

**Schema**: `imageUrl` only (no video)

### Target State
**1 Endpoint**:
- `POST /services` - Image (required), multipart/form-data only

### Files to Modify
```
apps/api/src/modules/services/services.controller.ts
apps/api/src/modules/services/dto/upload-service.dto.ts
```

### Implementation

**File**: `services.controller.ts`

```typescript
@Post()
@ApiBearerAuth('JWT-auth')
@UseInterceptors(FileInterceptor('image'))
@ApiConsumes('multipart/form-data')
@ApiOperation({ summary: 'Create service with image upload' })
@ApiBody({
  schema: {
    type: 'object',
    required: ['image', 'name', 'description', 'price', 'duration', 'category'],
    properties: {
      image: {
        type: 'string',
        format: 'binary',
        description: 'Service image (max 10MB, jpg/jpeg/png/webp)',
      },
      name: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      duration: { type: 'number' },
      category: {
        type: 'string',
        enum: ['extensions', 'manicure', 'nail-art', 'pedicure', 'spa'],
      },
      featured: { type: 'boolean' },
      isActive: { type: 'boolean' },
      sortIndex: { type: 'number' },
    },
  },
})
async create(
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
      ],
    }),
  )
  file: Express.Multer.File,
  @Body() uploadServiceDto: UploadServiceDto,
) {
  const imageUrl = await this.storageService.uploadFile(file, 'services');
  return this.servicesService.create({ ...uploadServiceDto, imageUrl });
}

// Deprecate old endpoint
@Post('upload')
@ApiDeprecated('Use POST /services instead')
async upload(...) {
  // Keep existing implementation
}
```

### Testing

**cURL Test**:
```bash
curl -X POST http://localhost:3000/services \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "name=Classic Manicure" \
  -F "description=Professional nail care" \
  -F "price=25.99" \
  -F "duration=45" \
  -F "category=manicure"
```

**Integration Tests**:
```typescript
describe('POST /services', () => {
  it('should create service with image');
  it('should reject without image');
  it('should reject oversized image');
  it('should reject invalid file type');
  it('should return 401 without auth');
});
```

### Acceptance Criteria
- [ ] `POST /services` accepts image file
- [ ] Image validation: max 10MB, jpg/jpeg/png/webp
- [ ] Image uploaded to storage
- [ ] Service created with imageUrl
- [ ] Old `/upload` deprecated but functional
- [ ] Tests pass
- [ ] Swagger docs updated

---

## Combined Phase 3-4 Checklist

**API Implementation**:
- [ ] Gallery endpoint updated
- [ ] Services endpoint updated
- [ ] Old endpoints deprecated
- [ ] File validation working
- [ ] Storage uploads working

**Testing**:
- [ ] Gallery integration tests pass
- [ ] Services integration tests pass
- [ ] Manual cURL testing successful
- [ ] Type-check passes
- [ ] Build passes

**Documentation**:
- [ ] Swagger docs updated for both
- [ ] Old endpoints marked deprecated

---

## Next Steps

After Phase 3-4 complete → Proceed to Phase 5 (Admin - Banners)
