import { BadRequestException } from '@nestjs/common';
import { MediaUploadPipe } from './media-upload.pipe';

function createMockFile(
  mimetype: string,
  size: number,
): Express.Multer.File {
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

describe('MediaUploadPipe', () => {
  let pipe: MediaUploadPipe;

  beforeEach(() => {
    pipe = new MediaUploadPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
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

  it('should pass with valid png image', () => {
    const files = {
      image: [createMockFile('image/png', 5 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).not.toThrow();
  });

  it('should pass with valid webp image', () => {
    const files = {
      image: [createMockFile('image/webp', 5 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).not.toThrow();
  });

  it('should pass with valid webm video', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
      video: [createMockFile('video/webm', 50 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).not.toThrow();
  });

  it('should throw BadRequestException if image missing', () => {
    const files = {};
    expect(() => pipe.transform(files)).toThrow(BadRequestException);
    expect(() => pipe.transform(files)).toThrow('Image file is required');
  });

  it('should throw BadRequestException if image array empty', () => {
    const files = { image: [] };
    expect(() => pipe.transform(files)).toThrow(BadRequestException);
    expect(() => pipe.transform(files)).toThrow('Image file is required');
  });

  it('should throw BadRequestException if image too large', () => {
    const files = {
      image: [createMockFile('image/jpeg', 15 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).toThrow(BadRequestException);
    expect(() => pipe.transform(files)).toThrow('exceeds 10MB limit');
  });

  it('should throw BadRequestException if image wrong type', () => {
    const files = {
      image: [createMockFile('text/plain', 1024)],
    };
    expect(() => pipe.transform(files)).toThrow(BadRequestException);
    expect(() => pipe.transform(files)).toThrow('Invalid image type');
  });

  it('should throw BadRequestException if video too large', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
      video: [createMockFile('video/mp4', 150 * 1024 * 1024)],
    };
    expect(() => pipe.transform(files)).toThrow(BadRequestException);
    expect(() => pipe.transform(files)).toThrow('exceeds 100MB limit');
  });

  it('should throw BadRequestException if video wrong type', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
      video: [createMockFile('text/plain', 1024)],
    };
    expect(() => pipe.transform(files)).toThrow(BadRequestException);
    expect(() => pipe.transform(files)).toThrow('Invalid video type');
  });

  it('should return files if validation passes', () => {
    const files = {
      image: [createMockFile('image/jpeg', 5 * 1024 * 1024)],
      video: [createMockFile('video/mp4', 50 * 1024 * 1024)],
    };
    const result = pipe.transform(files);
    expect(result).toEqual(files);
  });
});
