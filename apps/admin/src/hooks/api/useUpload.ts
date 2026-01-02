import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { imageUploadService } from '@/services/imageUpload.service';

/**
 * Mutation: Upload image with progress tracking
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: ({
      file,
      folder,
      onProgress,
    }: {
      file: File;
      folder: 'banners' | 'services' | 'gallery';
      onProgress?: (progress: number) => void;
    }) => imageUploadService.uploadImage(file, folder, onProgress),
    onError: () => {
      toast.error('Failed to upload image');
    },
  });
}

/**
 * Mutation: Upload multiple images
 */
export function useUploadMultipleImages() {
  return useMutation({
    mutationFn: ({
      files,
      folder,
    }: {
      files: File[];
      folder: 'banners' | 'services' | 'gallery';
    }) => imageUploadService.uploadMultiple(files, folder),
    onSuccess: (urls) => {
      toast.success(`${urls.length} image(s) uploaded successfully`);
    },
    onError: () => {
      toast.error('Failed to upload images');
    },
  });
}

/**
 * Mutation: Upload video with progress tracking
 */
export function useUploadVideo() {
  return useMutation({
    mutationFn: ({
      file,
      folder,
      onProgress,
    }: {
      file: File;
      folder: 'banners' | 'services' | 'gallery';
      onProgress?: (progress: number) => void;
    }) => imageUploadService.uploadVideo(file, folder, onProgress),
    onError: () => {
      toast.error('Failed to upload video');
    },
  });
}
