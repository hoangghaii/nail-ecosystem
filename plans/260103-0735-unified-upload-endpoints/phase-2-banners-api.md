# Phase 2: Banners API (Pilot Implementation)

**Objective**: Consolidate 3 banner endpoints → 1
**Estimated Time**: 2-3 hours
**Dependencies**: Phase 1 complete

---

## Current State

**3 Endpoints**:
- `POST /banners/upload/image` - Image only
- `POST /banners/upload/video` - Video only
- `POST /banners` - With existing URLs

**Schema**: Already supports both `imageUrl` and optional `videoUrl`

---

## Target State

**1 Endpoint**:
- `POST /banners` - Image (required) + Video (optional), multipart/form-data

---

## Files to Modify

```
apps/api/src/modules/banners/banners.controller.ts
apps/api/src/modules/banners/dto/upload-banner.dto.ts
```

---

## Task 2.1: Update POST /banners Endpoint

**File**: `apps/api/src/modules/banners/banners.controller.ts`

**Changes**:
```typescript
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MediaUploadPipe } from '../../common/pipes/media-upload.pipe';

// Replace existing POST / endpoint
@Post()
@ApiBearerAuth('JWT-auth')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]))
@ApiConsumes('multipart/form-data')
@ApiOperation({ summary: 'Create banner with image (required) and video (optional)' })
@ApiBody({
  schema: {
    type: 'object',
    required: ['image', 'title', 'type'],
    properties: {
      image: {
        type: 'string',
        format: 'binary',
        description: 'Banner image file (max 10MB, jpg/jpeg/png/webp)',
      },
      video: {
        type: 'string',
        format: 'binary',
        description: 'Banner video file (max 100MB, mp4/webm, optional)',
      },
      title: { type: 'string', example: 'Welcome Banner' },
      type: {
        type: 'string',
        enum: ['image', 'video'],
        example: 'image',
      },
      isPrimary: { type: 'boolean', example: false },
      active: { type: 'boolean', example: true },
      sortIndex: { type: 'number', example: 1 },
    },
  },
})
@ApiResponse({
  status: 201,
  description: 'Banner created successfully',
})
@ApiResponse({ status: 400, description: 'Invalid input or file' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 413, description: 'File too large' })
async create(
  @UploadedFiles(new MediaUploadPipe())
  files: {
    image: Express.Multer.File[];
    video?: Express.Multer.File[];
  },
  @Body() uploadBannerDto: UploadBannerDto,
) {
  // Upload image (required)
  const imageUrl = await this.storageService.uploadFile(
    files.image[0],
    'banners'
  );

  // Upload video (optional)
  let videoUrl: string | undefined;
  if (files.video && files.video.length > 0) {
    videoUrl = await this.storageService.uploadFile(
      files.video[0],
      'banners'
    );
  }

  // Create banner
  return this.bannersService.create({
    ...uploadBannerDto,
    imageUrl,
    videoUrl,
  });
}
```

---

## Task 2.2: Deprecate Old Endpoints

**File**: `apps/api/src/modules/banners/banners.controller.ts`

**Add deprecation decorators** (keep endpoints functional):
```typescript
import { ApiDeprecated } from '@nestjs/swagger';

@Post('upload/image')
@ApiDeprecated('Use POST /banners instead with multipart/form-data')
@ApiBearerAuth('JWT-auth')
async uploadImage(...) {
  // Keep existing implementation
}

@Post('upload/video')
@ApiDeprecated('Use POST /banners instead with multipart/form-data')
@ApiBearerAuth('JWT-auth')
async uploadVideo(...) {
  // Keep existing implementation
}
```

---

## Task 2.3: Update DTO (if needed)

**File**: `apps/api/src/modules/banners/dto/upload-banner.dto.ts`

**Note**: DTO likely already correct (metadata only, no imageUrl/videoUrl fields)

**Verify**:
```typescript
export class UploadBannerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(['image', 'video'])
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPrimary?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  sortIndex?: number;
}
```

---

## Task 2.4: Write Integration Tests

**File**: `apps/api/test/banners.e2e-spec.ts` (or similar)

**Test Cases**:
```typescript
describe('POST /banners', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    authToken = await getAuthToken();
  });

  it('should create banner with image only', async () => {
    const response = await request(app.getHttpServer())
      .post('/banners')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', 'test/fixtures/test-image.jpg')
      .field('title', 'Test Banner')
      .field('type', 'image')
      .field('active', 'true');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('imageUrl');
    expect(response.body.imageUrl).toContain('banners/');
    expect(response.body.videoUrl).toBeUndefined();
  });

  it('should create banner with image and video', async () => {
    const response = await request(app.getHttpServer())
      .post('/banners')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('image', 'test/fixtures/test-image.jpg')
      .attach('video', 'test/fixtures/test-video.mp4')
      .field('title', 'Video Banner')
      .field('type', 'video');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('imageUrl');
    expect(response.body).toHaveProperty('videoUrl');
    expect(response.body.videoUrl).toContain('banners/');
  });

  it('should reject without image', async () => {
    const response = await request(app.getHttpServer())
      .post('/banners')
      .set('Authorization', `Bearer ${authToken}`)
      .field('title', 'Test');

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Image file is required');
  });

  it('should reject oversized image (>10MB)', async () => {
    // Implementation with large file
  });

  it('should reject invalid file type', async () => {
    // Implementation with .txt file
  });

  it('should return 401 without auth', async () => {
    const response = await request(app.getHttpServer())
      .post('/banners')
      .attach('image', 'test/fixtures/test-image.jpg');

    expect(response.status).toBe(401);
  });
});
```

---

## Manual Testing Commands

**Test Image Only**:
```bash
curl -X POST http://localhost:3000/banners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "title=Test Banner" \
  -F "type=image" \
  -F "active=true"
```

**Test Image + Video**:
```bash
curl -X POST http://localhost:3000/banners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "video=@test-video.mp4" \
  -F "title=Video Banner" \
  -F "type=video"
```

**Test Error (No Image)**:
```bash
curl -X POST http://localhost:3000/banners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test"
# Expected: 400 Bad Request
```

**Test Deprecated Endpoints Still Work**:
```bash
# Old image endpoint should still work
curl -X POST http://localhost:3000/banners/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@test-image.jpg" \
  -F "title=Old Endpoint Test" \
  -F "type=image"
```

---

## Acceptance Criteria

- [ ] `POST /banners` accepts image + optional video
- [ ] Image validation: max 10MB, jpg/jpeg/png/webp
- [ ] Video validation: max 100MB, mp4/webm
- [ ] Both files uploaded to storage correctly
- [ ] Banner created with imageUrl + videoUrl (if video present)
- [ ] Old endpoints deprecated but still functional
- [ ] Swagger docs accurate and updated
- [ ] Integration tests pass
- [ ] Manual testing successful
- [ ] No TypeScript errors
- [ ] Build passes

---

## Rollback Plan

If issues found:
1. Revert controller changes
2. Old endpoints still available
3. Fix issues
4. Re-deploy

---

## Next Steps

After Phase 2 complete → Proceed to Phase 3 (Gallery API)
