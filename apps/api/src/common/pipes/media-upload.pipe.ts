import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import {
  validateImageFile,
  validateVideoFile,
} from '../validators/file-validators';

@Injectable()
export class MediaUploadPipe implements PipeTransform {
  transform(files: {
    image?: Express.Multer.File[];
    video?: Express.Multer.File[];
  }) {
    // Validate image required
    if (!files.image || files.image.length === 0) {
      throw new BadRequestException('Image file is required');
    }

    // Validate image (max 10MB, jpg/jpeg/png/webp)
    try {
      validateImageFile(files.image[0], 10 * 1024 * 1024);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(message);
    }

    // Validate video if present (max 100MB, mp4/webm)
    if (files.video && files.video.length > 0) {
      try {
        validateVideoFile(files.video[0], 100 * 1024 * 1024);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        throw new BadRequestException(message);
      }
    }

    return files;
  }
}
