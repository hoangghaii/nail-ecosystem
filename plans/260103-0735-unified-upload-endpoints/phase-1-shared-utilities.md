# Phase 1: Shared Utilities (API Foundation)

**Objective**: Create reusable validation utilities for file uploads
**Estimated Time**: 2-3 hours
**Dependencies**: None

---

## Files to Create

```
apps/api/src/common/pipes/media-upload.pipe.ts       (Custom validation pipe)
apps/api/src/common/validators/file-validators.ts    (Reusable validators)
```

---

## Task 1.1: Create MediaUploadPipe

**File**: `apps/api/src/common/pipes/media-upload.pipe.ts`

**Purpose**: Validate multi-file uploads with different size limits per file type

**Implementation**:
```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validateImageFile, validateVideoFile } from '../validators/file-validators';

@Injectable()
export class MediaUploadPipe implements PipeTransform {
  transform(files: {
    image?: Express.Multer.File[],
    video?: Express.Multer.File[]
  }) {
    // Validate image required
    if (!files.image || files.image.length === 0) {
      throw new BadRequestException('Image file is required');
    }

    // Validate image (max 10MB, jpg/jpeg/png/webp)
    try {
      validateImageFile(files.image[0], 10 * 1024 * 1024);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    // Validate video if present (max 100MB, mp4/webm)
    if (files.video && files.video.length > 0) {
      try {
        validateVideoFile(files.video[0], 100 * 1024 * 1024);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    return files;
  }
}
```

---

## Task 1.2: Create File Validators

**File**: `apps/api/src/common/validators/file-validators.ts`

**Purpose**: Reusable validation functions for image and video files

**Implementation**:
```typescript
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm'];

export function validateImageFile(
  file: Express.Multer.File,
  maxSize: number
): void {
  if (!file) {
    throw new Error('Image file is required');
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    throw new Error(`Image file size exceeds ${maxSizeMB}MB limit`);
  }

  // Check MIME type
  if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(
      'Invalid image type. Allowed: jpg, jpeg, png, webp'
    );
  }
}

export function validateVideoFile(
  file: Express.Multer.File,
  maxSize: number
): void {
  if (!file) {
    throw new Error('Video file is required');
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    throw new Error(`Video file size exceeds ${maxSizeMB}MB limit`);
  }

  // Check MIME type
  if (!VIDEO_MIME_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid video type. Allowed: mp4, webm');
  }
}
```

---

## Task 1.3: Write Unit Tests

**File**: `apps/api/src/common/pipes/media-upload.pipe.spec.ts`

**Test Cases**:
```typescript
describe('MediaUploadPipe', () => {
  let pipe: MediaUploadPipe;

  beforeEach(() => {
    pipe = new MediaUploadPipe();
  });

  it('should pass with valid image only', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).not.toThrow();
  });

  it('should pass with valid image and video', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
      video: [createMockFile('video/mp4', 50 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).not.toThrow();
  });

  it('should throw if image missing', () => {
    const files = {};
    expect(() => pipe.transform(files)).toThrow('Image file is required');
  });

  it('should throw if image too large', () => {
    const files = {
      image: [createMockFile('image/jpeg', 15 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).toThrow('exceeds 10MB limit');
  });

  it('should throw if image wrong type', () => {
    const files = {
      image: [createMockFile('text/plain', 1024)],
    };
    expect(() => pipe.transform(files)).toThrow('Invalid image type');
  });

  it('should throw if video too large', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
      video: [createMockFile('video/mp4', 150 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).toThrow('exceeds 100MB limit');
  });

  it('should throw if video wrong type', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
      video: [createMockFile('text/plain', 1024)],
    };
    expect(() => pipe.transform(files)).toThrow('Invalid video type');
  });
});

function createMockFile(mimetype: string, size: number): Express.Multer.File {
  return {
    mimetype,
    size,
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    buffer: Buffer.alloc(size),
  } as Express.Multer.File;
}
```

**File**: `apps/api/src/common/validators/file-validators.spec.ts`

**Test Cases**:
```typescript
describe('File Validators', () => {
  describe('validateImageFile', () => {
    it('should pass with valid image', () => {
      const file = createMockFile('image/jpeg', 5 * 1024 * 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).not.toThrow();
    });

    it('should throw if file too large', () => {
      const file = createMockFile('image/jpeg', 15 * 1024 * 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).toThrow();
    });

    it('should throw if invalid type', () => {
      const file = createMockFile('text/plain', 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).toThrow();
    });
  });

  describe('validateVideoFile', () => {
    it('should pass with valid video', () => {
      const file = createMockFile('video/mp4', 50 * 1024 * 1024);
      expect(() => validateVideoFile(file, 100 * 1024 * 1024)).not.toThrow();
    });

    it('should throw if file too large', () => {
      const file = createMockFile('video/mp4', 150 * 1024 * 1024);
      expect(() => validateVideoFile(file, 100 * 1024 * 1024)).toThrow();
    });

    it('should throw if invalid type', () => {
      const file = createMockFile('text/plain', 1024);
      expect(() => validateVideoFile(file, 100 * 1024 * 1024)).toThrow();
    });
  });
});
```

---

## Acceptance Criteria

- [ ] `MediaUploadPipe` validates image required
- [ ] `MediaUploadPipe` validates video optional
- [ ] Image validation: max 10MB, jpg/jpeg/png/webp
- [ ] Video validation: max 100MB, mp4/webm
- [ ] Clear error messages for violations
- [ ] All unit tests pass
- [ ] Test coverage ≥ 100%
- [ ] Code follows project standards

---

## Testing

**Run Tests**:
```bash
cd apps/api
npm test -- media-upload.pipe.spec
npm test -- file-validators.spec
npm run test:cov
```

**Expected Output**:
- All tests passing
- 100% coverage for pipe and validators

---

## Next Steps

After Phase 1 complete → Proceed to Phase 2 (Banners API)
