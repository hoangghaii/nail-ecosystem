const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm'];

export function validateImageFile(
  file: Express.Multer.File,
  maxSize: number,
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
    throw new Error('Invalid image type. Allowed: jpg, jpeg, png, webp');
  }
}

export function validateVideoFile(
  file: Express.Multer.File,
  maxSize: number,
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
