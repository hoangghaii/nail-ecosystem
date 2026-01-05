import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  imageUploadService,
  type UploadFolder,
  type UploadMetadata,
} from "@/services/imageUpload.service";

/**
 * Mutation: Upload image with progress tracking
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: ({
      file,
      folder,
      metadata,
      onProgress,
    }: {
      file: File;
      folder: UploadFolder;
      metadata?: UploadMetadata;
      onProgress?: (progress: number) => void;
    }) => imageUploadService.uploadImage(file, folder, metadata, onProgress),
    onError: () => {
      toast.error("Failed to upload image");
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
      metadataArray,
    }: {
      files: File[];
      folder: UploadFolder;
      metadataArray?: UploadMetadata[];
    }) => imageUploadService.uploadMultiple(files, folder, metadataArray),
    onError: () => {
      toast.error("Failed to upload images");
    },
    onSuccess: (urls) => {
      toast.success(`${urls.length} image(s) uploaded successfully`);
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
      metadata,
      onProgress,
    }: {
      file: File;
      folder: UploadFolder;
      metadata?: UploadMetadata;
      onProgress?: (progress: number) => void;
    }) => imageUploadService.uploadVideo(file, folder, metadata, onProgress),
    onError: () => {
      toast.error("Failed to upload video");
    },
  });
}
