import { validateImageFile, validateVideoFile } from './file-validators';

function createMockFile(mimetype: string, size: number): Express.Multer.File {
  return {
    mimetype,
    size,
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    buffer: Buffer.alloc(size),
    destination: '',
    filename: '',
    path: '',
    stream: {} as any,
  } as Express.Multer.File;
}

describe('File Validators', () => {
  describe('validateImageFile', () => {
    it('should pass with valid jpeg image', () => {
      const file = createMockFile('image/jpeg', 5 * 1024 * 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).not.toThrow();
    });

    it('should pass with valid jpg image', () => {
      const file = createMockFile('image/jpg', 5 * 1024 * 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).not.toThrow();
    });

    it('should pass with valid png image', () => {
      const file = createMockFile('image/png', 5 * 1024 * 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).not.toThrow();
    });

    it('should pass with valid webp image', () => {
      const file = createMockFile('image/webp', 5 * 1024 * 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).not.toThrow();
    });

    it('should throw if file too large', () => {
      const file = createMockFile('image/jpeg', 15 * 1024 * 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).toThrow(
        'Image file size exceeds 10MB limit',
      );
    });

    it('should throw if invalid type', () => {
      const file = createMockFile('text/plain', 1024);
      expect(() => validateImageFile(file, 10 * 1024 * 1024)).toThrow(
        'Invalid image type. Allowed: jpg, jpeg, png, webp',
      );
    });

    it('should throw if file is null', () => {
      expect(() => validateImageFile(null as any, 10 * 1024 * 1024)).toThrow(
        'Image file is required',
      );
    });

    it('should throw if file is undefined', () => {
      expect(() =>
        validateImageFile(undefined as any, 10 * 1024 * 1024),
      ).toThrow('Image file is required');
    });
  });

  describe('validateVideoFile', () => {
    it('should pass with valid mp4 video', () => {
      const file = createMockFile('video/mp4', 50 * 1024 * 1024);
      expect(() => validateVideoFile(file, 100 * 1024 * 1024)).not.toThrow();
    });

    it('should pass with valid webm video', () => {
      const file = createMockFile('video/webm', 50 * 1024 * 1024);
      expect(() => validateVideoFile(file, 100 * 1024 * 1024)).not.toThrow();
    });

    it('should throw if file too large', () => {
      const file = createMockFile('video/mp4', 150 * 1024 * 1024);
      expect(() => validateVideoFile(file, 100 * 1024 * 1024)).toThrow(
        'Video file size exceeds 100MB limit',
      );
    });

    it('should throw if invalid type', () => {
      const file = createMockFile('text/plain', 1024);
      expect(() => validateVideoFile(file, 100 * 1024 * 1024)).toThrow(
        'Invalid video type. Allowed: mp4, webm',
      );
    });

    it('should throw if file is null', () => {
      expect(() => validateVideoFile(null as any, 100 * 1024 * 1024)).toThrow(
        'Video file is required',
      );
    });

    it('should throw if file is undefined', () => {
      expect(() =>
        validateVideoFile(undefined as any, 100 * 1024 * 1024),
      ).toThrow('Video file is required');
    });
  });
});
